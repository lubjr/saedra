"use client";

import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import { CheckIcon } from "@repo/ui/lucide";

export default function Home() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Great for quick tests and validation.",
      features: ["Limited analyses", "Basic resources", "No priority support"],
    },
    {
      name: "Pro",
      price: "TBD",
      description: "Professional plan — coming soon.",
      features: [
        "More analyses per month",
        "GitHub integration",
        "Priority support",
      ],
    },
    {
      name: "Enterprise",
      price: "TBD",
      description: "Enterprise-grade plan — coming soon.",
      features: [
        "Unlimited analyses",
        "CI/CD integrations",
        "Dedicated support",
      ],
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 sm:py-32 px-4 sm:px-6 lg:px-8 min-h-screen overflow-hidden">
        {/* Gradient background effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Badge */}
          <Badge
            variant="outline"
            className="mb-8 px-3 py-1.5 rounded-full bg-white/5 border-white/10 text-zinc-300 backdrop-blur-sm hover:bg-white/10 transition-colors text-base sm:text-lg shadow-lg shadow-white/5"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-400"></span>
            </span>
            <span>Revolutionizing code analysis</span>
          </Badge>

          {/* Main heading */}
          <h1
            className="font-bold text-white mb-6 leading-tight"
            style={{
              fontSize: "clamp(2rem, 6vw, 6rem)",
            }}
          >
            Welcome to Saedra
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Powerful code analysis tools to help you build better software,
            faster. Catch issues early, improve quality, and ship with
            confidence.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              disabled
              size="lg"
              variant="outline"
              className="min-w-[180px] bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all"
            >
              Get Started Free
            </Button>
            <Button
              disabled
              size="lg"
              variant="outline"
              className="min-w-[180px] bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Docs Section */}
      <section
        id="docs"
        className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen scroll-mt-20"
      >
        <h2 className="text-4xl font-bold text-white mb-8">Docs</h2>
      </section>

      {/* Blog Section */}
      <section
        id="blog"
        className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen bg-zinc-900/50 scroll-mt-20"
      >
        <h2 className="text-4xl font-bold text-white mb-8">Blog</h2>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="flex flex-col items-center text-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen scroll-mt-20"
      >
        <h2 className="text-4xl font-bold text-white mb-2">Pricing Plans</h2>
        <p className="text-zinc-400 text-lg mb-12">
          Our paid plans are not available yet. Stay tuned.
        </p>

        <div className="grid gap-6 md:grid-cols-3 w-full">
          {plans.map((plan) => {
            return (
              <Card
                key={plan.name}
                className="flex flex-col bg-zinc-800 border border-zinc-700 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <CardContent className="flex flex-col flex-1 p-6 text-left">
                  <h3 className="text-xl font-semibold text-white">
                    {plan.name}
                  </h3>
                  <p className="text-3xl font-bold text-white mt-2">
                    {plan.price}
                  </p>
                  <p className="text-zinc-400 text-sm mt-2">
                    {plan.description}
                  </p>

                  <ul className="mt-4 flex-1 space-y-2">
                    {plan.features.map((feature, i) => {
                      return (
                        <li
                          key={i}
                          className="text-sm text-zinc-300 flex items-center gap-2"
                        >
                          <CheckIcon className="text-white" size={14} />
                          {feature}
                        </li>
                      );
                    })}
                  </ul>

                  <button
                    className="mt-8 mx-auto w-full py-2 px-4 rounded-md bg-zinc-700 text-white text-sm font-medium shadow hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                  >
                    Coming soon
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen bg-zinc-900/50 scroll-mt-20"
      >
        <h2 className="text-4xl font-bold text-white mb-8">About</h2>
      </section>
    </main>
  );
}
