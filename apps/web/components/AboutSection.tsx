"use client";

import { Card, CardContent } from "@repo/ui/card";
import { TargetIcon, UsersIcon } from "@repo/ui/lucide";

export const AboutSection = () => {
  return (
    <section
      id="about"
      className="flex flex-col items-center text-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen bg-zinc-900/50 scroll-mt-20"
    >
      <h2 className="text-4xl font-bold text-white mb-4">About Saedra</h2>
      <p className="text-zinc-400 text-lg mb-12 text-center max-w-2xl">
        We&apos;re building the next generation of code analysis tools to help
        developers ship better software
      </p>

      <div className="grid gap-6 md:grid-cols-2 w-full">
        <Card
          className="flex flex-col bg-zinc-800 border-2 border-zinc-700 rounded-2xl shadow-sm hover:shadow-md hover:shadow-teal-500/20 transition-all duration-300 group"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#14b8a6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "";
          }}
        >
          <CardContent className="flex flex-col items-start text-left p-6">
            <div className="w-12 h-12 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
              <TargetIcon className="text-teal-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Our Mission
            </h3>
            <p className="text-zinc-400 text-sm">
              To empower developers with intelligent analysis tools that catch
              issues early, improve code quality, and accelerate development
              workflows. We believe great tools lead to great software.
            </p>
          </CardContent>
        </Card>

        <Card
          className="flex flex-col bg-zinc-800 border-2 border-zinc-700 rounded-2xl shadow-sm hover:shadow-md hover:shadow-teal-500/20 transition-all duration-300 group"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#14b8a6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "";
          }}
        >
          <CardContent className="flex flex-col items-start text-left p-6">
            <div className="w-12 h-12 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
              <UsersIcon className="text-teal-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Our Team</h3>
            <p className="text-zinc-400 text-sm">
              Built by developers, for developers. We understand the challenges
              you face and are committed to creating tools that truly make a
              difference in your daily workflow and long-term success.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
