import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { imgSrc } from "@/lib/api";

const LINKS = [
  { id: "varian", label: "Varian Rasa", testid: "nav-link-varian" },
  { id: "manifesto", label: "Janji Kami", testid: "nav-link-janji" },
  { id: "proses", label: "Proses", testid: "nav-link-proses" },
  { id: "testimoni", label: "Testimoni", testid: "nav-link-testimoni" },
  { id: "faq", label: "FAQ", testid: "nav-link-faq" },
];

export default function Header({ content }) {
  const { count } = useCart();

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3" data-testid="navbar">
      <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-2 rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.92)] py-2 pl-4 pr-2 shadow-[0_20px_50px_-30px_rgba(26,26,24,0.45)] backdrop-blur-xl sm:pl-5">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex shrink-0 items-center"
          data-testid="nav-logo"
          aria-label="MilkyWay beranda"
        >
          <img src={content.logo_image ? imgSrc(content.logo_image) : "/logo.png"} alt={content.product_name || "MilkyWay"} className="h-7 w-auto sm:h-8" />
        </button>

        <nav className="hidden items-center gap-6 text-[13px] font-medium text-[var(--ink)]/70 lg:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="transition-colors hover:text-[var(--pasture)]"
              data-testid={l.testid}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => scrollTo("pesan")}
            className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-3.5 py-2 text-xs font-semibold text-[var(--ink)] transition hover:border-[var(--pasture)]/40"
            data-testid="nav-cart-btn"
            aria-label="Lihat keranjang"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Keranjang</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--pasture)] px-1 text-[10px] font-bold text-[var(--cream)]" data-testid="nav-cart-count">
              {count}
            </span>
          </button>
          <button
            onClick={() => scrollTo("pesan")}
            className="btn-pill primary !px-5 !py-2.5 !text-xs"
            data-testid="nav-order-btn"
          >
            {count > 0 ? `Cek Pesanan` : "Pesan Sekarang"}
          </button>
        </div>
      </div>
    </header>
  );
}
