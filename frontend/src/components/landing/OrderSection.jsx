import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CheckCircle2, MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import api, { formatApiError, formatRupiah, imgSrc, waLink } from "@/lib/api";

const EASE = [0.22, 1, 0.36, 1];

const buildWaMessage = (o) =>
  [
    "Halo MilkyWay! Saya mau pesan:",
    "",
    ...o.items.map((i) => `- ${i.name} x${i.qty} = ${formatRupiah(i.price * i.qty)}`),
    "",
    `Total: ${formatRupiah(o.total)}`,
    "",
    `Nama: ${o.customer_name}`,
    `No. WA: ${o.whatsapp}`,
    `Alamat: ${o.address}`,
    o.note ? `Catatan: ${o.note}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");

export default function OrderSection({ flavors, content }) {
  const { items, add, setQty, clear, count, total } = useCart();
  const [form, setForm] = useState({ name: "", whatsapp: "", address: "", note: "" });
  const [sending, setSending] = useState(false);
  const [placed, setPlaced] = useState(null);

  const qtyOf = (id) => items.find((i) => i.id === id)?.qty || 0;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!count) return;
    if (!form.name.trim() || !form.whatsapp.trim() || !form.address.trim()) {
      toast.error("Lengkapi nama, nomor WhatsApp, dan alamat dulu ya");
      return;
    }
    setSending(true);
    try {
      const { data } = await api.post("/orders", {
        customer_name: form.name,
        whatsapp: form.whatsapp,
        address: form.address,
        note: form.note,
        items: items.map((i) => ({ flavor_id: i.id, qty: i.qty })),
      });
      setPlaced(data);
      clear();
      toast.success("Pesanan tersimpan!");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="pesan" className="relative overflow-hidden bg-[var(--milk-2)] py-24 lg:py-36" data-testid="order-section">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(229,168,35,0.22),transparent_60%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-14 lg:px-12">
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="eyebrow mb-5">Pesan Sekarang</p>
            <h2 className="font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
              Dingin segar, <em className="font-light italic text-[var(--pasture)]">siap</em> kamu nikmati.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--ink-muted)] md:text-lg">
              Campur varian sesukamu dalam satu pesanan. Kami simpan pesananmu, lalu konfirmasi lewat WhatsApp.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="glass mt-10 rounded-[1.75rem] p-6"
            data-testid="order-summary"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--pasture)] text-[var(--cream)]">
                <ShoppingBag className="h-[18px] w-[18px]" />
              </span>
              <p className="eyebrow">Ringkasan Keranjang</p>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-[var(--ink-muted)]" data-testid="order-summary-empty">
                Keranjang masih kosong. Tambahkan botol dari daftar varian.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {items.map((i) => (
                  <li key={i.id} className="flex justify-between text-[var(--ink)]/80">
                    <span>
                      {i.name} <span className="font-semibold">x{i.qty}</span>
                    </span>
                    <span className="font-semibold">{formatRupiah(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 flex items-end justify-between border-t border-[var(--line)] pt-4">
              <p className="text-sm text-[var(--ink-muted)]" data-testid="order-summary-count">{count} botol</p>
              <p className="font-display text-3xl font-semibold text-[var(--pasture)]" data-testid="order-summary-total">
                {formatRupiah(total)}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="lg:col-span-7"
        >
          <div className="rounded-[2rem] border border-[var(--line)] bg-white p-6 shadow-[0_40px_80px_-50px_rgba(26,26,24,0.35)] sm:p-10">
            {placed ? (
              <div className="flex flex-col items-center py-10 text-center" data-testid="order-success-message">
                <CheckCircle2 className="h-16 w-16 text-[var(--pasture)]" />
                <h3 className="mt-4 font-display text-3xl font-medium">Pesanan tersimpan!</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--ink-muted)]">
                  Terima kasih, {placed.customer_name}. Total pesananmu{" "}
                  <span className="font-semibold text-[var(--pasture)]">{formatRupiah(placed.total)}</span>. Lanjutkan
                  konfirmasi ke WhatsApp agar pesananmu segera diproses.
                </p>
                <a
                  href={waLink(content.whatsapp_number, buildWaMessage(placed))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold text-white shadow-[0_16px_40px_-12px_rgba(37,211,102,0.6)] transition hover:brightness-95 active:scale-95"
                  data-testid="whatsapp-confirm-btn"
                >
                  <MessageCircle className="h-4 w-4" />
                  Konfirmasi via WhatsApp
                </a>
                <button
                  onClick={() => setPlaced(null)}
                  className="mt-4 text-sm font-semibold text-[var(--ink-muted)] underline-offset-4 hover:underline"
                  data-testid="order-again-btn"
                >
                  Pesan lagi
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-6" data-testid="order-form">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="eyebrow">Pilih varian & jumlah</p>
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--ink-muted)]" data-testid="cart-total-qty">
                      {count} botol
                    </span>
                  </div>
                  <ul className="divide-y divide-[var(--line)]" data-testid="cart-list">
                    {flavors.map((f) => {
                      const q = qtyOf(f.id);
                      return (
                        <li key={f.id} className="flex items-center gap-3 py-3 sm:gap-4" data-testid={`cart-row-${f.key}`}>
                          <div
                            className="h-14 w-11 shrink-0 overflow-hidden rounded-xl border border-[var(--line)] sm:h-16 sm:w-12"
                            style={{ backgroundColor: f.bg_color }}
                          >
                            {f.image && <img src={imgSrc(f.image)} alt={f.name} loading="lazy" className="h-full w-full object-cover" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{f.name}</p>
                            <p className="text-xs text-[var(--ink-muted)]">{formatRupiah(f.price)} / botol</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={q === 0}
                              onClick={() => setQty(f.id, q - 1)}
                              className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] transition-colors hover:bg-[var(--milk-2)] disabled:opacity-30"
                              data-testid={`cart-minus-${f.key}`}
                              aria-label={`Kurangi ${f.name}`}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-7 text-center font-display text-xl font-semibold tabular-nums" data-testid={`cart-qty-${f.key}`}>
                              {q}
                            </span>
                            <button
                              type="button"
                              onClick={() => (q === 0 ? add(f, 1) : setQty(f.id, q + 1))}
                              className="grid h-9 w-9 place-items-center rounded-full text-[var(--cream)] transition-transform hover:scale-105"
                              style={{ background: f.text_color }}
                              data-testid={`cart-plus-${f.key}`}
                              aria-label={`Tambah ${f.name}`}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input required minLength={2} value={form.name} onChange={set("name")} className="field" placeholder="Nama lengkap" data-testid="order-form-name-input" />
                  <input required minLength={8} type="tel" value={form.whatsapp} onChange={set("whatsapp")} className="field" placeholder="Nomor WhatsApp (08xx)" data-testid="order-form-whatsapp-input" />
                </div>
                <textarea required minLength={5} rows={2} value={form.address} onChange={set("address")} className="field resize-none" placeholder="Alamat lengkap" data-testid="order-form-address-input" />
                <textarea rows={2} value={form.note} onChange={set("note")} className="field resize-none" placeholder="Catatan (opsional): patokan alamat, waktu pengambilan, dll." data-testid="order-form-note-input" />

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">Total · {count} botol</p>
                    <p className="font-display text-3xl font-semibold" data-testid="order-total">{formatRupiah(total)}</p>
                  </div>
                  <button
                    type="submit"
                    disabled={count === 0 || sending}
                    className="btn-pill primary disabled:cursor-not-allowed disabled:opacity-50"
                    data-testid="order-form-submit-btn"
                  >
                    <Check className="h-4 w-4" />
                    {sending ? "Menyimpan..." : "Buat Pesanan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
