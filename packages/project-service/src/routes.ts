import { Router } from "express";
import { authenticate } from "./middleware/authenticate.js";

import * as repo from "./repository.js";

const routes: Router = Router();

routes.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    const user = await repo.signUpUser(email, password);

    if ('error' in user) {
      return res.status(400).json({ error: user.error });
    }

    res.json({ user });
});

routes.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const session = await repo.signInUser(email, password);

    if ('error' in session) {
      return res.status(400).json({ error: session.error });
    }

    res.json({ session });
});

routes.get('/userinfo', authenticate, async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const userInfo = await repo.getUserByToken(token);

  if ('error' in userInfo) {
    return res.status(400).json({ error: userInfo.error });
  }

  res.json({ user: userInfo });
});

routes.post('/create', authenticate, async (req, res) => {
  const { name, userId } = req.body;

  if (!name || !userId) {
    return res.status(400).json({ error: 'name and userId required' });
  }

  const project = await repo.createProject(name, userId);

  res.status(201).json(project);
});

routes.post('/:id/connect-aws', authenticate, async (req, res) => {
  const { id } = req.params;
  const { awsConfig } = req.body;

  if (!awsConfig || !id) {
    return res.status(400).json({ error: 'id and aws config required' });
  }

  const credentials = await repo.createCredentials(id, awsConfig);

  if (!credentials) {
    return res.status(404).json({ error: 'project not found' });
  }

  res.json(credentials);
});

routes.get('/:id/diagram', authenticate, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }

  const project = await repo.getProjectById(id);

  if (!project) {
    return res.status(404).json({ error: 'project not found' });
  }

  const diagram = await repo.createDiagram(id);

  if (!diagram) {
    return res.status(500).json({ error: 'failed to generate diagram' });
  }

  res.json(diagram);
});

routes.get('/user/:userId', authenticate, async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  const projects = await repo.listProjectByUserId(userId);

  res.json(projects);
});

routes.get('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }

  const project = await repo.getProjectById(id);

  if (!project) {
    return res.status(404).json({ error: 'project not found' });
  }

  res.json(project);
});

routes.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }

  const success = await repo.deleteProjectById(id);

  if (!success) {
    return res.status(404).json({ error: 'error deleting project' });
  }
  
  res.status(204).json({ message: 'project deleted' });
});

export default routes;