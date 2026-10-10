import { motion } from "framer-motion";
import { CalendarClock, FlaskConical, ShieldCheck, Snowflake, Timer } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const ICONS = {
  flask: FlaskConical,
  snowflake: Snowflake,
  calendar: CalendarClock,
  timer: Timer,
  shield: ShieldCheck,
};

export default function ProductInfo({ facts }) {
  if (!facts?.length) return null;

  return (
    <section id="info" className="relative py-24 lg:py-32" data-testid="product-info-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="eyebrow mb-5">Info Produk</p>
          <h2 className="max-w-2xl font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            Yang perlu kamu <em className="font-light italic text-[var(--pasture)]">tahu.</em>
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
          {facts.map((f, i) => {
            const Icon = ICONS[f.icon] || ShieldCheck;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
                whileHover={{ y: -5 }}
                className={`rounded-[1.75rem] border border-[var(--line)] bg-white p-5 transition-shadow duration-300 hover:shadow-[0_30px_60px_-40px_rgba(26,26,24,0.35)] sm:p-6 ${
                  i === facts.length - 1 && facts.length % 2 === 1 ? "col-span-2 md:col-span-1" : ""
                }`}
                data-testid={`product-info-${i}`}
              >
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--pasture)]/8 text-[var(--pasture)]" style={{ background: "rgba(12,74,52,0.08)" }}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-base font-semibold sm:text-lg">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-muted)] sm:text-sm">{f.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
