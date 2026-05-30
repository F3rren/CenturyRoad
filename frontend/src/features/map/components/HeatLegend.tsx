const LEVELS = [
  { color: '#22c55e', label: '1–2 eventi' },
  { color: '#eab308', label: '3–5 eventi' },
  { color: '#ef4444', label: '≥6 eventi' },
] as const;

export function HeatLegend() {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
        Oggi nel '900
      </p>
      {LEVELS.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-sm"
            style={{ backgroundColor: color, opacity: 0.85 }}
          />
          <span className="text-xs text-white/80">{label}</span>
        </div>
      ))}
    </div>
  );
}
