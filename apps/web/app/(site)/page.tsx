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
          The modern platform for code analysis and validation.
          Start testing your projects today.
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
        className="flex flex-col items-center text-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen"
      >
        <h2 className="text-4xl font-bold text-white mb-4">Documentation</h2>
        <p className="text-zinc-400 text-lg mb-12 max-w-2xl">
          Learn how to use Saedra with our comprehensive documentation.
        </p>

        <div className="grid gap-6 md:grid-cols-3 w-full">
          <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl hover:border-zinc-600 transition">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                Getting Started
              </h3>
              <p className="text-zinc-400 text-sm">
                Quick start guide to get you up and running in minutes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl hover:border-zinc-600 transition">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                API Reference
              </h3>
              <p className="text-zinc-400 text-sm">
                Complete API documentation for developers.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl hover:border-zinc-600 transition">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                Tutorials
              </h3>
              <p className="text-zinc-400 text-sm">
                Step-by-step tutorials and best practices.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Blog Section */}
      <section
        id="blog"
        className="flex flex-col items-center text-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen bg-zinc-900/50"
      >
        <h2 className="text-4xl font-bold text-white mb-4">Blog</h2>
        <p className="text-zinc-400 text-lg mb-12 max-w-2xl">
          Latest news, updates, and insights from the Saedra team.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
          <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl hover:border-zinc-600 transition">
            <CardContent className="p-6 text-left">
              <div className="text-zinc-500 text-xs mb-2">Coming Soon</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Introducing Saedra 2.0
              </h3>
              <p className="text-zinc-400 text-sm">
                Discover the new features and improvements in our latest release.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl hover:border-zinc-600 transition">
            <CardContent className="p-6 text-left">
              <div className="text-zinc-500 text-xs mb-2">Coming Soon</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Best Practices Guide
              </h3>
              <p className="text-zinc-400 text-sm">
                Learn the best practices for code analysis and quality assurance.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl hover:border-zinc-600 transition">
            <CardContent className="p-6 text-left">
              <div className="text-zinc-500 text-xs mb-2">Coming Soon</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Community Highlights
              </h3>
              <p className="text-zinc-400 text-sm">
                See how the community is using Saedra in their projects.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="flex flex-col items-center text-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen"
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
                  <p className="text-zinc-400 text-sm mt-2">{plan.description}</p>

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
        className="flex flex-col items-center text-center py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen bg-zinc-900/50"
      >
        <h2 className="text-4xl font-bold text-white mb-4">About Saedra</h2>
        <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
          Saedra is a modern platform designed to help developers analyze and
          validate their code with ease. Our mission is to make code quality
          accessible to everyone.
        </p>

        <div className="grid gap-8 md:grid-cols-2 w-full mt-8">
          <div className="text-left">
            <h3 className="text-2xl font-semibold text-white mb-3">
              Our Mission
            </h3>
            <p className="text-zinc-400">
              To empower developers with the best tools for code analysis,
              helping teams ship better software faster.
            </p>
          </div>

          <div className="text-left">
            <h3 className="text-2xl font-semibold text-white mb-3">
              Our Vision
            </h3>
            <p className="text-zinc-400">
              A world where code quality is never an afterthought, but an
              integral part of the development process.
            </p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-zinc-800 rounded-2xl border border-zinc-700 w-full">
          <h3 className="text-xl font-semibold text-white mb-3">
            Open Source
          </h3>
          <p className="text-zinc-400 mb-4">
            Saedra is open source and community-driven. We believe in
            transparency and collaboration.
          </p>
          <a
            href="https://github.com/lubjr/saedra"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white hover:text-zinc-300 transition"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.373 0 12a12 12 0 008.208 11.436c.6.112.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.388-1.332-1.757-1.332-1.757-1.09-.745.083-.73.083-.73 1.205.086 1.84 1.237 1.84 1.237 1.07 1.833 2.807 1.303 3.492.996.108-.774.418-1.304.76-1.604-2.665-.3-5.466-1.335-5.466-5.933 0-1.31.47-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.323 3.3 1.23a11.47 11.47 0 016.003 0c2.29-1.553 3.297-1.23 3.297-1.23.654 1.653.243 2.873.12 3.176.77.84 1.236 1.91 1.236 3.22 0 4.61-2.805 5.628-5.476 5.923.43.37.814 1.102.814 2.222v3.293c0 .32.218.694.825.576A12.005 12.005 0 0024 12c0-6.627-5.373-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </section>
    </main>
  );
}
