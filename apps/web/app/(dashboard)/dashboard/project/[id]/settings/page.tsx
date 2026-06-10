import { getProjectSummary } from "../../../../../../auth/projects";
import { getProjectSettings } from "../../../../../../auth/settings";
import { AiConfigCard } from "../../../../../../components/project/settings/AiConfigCard";
import { GeneralCard } from "../../../../../../components/project/settings/GeneralCard";
import { SettingsHeader } from "../../../../../../components/project/settings/SettingsHeader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [summary, settings] = await Promise.all([
    getProjectSummary(id),
    getProjectSettings(id),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <SettingsHeader summary={summary} />
      <GeneralCard initialName={summary?.name ?? ""} />
      <AiConfigCard projectId={id} settings={settings} />
      {/* DangerCard — Parte 3 */}
    </div>
  );
}
