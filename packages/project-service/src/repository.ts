import { type CreateProjectResponse, type CreateCredentialsResponse, type CreateDiagramResponse } from "./types.js";
import { collectResources, type AwsCredentials } from "@repo/aws-connector/aws";
import { generateDiagramFromResources } from "@repo/diagram-service/diagram";
import { ProjectDB, AwsCredentialsDB, DiagramDB, LoginDB, ProfileDB } from "@repo/db-queries/queries";

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
    return JSON.parse(`{"error": "${error.message}"}`);
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
          return JSON.parse(`{"error": "${error.message}"}`);
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
    return JSON.parse(`{"error": "${error.message}"}`);
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
    return JSON.parse(`{"error": "${error.message}"}`);
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
    console.log(`{"error": "${error.message}"}`);
    return false;
  }

  return true;
}

export const listProjectByUserId = async (userId: string): Promise<CreateProjectResponse> => {
    const { data, error } = await ProjectDB.getProjectsByUser(userId);

    if (error) {
      return JSON.parse(`{"error": "${error.message}"}`);
    }

    return data;
}

export const getProjectById = async (id: string): Promise<CreateProjectResponse> => {
    const { data, error } = await ProjectDB.getProjectById(id);

    if (error) {
      return JSON.parse(`{"error": "${error.message}"}`);
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
    console.log(`{"error": "${error.message}"}`);

    return false;
  }

  return true;
}