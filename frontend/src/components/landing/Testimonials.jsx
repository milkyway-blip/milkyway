import { motion } from "framer-motion";
import { Star } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

export default function Testimonials({ items }) {
  if (!items?.length) return null;

  return (
    <section id="testimoni" className="relative py-24 lg:py-32" data-testid="testimonials-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="eyebrow mb-5">Testimoni</p>
          <h2 className="max-w-2xl font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            Kata mereka yang sudah <em className="font-light italic text-[var(--pasture)]">mencoba.</em>
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.figure
              key={t.id || i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
              whileHover={{ y: -5 }}
              className="flex flex-col rounded-[1.75rem] border border-[var(--line)] bg-white p-6 transition-shadow duration-300 hover:shadow-[0_30px_60px_-40px_rgba(26,26,24,0.35)] sm:p-7"
              data-testid={`testimonial-card-${i}`}
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`h-4 w-4 ${n <= t.rating ? "fill-[var(--gold)] text-[var(--gold)]" : "text-[var(--line)]"}`}
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 font-display text-base font-light leading-relaxed text-[var(--ink)] sm:text-lg">
                "{t.text}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--line)] pt-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--pasture)]/10 font-display text-sm font-semibold text-[var(--pasture)]">
                  {t.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-semibold">{t.name}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
