import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/api";

export default function WhatsAppFloat({ content }) {
  return (
    <motion.a
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.4, type: "spring", stiffness: 260, damping: 18 }}
      href={waLink(content.whatsapp_number, "Halo MilkyWay! Saya mau tanya-tanya dulu.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 transition hover:brightness-95 active:scale-90"
      data-testid="whatsapp-float-btn"
      aria-label="Chat WhatsApp MilkyWay"
    >
      <MessageCircle className="h-6 w-6" />
    </motion.a>
  );
}
