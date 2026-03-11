"use client";

import { CardContent } from "@repo/ui/card";
import { ArrowUpRightIcon, BookOpenIcon, CodeIcon } from "@repo/ui/lucide";

const docCategories = [
  {
    title: "Getting Started",
    description: "Install the CLI, authenticate and set up your first project.",
    icon: BookOpenIcon,
    href: "https://docs.saedra.pro/docs/cli/getting-started",
  },
  {
    title: "CLI Reference",
    description:
      "Full reference for all commands: projects, documents, memory and AI.",
    icon: CodeIcon,
    href: "https://docs.saedra.pro/docs/cli/auth",
  },
];

export const DocsSection = () => {
  return (
    <section
      id="docs"
      className="flex flex-col items-center text-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen scroll-mt-20"
    >
      <h2 className="text-4xl font-bold text-white mb-4">Documentation</h2>
      <p className="text-zinc-400 text-lg mb-12 text-center max-w-2xl">
        Explore our guides and API reference to get the most out of Saedra
      </p>

      <div className="grid gap-6 md:grid-cols-3 w-full mb-12">
        {docCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <a
              key={category.title}
              href={category.href}
              target="_blank"
              rel="noopener noreferrer"
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
                <span className="flex items-center gap-2 text-teal-400 text-sm font-medium group-hover:text-teal-300 group-hover:gap-3 transition-all">
                  Learn more
                  <ArrowUpRightIcon size={16} />
                </span>
              </CardContent>
            </a>
          );
        })}
      </div>
    </section>
  );
};
