import { motion } from "framer-motion";
import { BadgePercent, CalendarCheck, MessageCircle, Milk, Truck } from "lucide-react";
import { waLink } from "@/lib/api";

const EASE = [0.22, 1, 0.36, 1];

const BENEFITS = [
  { icon: Milk, text: "Minimal 2 botol ukuran 1 liter" },
  { icon: CalendarCheck, text: "Mingguan atau bulanan, jadwal fleksibel" },
  { icon: Truck, text: "Radius pengantaran 2 km" },
  { icon: BadgePercent, text: "Gratis ongkir untuk pelanggan langganan" },
];

export default function Subscription({ content }) {
  return (
    <section id="langganan" className="relative py-24 lg:py-32" data-testid="subscription-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden rounded-[2rem] bg-[var(--pasture)] p-8 text-[var(--cream)] sm:p-12 lg:p-16"
        >
          <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(229,168,35,0.25),transparent_60%)]" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow mb-5 !text-[var(--gold)]">Penawaran Langganan</p>
              <h2 className="font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
                Langganan mingguan atau bulanan,{" "}
                <em className="font-light italic text-[var(--gold)]">lebih hemat.</em>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--cream)]/70 md:text-lg">
                Stok susu segar tanpa repot. Pilih paket mingguan atau bulanan dan kami antar rutin ke alamatmu —
                gratis ongkir dalam radius 2 km.
              </p>
              <a
                href={waLink(
                  content.whatsapp_number,
                  "Halo MilkyWay! Saya tertarik langganan susu (min. 2 botol ukuran 1 liter, radius 2 km). Boleh info lebih lanjut?",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-7 py-3.5 text-sm font-bold text-[var(--pasture-deep)] shadow-[0_16px_40px_-12px_rgba(229,168,35,0.5)] transition hover:brightness-105 active:scale-95"
                data-testid="subscription-wa-btn"
              >
                <MessageCircle className="h-4 w-4" />
                Daftar Langganan via WhatsApp
              </a>
            </div>

            <ul className="space-y-3.5">
              {BENEFITS.map((b, i) => (
                <motion.li
                  key={b.text}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: EASE }}
                  className="flex items-center gap-4 rounded-2xl border border-[var(--cream)]/15 bg-[var(--cream)]/5 px-5 py-4"
                  data-testid={`subscription-benefit-${i}`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--gold)]/20 text-[var(--gold)]">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium leading-snug sm:text-base">{b.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
