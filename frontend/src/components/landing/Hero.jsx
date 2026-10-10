import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Droplets, Thermometer } from "lucide-react";
import { imgSrc } from "@/lib/api";

const EASE = [0.22, 1, 0.36, 1];

export default function Hero({ content, flavors, onPickFlavor }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 10,
      y: ((e.clientY - r.top) / r.height - 0.5) * -10,
    });
  };

  const words = (content.hero_title || "").split(" ").filter(Boolean);
  const commaIdx = words.findIndex((w) => w.includes(","));

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="hero" className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:min-h-screen lg:pb-20 lg:pt-36" data-testid="hero-section">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(229,168,35,0.20),transparent_60%)]" />
      <div className="pointer-events-none absolute -right-52 top-1/3 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(12,74,52,0.14),transparent_60%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="eyebrow mb-6 flex items-center sm:mb-8"
            data-testid="hero-badge"
          >
            {content.tagline} · Botol {content.unit_size}
          </motion.p>

          <h1
            className="font-display text-4xl font-medium leading-[1.04] tracking-[-0.03em] text-[var(--ink)] sm:text-5xl lg:text-6xl xl:text-7xl"
            data-testid="hero-title"
          >
            {words.map((w, i) => (
              <span key={i} className="reveal-word">
                <motion.span
                  className={`inline-block ${
                    commaIdx !== -1 && i > commaIdx ? "font-light italic text-[var(--pasture)]" : ""
                  }`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.75, ease: EASE }}
                >
                  {w}
                  {i < words.length - 1 ? "\u00A0" : ""}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-[var(--ink-muted)] sm:mt-8 md:text-lg"
            data-testid="hero-subtitle"
          >
            {content.hero_subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4"
          >
            <button onClick={() => scrollTo("pesan")} className="btn-pill primary" data-testid="hero-cta-order">
              Pesan Sekarang
              <ArrowDown className="h-4 w-4" />
            </button>
            <button onClick={() => scrollTo("varian")} className="btn-pill ghost" data-testid="hero-cta-flavors">
              Lihat {flavors.length} Varian
            </button>
          </motion.div>

          <div className="mt-10 flex flex-wrap gap-2 sm:mt-14" data-testid="hero-flavor-dots">
            {flavors.map((f, i) => (
              <motion.button
                key={f.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.05, duration: 0.4, ease: EASE }}
                onClick={() => onPickFlavor(f.key)}
                className="group flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 py-1.5 pl-1.5 pr-3 text-xs font-medium transition hover:border-[var(--pasture)]/40"
                data-testid={`hero-flavor-${f.key}`}
                title={f.name}
              >
                <span
                  className="h-5 w-5 rounded-full border border-black/10"
                  style={{ background: f.bg_color, borderColor: f.border_color }}
                />
                {f.name}
              </motion.button>
            ))}
          </div>
        </div>

        <div
          className="relative lg:col-span-5"
          style={{ perspective: 1200 }}
          onMouseMove={onMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        >
          <div
            className="transition-transform duration-200 ease-out"
            style={{ transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`, transformStyle: "preserve-3d" }}
          >
            <motion.div
              initial={{ opacity: 0, rotate: -10, y: 40 }}
              animate={{ opacity: 1, rotate: -6, y: 0 }}
              transition={{ delay: 0.45, duration: 0.9, ease: EASE }}
              className="relative mx-auto aspect-[3/4] w-[82%] max-w-md overflow-hidden rounded-[2.4rem] shadow-[0_50px_100px_-40px_rgba(26,26,24,0.45)] sm:w-[70%] lg:w-full"
              data-testid="hero-bottle-card"
            >
              <img
                src={imgSrc(content.hero_image)}
                alt={`${content.product_name} ${content.unit_size}`}
                className="absolute inset-0 h-full w-full object-cover"
                data-testid="hero-image"
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_25%,rgba(255,255,255,0.35),transparent_55%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,74,52,0.65)] via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-[var(--cream)]">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-80">Batch Pagi</p>
                  <p className="mt-1 font-display text-2xl font-medium leading-none">{content.unit_size}</p>
                </div>
                <div className="text-right font-mono text-[10px] uppercase tracking-[0.2em] opacity-80">
                  Tanpa
                  <br />
                  Pengawet
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.7, ease: EASE }}
            className="glass float-slow absolute -left-2 top-8 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg sm:left-0 sm:top-10"
            data-testid="hero-badge-temp"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--gold)]/20 text-[var(--gold)]">
              <Thermometer className="h-[18px] w-[18px]" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">Pasteurisasi</p>
              <p className="font-display text-lg font-semibold leading-none">72°C · 15 dtk</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.15, duration: 0.7, ease: EASE }}
            className="glass float-slow absolute -right-2 bottom-14 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg [animation-delay:1.5s] sm:right-0 sm:bottom-16"
            data-testid="hero-badge-fresh"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--pasture)]/10 text-[var(--pasture)]">
              <Droplets className="h-[18px] w-[18px]" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">Rantai Dingin</p>
              <p className="font-display text-lg font-semibold leading-none">Selalu 2–4°C</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
