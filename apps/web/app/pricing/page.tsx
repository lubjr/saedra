"use client";

import { Card, CardContent } from "@repo/ui/card";
import { CheckIcon } from "@repo/ui/lucide";

export default function Pricing() {
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
    <div className="flex flex-col items-center text-center py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        Pricing Plans
      </h1>
      <p className="text-zinc-400 text-sm mb-12">
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
                <h2 className="text-xl font-semibold text-white">
                  {plan.name}
                </h2>
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
    </div>
  );
}
