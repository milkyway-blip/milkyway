import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const DEFAULT_CHAPTERS = [
  {
    title: "Bahan baku segar, diseleksi ketat.",
    body: "Kami hanya memakai susu sapi segar yang lolos seleksi kualitas. Begitu tiba, susu langsung didinginkan dalam hitungan menit.",
  },
  {
    title: "Pasteurisasi presisi, bukan perebusan berlebihan.",
    body: "Susu dipanaskan sebentar pada suhu dan waktu yang tepat, lalu didinginkan cepat. Hasilnya: rasa creamy alami yang tetap terjaga di setiap botol.",
  },
  {
    title: "Rantai dingin yang tidak pernah putus.",
    body: "Dari tangki pendingin hingga botol yang disegel, semuanya terjaga di 2–4°C. Karena susu segar hanya layak disebut segar jika suhunya konsisten.",
  },
  {
    title: "Botol kecil, standar besar.",
    body: "Setiap botol disegel rapat dan diberi tanggal batch, jadi kamu tahu persis kapan susumu diproduksi. Tanpa pengawet, tanpa pemanis buatan.",
  },
];

export default function Manifesto({ items }) {
  const chapters = items?.length ? items : DEFAULT_CHAPTERS;

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
              <p className="eyebrow mb-5">Janji Kami</p>
              <h2 className="font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
                Empat hal yang kami <em className="font-light italic text-[var(--pasture)]">pegang</em> teguh.
              </h2>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-[var(--ink-muted)] md:text-lg">
                Bukan sekadar susu dalam botol — ini janji kualitas yang bisa kamu rasakan di setiap tegukan.
              </p>
            </motion.div>
          </div>
        </div>

        <ol className="divide-y divide-[var(--line)] lg:col-span-8">
          {chapters.map((c, i) => {
            const n = String(i + 1).padStart(2, "0");
            return (
              <li key={n} className="group grid gap-4 py-10 first:pt-0 sm:grid-cols-12 sm:gap-6 sm:py-12" data-testid={`manifesto-chapter-${n}`}>
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="sm:col-span-3"
                >
                  <span className="font-display text-6xl font-light leading-none text-[var(--pasture)]/25 transition-colors duration-500 group-hover:text-[var(--gold)] lg:text-7xl">
                    {n}
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
            );
          })}
        </ol>
      </div>
    </section>
  );
}
