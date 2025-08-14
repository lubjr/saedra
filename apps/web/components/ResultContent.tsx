"use client";

export default function ResultContent({
  data,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { resources: any[]; summary: string } | string;
}) {
  return (
    <div className="w-full max-w-3xl flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center">Analysis Result</h1>

      <div className="flex flex-col gap-4 overflow-auto bg-zinc-800 rounded p-4 w-full h-[calc(100vh-16rem)]">
        {typeof data === "string" ? (
          <pre className="text-left whitespace-pre-wrap">{data}</pre>
        ) : data.resources.length > 0 ? (
          data.resources.map((res, idx) => {
            return (
              <div key={idx} className="text-left">
                <p>
                  <strong>Type:</strong> {res.type}
                </p>
                <p>
                  <strong>Name:</strong> {res.name}
                </p>
                <p>
                  <strong>Description:</strong> {res.description}
                </p>

                {res.risks && res.risks.length > 0 && (
                  <div className="mt-2">
                    <strong>Risks:</strong>
                    <ul className="list-disc ml-5">
                      {res.risks.map((risk: string, i: number) => {
                        return <li key={i}>{risk}</li>;
                      })}
                    </ul>
                  </div>
                )}

                {res.recommendations && res.recommendations.length > 0 && (
                  <div className="mt-2">
                    <strong>Recommendations:</strong>
                    <ul className="list-disc ml-5">
                      {res.recommendations.map((rec: string, i: number) => {
                        return <li key={i}>{rec}</li>;
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-400">{data.summary}</p>
        )}
      </div>
    </div>
  );
}
