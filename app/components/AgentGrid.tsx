"use client";

import { useState } from "react";
import { AgentOrb, type Agent } from "./AgentOrb";
import { AgentVoicePanel } from "./AgentVoicePanel";

const AGENTS: Agent[] = [
  {
    id: "adam",
    name: "Adam",
    role: "Personal Assistant",
    status: "ready",
    tagline: "Your chief of staff. Briefings, schedule, life.",
    vapiAssistantId: "2e1428ba-6624-4be6-a15d-cceca8d14c0d",
  },
  {
    id: "mark",
    name: "Mark",
    role: "The Money Man",
    status: "coming-soon",
    tagline: "Xero, P&L, cashflow, the CFO brain.",
  },
  {
    id: "claire",
    name: "Claire",
    role: "JBC Operations",
    status: "ready",
    tagline: "Care partners, compliance, payroll, tickets.",
    vapiAssistantId: "eabb183c-e495-4ec4-95e7-59844253d596",
  },
  {
    id: "tom",
    name: "Tom",
    role: "Developer",
    status: "coming-soon",
    tagline: "Ships features. Opens PRs. Doesn't sleep.",
  },
];

export function AgentGrid() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const active = activeId ? AGENTS.find((a) => a.id === activeId) ?? null : null;

  const showSoon = (name: string) => {
    setToast(`${name} is on the build list — coming next session.`);
    window.setTimeout(() => setToast(null), 2400);
  };

  return (
    <>
      <div className="relative z-10 max-w-[1800px] mx-auto px-6 py-10">
        <div className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">
          Agent fleet
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {AGENTS.map((a) => (
            <AgentOrb
              key={a.id}
              agent={a}
              active={activeId === a.id}
              onClick={() => {
                if (a.status === "ready" && a.vapiAssistantId) {
                  setActiveId(a.id);
                } else {
                  showSoon(a.name);
                }
              }}
            />
          ))}
        </div>
      </div>

      {active && active.vapiAssistantId ? (
        <AgentVoicePanel
          agent={{
            name: active.name,
            role: active.role,
            initial: active.name[0] ?? "?",
            vapiAssistantId: active.vapiAssistantId,
          }}
          onClose={() => setActiveId(null)}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded font-[family-name:var(--font-jetbrains)] text-xs text-[var(--text-dim)]">
          {toast}
        </div>
      ) : null}
    </>
  );
}
