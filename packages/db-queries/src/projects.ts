import { serviceClient } from "@repo/db-connector/db";

type ProjectDBType = {
  insertProject(userId: string, name: string): Promise<any>;
  getProjectsByUser(userId: string): Promise<any>;
  getProjectById(projectId: string): Promise<any>;
  deleteProjectById(projectId: string): Promise<any>;
}

export const ProjectDB: ProjectDBType = {
  async insertProject(userId: string, name: string) {
    return serviceClient.from('projects').insert({ user_id: userId, name }).select().single();
  },

  async getProjectsByUser(userId: string) {
    return serviceClient.from('projects').select('*').eq('user_id', userId);
  },

  async getProjectById(projectId: string) {
    return serviceClient.from('projects').select('*').eq('id', projectId).single();
  },

  async deleteProjectById(projectId: string) {
    return serviceClient.from('projects').delete().eq('id', projectId);
  }
};