const Star = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-brand-blue" fill="currentColor" aria-hidden="true">
    <path d="M12 2c.6 4.8 2.4 8 5.2 9.4 2.8 1.4 4.8.6 4.8.6s-2 2.2-4.8 3.6C14.4 17 12.6 20.2 12 25c-.6-4.8-2.4-8-5.2-9.4C4 14.2 2 15 2 15s2-2.2 4.8-3.6C9.6 10 11.4 6.8 12 2z" transform="translate(0 -1.5)" />
  </svg>
);

export default function Marquee({ text }) {
  const items = (text || "").split("•").map((s) => s.trim()).filter(Boolean);
  if (!items.length) return null;

  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="mx-7 flex items-center gap-7 whitespace-nowrap font-display text-lg italic text-white/90">
          {t}
          <Star />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden bg-brand-navy py-5" data-testid="marquee">
      <div className="flex w-max animate-marquee-x">
        {row}
        {row}
      </div>
    </div>
  );
}
