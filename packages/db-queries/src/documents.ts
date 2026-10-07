import { serviceClient } from "@repo/db-connector/db";

type DocumentDBType = {
  insertDocument(projectId: string, name: string, content: string, type?: string): Promise<any>;
  getDocumentsByProject(projectId: string, type?: string): Promise<any>;
  getDocumentById(documentId: string, projectId: string): Promise<any>;
  updateDocumentById(documentId: string, projectId: string, content: string): Promise<any>;
  deleteDocumentById(documentId: string, projectId: string): Promise<any>;
}

export const DocumentDB: DocumentDBType = {
  async insertDocument(projectId: string, name: string, content: string, type = 'doc') {
    return serviceClient.from('documents').insert({ project_id: projectId, name, content, type }).select().single();
  },

  async getDocumentsByProject(projectId: string, type?: string) {
    const query = serviceClient
      .from('documents')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    return type ? query.eq('type', type) : query;
  },

  async getDocumentById(documentId: string, projectId: string) {
    return serviceClient.from('documents').select('*').eq('id', documentId).eq('project_id', projectId).single();
  },

  async updateDocumentById(documentId: string, projectId: string, content: string) {
    return serviceClient.from('documents').update({ content, updated_at: new Date().toISOString() }).eq('id', documentId).eq('project_id', projectId);
  },

  async deleteDocumentById(documentId: string, projectId: string) {
    return serviceClient.from('documents').delete().eq('id', documentId).eq('project_id', projectId);
  },
};
