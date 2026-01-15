"use client";

import { Badge } from "@repo/ui/badge";
import { Card, CardContent } from "@repo/ui/card";
import { ArrowUpRightIcon, CalendarIcon, ClockIcon } from "@repo/ui/lucide";

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

export const BlogSection = () => {
  return (
    <section
      id="blog"
      className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen bg-zinc-900/50 scroll-mt-20"
    >
      <h2 className="text-4xl font-bold text-white mb-4">Latest from Blog</h2>
      <p className="text-zinc-400 text-lg mb-12 text-center max-w-2xl">
        Insights, tutorials, and updates from the Saedra team
      </p>

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
              <div
                className={`h-48 bg-gradient-to-br ${post.gradient} relative`}
              />

              <CardContent className="flex flex-col flex-1 p-6">
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

                <h3 className="text-xl font-semibold text-white mb-2">
                  {post.title}
                </h3>

                <p className="text-zinc-400 text-sm mb-4 flex-1">
                  {post.description}
                </p>

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
  );
};
