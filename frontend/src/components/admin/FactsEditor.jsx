import { Plus, Trash2 } from "lucide-react";

const ICON_OPTIONS = [
  { id: "flask", label: "Labu (komposisi)" },
  { id: "snowflake", label: "Salju (dingin)" },
  { id: "calendar", label: "Kalender (masa simpan)" },
  { id: "timer", label: "Timer (suhu ruang)" },
  { id: "shield", label: "Perisai (halal)" },
];

export default function FactsEditor({ facts, onChange }) {
  const set = (i, k, v) => onChange(facts.map((f, idx) => (idx === i ? { ...f, [k]: v } : f)));
  const remove = (i) => onChange(facts.filter((_, idx) => idx !== i));
  const add = () => onChange([...facts, { icon: "shield", title: "", text: "" }]);

  const inputCls =
    "w-full rounded-xl border border-brand-navy/10 bg-white px-3.5 py-2 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";

  return (
    <div className="space-y-3" data-testid="cms-facts-editor">
      {facts.map((f, i) => (
        <div key={i} className="space-y-2.5 rounded-2xl border border-brand-navy/10 p-3.5" data-testid={`fact-row-${i}`}>
          <div className="flex gap-2">
            <select
              value={f.icon}
              onChange={(e) => set(i, "icon", e.target.value)}
              className={`${inputCls} w-40 shrink-0 cursor-pointer`}
              data-testid={`fact-icon-${i}`}
            >
              {ICON_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <input
              value={f.title}
              onChange={(e) => set(i, "title", e.target.value)}
              placeholder="Judul (mis. Komposisi)"
              className={inputCls}
              data-testid={`fact-title-${i}`}
            />
            <button
              onClick={() => remove(i)}
              className="shrink-0 rounded-xl p-2 text-brand-navy/30 transition hover:bg-red-50 hover:text-red-500"
              data-testid={`fact-delete-${i}`}
              aria-label="Hapus info"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <textarea
            value={f.text}
            onChange={(e) => set(i, "text", e.target.value)}
            placeholder="Isi info produk"
            rows={2}
            className={`${inputCls} resize-none`}
            data-testid={`fact-text-${i}`}
          />
        </div>
      ))}
      <button
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-brand-navy/20 px-4 py-2 text-xs font-bold text-brand-navy/50 transition hover:border-brand-blue hover:text-brand-blue"
        data-testid="fact-add-btn"
      >
        <Plus className="h-3.5 w-3.5" />
        Tambah Info
      </button>
    </div>
  );
}
