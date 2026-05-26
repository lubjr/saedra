import { serviceClient } from "@repo/db-connector/db";

type ProjectDBType = {
  insertProject(userId: string, name: string): Promise<any>;
  getProjectsByUser(userId: string): Promise<any>;
  getProjectById(projectId: string): Promise<any>;
  deleteProjectById(projectId: string): Promise<any>;
  getProjectSummaryData(userId: string): Promise<{ projects: any[]; reviews: any[]; docs: any[] }>;
}

export const ProjectDB: ProjectDBType = {
  async insertProject(userId: string, name: string) {
    return serviceClient.from('projects').insert({ user_id: userId, name }).select().single();
  },

  async getProjectsByUser(userId: string) {
    return serviceClient.from('projects').select('*, documents(count)').eq('user_id', userId);
  },

  async getProjectById(projectId: string) {
    return serviceClient.from('projects').select('*').eq('id', projectId).single();
  },

  async deleteProjectById(projectId: string) {
    return serviceClient.from('projects').delete().eq('id', projectId);
  },

  async getProjectSummaryData(userId: string) {
    const { data: projects } = await serviceClient
      .from('projects')
      .select('id, name, created_at')
      .eq('user_id', userId);

    const projectIds = (projects ?? []).map((p: any) => p.id);

    if (projectIds.length === 0) {
      return { projects: [], reviews: [], docs: [] };
    }

    const [{ data: reviews }, { data: docs }] = await Promise.all([
      serviceClient
        .from('reviews')
        .select('id, project_id, violations, warnings, ok, total_files, branch, created_at')
        .in('project_id', projectIds)
        .order('created_at', { ascending: false }),
      serviceClient
        .from('documents')
        .select('project_id, type, created_at')
        .in('project_id', projectIds)
        .order('created_at', { ascending: false }),
    ]);

    return {
      projects: projects ?? [],
      reviews: reviews ?? [],
      docs: docs ?? [],
    };
  },
};