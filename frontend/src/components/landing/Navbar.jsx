import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar({ content }) {
  const { count, setOpen } = useCart();

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5" data-testid="navbar">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/60 bg-white/80 px-4 py-2.5 shadow-lg shadow-brand-navy/5 backdrop-blur-xl sm:px-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2"
          data-testid="nav-logo"
          aria-label="MilkyWay beranda"
        >
          <img src="/logo.png" alt={content.product_name || "MilkyWay"} className="h-8 w-auto sm:h-9" />
        </button>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-brand-navy/70 md:flex">
          <button onClick={() => scrollTo("varian")} className="transition-colors hover:text-brand-blue" data-testid="nav-link-varian">
            Varian Rasa
          </button>
          <button onClick={() => scrollTo("kualitas")} className="transition-colors hover:text-brand-blue" data-testid="nav-link-kualitas">
            Kualitas
          </button>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setOpen(true)}
            className="relative rounded-full border border-brand-blue/20 bg-white p-2.5 text-brand-navy transition hover:border-brand-blue/50 hover:text-brand-blue"
            data-testid="nav-cart-btn"
            aria-label="Buka keranjang"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-blue px-1 text-[11px] font-bold text-white" data-testid="nav-cart-count">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => scrollTo("varian")}
            className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-blue/30 transition hover:bg-brand-deep active:scale-95"
            data-testid="nav-order-btn"
          >
            Pesan
          </button>
        </div>
      </div>
    </header>
  );
}
