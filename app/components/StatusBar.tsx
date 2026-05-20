"use client";

import { useEffect, useState } from "react";

type Indicator = {
  label: string;
  status: "online" | "warn" | "offline";
};

export function StatusBar({
  bodyopsOnline,
  fetchedAt,
}: {
  bodyopsOnline: boolean;
  fetchedAt: string | null;
}) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const indicators: Indicator[] = [
    {
      label: "BODYOPS",
      status: bodyopsOnline ? "online" : "offline",
    },
    { label: "VAPI", status: "online" },
    { label: "ANTHROPIC", status: "online" },
    { label: "RAILWAY", status: "online" },
  ];

  // Lightweight heartbeat for the system pulse
  const phase = tick % 4;

  return (
    <div className="relative z-10 border-b border-[var(--border)] bg-[rgba(6,9,17,0.4)] backdrop-blur-sm">
      <div className="max-w-[1800px] mx-auto px-6 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.3em] text-[var(--blue)]">
            BRIDGE
          </span>
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            v0.1 · Voice Command
          </span>
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            sysclk {".".repeat(phase + 1).padEnd(4, " ")}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {indicators.map((i) => (
            <div key={i.label} className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  i.status === "online"
                    ? "bg-[var(--green)] shadow-[0_0_6px_var(--green)]"
                    : i.status === "warn"
                      ? "bg-[var(--amber)] shadow-[0_0_6px_var(--amber)]"
                      : "bg-[var(--red)] shadow-[0_0_6px_var(--red)]"
                }`}
              />
              <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
                {i.label}
              </span>
            </div>
          ))}
          {fetchedAt ? (
            <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] hidden md:inline">
              data · {new Date(fetchedAt).toLocaleTimeString("en-AU", { timeZone: "Australia/Brisbane", hour12: false })}
            </span>
          ) : null}
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Tony Sandy
          </span>
        </div>
      </div>
    </div>
  );
}
