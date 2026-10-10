import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import api, { formatApiError, formatRupiah, imgSrc, waLink } from "@/lib/api";

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

export default function CartDrawer({ content }) {
  const { items, setQty, remove, clear, total, open, setOpen } = useCart();
  const [form, setForm] = useState({ name: "", whatsapp: "", address: "", note: "" });
  const [sending, setSending] = useState(false);
  const [placed, setPlaced] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const close = () => {
    setOpen(false);
    if (placed) setPlaced(null);
  };

  const submit = async () => {
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
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-brand-navy/40 backdrop-blur-sm"
            data-testid="cart-backdrop"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            data-testid="cart-drawer"
          >
            <div className="flex items-center justify-between border-b border-brand-navy/5 px-6 py-4">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-brand-navy">
                <ShoppingBag className="h-5 w-5 text-brand-blue" />
                {placed ? "Pesanan Kamu" : "Keranjang"}
              </h2>
              <button
                onClick={close}
                className="rounded-full p-2 text-brand-navy/50 transition hover:bg-brand-cream hover:text-brand-navy"
                data-testid="cart-close-btn"
                aria-label="Tutup keranjang"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5" data-lenis-prevent>
              {placed ? (
                <div className="flex h-full flex-col items-center justify-center text-center" data-testid="order-success-message">
                  <CheckCircle2 className="h-16 w-16 text-brand-blue" />
                  <h3 className="mt-4 font-display text-2xl font-bold text-brand-navy">Pesanan tersimpan!</h3>
                  <p className="mt-2 text-sm text-brand-navy/60">
                    Terima kasih, {placed.customer_name}. Total pesananmu{" "}
                    <span className="font-bold text-brand-blue">{formatRupiah(placed.total)}</span>.
                    Lanjutkan konfirmasi ke WhatsApp agar pesananmu segera diproses.
                  </p>
                  <a
                    href={waLink(content.whatsapp_number, buildWaMessage(placed))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/30 transition hover:brightness-95 active:scale-95"
                    data-testid="whatsapp-confirm-btn"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Konfirmasi via WhatsApp
                  </a>
                  <button
                    onClick={() => {
                      setPlaced(null);
                      setOpen(false);
                    }}
                    className="mt-3 text-sm font-semibold text-brand-navy/50 underline-offset-4 hover:underline"
                    data-testid="order-again-btn"
                  >
                    Pesan lagi
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center" data-testid="cart-empty">
                  <ShoppingBag className="h-14 w-14 text-brand-navy/15" />
                  <p className="mt-4 font-display text-lg font-bold text-brand-navy">Keranjang masih kosong</p>
                  <p className="mt-1 text-sm text-brand-navy/50">Yuk pilih varian favoritmu — bisa campur banyak rasa.</p>
                  <button
                    onClick={() => {
                      setOpen(false);
                      document.getElementById("varian")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="mt-5 rounded-full bg-brand-blue px-6 py-3 text-sm font-bold text-white shadow-md shadow-brand-blue/25 transition hover:bg-brand-deep"
                    data-testid="cart-browse-btn"
                  >
                    Lihat Varian
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((i) => (
                    <div key={i.id} className="flex gap-3 rounded-2xl border border-brand-navy/5 bg-brand-cream/60 p-3" data-testid={`cart-item-${i.id}`}>
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl" style={{ backgroundColor: i.bg_color }}>
                        {i.image && <img src={imgSrc(i.image)} alt={i.name} className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-brand-navy">{i.name}</p>
                          <button
                            onClick={() => remove(i.id)}
                            className="text-brand-navy/30 transition hover:text-red-500"
                            data-testid={`cart-remove-${i.id}`}
                            aria-label="Hapus item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-brand-blue">{formatRupiah(i.price)} / botol</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-brand-navy/10 bg-white">
                            <button
                              onClick={() => setQty(i.id, i.qty - 1)}
                              className="p-1.5 text-brand-navy/60 hover:text-brand-blue"
                              data-testid={`cart-qty-minus-${i.id}`}
                              aria-label="Kurangi"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm font-bold">{i.qty}</span>
                            <button
                              onClick={() => setQty(i.id, i.qty + 1)}
                              className="p-1.5 text-brand-navy/60 hover:text-brand-blue"
                              data-testid={`cart-qty-plus-${i.id}`}
                              aria-label="Tambah"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-sm font-bold text-brand-navy">{formatRupiah(i.price * i.qty)}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-3 rounded-2xl border border-brand-navy/5 p-4" data-testid="order-form">
                    <p className="font-display text-base font-bold text-brand-navy">Data Pemesan</p>
                    <input
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Nama lengkap"
                      className="w-full rounded-xl border border-brand-navy/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      data-testid="order-form-name-input"
                    />
                    <input
                      value={form.whatsapp}
                      onChange={set("whatsapp")}
                      placeholder="Nomor WhatsApp aktif"
                      inputMode="tel"
                      className="w-full rounded-xl border border-brand-navy/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      data-testid="order-form-whatsapp-input"
                    />
                    <textarea
                      value={form.address}
                      onChange={set("address")}
                      placeholder="Alamat lengkap pengiriman"
                      rows={2}
                      className="w-full resize-none rounded-xl border border-brand-navy/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      data-testid="order-form-address-input"
                    />
                    <input
                      value={form.note}
                      onChange={set("note")}
                      placeholder="Catatan (opsional)"
                      className="w-full rounded-xl border border-brand-navy/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      data-testid="order-form-note-input"
                    />
                  </div>
                </div>
              )}
            </div>

            {!placed && items.length > 0 && (
              <div className="border-t border-brand-navy/5 px-6 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-brand-navy/60">Total</span>
                  <span className="font-display text-xl font-bold text-brand-navy" data-testid="cart-total">
                    {formatRupiah(total)}
                  </span>
                </div>
                <button
                  onClick={submit}
                  disabled={sending}
                  className="w-full rounded-full bg-brand-blue py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-blue/30 transition hover:bg-brand-deep active:scale-[0.98] disabled:opacity-60"
                  data-testid="order-form-submit-btn"
                >
                  {sending ? "Menyimpan..." : "Buat Pesanan"}
                </button>
                <p className="mt-2 text-center text-[11px] text-brand-navy/40">
                  Pesanan tersimpan, lalu lanjut konfirmasi ke WhatsApp kami.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
