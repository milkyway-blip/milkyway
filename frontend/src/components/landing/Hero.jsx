import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { imgSrc, waLink } from "@/lib/api";

export default function Hero({ content }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const words = (content.hero_title || "").split(" ").filter(Boolean);

  const scrollToVarian = () =>
    document.getElementById("varian")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={ref} className="relative overflow-hidden pb-14 pt-28 sm:pt-32 lg:pb-24 lg:pt-40" data-testid="hero-section">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-blue/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-52 top-1/3 h-[420px] w-[420px] rounded-full bg-brand-blue/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div style={{ y: yText }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-white px-4 py-1.5 text-xs font-bold tracking-wide text-brand-deep shadow-sm"
            data-testid="hero-badge"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-blue" />
            {content.tagline} • {content.unit_size}
          </motion.div>

          <h1
            className="mt-6 font-display text-4xl font-semibold leading-[1.06] tracking-tight text-brand-navy sm:text-5xl lg:text-6xl"
            data-testid="hero-title"
          >
            {words.map((w, i) => (
              <span key={i} className="-mb-1 inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.25 + i * 0.055, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                  {i < words.length - 1 ? "\u00A0" : ""}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-brand-navy/60 sm:text-lg"
            data-testid="hero-subtitle"
          >
            {content.hero_subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={scrollToVarian}
              className="group inline-flex items-center gap-2 rounded-full bg-brand-blue px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-blue/30 transition hover:bg-brand-deep active:scale-95"
              data-testid="hero-cta-order"
            >
              Pesan Sekarang
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href={waLink(content.whatsapp_number, "Halo MilkyWay! Saya mau tanya-tanya dulu.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-brand-navy/15 bg-white px-7 py-3.5 text-sm font-bold text-brand-navy transition hover:border-brand-blue/40 hover:text-brand-blue active:scale-95"
              data-testid="hero-cta-wa"
            >
              <MessageCircle className="h-4 w-4" />
              Chat WhatsApp
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-10 flex items-center gap-8 text-sm"
            data-testid="hero-stats"
          >
            <div>
              <p className="font-display text-2xl font-bold text-brand-navy">10</p>
              <p className="text-brand-navy/50">Varian Rasa</p>
            </div>
            <div className="h-10 w-px bg-brand-navy/10" />
            <div>
              <p className="font-display text-2xl font-bold text-brand-navy">{content.price_display}</p>
              <p className="text-brand-navy/50">per Botol {content.unit_size}</p>
            </div>
            <div className="h-10 w-px bg-brand-navy/10" />
            <div>
              <p className="font-display text-2xl font-bold text-brand-navy">Campur</p>
              <p className="text-brand-navy/50">Rasa Sesukamu</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: yImg }} className="relative mx-auto w-full max-w-xs sm:max-w-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-b-[2.5rem] rounded-t-[999px] border-8 border-white shadow-2xl shadow-brand-blue/25"
          >
            <img
              src={imgSrc(content.hero_image)}
              alt={`${content.product_name} ${content.unit_size}`}
              className="aspect-[3/4] w-full object-cover"
              data-testid="hero-image"
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -left-4 bottom-10 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:-left-10"
            data-testid="hero-price-chip"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-navy/50">Harga</p>
            <p className="font-display text-lg font-bold text-brand-blue">{content.price_display}</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.6 }}
            className="absolute -right-3 top-12 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:-right-8"
            data-testid="hero-variant-chip"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-navy/50">Varian</p>
            <p className="font-display text-lg font-bold text-brand-navy">10 Rasa</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
