"use client";

import { AlertTriangle, CheckCircle, Info } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function ResultContent({
  data,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { resources: any[]; summary: string } | string;
}) {
  return (
    <div className="w-full max-w-5xl flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center text-white">
        IaC Analysis Result
      </h1>

      <div className="flex flex-col gap-6 overflow-auto bg-zinc-900 rounded-2xl p-6 shadow-lg w-full h-[calc(100vh-16rem)]">
        {typeof data === "string" ? (
          <pre className="text-left whitespace-pre-wrap text-gray-300">
            {data}
          </pre>
        ) : data.resources.length > 0 ? (
          <>
            {data.resources.map((res, idx) => {
              return (
                <Card
                  key={idx}
                  className="bg-zinc-800 text-gray-100 border border-zinc-700 rounded-xl"
                >
                  <CardContent className="p-5 space-y-5">
                    <div className="border-b border-zinc-700 pb-3">
                      <h2 className="text-xl font-semibold">
                        {res.name}
                        <span className="text-gray-400 ml-2 text-sm">
                          ({res.type})
                        </span>
                      </h2>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Description</p>
                      <p className="leading-relaxed">{res.description}</p>
                    </div>

                    {res.risks?.length > 0 && (
                      <div>
                        <p className="flex items-center font-semibold text-red-400 mb-2">
                          <AlertTriangle className="h-5 w-5 mr-2" /> Risks
                        </p>
                        <ul className="space-y-2">
                          {res.risks.map((risk: string, i: number) => {
                            return (
                              <li
                                key={i}
                                className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-md p-2"
                              >
                                <AlertTriangle className="h-4 w-4 mt-0.5 text-red-400" />
                                <span>{risk}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {res.recommendations?.length > 0 && (
                      <div>
                        <p className="flex items-center font-semibold text-green-400 mb-2">
                          <CheckCircle className="h-5 w-5 mr-2" />{" "}
                          Recommendations
                        </p>
                        <ul className="space-y-2">
                          {res.recommendations.map((rec: string, i: number) => {
                            return (
                              <li
                                key={i}
                                className="flex items-start gap-2 bg-green-500/10 border border-green-500/20 rounded-md p-2"
                              >
                                <CheckCircle className="h-4 w-4 mt-0.5 text-green-400" />
                                <span>{rec}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </>
        ) : (
          <Card className="bg-zinc-800 text-gray-300">
            <CardContent className="p-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-400" />
              <p>{data.summary}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
