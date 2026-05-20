"use client";

import { useEffect, useRef, useState } from "react";
import type Vapi from "@vapi-ai/web";

// Public key that allows BOTH Adam and Claire (and future fleet members).
// Old key 9e3bca0c-... was scoped to Adam only and 403'd on Claire.
const VAPI_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ||
  "f2f527a9-55ba-49b3-9aed-43bd5aa390bd";

type Line = { role: "user" | "assistant"; text: string };

type Status =
  | "idle"
  | "connecting"
  | "listening"
  | "speaking"
  | "ending"
  | "error";

export type VoiceAgentDetails = {
  name: string;
  role: string;
  initial: string;
  vapiAssistantId: string;
};

export function AgentVoicePanel({
  agent,
  onClose,
}: {
  agent: VoiceAgentDetails;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState<string | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const linesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    linesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines.length]);

  const start = async () => {
    setError(null);
    setStatus("connecting");
    try {
      const { default: VapiCtor } = await import("@vapi-ai/web");
      const vapi = new VapiCtor(VAPI_PUBLIC_KEY);
      vapiRef.current = vapi;

      vapi.on("call-start", () => setStatus("listening"));
      vapi.on("call-end", () => {
        setStatus("idle");
        vapiRef.current = null;
      });
      vapi.on("speech-start", () => setStatus("speaking"));
      vapi.on("speech-end", () => setStatus("listening"));
      vapi.on("message", (msg: { type: string; transcriptType?: string; role?: "user" | "assistant"; transcript?: string }) => {
        if (
          msg.type === "transcript" &&
          msg.transcriptType === "final" &&
          msg.role &&
          msg.transcript
        ) {
          setLines((prev) => [
            ...prev,
            { role: msg.role as "user" | "assistant", text: msg.transcript! },
          ]);
        }
      });
      vapi.on("error", (err: unknown) => {
        // Vapi error payloads vary; dig for whatever's there
        const errObj = err as Record<string, unknown> | null;
        const nested = errObj && typeof errObj === "object" && "error" in errObj
          ? (errObj.error as Record<string, unknown>)
          : null;
        const message =
          (errObj?.errorMsg as string | undefined)
          ?? (nested?.msg as string | undefined)
          ?? (nested?.errorMsg as string | undefined)
          ?? (errObj?.message as string | undefined)
          ?? (err instanceof Error ? err.message : null)
          ?? "unknown error";
        setError(message);
        setStatus("error");
        // eslint-disable-next-line no-console
        console.error("Vapi error:", JSON.stringify(err, null, 2), err);
      });

      await vapi.start(agent.vapiAssistantId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setStatus("error");
    }
  };

  const stop = () => {
    setStatus("ending");
    vapiRef.current?.stop();
    vapiRef.current = null;
  };

  useEffect(() => {
    return () => {
      vapiRef.current?.stop();
    };
  }, []);

  const statusText = (() => {
    switch (status) {
      case "idle":
        return "Ready when you are";
      case "connecting":
        return "Connecting…";
      case "listening":
        return "Listening — speak now";
      case "speaking":
        return `${agent.name} is speaking…`;
      case "ending":
        return "Ending call";
      case "error":
        return `Error: ${error ?? "unknown"}`;
    }
  })();

  const live = status === "listening" || status === "speaking";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(6,9,17,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !live) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl mx-4 bg-[var(--surface)] border border-[var(--border)] rounded">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--text-dim)] hover:text-[var(--text)] text-xl leading-none w-8 h-8 flex items-center justify-center"
          aria-label="Close"
        >
          ×
        </button>

        <div className="p-8 flex flex-col items-center gap-6">
          <div className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            {agent.name} · {agent.role}
          </div>

          <div className="relative w-40 h-40 flex items-center justify-center">
            {live ? (
              <>
                <span className="absolute inset-0 rounded-full border border-[var(--blue)] animate-[ring-pulse_2s_ease-out_infinite]" />
                <span
                  className="absolute inset-0 rounded-full border border-[var(--blue)] animate-[ring-pulse_2s_ease-out_infinite]"
                  style={{ animationDelay: "0.7s" }}
                />
                <span
                  className="absolute inset-0 rounded-full border border-[var(--blue)] animate-[ring-pulse_2s_ease-out_infinite]"
                  style={{ animationDelay: "1.4s" }}
                />
              </>
            ) : null}
            <div
              className="w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500"
              style={{
                background:
                  "radial-gradient(circle at 35% 35%, #1a3a5c, var(--bg) 70%)",
                border: `1px solid ${
                  live ? "rgba(55,138,221,0.7)" : "rgba(55,138,221,0.2)"
                }`,
                boxShadow: live
                  ? "0 0 50px var(--blue-glow), inset 0 0 25px rgba(55,138,221,0.2)"
                  : "inset 0 0 15px rgba(55,138,221,0.08)",
              }}
            >
              <span
                className="text-6xl font-bold select-none"
                style={{ color: "#B5D4F4" }}
              >
                {agent.initial}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-[family-name:var(--font-jetbrains)] text-sm text-[var(--text-dim)]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === "speaking"
                  ? "bg-[var(--blue)] shadow-[0_0_6px_var(--blue)] animate-[blink_1s_ease_infinite]"
                  : status === "listening"
                    ? "bg-[var(--green)] shadow-[0_0_6px_var(--green)]"
                    : status === "error"
                      ? "bg-[var(--red)]"
                      : "bg-[var(--text-muted)]"
              }`}
            />
            {statusText}
          </div>

          <div className="flex gap-3">
            {status === "idle" || status === "error" ? (
              <button
                type="button"
                onClick={start}
                className="px-8 py-3 border border-[var(--blue)] text-[var(--blue)] font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-[0.15em] hover:bg-[var(--blue-dim)] hover:shadow-[0_0_20px_var(--blue-glow)] transition-all"
              >
                ● Talk to {agent.name}
              </button>
            ) : (
              <button
                type="button"
                onClick={stop}
                className="px-8 py-3 border border-[var(--red)] text-[var(--red)] font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-[0.15em] hover:bg-[rgba(226,75,74,0.08)] transition-all"
              >
                ■ End Call
              </button>
            )}
          </div>

          <div className="w-full mt-2 border border-[var(--border)] rounded bg-[rgba(0,0,0,0.3)]">
            <div className="px-4 py-2 border-b border-[var(--border)] font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)] flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  live ? "bg-[var(--green)]" : "bg-[var(--text-muted)]"
                }`}
              />
              Live transcript
            </div>
            <div className="p-4 h-32 overflow-y-auto font-[family-name:var(--font-jetbrains)] text-xs leading-relaxed">
              {lines.length === 0 ? (
                <div className="text-[var(--text-muted)]">
                  Awaiting connection…
                </div>
              ) : (
                lines.map((l, i) => (
                  <div key={i} className="mb-1">
                    <span
                      className={`mr-2 ${
                        l.role === "user"
                          ? "text-[var(--text)]"
                          : "text-[var(--blue)]"
                      }`}
                    >
                      {l.role === "user" ? "You:" : `${agent.name}:`}
                    </span>
                    <span className="text-[var(--text-dim)]">{l.text}</span>
                  </div>
                ))
              )}
              <div ref={linesEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
