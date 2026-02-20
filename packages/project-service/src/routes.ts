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

routes.get('/profile/:userId', authenticate, async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  const profile = await repo.getProfileById(userId);

  if ('error' in profile) {
    return res.status(400).json({ error: profile.error });
  }

  res.json({ user: profile.user });
});

routes.put('/profile/:userId', authenticate, async (req, res) => {
  const { userId } = req.params;
  const { username, avatar_url } = req.body;

  if (!userId || !username || !avatar_url) {
    return res.status(400).json({ error: 'userId, username and avatar_url required' });
  }

  const profile = await repo.updateProfileById(userId, username, avatar_url);

  if ('error' in profile) {
    return res.status(400).json({ error: profile.error });
  }

  res.json(profile);
});

routes.post('/create', authenticate, async (req, res) => {
  const { name, userId } = req.body;

  if (!name || !userId) {
    return res.status(400).json({ error: 'name and userId required' });
  }

  const project = await repo.createProject(name, userId);

  res.status(201).json(project);
});

routes.get('/credentials/user/:userId', authenticate, async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  const credentials = await repo.listCredentialsByUserId(userId);

  if ('error' in credentials) {
    return res.status(400).json({ error: credentials.error });
  }

  res.json(credentials);
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

routes.get('/:projectId/credentials', authenticate, async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({ error: 'projectId required' });
  }

  const credentials = await repo.getCredentials(projectId);

  if (!credentials) {
    return res.status(404).json({ error: 'credentials not found' });
  }

  res.json(credentials);
});

routes.delete('/:projectId/credentials', authenticate, async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({ error: 'projectId required' });
  }

  const success = await repo.deleteCredentials(projectId);

  if (!success) {
    return res.status(404).json({ error: 'error deleting credentials' });
  }

  res.status(204).json({ message: 'credentials deleted' });
});

routes.post('/:id/diagram', authenticate, async (req, res) => {
  const { id } = req.params;
  const { credentialId } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }

  if (!credentialId) {
    return res.status(400).json({ error: 'credentialId required' });
  }

  const project = await repo.getProjectById(id);

  if (!project) {
    return res.status(404).json({ error: 'project not found' });
  }

  const diagram = await repo.createDiagram(id, credentialId);

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

routes.post('/:projectId/documents', authenticate, async (req, res) => {
  const { projectId } = req.params;
  const { name, content } = req.body;

  if (!name || !projectId) {
    return res.status(400).json({ error: 'name and projectId required' });
  }

  const document = await repo.createDocument(projectId, name, content ?? '');

  if ('error' in document) {
    return res.status(400).json({ error: document.error });
  }

  res.status(201).json(document);
});

routes.get('/:projectId/documents', authenticate, async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({ error: 'projectId required' });
  }

  const documents = await repo.listDocumentsByProject(projectId);

  if ('error' in documents) {
    return res.status(400).json({ error: documents.error });
  }

  res.json(documents);
});

routes.get('/:projectId/documents/:documentId', authenticate, async (req, res) => {
  const { documentId } = req.params;

  if (!documentId) {
    return res.status(400).json({ error: 'documentId required' });
  }

  const document = await repo.getDocumentById(documentId);

  if (!document || 'error' in document) {
    return res.status(404).json({ error: 'document not found' });
  }

  res.json(document);
});

routes.put('/:projectId/documents/:documentId', authenticate, async (req, res) => {
  const { documentId } = req.params;
  const { content } = req.body;

  if (content === undefined || !documentId) {
    return res.status(400).json({ error: 'content and documentId required' });
  }

  const success = await repo.updateDocument(documentId, content);

  if (!success) {
    return res.status(404).json({ error: 'error updating document' });
  }

  res.status(204).json({ message: 'document updated' });
});

routes.delete('/:projectId/documents/:documentId', authenticate, async (req, res) => {
  const { documentId } = req.params;

  if (!documentId) {
    return res.status(400).json({ error: 'documentId required' });
  }

  const success = await repo.deleteDocument(documentId);

  if (!success) {
    return res.status(404).json({ error: 'error deleting document' });
  }

  res.status(204).json({ message: 'document deleted' });
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