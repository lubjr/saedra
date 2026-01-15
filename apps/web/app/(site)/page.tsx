"use client";

import { AboutSection } from "../../components/AboutSection";
import { BlogSection } from "../../components/BlogSection";
import { DocsSection } from "../../components/DocsSection";
import { HeroSection } from "../../components/HeroSection";
import { PricingSection } from "../../components/PricingSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <DocsSection />
      <BlogSection />
      <PricingSection />
      <AboutSection />
    </main>
  );
}
