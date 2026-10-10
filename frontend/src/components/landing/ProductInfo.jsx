import { motion } from "framer-motion";
import { CalendarClock, FlaskConical, ShieldCheck, Snowflake, Timer } from "lucide-react";

const facts = [
  {
    icon: FlaskConical,
    title: "Komposisi",
    text: "Susu murni, gula, syrup/bubuk perisa. Tanpa pengawet maupun pemanis buatan.",
  },
  {
    icon: Snowflake,
    title: "Penyimpanan",
    text: "Simpan pada suhu 2–4°C agar kesegaran tetap terjaga.",
  },
  {
    icon: CalendarClock,
    title: "Masa Simpan",
    text: "1,5 minggu di dalam kulkas sejak tanggal produksi.",
  },
  {
    icon: Timer,
    title: "Suhu Ruang",
    text: "Tahan hingga 6 jam di suhu ruang — segera dinginkan kembali.",
  },
  {
    icon: ShieldCheck,
    title: "Tersertifikasi Halal",
    text: "No. Sertifikat ID34110080995230926.",
  },
];

export default function ProductInfo() {
  return (
    <section className="pb-16 sm:pb-24" data-testid="product-info-section">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">Info Produk</p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl lg:text-4xl">
            Yang perlu kamu tahu
          </h2>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
          {facts.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              className={`rounded-3xl border border-brand-navy/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg ${
                i === 4 ? "col-span-2 md:col-span-1" : ""
              }`}
              data-testid={`product-info-${i}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-sky text-brand-blue">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-base font-bold text-brand-navy">{f.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-brand-navy/55 sm:text-sm">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
