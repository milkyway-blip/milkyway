import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

export default function Testimonials({ items }) {
  if (!items?.length) return null;

  return (
    <section className="pb-16 sm:pb-24" data-testid="testimonials-section">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">Testimoni</p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl lg:text-4xl">
            Kata mereka yang sudah coba
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.figure
              key={t.id || i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              className="relative flex flex-col rounded-3xl border border-brand-navy/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
              data-testid={`testimonial-card-${i}`}
            >
              <Quote className="absolute right-5 top-5 h-7 w-7 text-brand-blue/10" />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`h-4 w-4 ${n <= t.rating ? "fill-amber-400 text-amber-400" : "text-brand-navy/10"}`}
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-brand-navy/70">
                "{t.text}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-brand-navy/5 pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-sky font-display text-sm font-bold text-brand-deep">
                  {t.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-bold text-brand-navy">{t.name}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
