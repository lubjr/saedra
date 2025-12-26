"use client";

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
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 sm:px-6 lg:px-8 min-h-[80vh]">
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
          Welcome to Saedra
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-8">
          The modern platform for code analysis and validation. Start testing
          your projects today.
        </p>
        <div className="flex gap-4">
          <button className="py-3 px-6 rounded-lg bg-white text-zinc-900 font-semibold hover:bg-zinc-100 transition">
            Get Started
          </button>
          <button className="py-3 px-6 rounded-lg bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition border border-zinc-700">
            Learn More
          </button>
        </div>
      </section>

      {/* Docs Section */}
      <section
        id="docs"
        className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen scroll-mt-20"
      >
        <h2 className="text-4xl font-bold text-white mb-8">Docs</h2>
        <Card className="w-96 h-96 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center">
          <CardContent className="text-center">
            <p className="text-zinc-500 text-sm">Coming soon</p>
          </CardContent>
        </Card>
      </section>

      {/* Blog Section */}
      <section
        id="blog"
        className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen bg-zinc-900/50 scroll-mt-20"
      >
        <h2 className="text-4xl font-bold text-white mb-8">Blog</h2>
        <Card className="w-96 h-96 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center">
          <CardContent className="text-center">
            <p className="text-zinc-500 text-sm">Coming soon</p>
          </CardContent>
        </Card>
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
        <Card className="w-96 h-96 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center">
          <CardContent className="text-center">
            <p className="text-zinc-500 text-sm">Coming soon</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
