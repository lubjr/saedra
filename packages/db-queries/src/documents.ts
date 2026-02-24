import { serviceClient } from "@repo/db-connector/db";

type DocumentDBType = {
  insertDocument(projectId: string, name: string, content: string): Promise<any>;
  getDocumentsByProject(projectId: string): Promise<any>;
  getDocumentById(documentId: string): Promise<any>;
  updateDocumentById(documentId: string, content: string): Promise<any>;
  deleteDocumentById(documentId: string): Promise<any>;
}

export const DocumentDB: DocumentDBType = {
  async insertDocument(projectId: string, name: string, content: string) {
    return serviceClient.from('documents').insert({ project_id: projectId, name, content }).select().single();
  },

  async getDocumentsByProject(projectId: string) {
    return serviceClient.from('documents').select('*').eq('project_id', projectId);
  },

  async getDocumentById(documentId: string) {
    return serviceClient.from('documents').select('*').eq('id', documentId).single();
  },

  async updateDocumentById(documentId: string, content: string) {
    return serviceClient.from('documents').update({ content, updated_at: new Date().toISOString() }).eq('id', documentId);
  },

  async deleteDocumentById(documentId: string) {
    return serviceClient.from('documents').delete().eq('id', documentId);
  },
};
