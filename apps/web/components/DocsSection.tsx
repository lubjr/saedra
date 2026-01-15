"use client";

import { Card, CardContent } from "@repo/ui/card";
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  CodeIcon,
  ZapIcon,
} from "@repo/ui/lucide";

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

export const DocsSection = () => {
  return (
    <section
      id="docs"
      className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen scroll-mt-20"
    >
      <h2 className="text-4xl font-bold text-white mb-4">Documentation</h2>
      <p className="text-zinc-400 text-lg mb-12 text-center max-w-2xl">
        Explore our guides and API reference to get the most out of Saedra
      </p>

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
  );
};
