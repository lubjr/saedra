import { supabase } from "@repo/db-connector/db";

type DiagramDBType = {
  insertDiagram(projectId: string, graph: object): Promise<any>;
  getDiagramByProject(projectId: string): Promise<any>;
}

export const DiagramDB: DiagramDBType = {
  async insertDiagram(projectId: string, graph: object) {
    return supabase.from('diagrams').insert({
      project_id: projectId,
      graph,
    }).select().single();
  },

  async getDiagramByProject(projectId: string) {
    return supabase.from('diagrams').select('graph').eq('project_id', projectId).single();
  },
};