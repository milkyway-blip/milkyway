import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { formatRupiah, imgSrc, priceFor } from "@/lib/api";

const EASE = [0.22, 1, 0.36, 1];

export default function FlavorShowcase({ flavors, unitSize, sizes = [], selectedKey, onSelect }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(sizes.find((s) => s.label === "350ml")?.label || sizes[0]?.label || "");

  if (!flavors.length) return null;
  const active = flavors.find((f) => f.key === selectedKey) || flavors[0];
  const unitPrice = priceFor(active, sizes, size);

  const pick = (key) => {
    onSelect(key);
    setQty(1);
  };

  const handleAdd = () => {
    add(active, qty, size, unitPrice);
    toast.success(`${active.name}${size ? ` ${size}` : ""} x${qty} masuk keranjang`, {
      action: {
        label: "Lihat",
        onClick: () => document.getElementById("pesan")?.scrollIntoView({ behavior: "smooth" }),
      },
    });
    setQty(1);
  };

  return (
    <section id="varian" className="relative py-20 transition-[background-color] duration-700 sm:py-28 lg:py-36" style={{ backgroundColor: active.bg_color }} data-testid="flavor-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-3xl"
        >
          <p className="eyebrow mb-5" data-testid="flavor-eyebrow">
            {flavors.length} Varian Rasa
          </p>
          <h2 className="font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl" data-testid="flavor-title">
            Pilih <em className="font-light italic text-[var(--pasture)]">moodmu</em> hari ini.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-muted)] md:text-lg" data-testid="flavor-subtitle">
            Semua varian berbasis susu sapi pasteurisasi yang sama. Pilih satu favorit, atau campur semuanya dalam satu pesanan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-10 flex flex-wrap gap-2"
          data-testid="flavor-tabs"
        >
          {flavors.map((f) => (
            <button
              key={f.id}
              onClick={() => pick(f.key)}
              className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm font-medium transition ${
                active.key === f.key
                  ? "border-transparent bg-[var(--pasture)] text-[var(--cream)]"
                  : "border-[var(--line)] bg-white/70 text-[var(--ink)] hover:border-[var(--pasture)]/40"
              }`}
              data-testid={`flavor-tab-${f.key}`}
            >
              <span
                className="h-5 w-5 rounded-full border border-black/10"
                style={{ background: f.bg_color, borderColor: f.border_color }}
              />
              {f.name}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.key}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            data-testid="flavor-detail"
          >
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_40px_80px_-50px_rgba(26,26,24,0.35)]">
              {active.image && (
                <img
                  src={imgSrc(active.image)}
                  alt={active.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  data-testid="flavor-detail-image"
                />
              )}
              <span className="absolute bottom-4 left-4 rounded-full bg-[var(--pasture)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--cream)]">
                {size || unitSize}
              </span>
            </div>

            <div>
              <p className="eyebrow" data-testid="flavor-detail-eyebrow">
                Varian · {active.badge || "Murni"}
              </p>
              <h3 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl" data-testid="flavor-detail-name">
                {active.name}
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {active.badge && (
                  <span className="rounded-full border border-[var(--line)] bg-white/70 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                    {active.badge}
                  </span>
                )}
                <span className="rounded-full border border-[var(--line)] bg-white/70 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                  Tanpa Pengawet
                </span>
              </div>

              {sizes.length > 0 && (
                <div className="mt-6" data-testid="flavor-sizes">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">Ukuran botol</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => setSize(s.label)}
                        className={`rounded-full border px-4 py-2 font-mono text-xs tracking-wide transition ${
                          size === s.label
                            ? "border-transparent bg-[var(--pasture)] text-[var(--cream)]"
                            : "border-[var(--line)] bg-white/70 text-[var(--ink)] hover:border-[var(--pasture)]/40"
                        }`}
                        data-testid={`showcase-size-${s.label}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">Harga per botol</p>
                  <p className="mt-1 font-display text-3xl font-semibold" data-testid="flavor-detail-price">
                    {formatRupiah(unitPrice)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] transition-colors hover:bg-white/70 disabled:opacity-30"
                    data-testid={`qty-minus-${active.key}`}
                    aria-label="Kurangi"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center font-display text-xl font-semibold tabular-nums" data-testid={`qty-value-${active.key}`}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(active.stock ?? 99, q + 1))}
                    className="grid h-9 w-9 place-items-center rounded-full text-[var(--cream)] transition-transform hover:scale-105"
                    style={{ background: active.text_color }}
                    data-testid={`qty-plus-${active.key}`}
                    aria-label="Tambah"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button onClick={handleAdd} className="btn-pill primary" data-testid={`add-to-cart-${active.key}`}>
                  <Plus className="h-4 w-4" />
                  Tambah ke Pesanan
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
