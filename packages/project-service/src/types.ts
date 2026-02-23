export type CreateProjectResponse = {
  data: {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
} | {
  error: string;
};

export type CreateCredentialsResponse = {
  data: {
    id: string;
    project_id: string;
    acess_key_id: string;
    secret_access_key: string;
    region: string;
    created_at: string;
    updated_at: string;
  };
} | {
  error: string;
};

export type CreateDiagramResponse = {
      id: string;
      project_id: string;
      graph: {
        edges: object[];
        nodes: object[];
      };
      created_at: string;
      updated_at: string;
    }
  | {
      error: string;
};

export type DocumentResponse = {
  id: string;
  project_id: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
} | {
  error: string;
};
