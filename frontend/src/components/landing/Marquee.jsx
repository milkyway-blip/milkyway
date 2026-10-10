export default function Marquee({ text, theme = "light" }) {
  const items = (text || "").split("•").map((s) => s.trim()).filter(Boolean);
  if (!items.length) return null;
  const dark = theme === "green";

  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span
          key={i}
          className="flex items-center gap-8 whitespace-nowrap pr-8 font-display text-xl font-light tracking-tight sm:text-2xl"
        >
          {t}
          <span className={`h-2 w-2 rounded-full ${dark ? "bg-[var(--gold)]" : "bg-[var(--pasture)]"}`} />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`relative overflow-hidden border-y py-5 ${
        dark
          ? "border-[var(--pasture-deep)] bg-[var(--pasture)] text-[var(--cream)]"
          : "border-[var(--line)] bg-[var(--milk-2)] text-[var(--ink)]"
      }`}
      data-testid={dark ? "marquee-green" : "marquee"}
    >
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}
