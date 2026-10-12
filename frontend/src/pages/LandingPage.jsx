import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import api, { imgSrc } from "@/lib/api";
import Header from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import FlavorShowcase from "@/components/landing/FlavorShowcase";
import Manifesto from "@/components/landing/Manifesto";
import Process from "@/components/landing/Process";
import ProductInfo from "@/components/landing/ProductInfo";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Subscription from "@/components/landing/Subscription";
import OrderSection from "@/components/landing/OrderSection";
import Footer from "@/components/landing/Footer";
import WhatsAppFloat from "@/components/landing/WhatsAppFloat";

export default function LandingPage() {
  const [data, setData] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState(null);
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
      .catch(() => setData({ content: {}, flavors: [], testimonials: [] }));
    if (!tracked.current) {
      tracked.current = true;
      api.post("/track").catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (data?.content?.logo_image) {
      const link = document.querySelector("link[rel~='icon']");
      if (link) link.href = imgSrc(data.content.logo_image);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--cream)]" data-testid="landing-loading">
        <img src="/logo.png" alt="MilkyWay" className="h-14 animate-pulse" />
      </div>
    );
  }

  const { content, flavors } = data;

  const pickFlavor = (key) => {
    setSelectedFlavor(key);
    document.getElementById("varian")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] font-sans text-[var(--ink)]" data-testid="landing-page">
      <Header content={content} />
      <main>
        <Hero content={content} flavors={flavors} onPickFlavor={pickFlavor} />
        <Marquee text={content.marquee_text} />
        <FlavorShowcase
          flavors={flavors}
          unitSize={content.unit_size}
          sizes={content.sizes || []}
          selectedKey={selectedFlavor}
          onSelect={setSelectedFlavor}
        />
        <Manifesto items={content.manifesto || []} />
        <Process />
        <Marquee text={content.marquee_text} theme="green" />
        <ProductInfo facts={content.facts || []} />
        <Testimonials items={data.testimonials || []} />
        <FAQ />
        <Subscription content={content} />
        <OrderSection flavors={flavors} content={content} />
      </main>
      <Footer content={content} />
      <WhatsAppFloat content={content} />
    </div>
  );
}
