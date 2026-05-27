import { type CreateProjectResponse, type CreateCredentialsResponse, type CreateDiagramResponse, type DocumentResponse, type DocumentType, type ReviewData, type ProjectSettings, type ProjectSummary } from "./types.js";
import { collectResources, type AwsCredentials } from "@repo/aws-connector/aws";
import { generateDiagramFromResources } from "@repo/diagram-service/diagram";
import { ProjectDB, AwsCredentialsDB, DiagramDB, LoginDB, ProfileDB, DocumentDB, ReviewDB, SettingsDB } from "@repo/db-queries/queries";

export const signUpUser = async (email: string, password: string): Promise<{ userId: string } | { error: string }> => {
  const { data, error } = await LoginDB.signUpUser(email, password);

  if (error) {
    return { error: error.message };
  }

  return { userId: data.user };
};

export const signInUser = async (email: string, password: string): Promise<{ userId: string } | { error: string }> => {
  const { data, error } = await LoginDB.signInUser(email, password);

  if (error) {
    return { error: error.message };
  }

  return { userId: data.session };
};

export const getProfileById = async (userId: string): Promise<{ user: any } | { error: string }> => {
  const { data, error } = await ProfileDB.getProfileByUser(userId);

  if (error) {
    return { error: error.message };
  }

  return { user: data };
};

export const updateProfileById = async (userId: string, username: string, avatar_url: string): Promise<{ user: any } | { error: string }> => {  
  const { data, error } = await ProfileDB.updateProfileByUser(userId, username, avatar_url);

  if (error) {
    return { error: error.message };
  }

  return { user: data[0] };
};

export const createProject = async (name: string, userId: string): Promise<CreateProjectResponse> => {
  const { data, error } = await ProjectDB.insertProject(userId, name);

  if (error) {
    return { error: error.message };
  }

  return data;
};

export const createDiagram = async (projectId: string, credentialId: string): Promise<CreateDiagramResponse | undefined> => {
  const { data: credentials, error } = await AwsCredentialsDB.getCredentialById(credentialId);

  if (error || !credentials) {
    console.log(`error fetching credentials: ${error?.message}`);
    return undefined;
  }

  const awsCredentials: AwsCredentials = {
    accessKeyId: credentials.access_key_id,
    secretAccessKey: credentials.secret_access_key,
    region: credentials.region,
  };

  const getDiagram = await DiagramDB.getDiagramByProject(projectId);

  if (getDiagram.data) {
    return getDiagram.data;
  }

  try {
        const { resources } = await collectResources(awsCredentials);
        const diagram = generateDiagramFromResources(resources);

        const { data, error } = await DiagramDB.insertDiagram(projectId, diagram);

        if (error) {
          return { error: error.message };
        }

        return data;
    } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        console.log(`error generating diagram for project ${projectId}, message: ${message}`);
        return undefined;
    }
}

export const createCredentials = async (projectId: string, credentials: AwsCredentials): Promise<CreateCredentialsResponse | undefined> => {
  const project = await getProjectById(projectId);

  if (!project || 'error' in project) {
    return undefined;
  }

  const { data, error } = await AwsCredentialsDB.insertCredentials(projectId, credentials);

  if (error) {
    return { error: error.message };
  }

  return data;
}

export const getCredentials = async (projectId: string): Promise<any[] | undefined> => {
  const project = await getProjectById(projectId);

  if (!project || 'error' in project) {
    return undefined;
  }

  const { data, error } = await AwsCredentialsDB.getCredentialsByProject(projectId);

  if (error) {
    return undefined;
  }

  return data || [];
}

export const listCredentialsByUserId = async (userId: string): Promise<any> => {
  const { data, error } = await AwsCredentialsDB.getCredentialsByUser(userId);

  if (error) {
    return { error: error.message };
  }

  return data.map((cred: any) => ({
    id: cred.id,
    projectId: cred.project_id,
    projectName: cred.projects.name,
    accessKeyId: cred.access_key_id,
    region: cred.region,
    createdAt: cred.created_at,
  }));
}

export const deleteCredentials = async (projectId: string): Promise<boolean> => {
  const project = await getProjectById(projectId);

  if (!project || 'error' in project) {
    return false;
  }

  const { error } = await AwsCredentialsDB.deleteCredentialsByProject(projectId);

  if (error) {
    console.error("error deleting credentials:", error.message);
    return false;
  }

  return true;
}

