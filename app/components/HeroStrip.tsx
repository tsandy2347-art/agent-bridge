import { LiveClock } from "./LiveClock";
import { RecoveryRing } from "./RecoveryRing";
import { getRundown } from "../lib/bodyops";

function StatTile({
  label,
  value,
  unit,
  hint,
  pending,
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  pending?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 border-l border-[var(--border)] pl-4">
      <div className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
        {label}
      </div>
      <div
        className={`font-[family-name:var(--font-jetbrains)] text-xl tabular-nums leading-none ${
          pending ? "text-[var(--text-muted)]" : "text-[var(--text)]"
        }`}
      >
        {value}
        {unit ? <span className="text-[var(--text-dim)] text-sm ml-1">{unit}</span> : null}
      </div>
      {hint ? (
        <div className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)]">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

export async function HeroStrip() {
  const rundown = await getRundown();
  const d = rundown.data;

  const recovery = d?.today.recovery ?? null;
  const band = d?.trainingLoad.readinessBand ?? null;
  const acwr = d?.trainingLoad.acwr ?? null;
  const sleep = d?.today.sleepHours ?? null;
  const weight = d?.weight.kg ?? null;
  const z2 = d?.weeklyZ2 ?? null;
  const dangerAlert = d?.alerts?.find((a) => a.severity === "danger");

  return (
    <div className="border-b border-[var(--border)] bg-[rgba(14,21,32,0.6)] backdrop-blur-sm relative z-10">
      <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-4">
          <RecoveryRing recovery={recovery} band={band} />
          <LiveClock />
        </div>

        <div className="flex-1 flex items-stretch gap-5 ml-2 min-w-0">
          <StatTile
            label="ACWR"
            value={acwr !== null ? acwr.toFixed(2) : "—"}
            hint={d?.trainingLoad.acwrBand?.replace(/_/g, " ") ?? ""}
          />
          <StatTile
            label="Sleep"
            value={sleep !== null ? sleep.toFixed(1) : "—"}
            unit="h"
          />
          <StatTile
            label="Weight"
            value={weight !== null ? weight.toFixed(1) : "—"}
            unit="kg"
          />
          <StatTile
            label="Z2 Week"
            value={z2 ? `${z2.done}/${z2.target}` : "—"}
            unit="min"
            hint={z2 ? (z2.onTrack ? "on track" : "behind") : ""}
          />
        </div>
      </div>

      {dangerAlert ? (
        <div className="border-t border-[var(--border)] bg-[rgba(226,75,74,0.06)]">
          <div className="max-w-[1800px] mx-auto px-6 py-2 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[var(--red)] rounded-full shadow-[0_0_6px_var(--red)] animate-[blink_1.2s_ease_infinite] flex-shrink-0" />
            <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.2em] text-[var(--red)] flex-shrink-0">
              Alert
            </span>
            <span className="text-sm text-[var(--text)] leading-tight">
              {dangerAlert.headline}
            </span>
            <span className="text-[11px] text-[var(--text-dim)] leading-tight">
              · {dangerAlert.detail}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
