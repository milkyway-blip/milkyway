import { motion } from "framer-motion";
import { Leaf, Milk, Snowflake, Thermometer } from "lucide-react";

const cells = [
  {
    icon: Thermometer,
    title: "Pasteurisasi Suhu Tepat",
    text: "Dipanaskan sebentar pada suhu presisi agar kualitas rasa tetap terjaga.",
  },
  {
    icon: Snowflake,
    title: "Simpan Dingin 2–4°C",
    text: "Masa simpan 1,5 minggu di kulkas, tahan 6 jam di suhu ruang.",
  },
  {
    icon: Milk,
    title: "Botol 350ml",
    text: "Pas untuk sekali minum, praktis dibawa ke mana saja.",
  },
  {
    icon: Leaf,
    title: "Tanpa Pengawet",
    text: "Juga tanpa pemanis buatan — hanya susu murni, gula, dan perisa.",
  },
];

export default function BentoSection() {
  return (
    <section id="kualitas" className="py-16 sm:py-24" data-testid="bento-section">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">Kualitas MilkyWay</p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl lg:text-4xl">
            Dari peternakan ke botolmu
          </h2>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative col-span-2 row-span-2 min-h-[280px] overflow-hidden rounded-3xl shadow-lg shadow-brand-navy/10 lg:min-h-[420px]"
            data-testid="bento-farm"
          >
            <img
              src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?crop=entropy&cs=srgb&fm=jpg&q=85"
              alt="Peternakan sapi perah"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/10 to-transparent" />
            <div className="absolute bottom-0 p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-white sm:text-2xl">Peternakan Terpilih</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80">
                Susu sapi segar diperah setiap hari dari peternakan mitra yang terjaga kualitasnya.
              </p>
            </div>
          </motion.div>

          {cells.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.08 * (i + 1), duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              className="flex flex-col justify-between rounded-3xl border border-brand-navy/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg sm:p-6"
              data-testid={`bento-cell-${i}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-sky text-brand-blue">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="mt-6">
                <h3 className="font-display text-base font-bold text-brand-navy sm:text-lg">{c.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-brand-navy/55 sm:text-sm">{c.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
