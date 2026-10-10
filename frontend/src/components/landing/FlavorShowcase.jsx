import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/api";

function FlavorCard({ flavor, index, unitSize }) {
  const { add, setOpen } = useCart();
  const [qty, setQtyLocal] = useState(1);

  const handleAdd = () => {
    add(flavor, qty);
    toast.success(`${flavor.name} x${qty} masuk keranjang`, {
      action: { label: "Lihat", onClick: () => setOpen(true) },
    });
    setQtyLocal(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 5) * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-3xl border-2 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-brand-blue/10"
      style={{ borderColor: flavor.border_color }}
      data-testid={`flavor-card-${flavor.key}`}
    >
      <div className="relative h-36 overflow-hidden sm:h-44" style={{ backgroundColor: flavor.bg_color }}>
        {flavor.image && (
          <img
            src={flavor.image}
            alt={flavor.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
          />
        )}
        {flavor.badge && (
          <span
            className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur"
            style={{ color: flavor.text_color }}
          >
            {flavor.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-bold text-brand-navy sm:text-lg">{flavor.name}</h3>
        <p className="mt-0.5 text-sm font-semibold text-brand-blue">
          {formatRupiah(flavor.price)}
          <span className="ml-1 text-xs font-medium text-brand-navy/40">/ {unitSize}</span>
        </p>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center self-start rounded-full border border-brand-navy/10 bg-brand-cream">
            <button
              onClick={() => setQtyLocal((q) => Math.max(1, q - 1))}
              className="p-1.5 text-brand-navy/60 transition hover:text-brand-blue disabled:opacity-30"
              disabled={qty <= 1}
              data-testid={`qty-minus-${flavor.key}`}
              aria-label="Kurangi"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-bold" data-testid={`qty-value-${flavor.key}`}>{qty}</span>
            <button
              onClick={() => setQtyLocal((q) => Math.min(99, q + 1))}
              className="p-1.5 text-brand-navy/60 transition hover:text-brand-blue"
              data-testid={`qty-plus-${flavor.key}`}
              aria-label="Tambah"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="w-full rounded-full bg-brand-blue px-3.5 py-2.5 text-center text-xs font-bold text-white shadow-md shadow-brand-blue/25 transition hover:bg-brand-deep active:scale-95 sm:w-auto sm:py-2 sm:text-sm"
            data-testid={`add-to-cart-${flavor.key}`}
          >
            + Keranjang
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function FlavorShowcase({ flavors, priceDisplay, unitSize }) {
  return (
    <section id="varian" className="relative py-16 sm:py-24" data-testid="flavor-section">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue" data-testid="flavor-eyebrow">
            10 Varian Rasa
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl lg:text-4xl" data-testid="flavor-title">
            Pilih favoritmu, campur sesukamu
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-navy/60 sm:text-base" data-testid="flavor-subtitle">
            Semua varian {priceDisplay} per botol {unitSize}. Satu pesanan bisa berisi banyak rasa sekaligus — tinggal masukkan ke keranjang.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-5" data-testid="flavor-grid">
          {flavors.map((f, i) => (
            <FlavorCard key={f.id} flavor={f} index={i} unitSize={unitSize} />
          ))}
        </div>
      </div>
    </section>
  );
}
