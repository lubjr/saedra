"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { FaArrowRight, FaGithub, FaPaperclip } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

import { useNats } from "./providers/NatsProvider";

export default function Home() {
  const [code, setCode] = React.useState("");
  const [language, setLanguage] = React.useState("Terraform");
  const [loading, setLoading] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const { broker, codec } = useNats();

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 500) + "px";
    }
  }, [code]);

  const handleProceed = async () => {
    try {
      if (!code.trim()) return;

      setLoading(true);

      const requestId = uuidv4();
      const replyTopic = `iac.analysis.result.${requestId}`;

      const filename =
        language.toLowerCase() === "terraform"
          ? "main.tf"
          : language.toLowerCase() === "yaml"
            ? "main.yaml"
            : "main.json";

      const payloadObj = {
        filename,
        content: code,
        replyTopic,
      };

      broker.publish(
        "iac.to.analyze",
        codec.encode(JSON.stringify(payloadObj)),
      );

      router.push(
        `/result?filename=${encodeURIComponent(filename)}&requestId=${requestId}`,
      );
    } catch (error) {
      alert("Error starting analysis: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        How to analyze your IaC?
      </h1>
      <p className="text-zinc-400 text-sm mb-8">
        Secure and optimize your IaC with AI.
      </p>

      <div className="w-full relative bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-2 py-2 border-b border-zinc-700">
          <select
            value={language}
            onChange={(e) => {
              return setLanguage(e.target.value);
            }}
            className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded border border-zinc-700 focus:outline-none"
          >
            <option>Terraform</option>
            <option>YAML</option>
            <option>JSON</option>
          </select>

          {code.trim() && (
            <button
              onClick={handleProceed}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Processing..." : <FaArrowRight size={14} />}
            </button>
          )}
        </div>

        <div className="w-full bg-zinc-800 rounded border border-zinc-700 flex flex-col">
          <textarea
            ref={textareaRef}
            maxLength={1000}
            value={code}
            onChange={(e) => {
              return setCode(e.target.value);
            }}
            placeholder={`Paste your ${language} code here...`}
            className="w-full min-h-[150px] max-h-[300px] bg-zinc-800 text-sm text-white font-mono p-4 pl-8 pr-10 resize-none focus:outline-none overflow-y-auto custom-scroll"
          />

          <div className="flex items-center justify-between px-3 py-2 text-zinc-500 text-xs border-t border-zinc-700">
            <FaPaperclip
              size={14}
              className="cursor-pointer hover:text-zinc-300"
            />
            <span>{code.length}/1000</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <span className="text-zinc-500 text-xs">or import from</span>
        <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-3 py-1.5 rounded-full border border-zinc-700 transition">
          <FaGithub size={14} />
          GitHub
        </button>
      </div>
    </div>
  );
}
