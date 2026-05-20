"use client";

import { useState } from "react";

export type AgentStatus = "ready" | "live" | "coming-soon";

export type Agent = {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  tagline: string;
  vapiAssistantId?: string;
};

type Props = {
  agent: Agent;
  onClick?: () => void;
  active?: boolean;
};

export function AgentOrb({ agent, onClick, active = false }: Props) {
  const [hovered, setHovered] = useState(false);
  const clickable = agent.status !== "coming-soon" && !!onClick;
  const initial = agent.name[0]?.toUpperCase() ?? "?";
  const idleColor = agent.status === "ready" ? "var(--blue)" : "rgba(107, 125, 147, 0.5)";

  return (
    <button
      type="button"
      onClick={clickable ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={!clickable && agent.status !== "coming-soon"}
      className={`relative group flex flex-col items-center justify-center gap-4 p-6 rounded bg-[var(--surface)] transition-all duration-300 ${
        active
          ? "border border-[var(--blue)] shadow-[0_0_40px_var(--blue-glow)]"
          : "border border-[var(--border)] hover:border-[var(--blue)]"
      } ${
        agent.status === "coming-soon"
          ? "cursor-not-allowed opacity-80"
          : "cursor-pointer"
      }`}
    >
      {/* Corner ticks for HUD feel */}
      <span className="absolute top-2 left-2 w-2 h-2 border-l border-t border-[var(--blue)] opacity-60" />
      <span className="absolute top-2 right-2 w-2 h-2 border-r border-t border-[var(--blue)] opacity-60" />
      <span className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-[var(--blue)] opacity-60" />
      <span className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-[var(--blue)] opacity-60" />

      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Outer rotating ring — always animating */}
        <svg
          className="absolute inset-0 w-full h-full orb-spin"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke={idleColor}
            strokeWidth="0.4"
            strokeDasharray="2 4"
            opacity="0.6"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={idleColor}
            strokeWidth="0.3"
            strokeDasharray="1 6"
            opacity="0.4"
          />
        </svg>

        {/* Tick marks around the orb (like a compass) */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
        >
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 50 + Math.cos(angle) * 47;
            const y1 = 50 + Math.sin(angle) * 47;
            const x2 = 50 + Math.cos(angle) * 50;
            const y2 = 50 + Math.sin(angle) * 50;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={idleColor}
                strokeWidth="0.4"
                opacity="0.5"
              />
            );
          })}
        </svg>

        {/* Expanding ring pulses when active or hovered */}
        {(active || hovered) && agent.status === "ready" ? (
          <>
            <span
              className="absolute inset-0 rounded-full border border-[var(--blue)] animate-[ring-pulse_2s_ease-out_infinite]"
              style={{ animationDelay: "0s" }}
            />
            <span
              className="absolute inset-0 rounded-full border border-[var(--blue)] animate-[ring-pulse_2s_ease-out_infinite]"
              style={{ animationDelay: "0.7s" }}
            />
          </>
        ) : null}

        {/* Core orb */}
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 orb-core"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #2a5a90, #0e1f33 55%, var(--bg) 85%)",
            border: `1px solid ${
              active || hovered
                ? "rgba(55,138,221,0.7)"
                : agent.status === "ready"
                  ? "rgba(55,138,221,0.35)"
                  : "rgba(107,125,147,0.25)"
            }`,
            boxShadow:
              active || hovered
                ? "0 0 35px var(--blue-glow), inset 0 0 30px rgba(55,138,221,0.25)"
                : agent.status === "ready"
                  ? "inset 0 0 20px rgba(55,138,221,0.15)"
                  : "inset 0 0 15px rgba(0,0,0,0.5)",
          }}
        >
          <span
            className="text-5xl font-bold select-none orb-letter"
            style={{
              color: agent.status === "ready" ? "#B5D4F4" : "#6b7d93",
              textShadow:
                agent.status === "ready"
                  ? "0 0 12px rgba(181, 212, 244, 0.5)"
                  : "none",
            }}
          >
            {initial}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <div className="text-xl font-semibold tracking-tight">{agent.name}</div>
        <div className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
          {agent.role}
        </div>
        <div className="text-xs text-[var(--text-dim)] mt-1 text-center max-w-[220px] leading-snug">
          {agent.tagline}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            agent.status === "live"
              ? "bg-[var(--green)] shadow-[0_0_6px_var(--green)] animate-[blink_1s_ease_infinite]"
              : agent.status === "ready"
                ? "bg-[var(--green)] shadow-[0_0_8px_var(--green)] orb-status-pulse"
                : "bg-[var(--text-muted)]"
          }`}
        />
        <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {agent.status === "live"
            ? "live"
            : agent.status === "ready"
              ? "ready · click to talk"
              : "coming soon"}
        </span>
      </div>

      <style>{`
        .orb-spin {
          animation: orb-spin 40s linear infinite;
        }
        @keyframes orb-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .orb-core {
          animation: orb-breathe 4s ease-in-out infinite;
        }
        @keyframes orb-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.025); }
        }
        .orb-status-pulse {
          animation: blink 2.4s ease-in-out infinite;
        }
      `}</style>
    </button>
  );
}
