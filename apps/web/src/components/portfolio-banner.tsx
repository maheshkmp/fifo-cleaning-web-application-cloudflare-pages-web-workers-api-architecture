"use client";

export function PortfolioBanner() {
  return (
    <aside
      aria-label="Portfolio Showcase Banner"
      className="fixed top-0 left-0 right-0 h-8 z-[100] bg-zinc-900 text-zinc-200 border-b border-zinc-800 flex items-center justify-center px-4 select-none font-sans"
    >
      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-normal text-center truncate max-w-7xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] sm:text-xs font-semibold uppercase tracking-wider shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          Demo
        </span>
        <p className="truncate text-zinc-300">
          <strong className="font-semibold text-white tracking-wide">
            PORTFOLIO SHOWCASE
          </strong>{" "}
          <span className="text-zinc-500 mx-1">—</span>{" "}
          <span className="text-zinc-300">
            This website is a demonstration project created for portfolio purposes.
          </span>
        </p>
      </div>
    </aside>
  );
}
