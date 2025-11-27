import { getDiagram } from "../../../../../auth/diagram";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;

  const result = await getDiagram({ projectId: id });

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">Project Diagram</h1>

      {!result ? (
        <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded">
          <p className="text-yellow-300">
            No credentials registered for this project
          </p>
        </div>
      ) : "error" in result ? (
        <div className="p-4 bg-red-900/20 border border-red-700 rounded">
          <p className="text-red-300">Error: {result.error}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-green-900/20 border border-green-700 rounded">
            <p className="text-green-300">Diagram loaded successfully!</p>
          </div>

          <div className="p-4 bg-zinc-900 border border-zinc-700 rounded">
            <h2 className="text-lg font-semibold mb-2">Diagram Data:</h2>
            <pre className="overflow-auto text-xs">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>

          {result.data?.graph && (
            <div className="p-4 bg-zinc-900 border border-zinc-700 rounded">
              <h2 className="text-lg font-semibold mb-2">Graph Summary:</h2>
              <p>Nodes: {result.data.graph.nodes?.length || 0}</p>
              <p>Edges: {result.data.graph.edges?.length || 0}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
