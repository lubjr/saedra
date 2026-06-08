import { getViolationRules } from "../../../../../../auth/documents";
import { getProjectSummary } from "../../../../../../auth/projects";
import { RulesEmpty } from "../../../../../../components/project/rules/RulesEmpty";
import { RulesHeader } from "../../../../../../components/project/rules/RulesHeader";
import { RulesKpiStrip } from "../../../../../../components/project/rules/RulesKpiStrip";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [rules, summary] = await Promise.all([
    getViolationRules(id),
    getProjectSummary(id),
  ]);

  if (rules.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-5">
        <RulesHeader summary={summary} />
        <RulesEmpty />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <RulesHeader summary={summary} />
      <RulesKpiStrip rules={rules} />
      {/* RulesBoard — Parte 2 */}
    </div>
  );
}
