import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Pencil, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Overview from "@/components/admin/Overview";
import OrdersTable from "@/components/admin/OrdersTable";
import ContentEditor from "@/components/admin/ContentEditor";

const tabs = [
  { id: "overview", label: "Ringkasan", icon: LayoutDashboard, testid: "admin-tab-overview" },
  { id: "orders", label: "Pesanan", icon: ShoppingCart, testid: "admin-tab-orders" },
  { id: "konten", label: "Konten", icon: Pencil, testid: "admin-tab-cms" },
];

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");

  if (user === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream" data-testid="admin-loading">
        <img src="/logo.png" alt="MilkyWay" className="h-12 animate-pulse" />
      </div>
    );
  }
  if (user === false) return <Navigate to="/admin/login" replace />;

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-brand-cream" data-testid="admin-dashboard">
      <header className="sticky top-0 z-30 border-b border-brand-navy/5 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="MilkyWay" className="h-8 w-auto" data-testid="admin-logo" />
            <span className="hidden rounded-full bg-brand-sky px-2.5 py-1 text-[11px] font-bold text-brand-deep sm:inline">
              Admin
            </span>
          </div>

          <nav className="flex items-center gap-1 rounded-full border border-brand-navy/5 bg-brand-cream p-1" data-testid="admin-tabs">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                data-testid={t.testid}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition sm:text-sm ${
                  tab === t.id
                    ? "bg-brand-blue text-white shadow-md shadow-brand-blue/25"
                    : "text-brand-navy/60 hover:text-brand-navy"
                }`}
              >
                <t.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="rounded-full p-2.5 text-brand-navy/50 transition hover:bg-red-50 hover:text-red-500"
            data-testid="admin-logout-btn"
            aria-label="Keluar"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {tab === "overview" && <Overview />}
        {tab === "orders" && <OrdersTable />}
        {tab === "konten" && <ContentEditor />}
      </main>
    </div>
  );
}
