import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import api from "@/lib/api";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import FlavorShowcase from "@/components/landing/FlavorShowcase";
import BentoSection from "@/components/landing/BentoSection";
import ProductInfo from "@/components/landing/ProductInfo";
import Footer from "@/components/landing/Footer";
import CartDrawer from "@/components/landing/CartDrawer";
import WhatsAppFloat from "@/components/landing/WhatsAppFloat";

export default function LandingPage() {
  const [data, setData] = useState(null);
  const tracked = useRef(false);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    api
      .get("/content")
      .then((r) => setData(r.data))
      .catch(() => setData({ content: {}, flavors: [] }));
    if (!tracked.current) {
      tracked.current = true;
      api.post("/track").catch(() => {});
    }
  }, []);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream" data-testid="landing-loading">
        <img src="/logo.png" alt="MilkyWay" className="h-14 animate-pulse" />
      </div>
    );
  }

  const { content, flavors } = data;

  return (
    <div className="min-h-screen bg-brand-cream font-sans text-brand-navy" data-testid="landing-page">
      <Navbar content={content} />
      <main>
        <Hero content={content} />
        <Marquee text={content.marquee_text} />
        <FlavorShowcase flavors={flavors} priceDisplay={content.price_display} unitSize={content.unit_size} />
        <BentoSection />
        <ProductInfo />
      </main>
      <Footer content={content} />
      <CartDrawer content={content} />
      <WhatsAppFloat content={content} />
    </div>
  );
}
