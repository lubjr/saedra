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
  code?: string;
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

export type DocumentType = 'doc' | 'architecture' | 'decision' | 'change' | 'rule';

export type FileResult = {
  file: string;
  status: 'violation' | 'warning' | 'ok';
  violations: Array<{ rule_id: string; detail: string }>;
  note: string;
};

export type ReviewData = {
  branch: string;
  base: string | null;
  total_files: number;
  violations: number;
  warnings: number;
  ok: number;
  files: FileResult[];
};

export type ProjectSettings = {
  id: string;
  project_id: string;
  ai_provider: string;
  model: string;
  updated_at: string;
};

export type ProjectSummary = {
  id: string;
  name: string;
  created_at: string;
  has_memory: boolean;
  health: number | null;
  health_delta: number;
  decisions_count: number;
  reviews_count: number;
  last_activity_at: string | null;
  last_review_at: string | null;
  last_review_warnings: number;
  last_review_violations: number;
  last_review_branch: string | null;
  status: "active" | "setup" | "archived";
  health_history: number[];
};

export type DocumentResponse = {
  id: string;
  project_id: string;
  name: string;
  content: string;
  type: DocumentType;
  created_at: string;
  updated_at: string;
} | {
  error: string;
};
