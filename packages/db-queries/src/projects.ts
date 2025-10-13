import { supabase } from "@repo/db-connector/db";

type ProjectDBType = {
  insertProject(userId: string, name: string): Promise<any>;
  getProjectsByUser(userId: string): Promise<any>;
  getProjectById(projectId: string): Promise<any>;
}

export const ProjectDB: ProjectDBType = {
  async insertProject(userId: string, name: string) {
    return supabase.from('projects').insert({ user_id: userId, name }).select().single();
  },

  async getProjectsByUser(userId: string) {
    return supabase.from('projects').select('*').eq('user_id', userId);
  },

  async getProjectById(projectId: string) {
    return supabase.from('projects').select('*').eq('id', projectId).single();
  },
};