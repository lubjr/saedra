import { v4 as uuidv4 } from "uuid";
import { Project } from "./types.js";
import { collectResources, type AwsCredentials } from "@repo/aws-connector/aws";
import { generateDiagramFromResources, type DiagramGraph } from "@repo/diagram-service/diagram";

let projects: Project[] = [];

export const createProject = (name: string, userId: string): Project => {
    const project = { id: uuidv4(), name, userId };
    projects.push(project);
    return project;
}

export const createDiagramForProject = async (project: Project): Promise<DiagramGraph | undefined> => {
    const credentials = project.awsConfig as AwsCredentials;

    try {
        const { resources } = await collectResources(credentials);
        const diagram = generateDiagramFromResources(resources);
        return diagram;
    } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        console.log(`error generating diagram for project ${project.id}, message: ${message}`);
    } 
}

export const listProjectByUserId = (userId: string): Project[] => {
    return projects.filter(project => project.userId === userId);
}

export const listAllProjects = (): Project[] => {
    return projects;
}

export const getProjectById = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
}

export const deleteProjectById = (id: string): boolean => {
    const initialLength = projects.length;
    projects = projects.filter(project => project.id !== id);
    return projects.length < initialLength;
}