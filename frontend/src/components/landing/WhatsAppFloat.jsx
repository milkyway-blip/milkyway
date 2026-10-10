import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/api";

export default function WhatsAppFloat({ content }) {
  return (
    <motion.a
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.4, type: "spring", stiffness: 260, damping: 18 }}
      href={waLink(content.whatsapp_number, "Halo MilkyWay, saya ingin pesan susu botol 350ml")}
      target="_blank"
      rel="noopener noreferrer"
      className="pulse-ring fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_16px_40px_-12px_rgba(37,211,102,0.7)] transition hover:brightness-95 active:scale-90"
      data-testid="whatsapp-float-btn"
      aria-label="Chat WhatsApp MilkyWay"
    >
      <MessageCircle className="h-6 w-6" />
    </motion.a>
  );
}
