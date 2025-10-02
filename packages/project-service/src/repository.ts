import { v4 as uuidv4 } from "uuid";
import { Project } from "./types.js";

let projects: Project[] = [];

export const createProject = (name: string, userId: string): Project => {
    const project = { id: uuidv4(), name, userId };
    projects.push(project);
    return project;
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