import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";

const emptyTestimonial = { name: "", text: "", rating: 5, active: true };

function Stars({ value, onChange, testid }) {
  return (
    <div className="flex gap-1" data-testid={testid}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange && onChange(n)}
          disabled={!onChange}
          className={onChange ? "transition hover:scale-110" : "cursor-default"}
          data-testid={`${testid}-star-${n}`}
          aria-label={`${n} bintang`}
        >
          <Star className={`h-5 w-5 ${n <= value ? "fill-amber-400 text-amber-400" : "text-brand-navy/15"}`} />
        </button>
      ))}
    </div>
  );
}

function TestimonialModal({ initial, onClose, onSaved }) {
  const [t, setT] = useState(initial);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!t.name.trim() || !t.text.trim()) {
      toast.error("Nama dan isi testimoni wajib diisi");
      return;
    }
    setSaving(true);
    const payload = { name: t.name.trim(), text: t.text.trim(), rating: t.rating, active: !!t.active };
    try {
      if (t.id) await api.put(`/testimonials/${t.id}`, payload);
      else await api.post("/testimonials", payload);
      toast.success("Testimoni tersimpan");
      onSaved();
      onClose();
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-brand-navy/40 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      data-testid="testimonial-modal"
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-white p-6 sm:rounded-3xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-brand-navy">
            {t.id ? "Edit Testimoni" : "Tambah Testimoni"}
          </h3>
          <button onClick={onClose} className="rounded-full p-2 text-brand-navy/40 hover:bg-brand-cream" data-testid="testimonial-modal-close" aria-label="Tutup">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3.5">
          <input
            value={t.name}
            onChange={(e) => setT((p) => ({ ...p, name: e.target.value }))}
            placeholder="Nama pelanggan (mis. Dina P.)"
            className="w-full rounded-xl border border-brand-navy/10 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            data-testid="testimonial-form-name"
          />
          <textarea
            value={t.text}
            onChange={(e) => setT((p) => ({ ...p, text: e.target.value }))}
            placeholder="Isi ulasan pelanggan"
            rows={3}
            className="w-full resize-none rounded-xl border border-brand-navy/10 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            data-testid="testimonial-form-text"
          />
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-brand-navy/60">Rating</span>
            <Stars value={t.rating} onChange={(r) => setT((p) => ({ ...p, rating: r }))} testid="testimonial-form-rating" />
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-brand-navy/70">
            <input
              type="checkbox"
              checked={!!t.active}
              onChange={(e) => setT((p) => ({ ...p, active: e.target.checked }))}
              className="h-4 w-4 accent-[#0196FF]"
              data-testid="testimonial-form-active"
            />
            Tampilkan di landing page
          </label>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="mt-6 w-full rounded-full bg-brand-blue py-3 text-sm font-bold text-white shadow-lg shadow-brand-blue/30 transition hover:bg-brand-deep disabled:opacity-60"
          data-testid="testimonial-form-save"
        >
          {saving ? "Menyimpan..." : "Simpan Testimoni"}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function TestimonialsManager() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => api.get("/testimonials").then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => {
    load();
  }, []);

  const remove = async (t) => {
    if (!window.confirm(`Hapus testimoni dari "${t.name}"?`)) return;
    try {
      await api.delete(`/testimonials/${t.id}`);
      toast.success("Testimoni dihapus");
      load();
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };

  return (
    <div className="rounded-3xl border border-brand-navy/5 bg-white p-6 shadow-sm lg:col-span-2" data-testid="cms-testimonials">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-brand-navy">Testimoni Pelanggan</h3>
          <p className="text-xs text-brand-navy/50">{items.length} testimoni terdaftar</p>
        </div>
        <button
          onClick={() => setEditing({ ...emptyTestimonial })}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-blue/25 transition hover:bg-brand-deep"
          data-testid="testimonial-add-btn"
        >
          <Plus className="h-4 w-4" />
          Tambah Testimoni
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {items.length === 0 && (
          <p className="py-6 text-center text-sm text-brand-navy/40 md:col-span-2">
            Belum ada testimoni. Tambahkan ulasan pelanggan pertamamu.
          </p>
        )}
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl border border-brand-navy/10 p-4" data-testid={`testimonial-row-${t.id}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-sky font-display text-sm font-bold text-brand-deep">
                  {t.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-bold text-brand-navy">
                    {t.name}
                    {!t.active && (
                      <span className="ml-2 rounded-full bg-brand-navy/10 px-2 py-0.5 text-[10px] font-bold text-brand-navy/50">
                        disembunyikan
                      </span>
                    )}
                  </p>
                  <Stars value={t.rating} testid={`testimonial-stars-${t.id}`} />
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => setEditing({ ...t })}
                  className="rounded-full p-2 text-brand-navy/50 transition hover:bg-brand-cream hover:text-brand-blue"
                  data-testid={`testimonial-edit-${t.id}`}
                  aria-label={`Edit testimoni ${t.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(t)}
                  className="rounded-full p-2 text-brand-navy/50 transition hover:bg-red-50 hover:text-red-500"
                  data-testid={`testimonial-delete-${t.id}`}
                  aria-label={`Hapus testimoni ${t.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-brand-navy/60">"{t.text}"</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <TestimonialModal initial={editing} onClose={() => setEditing(null)} onSaved={load} />
        )}
      </AnimatePresence>
    </div>
  );
}
