import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { SettingsIcon } from "@repo/ui/lucide";

import { getProjectSettings } from "../../../../../../auth/settings";
import { SettingsForm } from "../../../../../../components/SettingsForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const settings = await getProjectSettings(id);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight py-2">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Project-level configuration shared across your team.
        </p>
      </div>

      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            AI Configuration
          </CardTitle>
          <CardDescription>
            Provider and model used by all team members when running{" "}
            <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
              saedra review
            </code>{" "}
            and other AI commands. The API key is configured locally via{" "}
            <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
              saedra ai setup
            </code>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm projectId={id} settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}
