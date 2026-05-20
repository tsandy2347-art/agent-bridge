"use client";

export type ScreenPopView = {
  title: string;
  url: string;
};

export function ScreenPopPanel({
  view,
  onClose,
}: {
  view: ScreenPopView;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed top-0 right-0 bottom-0 w-[68%] z-40 flex flex-col bg-[var(--surface)] border-l border-[var(--blue)] shadow-[0_0_60px_var(--blue-glow)]"
      style={{
        animation: "screen-pop-in 0.3s ease-out",
      }}
    >
      {/* HUD corner brackets */}
      <span className="absolute top-3 left-3 w-3 h-3 border-l border-t border-[var(--blue)] opacity-70 pointer-events-none" />
      <span className="absolute top-3 right-12 w-3 h-3 border-r border-t border-[var(--blue)] opacity-70 pointer-events-none" />
      <span className="absolute bottom-3 left-3 w-3 h-3 border-l border-b border-[var(--blue)] opacity-70 pointer-events-none" />
      <span className="absolute bottom-3 right-3 w-3 h-3 border-r border-b border-[var(--blue)] opacity-70 pointer-events-none" />

      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[rgba(6,9,17,0.6)]">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--blue)] shadow-[0_0_6px_var(--blue)] animate-[blink_1.4s_ease_infinite]" />
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Screen Pop · {view.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={view.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.15em] text-[var(--text-dim)] hover:text-[var(--blue)] transition-colors px-2 py-1"
          >
            Open in tab ↗
          </a>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-dim)] hover:text-[var(--text)] text-xl leading-none w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      <iframe
        src={view.url}
        title={view.title}
        className="flex-1 w-full bg-white"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />

      <style>{`
        @keyframes screen-pop-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
