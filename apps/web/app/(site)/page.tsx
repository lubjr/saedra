"use client";

import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  CodeIcon,
  ZapIcon,
} from "@repo/ui/lucide";

export default function Home() {
  const docCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics and set up your first analysis.",
      icon: BookOpenIcon,
    },
    {
      title: "API Reference",
      description: "Complete documentation for integrations.",
      icon: CodeIcon,
    },
    {
      title: "Quick Guides",
      description: "Step-by-step tutorials for common use cases.",
      icon: ZapIcon,
    },
  ];

  const blogPosts = [
    {
      title: "Introducing Saedra: The Future of Code Analysis",
      description: "Discover how Saedra is revolutionizing code analysis.",
      category: "Product",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      gradient: "from-teal-500/20 via-cyan-500/20 to-blue-500/20",
    },
    {
      title: "Best Practices for CI/CD Integration",
      description: "Learn how to integrate automated analysis.",
      category: "Tutorial",
      date: "Dec 10, 2024",
      readTime: "5 min read",
      gradient: "from-blue-500/20 via-indigo-500/20 to-purple-500/20",
    },
    {
      title: "Performance Optimization at Scale",
      description: "Maximize your application's performance.",
      category: "Engineering",
      date: "Dec 5, 2024",
      readTime: "5 min read",
      gradient: "from-cyan-500/20 via-teal-500/20 to-emerald-500/20",
    },
  ];

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
            className="mb-8 px-3 py-1.5 rounded-full bg-white/5 border-white/10 text-zinc-300 backdrop-blur-sm hover:bg-white/10 transition-colors text-sm sm:text-base shadow-lg shadow-white/5"
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
        <h2 className="text-4xl font-bold text-white mb-4">Documentation</h2>
        <p className="text-zinc-400 text-lg mb-12 text-center max-w-2xl">
          Explore our guides and API reference to get the most out of Saedra
        </p>

        {/* Doc Categories Grid */}
        <div className="grid gap-6 md:grid-cols-3 w-full mb-12">
          {docCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.title}
                className="flex flex-col bg-zinc-800 border-2 border-zinc-700 rounded-2xl shadow-sm hover:shadow-md hover:shadow-teal-500/20 transition-all duration-300 group"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#14b8a6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "";
                }}
              >
                <CardContent className="flex flex-col items-start text-left p-8">
                  <div className="w-12 h-12 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
                    <IconComponent className="text-teal-400" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4 flex-1">
                    {category.description}
                  </p>
                  <button className="flex items-center gap-2 text-teal-400 text-sm font-medium hover:text-teal-300 transition-colors group-hover:gap-3 transition-all">
                    Learn more
                    <ArrowUpRightIcon size={16} />
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Blog Section */}
      <section
        id="blog"
        className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen bg-zinc-900/50 scroll-mt-20"
      >
        <h2 className="text-4xl font-bold text-white mb-4">Latest from Blog</h2>
        <p className="text-zinc-400 text-lg mb-12 text-center max-w-2xl">
          Insights, tutorials, and updates from the Saedra team
        </p>

        {/* Blog Posts Grid */}
        <div className="grid gap-6 md:grid-cols-3 w-full">
          {blogPosts.map((post) => {
            return (
              <Card
                key={post.title}
                className="flex flex-col bg-zinc-800 border-2 border-zinc-700 rounded-2xl shadow-sm hover:shadow-md hover:shadow-teal-500/20 transition-all duration-300 group overflow-hidden"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#14b8a6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "";
                }}
              >
                {/* Gradient Header */}
                <div
                  className={`h-48 bg-gradient-to-br ${post.gradient} relative`}
                />

                <CardContent className="flex flex-col flex-1 p-6">
                  {/* Category Badge and Date */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant="outline"
                      className="px-2 py-1 rounded-md bg-teal-500/10 border-teal-500/20 text-teal-400 text-xs"
                    >
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-zinc-500 text-xs">
                      <CalendarIcon size={12} />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-400 text-sm mb-4 flex-1">
                    {post.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-700">
                    <div className="flex items-center gap-1 text-zinc-500 text-sm">
                      <ClockIcon size={14} />
                      <span>{post.readTime}</span>
                    </div>
                    <button className="flex items-center gap-2 text-teal-400 text-sm font-medium hover:text-teal-300 transition-colors group-hover:gap-3 transition-all">
                      Read article
                      <ArrowUpRightIcon size={16} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
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
