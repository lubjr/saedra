import { getProjectSummary } from "../../../../../../auth/projects";
import { SettingsHeader } from "../../../../../../components/project/settings/SettingsHeader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const summary = await getProjectSummary(id);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <SettingsHeader summary={summary} />
      {/* GeneralCard — Parte 2 */}
      {/* AiConfigCard — Parte 2 */}
      {/* DangerCard — Parte 3 */}
    </div>
  );
}
