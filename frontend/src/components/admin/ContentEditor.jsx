import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError, formatRupiah, imgSrc } from "@/lib/api";
import ImageUpload from "@/components/admin/ImageUpload";
import FactsEditor from "@/components/admin/FactsEditor";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

const emptyFlavor = {
  name: "",
  badge: "",
  price: 15000,
  image: "",
  bg_color: "#F0F9FF",
  border_color: "#BAE6FD",
  text_color: "#0C4A6E",
  active: true,
};

function FlavorModal({ initial, onClose, onSaved }) {
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF((prev) => ({ ...prev, [k]: v }));

  const save = async () => {
    if (!f.name.trim()) {
      toast.error("Nama varian wajib diisi");
      return;
    }
    setSaving(true);
    const payload = {
      name: f.name.trim(),
      badge: f.badge.trim(),
      price: parseInt(f.price, 10) || 15000,
      image: (f.image || "").trim(),
      bg_color: f.bg_color,
      border_color: f.border_color,
      text_color: f.text_color,
      active: !!f.active,
      stock: f.stock === null || f.stock === undefined || f.stock === "" ? null : parseInt(f.stock, 10),
    };
    try {
      if (f.id) await api.put(`/flavors/${f.id}`, payload);
      else await api.post("/flavors", payload);
      toast.success("Varian tersimpan");
      onSaved();
      onClose();
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setSaving(false);
    }
  };

  const colorField = (key, label) => (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-brand-navy/10 px-3 py-2">
      <span className="text-xs font-semibold text-brand-navy/60">{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-brand-navy/40">{f[key]}</span>
        <input
          type="color"
          value={f[key]}
          onChange={(e) => set(key, e.target.value)}
          className="h-7 w-9 cursor-pointer rounded-md border border-brand-navy/10"
          data-testid={`flavor-form-${key}`}
        />
      </span>
    </label>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-brand-navy/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      data-testid="flavor-modal"
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-brand-navy">
            {f.id ? "Edit Varian" : "Tambah Varian"}
          </h3>
          <button onClick={onClose} className="rounded-full p-2 text-brand-navy/40 hover:bg-brand-cream" data-testid="flavor-modal-close" aria-label="Tutup">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3.5" data-testid="flavor-form">
          <input
            value={f.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Nama varian (mis. Strawberry)"
            className="w-full rounded-xl border border-brand-navy/10 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            data-testid="flavor-form-name"
          />
          <input
            value={f.badge}
            onChange={(e) => set("badge", e.target.value)}
            placeholder="Badge singkat (mis. Stroberi Segar)"
            className="w-full rounded-xl border border-brand-navy/10 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            data-testid="flavor-form-badge"
          />
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-brand-navy/60">Harga / botol</label>
              <input
                type="number"
                min="0"
                value={f.price}
                onChange={(e) => set("price", e.target.value)}
                className="w-32 rounded-xl border border-brand-navy/10 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                data-testid="flavor-form-price"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-brand-navy/60">Stok</label>
              <input
                type="number"
                min="0"
                value={f.stock ?? ""}
                placeholder="Tak terbatas"
                onChange={(e) => set("stock", e.target.value)}
                className="w-32 rounded-xl border border-brand-navy/10 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                data-testid="flavor-form-stock"
              />
            </div>
          </div>
          <p className="-mt-1 text-[11px] text-brand-navy/40">Kosongkan stok jika tidak dibatasi. Isi 0 untuk menandai habis.</p>
          <div>
            <label className="mb-1 block text-xs font-bold text-brand-navy/60">Foto Varian</label>
            <ImageUpload value={f.image} onChange={(url) => set("image", url)} testid="flavor-form-image" />
          </div>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {colorField("bg_color", "Warna latar")}
            {colorField("border_color", "Warna bingkai")}
            {colorField("text_color", "Warna teks")}
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-brand-navy/70">
            <input
              type="checkbox"
              checked={!!f.active}
              onChange={(e) => set("active", e.target.checked)}
              className="h-4 w-4 accent-[#0C4A34]"
              data-testid="flavor-form-active"
            />
            Tampilkan di landing page
          </label>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="mt-6 w-full rounded-full bg-brand-blue py-3 text-sm font-bold text-white shadow-lg shadow-brand-blue/30 transition hover:bg-brand-deep disabled:opacity-60"
          data-testid="flavor-form-save"
        >
          {saving ? "Menyimpan..." : "Simpan Varian"}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function ContentEditor() {
  const [content, setContent] = useState(null);
  const [flavors, setFlavors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadFlavors = () => api.get("/flavors").then((r) => setFlavors(r.data)).catch(() => {});

  useEffect(() => {
    api.get("/content").then((r) => setContent(r.data.content)).catch(() => {});
    loadFlavors();
  }, []);

  const setC = (k) => (e) => setContent((c) => ({ ...c, [k]: e.target.value }));
  const setSizeAt = (i, k, v) =>
    setContent((c) => ({ ...c, sizes: (c.sizes || []).map((s, idx) => (idx === i ? { ...s, [k]: v } : s)) }));
  const removeSizeAt = (i) =>
    setContent((c) => ({ ...c, sizes: (c.sizes || []).filter((_, idx) => idx !== i) }));
  const addSize = () =>
    setContent((c) => ({ ...c, sizes: [...(c.sizes || []), { label: "", price: 15000 }] }));
  const setManifestoAt = (i, k, v) =>
    setContent((c) => ({ ...c, manifesto: (c.manifesto || []).map((m, idx) => (idx === i ? { ...m, [k]: v } : m)) }));
  const removeManifestoAt = (i) =>
    setContent((c) => ({ ...c, manifesto: (c.manifesto || []).filter((_, idx) => idx !== i) }));
  const addManifesto = () =>
    setContent((c) => ({ ...c, manifesto: [...(c.manifesto || []), { title: "", body: "" }] }));

  const saveContent = async () => {
    setSaving(true);
    try {
      await api.put("/content", {
        product_name: content.product_name,
        tagline: content.tagline,
        hero_title: content.hero_title,
        hero_subtitle: content.hero_subtitle,
        hero_image: content.hero_image,
        marquee_text: content.marquee_text,
        whatsapp_number: content.whatsapp_number,
        price_display: content.price_display,
        logo_image: content.logo_image || "",
        sizes: (content.sizes || [])
          .map((s) => ({ label: String(s.label || "").trim(), price: parseInt(s.price, 10) || 0 }))
          .filter((s) => s.label),
        manifesto: (content.manifesto || []).filter((m) => (m.title || "").trim()),
        pickup_address: content.pickup_address,
        pickup_hours: content.pickup_hours,
        facts: content.facts || [],
      });
      toast.success("Konten landing page tersimpan");
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setSaving(false);
    }
  };

  const removeFlavor = async (fl) => {
    if (!window.confirm(`Hapus varian "${fl.name}"?`)) return;
    try {
      await api.delete(`/flavors/${fl.id}`);
      toast.success("Varian dihapus");
      loadFlavors();
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };

  if (!content) {
    return <p className="py-24 text-center text-sm text-brand-navy/40">Memuat konten...</p>;
  }

  const inputCls =
    "w-full rounded-xl border border-brand-navy/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";

  return (
    <div className="grid gap-6 lg:grid-cols-2" data-testid="admin-cms">
      <div className="rounded-3xl border border-brand-navy/5 bg-white p-6 shadow-sm" data-testid="cms-content-form">
        <h3 className="font-display text-lg font-bold text-brand-navy">Konten Landing Page</h3>
        <p className="text-xs text-brand-navy/50">Perubahan langsung tampil di halaman utama.</p>

        <div className="mt-5 space-y-3.5">
          <div>
            <label className="mb-1 block text-xs font-bold text-brand-navy/60">Nama Produk</label>
            <input value={content.product_name || ""} onChange={setC("product_name")} className={inputCls} data-testid="cms-product-name" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-brand-navy/60">Tagline</label>
            <input value={content.tagline || ""} onChange={setC("tagline")} className={inputCls} data-testid="cms-tagline" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-brand-navy/60">Judul Hero</label>
            <input value={content.hero_title || ""} onChange={setC("hero_title")} className={inputCls} data-testid="cms-hero-title" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-brand-navy/60">Sub-judul Hero</label>
            <textarea value={content.hero_subtitle || ""} onChange={setC("hero_subtitle")} rows={3} className={`${inputCls} resize-none`} data-testid="cms-hero-subtitle" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-brand-navy/60">Logo (navbar & footer)</label>
            <ImageUpload
              value={content.logo_image || ""}
              onChange={(url) => setContent((c) => ({ ...c, logo_image: url }))}
              testid="cms-logo-image"
            />
            <p className="mt-1 text-[11px] text-brand-navy/40">Kosongkan untuk memakai logo bawaan MilkyWay.</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-brand-navy/60">Foto Produk</label>
            <ImageUpload
              value={content.hero_image || ""}
              onChange={(url) => setContent((c) => ({ ...c, hero_image: url }))}
              testid="cms-hero-image"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-brand-navy/60">Teks Marquee (pisahkan dengan •)</label>
            <textarea value={content.marquee_text || ""} onChange={setC("marquee_text")} rows={2} className={`${inputCls} resize-none`} data-testid="cms-marquee" />
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-brand-navy/60">Nomor WhatsApp</label>
              <input value={content.whatsapp_number || ""} onChange={setC("whatsapp_number")} className={inputCls} data-testid="cms-whatsapp" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-brand-navy/60">Label Harga</label>
              <input value={content.price_display || ""} onChange={setC("price_display")} className={inputCls} data-testid="cms-price-display" />
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-brand-navy/60">Lokasi Pengambilan</label>
              <input value={content.pickup_address || ""} onChange={setC("pickup_address")} className={inputCls} data-testid="cms-pickup-address" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-brand-navy/60">Jam Pengambilan</label>
              <input value={content.pickup_hours || ""} onChange={setC("pickup_hours")} className={inputCls} data-testid="cms-pickup-hours" />
            </div>
          </div>

          <div className="border-t border-brand-navy/5 pt-4">
            <label className="mb-2 block text-xs font-bold text-brand-navy/60">Ukuran Botol & Harga</label>
            <div className="space-y-2" data-testid="cms-sizes-editor">
              {(content.sizes || []).map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={s.label} onChange={(e) => setSizeAt(i, "label", e.target.value)} placeholder="250ml" className={`${inputCls} w-24 shrink-0`} data-testid={`size-label-${i}`} />
                  <input type="number" min="0" value={s.price} onChange={(e) => setSizeAt(i, "price", e.target.value)} placeholder="15000" className={inputCls} data-testid={`size-price-${i}`} />
                  <button onClick={() => removeSizeAt(i)} className="shrink-0 rounded-xl p-2 text-brand-navy/30 transition hover:bg-red-50 hover:text-red-500" data-testid={`size-delete-${i}`} aria-label="Hapus ukuran">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button onClick={addSize} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-brand-navy/20 px-4 py-2 text-xs font-bold text-brand-navy/50 transition hover:border-brand-blue hover:text-brand-blue" data-testid="size-add-btn">
                <Plus className="h-3.5 w-3.5" />
                Tambah Ukuran
              </button>
            </div>
          </div>

          <div className="border-t border-brand-navy/5 pt-4">
            <label className="mb-2 block text-xs font-bold text-brand-navy/60">Janji Kami (Manifesto)</label>
            <div className="space-y-3" data-testid="cms-manifesto-editor">
              {(content.manifesto || []).map((m, i) => (
                <div key={i} className="space-y-2 rounded-2xl border border-brand-navy/10 p-3" data-testid={`manifesto-row-${i}`}>
                  <div className="flex gap-2">
                    <input value={m.title} onChange={(e) => setManifestoAt(i, "title", e.target.value)} placeholder="Judul poin" className={inputCls} data-testid={`manifesto-title-${i}`} />
                    <button onClick={() => removeManifestoAt(i)} className="shrink-0 rounded-xl p-2 text-brand-navy/30 transition hover:bg-red-50 hover:text-red-500" data-testid={`manifesto-delete-${i}`} aria-label="Hapus poin">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea value={m.body} onChange={(e) => setManifestoAt(i, "body", e.target.value)} placeholder="Isi teks" rows={2} className={`${inputCls} resize-none`} data-testid={`manifesto-body-${i}`} />
                </div>
              ))}
              <button onClick={addManifesto} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-brand-navy/20 px-4 py-2 text-xs font-bold text-brand-navy/50 transition hover:border-brand-blue hover:text-brand-blue" data-testid="manifesto-add-btn">
                <Plus className="h-3.5 w-3.5" />
                Tambah Poin
              </button>
            </div>
          </div>

          <div className="border-t border-brand-navy/5 pt-4">
            <label className="mb-2 block text-xs font-bold text-brand-navy/60">
              Info Produk (komposisi, masa simpan, halal, dll.)
            </label>
            <FactsEditor
              facts={content.facts || []}
              onChange={(facts) => setContent((c) => ({ ...c, facts }))}
            />
          </div>
        </div>

        <button
          onClick={saveContent}
          disabled={saving}
          className="mt-6 w-full rounded-full bg-brand-blue py-3 text-sm font-bold text-white shadow-lg shadow-brand-blue/30 transition hover:bg-brand-deep disabled:opacity-60"
          data-testid="cms-save-btn"
        >
          {saving ? "Menyimpan..." : "Simpan Konten"}
        </button>
      </div>

      <div className="rounded-3xl border border-brand-navy/5 bg-white p-6 shadow-sm" data-testid="cms-flavors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-brand-navy">Varian Rasa</h3>
            <p className="text-xs text-brand-navy/50">{flavors.length} varian terdaftar</p>
          </div>
          <button
            onClick={() => setEditing({ ...emptyFlavor })}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-blue/25 transition hover:bg-brand-deep"
            data-testid="flavor-add-btn"
          >
            <Plus className="h-4 w-4" />
            Tambah Varian
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {flavors.map((fl) => (
            <div
              key={fl.id}
              className="flex items-center gap-3 rounded-2xl border p-3"
              style={{ borderColor: fl.border_color, backgroundColor: fl.bg_color }}
              data-testid={`cms-flavor-row-${fl.key}`}
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white">
                {fl.image && <img src={imgSrc(fl.image)} alt={fl.name} className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold" style={{ color: fl.text_color }}>
                  {fl.name}
                  {!fl.active && (
                    <span className="ml-2 rounded-full bg-brand-navy/10 px-2 py-0.5 text-[10px] font-bold text-brand-navy/50">
                      disembunyikan
                    </span>
                  )}
                </p>
                <p className="text-xs" style={{ color: fl.text_color, opacity: 0.7 }}>
                  {formatRupiah(fl.price)} {fl.badge && `• ${fl.badge}`} {fl.stock != null && `• Stok ${fl.stock}`}
                </p>
              </div>
              <button
                onClick={() => setEditing({ ...fl })}
                className="rounded-full bg-white/80 p-2 text-brand-navy/60 transition hover:text-brand-blue"
                data-testid={`flavor-edit-${fl.key}`}
                aria-label={`Edit ${fl.name}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => removeFlavor(fl)}
                className="rounded-full bg-white/80 p-2 text-brand-navy/60 transition hover:text-red-500"
                data-testid={`flavor-delete-${fl.key}`}
                aria-label={`Hapus ${fl.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <TestimonialsManager />

      <AnimatePresence>
        {editing && (
          <FlavorModal initial={editing} onClose={() => setEditing(null)} onSaved={loadFlavors} />
        )}
      </AnimatePresence>
    </div>
  );
}
