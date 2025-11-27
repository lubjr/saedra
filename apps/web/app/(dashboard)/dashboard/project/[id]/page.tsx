import { getDiagram } from "../../../../../auth/diagram";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const result = await getDiagram({ projectId: id });

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1>Project Diagram</h1>

      {!result ? (
        <div>
          <p>No credentials registered for this project</p>
        </div>
      ) : "error" in result ? (
        <div>
          <p>Error: {result.error}</p>
        </div>
      ) : (
        <div>
          <div>
            <p>Diagram loaded successfully!</p>
          </div>

          <div>
            <h2>Diagram Data:</h2>
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          </div>

          {result.data?.graph && (
            <div>
              <h2>Graph Summary:</h2>
              <p>Nodes: {result.data.graph.nodes?.length || 0}</p>
              <p>Edges: {result.data.graph.edges?.length || 0}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
