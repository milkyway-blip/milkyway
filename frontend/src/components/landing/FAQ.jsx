import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const FAQS = [
  {
    q: "Bagaimana cara memesan?",
    a: "Pilih varian dan jumlah botol di bagian Pesan, isi nama, nomor WhatsApp, dan alamat. Pesananmu tersimpan, lalu tinggal konfirmasi lewat tombol WhatsApp yang muncul.",
  },
  {
    q: "Apakah ada minimal pemesanan?",
    a: "Tidak ada. Pesan satu botol pun bisa, dan kamu bebas campur berbagai varian rasa dalam satu pesanan.",
  },
  {
    q: "Berapa lama susu bisa disimpan?",
    a: "Masa simpan 1,5 minggu di dalam kulkas pada suhu 2–4°C, dan tahan hingga 6 jam di suhu ruang. Sebaiknya langsung masuk kulkas begitu tiba di rumah.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative py-24 lg:py-32" data-testid="faq-section">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="eyebrow mb-5">FAQ</p>
          <h2 className="font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            Sering <em className="font-light italic text-[var(--pasture)]">ditanyakan.</em>
          </h2>
        </motion.div>

        <div className="mt-10">
          {FAQS.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              className="border-b border-[var(--line)]"
              data-testid={`faq-item-${i}`}
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors hover:text-[var(--pasture)]"
                data-testid={`faq-trigger-${i}`}
              >
                <span className="flex gap-5 text-base font-medium sm:text-lg">
                  <span className="pt-1 font-mono text-xs text-[var(--ink-muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {f.q}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[var(--ink-muted)] transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pl-10 pr-4 text-sm leading-relaxed text-[var(--ink-muted)] sm:text-base" data-testid={`faq-answer-${i}`}>
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
