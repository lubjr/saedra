import { Router } from "express";

import * as repo from "./repository.js";

const routes: Router = Router();

routes.post('/create', (req, res) => {
  const { name, userId } = req.body;
  if (!name || !userId) {
    return res.status(400).json({ error: 'name and userId required' });
  }
  const project = repo.createProject(name, userId);
  res.status(201).json(project);
});

routes.patch('/:id/connect-aws', (req, res) => {
  const { id } = req.params;
  const { awsConfig } = req.body;
  if (!awsConfig || !id) {
    return res.status(400).json({ error: 'id and aws config required' });
  }
  const project = repo.getProjectById(id);
  if (!project) {
    return res.status(404).json({ error: 'project not found' });
  }
  project.awsConfig = awsConfig;
  res.json(project);
});

routes.get('/:id/diagram', async (req, res) => {
  const { id } = req.params;

  const project = repo.getProjectById(id);

  if (!project) {
    return res.status(404).json({ error: 'project not found' });
  }

  if (!project.awsConfig) {
    return res.status(400).json({ error: 'project not connected to AWS' });
  }

  const diagram = await repo.createDiagramForProject(project);

  if (!diagram) {
    return res.status(500).json({ error: 'failed to generate diagram' });
  }

  res.json(diagram);

});

routes.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }
  const projects = repo.listProjectByUserId(userId);
  res.json(projects);
});

routes.get('/', (_req, res) => {
  const projects = repo.listAllProjects();
  res.json(projects);
});

routes.get('/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }
  const project = repo.getProjectById(id);
  if (!project) {
    return res.status(404).json({ error: 'project not found' });
  }
  res.json(project);
});

routes.delete('/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }
  const success = repo.deleteProjectById(id);
  if (!success) {
    return res.status(404).json({ error: 'project not found' });
  }
  res.status(204).send();
});

export default routes;