import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const CHAPTERS = [
  {
    n: "01",
    title: "Dari sapi yang dirawat, bukan diburu-buru.",
    body: "Sapi kami merumput dengan pakan hijauan segar. Pemerahan dilakukan dua kali sehari, pagi dan sore, lalu susu langsung didinginkan dalam hitungan menit.",
  },
  {
    n: "02",
    title: "Pasteurisasi presisi, bukan perebusan berlebihan.",
    body: "Susu dipanaskan sebentar pada suhu dan waktu yang tepat, lalu didinginkan cepat. Hasilnya: rasa creamy alami yang tetap terjaga di setiap botol.",
  },
  {
    n: "03",
    title: "Rantai dingin yang tidak pernah putus.",
    body: "Dari tangki pendingin hingga botol yang disegel — semuanya terjaga di 2–4°C. Karena susu segar hanya layak disebut segar jika suhunya konsisten.",
  },
  {
    n: "04",
    title: "Botol kecil, standar besar.",
    body: "Setiap botol 350ml disegel rapat dan diberi tanggal batch, jadi kamu tahu persis kapan susumu diproduksi. Tanpa pengawet, tanpa pemanis buatan.",
  },
];

export default function Manifesto() {
  return (
    <section id="manifesto" className="relative py-24 lg:py-36" data-testid="manifesto-section">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-12 lg:gap-16 lg:px-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <p className="eyebrow mb-5">Manifesto</p>
              <h2 className="font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
                Empat hal yang kami <em className="font-light italic text-[var(--pasture)]">pegang</em> teguh.
              </h2>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-[var(--ink-muted)] md:text-lg">
                Bukan sekadar susu. Ini janji kami pada setiap botol yang keluar dari peternakan.
              </p>
            </motion.div>
          </div>
        </div>

        <ol className="divide-y divide-[var(--line)] lg:col-span-8">
          {CHAPTERS.map((c, i) => (
            <li key={c.n} className="group grid gap-4 py-10 first:pt-0 sm:grid-cols-12 sm:gap-6 sm:py-12" data-testid={`manifesto-chapter-${c.n}`}>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: EASE }}
                className="sm:col-span-3"
              >
                <span className="font-display text-6xl font-light leading-none text-[var(--pasture)]/25 transition-colors duration-500 group-hover:text-[var(--gold)] lg:text-7xl">
                  {c.n}
                </span>
              </motion.div>
              <div className="sm:col-span-9">
                <motion.h3
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
                  className="font-display text-2xl font-medium leading-[1.15] tracking-tight lg:text-3xl"
                >
                  {c.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
                  className="mt-4 max-w-xl text-base leading-relaxed text-[var(--ink-muted)] sm:mt-5"
                >
                  {c.body}
                </motion.p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
