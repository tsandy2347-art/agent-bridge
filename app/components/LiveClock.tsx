"use client";

import { useEffect, useState } from "react";

function formatBrisbane(date: Date) {
  // Convert to Brisbane time (UTC+10, no DST) regardless of viewer's locale.
  const fmt = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Brisbane",
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return fmt.format(date);
}

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  // Avoid hydration mismatch — render placeholder until mount.
  if (!now) {
    return (
      <div className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
        — — —
      </div>
    );
  }
  const formatted = formatBrisbane(now);
  // formatted like: "Wed, 20 May 2026, 18:24:31"
  const [datePart, timePart] = formatted.split(", ").reduce<[string, string]>(
    (acc, part, i, arr) => {
      // The string is "Wed, 20 May 2026, 18:24:31"
      // Last segment is time; everything before is the date.
      if (i === arr.length - 1) return [acc[0], part];
      return [acc[0] ? `${acc[0]}, ${part}` : part, acc[1]];
    },
    ["", ""],
  );
  return (
    <div className="flex flex-col leading-tight">
      <div className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Brisbane · AEST
      </div>
      <div className="font-[family-name:var(--font-jetbrains)] text-2xl text-[var(--text)] tabular-nums">
        {timePart}
      </div>
      <div className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.15em] text-[var(--text-dim)]">
        {datePart}
      </div>
    </div>
  );
}
