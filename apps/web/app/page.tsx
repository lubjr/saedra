import * as React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center py-24 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
        AI-Powered IaC Analyzer
      </h1>

      <p className="max-w-2xl text-lg sm:text-xl text-zinc-400 mb-8">
        Upload your Infrastructure as Code files to receive clear, structured explanations, 
        with identified risks and actionable improvement suggestions.
      </p>

      <div>
        <button className="px-6 py-3 bg-sky-800 hover:bg-sky-700 text-white font-semibold rounded-xl transition duration-200">
          Get Started
        </button>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl w-full">
        <Feature
          title="Understand Your IaC"
          description="Get clear explanations for every resource, even in complex configurations."
        />
        <Feature
          title="Detect Security Risks"
          description="Automatically identify risky settings like public S3 buckets or permissive IAM roles."
        />
        <Feature
          title="Improve With Confidence"
          description="Receive actionable recommendations to harden your infrastructure."
        />
      </div>
    </div>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-zinc-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{description}</p>
    </div>
  );
}
