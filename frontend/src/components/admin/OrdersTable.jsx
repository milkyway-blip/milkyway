import { useEffect, useMemo, useState } from "react";
import { Download, Inbox, MapPin, MessageCircle, StickyNote } from "lucide-react";
import { toast } from "sonner";
import api, { formatRupiah, waLink } from "@/lib/api";

const STATUS = {
  baru: { label: "Baru", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  diproses: { label: "Diproses", cls: "bg-blue-100 text-blue-700 border-blue-200" },
  siap_diambil: { label: "Siap Diambil", cls: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  selesai: { label: "Selesai", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  dibatalkan: { label: "Dibatalkan", cls: "bg-red-100 text-red-700 border-red-200" },
};

const FILTERS = [{ id: "semua", label: "Semua" }, ...Object.entries(STATUS).map(([id, s]) => ({ id, label: s.label }))];

export default function OrdersTable() {
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState("semua");

  useEffect(() => {
    api.get("/orders").then((r) => setOrders(r.data)).catch(() => setOrders([]));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/orders/${id}`, { status });
      setOrders((prev) => prev.map((o) => (o.id === id ? data : o)));
      toast.success(`Status pesanan ${STATUS[status].label.toLowerCase()}`);
    } catch {
      toast.error("Gagal memperbarui status");
    }
  };

  const filtered = useMemo(
    () => (orders || []).filter((o) => filter === "semua" || o.status === filter),
    [orders, filter],
  );

  if (!orders) {
    return <p className="py-24 text-center text-sm text-brand-navy/40">Memuat pesanan...</p>;
  }

  return (
    <div className="space-y-5" data-testid="admin-orders">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2" data-testid="orders-filter">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            data-testid={`orders-filter-${f.id}`}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              filter === f.id
                ? "bg-brand-blue text-white shadow-md shadow-brand-blue/25"
                : "border border-brand-navy/10 bg-white text-brand-navy/60 hover:text-brand-navy"
            }`}
          >
            {f.label}
            <span className="ml-1.5 opacity-70">
              {f.id === "semua" ? orders.length : orders.filter((o) => o.status === f.id).length}
            </span>
          </button>
        ))}
        </div>
        <a
          href={`${process.env.REACT_APP_BACKEND_URL}/api/orders/export.csv`}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-navy/10 bg-white px-4 py-2 text-xs font-bold text-brand-navy/70 transition hover:border-brand-blue hover:text-brand-blue"
          data-testid="orders-export-csv-btn"
        >
          <Download className="h-3.5 w-3.5" />
          Unduh CSV
        </a>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-brand-navy/15 bg-white py-16 text-center" data-testid="orders-empty">
          <Inbox className="h-12 w-12 text-brand-navy/15" />
          <p className="mt-3 font-display text-lg font-bold text-brand-navy">Belum ada pesanan</p>
          <p className="mt-1 text-sm text-brand-navy/50">Pesanan dari landing page akan muncul di sini.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2" data-testid="admin-orders-table">
          {filtered.map((o) => (
            <div key={o.id} className="rounded-3xl border border-brand-navy/5 bg-white p-5 shadow-sm" data-testid={`order-row-${o.id}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-bold text-brand-navy">{o.customer_name}</p>
                  <p className="text-xs text-brand-navy/45">
                    {new Date(o.created_at).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold outline-none ${STATUS[o.status].cls}`}
                  data-testid={`order-status-select-${o.id}`}
                >
                  {Object.entries(STATUS).map(([id, s]) => (
                    <option key={id} value={id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <ul className="mt-4 space-y-1.5 border-t border-brand-navy/5 pt-3 text-sm">
                {o.items.map((i) => (
                  <li key={i.flavor_id} className="flex justify-between text-brand-navy/70">
                    <span>
                      {i.name} <span className="font-bold text-brand-navy">x{i.qty}</span>
                    </span>
                    <span className="font-semibold">{formatRupiah(i.price * i.qty)}</span>
                  </li>
                ))}
                <li className="flex justify-between border-t border-brand-navy/5 pt-2 font-display text-base font-bold text-brand-navy">
                  <span>Total</span>
                  <span className="text-brand-blue">{formatRupiah(o.total)}</span>
                </li>
              </ul>

              <div className="mt-3 space-y-1.5 text-xs text-brand-navy/55">
                {o.address && (
                  <p className="flex items-start gap-1.5">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-blue" />
                    {o.address}
                  </p>
                )}
                {o.note && (
                  <p className="flex items-start gap-1.5">
                    <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-blue" />
                    {o.note}
                  </p>
                )}
              </div>

              <a
                href={waLink(o.whatsapp, `Halo ${o.customer_name}, kami dari MilkyWay. Pesananmu sedang kami proses ya!`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366]/10 px-4 py-2 text-xs font-bold text-[#128C4B] transition hover:bg-[#25D366]/20"
                data-testid={`order-wa-btn-${o.id}`}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Chat {o.whatsapp}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
