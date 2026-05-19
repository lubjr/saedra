import { serviceClient } from "@repo/db-connector/db";

interface UpsertSettingsData {
  ai_provider: string;
  model: string;
}

type SettingsDBType = {
  getProjectSettings(projectId: string): Promise<any>;
  upsertProjectSettings(projectId: string, data: UpsertSettingsData): Promise<any>;
};

export const SettingsDB: SettingsDBType = {
  async getProjectSettings(projectId: string) {
    return serviceClient
      .from("project_settings")
      .select("id, project_id, ai_provider, model, updated_at")
      .eq("project_id", projectId)
      .maybeSingle();
  },

  async upsertProjectSettings(projectId: string, data: UpsertSettingsData) {
    return serviceClient
      .from("project_settings")
      .upsert(
        {
          project_id: projectId,
          ai_provider: data.ai_provider,
          model: data.model,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "project_id" }
      )
      .select()
      .single();
  },
};
