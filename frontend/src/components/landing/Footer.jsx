import { Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { waLink } from "@/lib/api";

export default function Footer({ content }) {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="bg-[var(--pasture-deep)] text-[var(--cream)]" data-testid="footer">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:py-20 md:grid-cols-[1.3fr_1fr_1fr] lg:px-12">
        <div>
          <div className="inline-flex rounded-full bg-[var(--cream)] px-5 py-2.5">
            <img src="/logo.png" alt={content.product_name} className="h-8 w-auto" />
          </div>
          <p className="mt-5 max-w-sm font-display text-2xl font-light leading-snug text-[var(--cream)]/90">
            {content.tagline} — segar setiap hari, langsung dari peternakan.
          </p>
          <a
            href={waLink(content.whatsapp_number, "Halo MilkyWay! Saya mau pesan susu.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:brightness-95 active:scale-95"
            data-testid="whatsapp-direct-btn"
          >
            <MessageCircle className="h-4 w-4" />
            {content.whatsapp_number}
          </a>
        </div>

        <div>
          <h4 className="eyebrow !text-[var(--gold)]">Navigasi</h4>
          <ul className="mt-5 space-y-3 text-sm text-[var(--cream)]/70">
            <li>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="transition hover:text-[var(--gold)]" data-testid="footer-link-beranda">
                Beranda
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo("varian")} className="transition hover:text-[var(--gold)]" data-testid="footer-link-varian">
                Varian Rasa
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo("pesan")} className="transition hover:text-[var(--gold)]" data-testid="footer-link-pesan">
                Pesan
              </button>
            </li>
            <li>
              <Link to="/admin/login" className="transition hover:text-[var(--gold)]" data-testid="footer-admin-link">
                Masuk Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow !text-[var(--gold)]">Jam Operasional</h4>
          <div className="mt-5 flex items-start gap-2.5 text-sm text-[var(--cream)]/70">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
            <div>
              <p className="font-semibold text-[var(--cream)]">{content.pickup_hours || "Setiap Hari 08.00–20.00 WIB"}</p>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2.5 text-sm text-[var(--cream)]/70">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
            <div>
              <p className="font-semibold text-[var(--cream)]">Tersertifikasi Halal</p>
              <p className="text-xs text-[var(--cream)]/50">ID34110080995230926</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-[var(--cream)]/50">
            Pesanan dikonfirmasi melalui WhatsApp.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-[var(--cream)]/40 sm:flex-row lg:px-12">
          <p>© 2026 {content.product_name}. Semua hak dilindungi.</p>
          <p>
            {content.price_display} / botol {content.unit_size}
          </p>
        </div>
      </div>
    </footer>
  );
}