export const getProjectSummaries = async (userId: string): Promise<ProjectSummary[]> => {
  const { projects, reviews, docs } = await ProjectDB.getProjectSummaryData(userId);

  const now = Date.now();
  const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

  return projects.map((p: any) => {
    const projectReviews = reviews.filter((r: any) => r.project_id === p.id);
    const projectDocs = docs.filter((d: any) => d.project_id === p.id);

    const last5 = projectReviews.slice(0, 5);
    const health: number | null = last5.length > 0
      ? Math.round(
          last5.reduce((sum: number, r: any) => {
            const score = r.total_files > 0 ? (1 - r.violations / r.total_files) * 100 : 100;
            return sum + score;
          }, 0) / last5.length
        )
      : null;

    let health_delta = 0;
    if (projectReviews.length >= 2) {
      const curr = projectReviews[0].total_files > 0
        ? Math.round((1 - projectReviews[0].violations / projectReviews[0].total_files) * 100)
        : 100;
      const prev = projectReviews[1].total_files > 0
        ? Math.round((1 - projectReviews[1].violations / projectReviews[1].total_files) * 100)
        : 100;
      health_delta = curr - prev;
    }

    const lastReview = projectReviews[0] ?? null;
    const decisions_count = projectDocs.filter((d: any) => d.type === 'decision').length;

    const lastDocDate = projectDocs[0]?.created_at ?? null;
    const lastReviewDate = lastReview?.created_at ?? null;
    const candidates = [lastDocDate, lastReviewDate].filter(Boolean) as string[];
    const last_activity_at = candidates.length > 0
      ? (candidates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? null)
      : null;

    const isSetup = health === null;
    const isArchived = !isSetup && last_activity_at
      ? now - new Date(last_activity_at).getTime() > NINETY_DAYS
      : false;
    const status: ProjectSummary["status"] = isSetup ? "setup" : isArchived ? "archived" : "active";

    const health_history = projectReviews.slice(0, 7).reverse().map((r: any) =>
      r.total_files > 0 ? Math.round((1 - r.violations / r.total_files) * 100) : 100
    );

    return {
      id: p.id,
      name: p.name,
      created_at: p.created_at,
      has_memory: projectDocs.length > 0,
      health,
      health_delta,
      decisions_count,
      reviews_count: projectReviews.length,
      last_activity_at,
      last_review_at: lastReview?.created_at ?? null,
      last_review_warnings: lastReview?.warnings ?? 0,
      last_review_violations: lastReview?.violations ?? 0,
      last_review_branch: lastReview?.branch ?? null,
      status,
      health_history,
    };
  });
};

export const listProjectByUserId = async (userId: string): Promise<CreateProjectResponse> => {
    const { data, error } = await ProjectDB.getProjectsByUser(userId);

    if (error) {
      return { error: error.message };
    }

    const projects = (data ?? []).map((p: any) => {
      const docCount = (p.documents as { count: number }[] | undefined)?.[0]?.count ?? 0;
      const { documents: _docs, ...rest } = p;
      return { ...rest, has_memory: docCount > 0 };
    });

    return projects;
}

export const getProjectById = async (id: string): Promise<CreateProjectResponse> => {
    const { data, error } = await ProjectDB.getProjectById(id);

    if (error) {
      return { error: error.message };
    }

    return data;
}

export const deleteProjectById = async (projectId: string): Promise<boolean> => {
  const project = await getProjectById(projectId);

  if (!project || 'error' in project) {
    return false;
  }

  const { error } = await ProjectDB.deleteProjectById(projectId);

  if (error) {
    console.error("error deleting project:", error.message);

    return false;
  }

  return true;
}

export const createDocument = async (projectId: string, name: string, content: string, type?: DocumentType): Promise<DocumentResponse> => {
  const { data, error } = await DocumentDB.insertDocument(projectId, name, content, type);

  if (error) {
    return { error: error.message };
  }

  return data;
}

export const listDocumentsByProject = async (projectId: string, type?: DocumentType): Promise<any[] | { error: string }> => {
  const { data, error } = await DocumentDB.getDocumentsByProject(projectId, type);

  if (error) {
    return { error: error.message };
  }

  return data || [];
}

export const getDocumentById = async (documentId: string): Promise<DocumentResponse> => {
  const { data, error } = await DocumentDB.getDocumentById(documentId);

  if (error) {
    return { error: error.message };
  }

  return data;
}

export const updateDocument = async (documentId: string, content: string): Promise<boolean> => {
  const { error } = await DocumentDB.updateDocumentById(documentId, content);

  if (error) {
    console.error("error updating document:", error.message);
    return false;
  }

  return true;
}

export const deleteDocument = async (documentId: string): Promise<boolean> => {
  const { error } = await DocumentDB.deleteDocumentById(documentId);

  if (error) {
    console.error("error deleting document:", error.message);
    return false;
  }

  return true;
}

export const createReview = async (projectId: string, data: ReviewData): Promise<any> => {
  const { data: review, error } = await ReviewDB.insertReview(projectId, data);

  if (error) {
    return { error: error.message };
  }

  return review;
}

export const listReviewsByProject = async (projectId: string): Promise<any> => {
  const { data, error } = await ReviewDB.getReviewsByProject(projectId);

  if (error) {
    return { error: error.message };
  }

  return data || [];
}

export const getReviewById = async (reviewId: string): Promise<any> => {
  const { data, error } = await ReviewDB.getReviewById(reviewId);

  if (error) {
    return { error: error.message };
  }

  return data;
}

export const getSettings = async (projectId: string): Promise<ProjectSettings | null | { error: string }> => {
  const { data, error } = await SettingsDB.getProjectSettings(projectId);

  if (error) {
    return { error: error.message };
  }

  return data;
}

export const deleteSettings = async (projectId: string): Promise<boolean> => {
  const { error } = await SettingsDB.deleteProjectSettings(projectId);

  if (error) return false;
  
  return true;
}

export const upsertSettings = async (projectId: string, data: { ai_provider: string; model: string }): Promise<ProjectSettings | { error: string }> => {
  const { data: settings, error } = await SettingsDB.upsertProjectSettings(projectId, data);

  if (error) {
    return { error: error.message };
  }

  return settings;
}