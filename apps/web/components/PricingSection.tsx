"use client";

import { Badge } from "@repo/ui/badge";
import { Card, CardContent } from "@repo/ui/card";
import { CheckIcon } from "@repo/ui/lucide";

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
    features: ["Unlimited analyses", "CI/CD integrations", "Dedicated support"],
  },
];

export const PricingSection = () => {
  return (
    <section
      id="pricing"
      className="flex flex-col items-center text-center py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen scroll-mt-20"
    >
      <h2 className="text-4xl font-bold text-white mb-4">Plans and Pricing</h2>
      <p className="text-zinc-400 text-lg mb-12 text-center max-w-2xl">
        Get started immediately for free. Upgrade for more credits, usage and
        collaboration.
      </p>

      <div className="grid gap-6 md:grid-cols-3 w-full">
        {plans.map((plan) => {
          const isRecommended = plan.name === "Pro";
          return (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                isRecommended ? "bg-zinc-800/80" : "bg-zinc-800"
              } border-2 ${
                isRecommended ? "border-teal-500/50" : "border-zinc-700"
              } rounded-2xl shadow-sm hover:shadow-md hover:shadow-teal-500/20 transition-all duration-300 group`}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#14b8a6";
              }}
              onMouseLeave={(e) => {
                if (isRecommended) {
                  e.currentTarget.style.borderColor = "#14b8a680";
                } else {
                  e.currentTarget.style.borderColor = "";
                }
              }}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge
                    variant="outline"
                    className="px-3 py-1 rounded-full bg-teal-500 border-teal-400 text-white text-xs font-semibold shadow-lg"
                  >
                    RECOMMENDED
                  </Badge>
                </div>
              )}
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
                  className="mt-8 mx-auto w-full py-2 px-4 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium shadow hover:bg-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
  );
};
