import { Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { waLink } from "@/lib/api";
import { Link } from "react-router-dom";

export default function Footer({ content }) {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="bg-brand-navy text-white" data-testid="footer">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="inline-flex rounded-2xl bg-white px-4 py-2.5">
            <img src="/logo.png" alt={content.product_name} className="h-9 w-auto" />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            {content.tagline} dalam botol {content.unit_size}. Segar setiap hari dengan 10 varian rasa — pesan campur sesukamu.
          </p>
          <a
            href={waLink(content.whatsapp_number, "Halo MilkyWay! Saya mau pesan susu.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:brightness-95 active:scale-95"
            data-testid="whatsapp-direct-btn"
          >
            <MessageCircle className="h-4 w-4" />
            {content.whatsapp_number}
          </a>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Navigasi</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="transition hover:text-brand-blue" data-testid="footer-link-beranda">
                Beranda
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo("varian")} className="transition hover:text-brand-blue" data-testid="footer-link-varian">
                Varian Rasa
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo("kualitas")} className="transition hover:text-brand-blue" data-testid="footer-link-kualitas">
                Kualitas
              </button>
            </li>
            <li>
              <Link to="/admin/login" className="transition hover:text-brand-blue" data-testid="footer-admin-link">
                Masuk Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Jam Operasional</h4>
          <div className="mt-4 flex items-start gap-2.5 text-sm text-white/70">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
            <div>
              <p>Setiap Hari</p>
              <p className="font-semibold text-white">08.00 – 20.00 WIB</p>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2.5 text-sm text-white/70">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
            <div>
              <p className="font-semibold text-white">Tersertifikasi Halal</p>
              <p className="text-xs text-white/50">ID34110080995230926</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/50">
            Pesanan dikonfirmasi melalui WhatsApp dan dikirim dalam keadaan dingin.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-white/40 sm:flex-row sm:px-8">
          <p>© 2026 {content.product_name}. Semua hak dilindungi.</p>
          <p>
            {content.price_display} / botol {content.unit_size}
          </p>
        </div>
      </div>
    </footer>
  );
}
