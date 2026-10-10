import { useEffect, useState } from "react";
import { Bell, Eye, ShoppingCart, Users, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api, { formatRupiah } from "@/lib/api";

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [traffic, setTraffic] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/stats/overview"), api.get("/stats/traffic")])
      .then(([s, t]) => {
        setStats(s.data);
        setTraffic(t.data);
      })
      .catch(() => setStats({}));
  }, []);

  if (!stats) {
    return <p className="py-24 text-center text-sm text-brand-navy/40">Memuat statistik...</p>;
  }

  const cards = [
    { icon: ShoppingCart, label: "Total Pesanan", value: stats.total_orders ?? 0, testid: "stat-total-orders" },
    { icon: Bell, label: "Pesanan Baru", value: stats.pending_orders ?? 0, testid: "stat-pending-orders" },
    { icon: Wallet, label: "Total Pendapatan", value: formatRupiah(stats.total_revenue), testid: "stat-revenue" },
    { icon: Eye, label: "Pengunjung Hari Ini", value: stats.visitors_today ?? 0, testid: "stat-visitors-today" },
    { icon: Users, label: "Total Pengunjung", value: stats.total_visitors ?? 0, testid: "stat-total-visitors" },
  ];

  const maxQty = Math.max(...(stats.top_flavors || []).map((f) => f.qty), 1);

  return (
    <div className="space-y-6" data-testid="admin-overview">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-3xl border border-brand-navy/5 bg-white p-5 shadow-sm" data-testid={c.testid}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-sky text-brand-blue">
              <c.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 font-display text-xl font-bold text-brand-navy sm:text-2xl">{c.value}</p>
            <p className="mt-0.5 text-xs font-medium text-brand-navy/50">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-brand-navy/5 bg-white p-5 shadow-sm sm:p-6" data-testid="traffic-chart">
          <h3 className="font-display text-lg font-bold text-brand-navy">Traffic 14 Hari Terakhir</h3>
          <p className="text-xs text-brand-navy/50">Pengunjung landing page & pesanan masuk per hari</p>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={traffic} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0196FF" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0196FF" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F0F7" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => `${d.slice(8)}/${d.slice(5, 7)}`}
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value, name) => [value, name === "visits" ? "Pengunjung" : "Pesanan"]}
                  labelFormatter={(d) => `Tanggal ${d}`}
                  contentStyle={{ borderRadius: 14, border: "1px solid #E8F0F7", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="visits" name="visits" stroke="#0196FF" strokeWidth={2.5} fill="url(#gradVisits)" />
                <Area type="monotone" dataKey="orders" name="orders" stroke="#0A2440" strokeWidth={2} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-brand-navy/5 bg-white p-5 shadow-sm sm:p-6" data-testid="top-flavors">
          <h3 className="font-display text-lg font-bold text-brand-navy">Varian Terlaris</h3>
          <p className="text-xs text-brand-navy/50">Berdasarkan jumlah botol terpesan</p>
          <div className="mt-5 space-y-4">
            {(stats.top_flavors || []).length === 0 && (
              <p className="py-8 text-center text-sm text-brand-navy/40">Belum ada pesanan masuk.</p>
            )}
            {(stats.top_flavors || []).map((f, i) => (
              <div key={f.name} data-testid={`top-flavor-${i}`}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-brand-navy">{f.name}</span>
                  <span className="font-bold text-brand-blue">{f.qty} botol</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-brand-cream">
                  <div
                    className="h-full rounded-full bg-brand-blue transition-all"
                    style={{ width: `${(f.qty / maxQty) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
