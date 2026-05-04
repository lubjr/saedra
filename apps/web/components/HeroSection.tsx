"use client";

import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-20 sm:py-32 px-4 sm:px-6 lg:px-8 min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <Badge
          variant="outline"
          className="mb-8 px-3 py-1.5 rounded-full bg-white/5 border-white/10 text-zinc-300 backdrop-blur-sm hover:bg-white/10 transition-colors text-sm sm:text-base shadow-lg shadow-white/5"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-400"></span>
          </span>
          <span>Now in early access</span>
        </Badge>

        <h1
          className="font-bold text-white mb-6 leading-tight"
          style={{
            fontSize: "clamp(2rem, 6vw, 6rem)",
          }}
        >
          The memory layer for your codebase
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Document your architecture decisions, enforce them on every PR, and
          give your AI tools the context they actually need. It&apos;s also open
          source.
        </p>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="min-w-[180px] bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all"
            onClick={() => {
              return (window.location.href = "/signup");
            }}
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </section>
  );
};
