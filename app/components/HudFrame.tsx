"use client";

// Decorative HUD corner brackets + a continuously sweeping scan line.
// Pure decoration — sits behind the content with pointer-events disabled.
export function HudFrame() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    >
      {/* Corner brackets */}
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />

      {/* Vertical scan sweep */}
      <div className="hud-sweep" />

      <style>{`
        .hud-sweep {
          position: absolute;
          top: 0;
          left: -100px;
          width: 100px;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(55, 138, 221, 0.04) 40%,
            rgba(181, 212, 244, 0.10) 50%,
            rgba(55, 138, 221, 0.04) 60%,
            transparent 100%
          );
          animation: hud-sweep 12s linear infinite;
        }
        @keyframes hud-sweep {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
      `}</style>
    </div>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const size = 28;
  const offset = 14;
  const stroke = "rgba(55, 138, 221, 0.55)";
  const w = 1.5;
  const top = pos.startsWith("t") ? offset : "auto";
  const bottom = pos.startsWith("b") ? offset : "auto";
  const left = pos.endsWith("l") ? offset : "auto";
  const right = pos.endsWith("r") ? offset : "auto";
  const borderTop = pos.startsWith("t") ? `${w}px solid ${stroke}` : "none";
  const borderBottom = pos.startsWith("b") ? `${w}px solid ${stroke}` : "none";
  const borderLeft = pos.endsWith("l") ? `${w}px solid ${stroke}` : "none";
  const borderRight = pos.endsWith("r") ? `${w}px solid ${stroke}` : "none";

  return (
    <div
      style={{
        position: "absolute",
        top,
        bottom,
        left,
        right,
        width: size,
        height: size,
        borderTop,
        borderBottom,
        borderLeft,
        borderRight,
        filter: `drop-shadow(0 0 4px ${stroke})`,
      }}
    />
  );
}
