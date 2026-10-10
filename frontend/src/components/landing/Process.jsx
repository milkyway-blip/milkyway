import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const STEPS = [
  {
    n: "01",
    value: "Pagi",
    title: "Pemerahan Segar",
    body: "Susu diperah pagi hari dan langsung didinginkan dalam tangki stainless yang bersih.",
  },
  {
    n: "02",
    value: "Presisi",
    title: "Pasteurisasi",
    body: "Dipanaskan sebentar dengan suhu dan waktu yang tepat, lalu didinginkan cepat.",
  },
  {
    n: "03",
    value: "2–4°C",
    title: "Rantai Dingin",
    body: "Suhu dingin terjaga konsisten dari tangki penyimpanan sampai pengiriman.",
  },
  {
    n: "04",
    value: "350 ml",
    title: "Botol & Segel",
    body: "Dituang ke botol bersih, disegel rapat, dan diberi tanggal batch produksi.",
  },
];

export default function Process() {
  return (
    <section id="proses" className="relative overflow-hidden bg-[var(--pasture)] py-24 text-[var(--cream)] lg:py-36" data-testid="process-section">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(229,168,35,0.15),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-3xl"
        >
          <p className="eyebrow mb-5 !text-[var(--gold)]">Proses Kami</p>
          <h2 className="font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            Ilmu di balik <em className="font-light italic text-[var(--gold)]">kesegaran.</em>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--cream)]/60 md:text-lg">
            Pasteurisasi bukan sekadar memanaskan susu. Ini soal suhu dan waktu yang tepat, lalu dingin yang tak pernah putus.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              className="relative border-t border-[var(--cream)]/15 pt-8"
              data-testid={`process-step-${s.n}`}
            >
              <span className="absolute -top-[21px] left-0 grid h-10 w-10 place-items-center rounded-full border border-[var(--gold)]/50 bg-[var(--pasture)] font-mono text-[10px] tracking-[0.1em] text-[var(--gold)]">
                {s.n}
              </span>
              <p className="font-display text-5xl font-light tracking-tight lg:text-6xl">{s.value}</p>
              <h3 className="mt-5 font-display text-xl font-medium">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[var(--cream)]/60">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
