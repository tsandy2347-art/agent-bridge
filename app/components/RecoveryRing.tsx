type Band = "GREEN" | "AMBER" | "RED" | null;

function bandColor(band: Band) {
  switch (band) {
    case "GREEN":
      return { stroke: "#1d9e75", glow: "rgba(29,158,117,0.55)", label: "GREEN" };
    case "AMBER":
      return { stroke: "#eab308", glow: "rgba(234,179,8,0.55)", label: "AMBER" };
    case "RED":
      return { stroke: "#e24b4a", glow: "rgba(226,75,74,0.55)", label: "RED" };
    default:
      return { stroke: "#6b7d93", glow: "rgba(107,125,147,0.4)", label: "—" };
  }
}

export function RecoveryRing({
  recovery,
  band,
}: {
  recovery: number | null;
  band: Band;
}) {
  const colors = bandColor(band);
  const value = recovery ?? 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div
      className="relative w-24 h-24 flex items-center justify-center"
      style={{ filter: `drop-shadow(0 0 12px ${colors.glow})` }}
    >
      {/* Outer rotating tick ring */}
      <svg
        className="absolute inset-0 w-full h-full ring-spin-slow"
        viewBox="0 0 100 100"
      >
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          // toFixed(3) avoids SSR/CSR float-precision hydration mismatch
          const x1 = (50 + Math.cos(angle) * 47).toFixed(3);
          const y1 = (50 + Math.sin(angle) * 47).toFixed(3);
          const x2 = (50 + Math.cos(angle) * 50).toFixed(3);
          const y2 = (50 + Math.sin(angle) * 50).toFixed(3);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={colors.stroke}
              strokeWidth="0.5"
              opacity={i % 3 === 0 ? 0.8 : 0.35}
            />
          );
        })}
      </svg>

      {/* Counter-rotating dashed ring */}
      <svg
        className="absolute inset-0 w-full h-full ring-spin-reverse"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="0.4"
          strokeDasharray="1 5"
          opacity="0.5"
        />
      </svg>

      {/* Main recovery progress arc */}
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="rgba(55, 138, 221, 0.12)"
          strokeWidth="3"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease",
            filter: `drop-shadow(0 0 4px ${colors.glow})`,
          }}
        />
      </svg>

      {/* Orbiting dot */}
      <div
        className="absolute inset-0 ring-spin-orbit pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      >
        <div
          className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full"
          style={{
            background: colors.stroke,
            boxShadow: `0 0 8px ${colors.stroke}`,
            transform: `translate(-50%, -50%) translateY(-44px)`,
          }}
        />
      </div>

      {/* Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <div className="font-[family-name:var(--font-jetbrains)] text-3xl tabular-nums text-[var(--text)]">
          {recovery !== null ? recovery : "—"}
        </div>
        <div
          className="font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-[0.2em] mt-1"
          style={{ color: colors.stroke }}
        >
          {colors.label}
        </div>
      </div>

      <style>{`
        .ring-spin-slow { animation: ring-spin 60s linear infinite; }
        .ring-spin-reverse { animation: ring-spin 30s linear infinite reverse; }
        .ring-spin-orbit { animation: ring-spin 8s linear infinite; }
        @keyframes ring-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
