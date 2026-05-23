import { HeroStrip } from "./components/HeroStrip";
import { AgentGrid } from "./components/AgentGrid";
import { ParticleField } from "./components/ParticleField";
import { HudFrame } from "./components/HudFrame";
import { StatusBar } from "./components/StatusBar";
import { getRundown } from "./lib/bodyops";

export const dynamic = "force-dynamic";

export default async function Bridge() {
  const rundown = await getRundown();

  return (
    <>
      <ParticleField />
      <HudFrame />

      <main className="relative z-10 flex-1 flex flex-col">
        <StatusBar
          bodyopsOnline={!!rundown.data && !rundown.error}
          fetchedAt={rundown.fetchedAtIso}
        />

        <HeroStrip />

        <AgentGrid />

        <div className="flex-1" />

        <footer className="relative z-10 px-6 py-3 border-t border-[var(--border)] bg-[rgba(6,9,17,0.6)] backdrop-blur-sm">
          <div className="max-w-[1800px] mx-auto flex items-center gap-3 font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            <span className="w-1.5 h-1.5 bg-[var(--green)] rounded-full shadow-[0_0_6px_var(--green)]" />
            JBC Team · Claire · Mark · Tom
          </div>
        </footer>
      </main>
    </>
  );
}
