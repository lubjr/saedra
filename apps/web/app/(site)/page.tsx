"use client";

import { AboutSection } from "../../components/AboutSection";
import { DocsSection } from "../../components/DocsSection";
import { HeroSection } from "../../components/HeroSection";
import { PricingSection } from "../../components/PricingSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <DocsSection />
      <PricingSection />
      <AboutSection />
    </main>
  );
}
