import { type CreateProjectResponse, type CreateCredentialsResponse, type CreateDiagramResponse } from "./types.js";
import { collectResources, type AwsCredentials } from "@repo/aws-connector/aws";
import { generateDiagramFromResources } from "@repo/diagram-service/diagram";
import { ProjectDB, AwsCredentialsDB, DiagramDB } from "@repo/db-queries/queries";

export const createProject = async (name: string, userId: string): Promise<CreateProjectResponse> => {
  const { data, error } = await ProjectDB.insertProject(userId, name);

  if (error) {
    return JSON.parse(`{"error": "${error.message}"}`);
  }

  return data;
};

export const createDiagram = async (projectId: string): Promise<CreateDiagramResponse | undefined> => {
  const credentials = await getCredentials(projectId);

  if (!credentials || 'error' in credentials) {
    return undefined;
  }

  const getDiagram = await DiagramDB.getDiagramByProject(projectId);

  if (getDiagram.data) {
    return getDiagram.data;
  }

  try {
        const { resources } = await collectResources(credentials);
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

export const getCredentials = async (projectId: string): Promise<AwsCredentials | undefined> => {
  const project = await getProjectById(projectId);

  if (!project || 'error' in project) {
    return undefined;
  }

  const { data, error } = await AwsCredentialsDB.getCredentialsByProject(projectId);

  if (error) {
    return JSON.parse(`{"error": "${error.message}"}`);
  }

  return {
    accessKeyId: data.access_key_id,
    secretAccessKey: data.secret_access_key,
    region: data.region,
  }
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