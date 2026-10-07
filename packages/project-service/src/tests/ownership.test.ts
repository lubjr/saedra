import { describe, test, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest'
import express from 'express'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'

const USERS = {
  owner: { id: 'user-owner', token: 'token-owner' },
  intruder: { id: 'user-intruder', token: 'token-intruder' },
}

const PROJECTS = {
  owned: { id: 'project-owned', user_id: USERS.owner.id },
  other: { id: 'project-other', user_id: USERS.owner.id },
}

const DOCUMENT = { id: 'doc-1', project_id: PROJECTS.owned.id, name: 'rule.json', content: '{}', type: 'rule' }
const REVIEW = { id: 'review-1', project_id: PROJECTS.owned.id, branch: 'main' }

vi.mock('@repo/db-queries/queries', () => {
  const projects: Record<string, { id: string; user_id: string }> = {
    'project-owned': { id: 'project-owned', user_id: 'user-owner' },
    'project-other': { id: 'project-other', user_id: 'user-owner' },
  }
  const tokens: Record<string, string> = {
    'token-owner': 'user-owner',
    'token-intruder': 'user-intruder',
  }

  return {
    hashToken: vi.fn((token: string) => token),
    ApiTokenDB: {
      getUserIdByTokenHash: vi.fn(),
      createApiToken: vi.fn(),
      listApiTokensByUser: vi.fn(),
      revokeApiToken: vi.fn(),
    },
    LoginDB: {
      validateToken: vi.fn(async (token: string) => {
        const id = tokens[token]
        return id ? { data: { user: { id } }, error: null } : { data: { user: null }, error: { message: 'invalid token' } }
      }),
    },
    ProjectDB: {
      getProjectOwner: vi.fn(async (projectId: string) => {
        const project = projects[projectId]
        return { data: project ? { user_id: project.user_id } : null, error: null }
      }),
      getProjectById: vi.fn(async (projectId: string) => ({ data: projects[projectId] ?? null, error: null })),
      getProjectsByUser: vi.fn(async () => ({ data: [], error: null })),
      deleteProjectById: vi.fn(async () => ({ error: null })),
      getProjectSummaryData: vi.fn(async () => ({ projects: [], reviews: [], docs: [] })),
    },
    ProfileDB: {
      getProfileByUser: vi.fn(async (userId: string) => ({ data: { id: userId }, error: null })),
      updateProfileByUser: vi.fn(async (userId: string) => ({ data: [{ id: userId }], error: null })),
    },
    DocumentDB: {
      insertDocument: vi.fn(async () => ({ data: {}, error: null })),
      getDocumentsByProject: vi.fn(async () => ({ data: [], error: null })),
      getDocumentById: vi.fn(),
      updateDocumentById: vi.fn(async () => ({ error: null })),
      deleteDocumentById: vi.fn(async () => ({ error: null })),
    },
    ReviewDB: {
      insertReview: vi.fn(async () => ({ data: {}, error: null })),
      getReviewsByProject: vi.fn(async () => ({ data: [], error: null })),
      getReviewById: vi.fn(),
    },
    SettingsDB: {
      getProjectSettings: vi.fn(async () => ({ data: null, error: null })),
      upsertProjectSettings: vi.fn(async () => ({ data: {}, error: null })),
      deleteProjectSettings: vi.fn(async () => ({ error: null })),
    },
  }
})

const { DocumentDB, ReviewDB, ProjectDB, ProfileDB } = (await import('@repo/db-queries/queries')) as any
const { default: routes } = await import('../routes.js')

let server: Server
let baseUrl: string

const request = async (method: string, path: string, token: string, body?: unknown) => {
  return fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}

beforeAll(async () => {
  const app = express()
  app.use(express.json())
  app.use('/projects', routes)
  server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
})

afterAll(() => {
  server.close()
})

describe('project ownership', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    DocumentDB.getDocumentById.mockImplementation(async (documentId: string, projectId: string) => {
      return documentId === DOCUMENT.id && projectId === DOCUMENT.project_id
        ? { data: DOCUMENT, error: null }
        : { data: null, error: { message: 'not found' } }
    })
    ReviewDB.getReviewById.mockImplementation(async (reviewId: string, projectId: string) => {
      return { data: reviewId === REVIEW.id && projectId === REVIEW.project_id ? REVIEW : null, error: null }
    })
  })

  const projectRoutes = [
    { method: 'GET', path: `/projects/${PROJECTS.owned.id}` },
    { method: 'DELETE', path: `/projects/${PROJECTS.owned.id}` },
    { method: 'GET', path: `/projects/${PROJECTS.owned.id}/documents` },
    { method: 'POST', path: `/projects/${PROJECTS.owned.id}/documents`, body: { name: 'x', content: '{}', type: 'rule' } },
    { method: 'GET', path: `/projects/${PROJECTS.owned.id}/documents/${DOCUMENT.id}` },
    { method: 'PUT', path: `/projects/${PROJECTS.owned.id}/documents/${DOCUMENT.id}`, body: { content: '{}' } },
    { method: 'DELETE', path: `/projects/${PROJECTS.owned.id}/documents/${DOCUMENT.id}` },
    { method: 'GET', path: `/projects/${PROJECTS.owned.id}/reviews` },
    { method: 'POST', path: `/projects/${PROJECTS.owned.id}/reviews`, body: { branch: 'main', files: [] } },
    { method: 'GET', path: `/projects/${PROJECTS.owned.id}/reviews/${REVIEW.id}` },
    { method: 'GET', path: `/projects/${PROJECTS.owned.id}/settings` },
    { method: 'PUT', path: `/projects/${PROJECTS.owned.id}/settings`, body: { ai_provider: 'claude', model: 'm' } },
    { method: 'DELETE', path: `/projects/${PROJECTS.owned.id}/settings` },
  ]

  test.each(projectRoutes)('$method $path returns 404 for a user who does not own the project', async ({ method, path, body }) => {
    const res = await request(method, path, USERS.intruder.token, body)

    expect(res.status).toBe(404)
    expect(DocumentDB.insertDocument).not.toHaveBeenCalled()
    expect(DocumentDB.updateDocumentById).not.toHaveBeenCalled()
    expect(DocumentDB.deleteDocumentById).not.toHaveBeenCalled()
    expect(ReviewDB.insertReview).not.toHaveBeenCalled()
    expect(ProjectDB.deleteProjectById).not.toHaveBeenCalled()
  })

  test.each(projectRoutes)('$method $path is allowed for the project owner', async ({ method, path, body }) => {
    const res = await request(method, path, USERS.owner.token, body)

    expect(res.status).toBeLessThan(300)
  })

  test('returns 404 for a project that does not exist', async () => {
    const res = await request('GET', '/projects/missing-project/documents', USERS.owner.token)

    expect(res.status).toBe(404)
  })

  test.each([
    { method: 'GET', path: `/projects/${PROJECTS.other.id}/documents/${DOCUMENT.id}` },
    { method: 'PUT', path: `/projects/${PROJECTS.other.id}/documents/${DOCUMENT.id}`, body: { content: '{}' } },
    { method: 'DELETE', path: `/projects/${PROJECTS.other.id}/documents/${DOCUMENT.id}` },
    { method: 'GET', path: `/projects/${PROJECTS.other.id}/reviews/${REVIEW.id}` },
  ])('$method $path returns 404 when the resource belongs to another project', async ({ method, path, body }) => {
    const res = await request(method, path, USERS.owner.token, body)

    expect(res.status).toBe(404)
    expect(DocumentDB.updateDocumentById).not.toHaveBeenCalled()
    expect(DocumentDB.deleteDocumentById).not.toHaveBeenCalled()
  })
})

describe('user-scoped routes ignore the userId in the url', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('GET /profile/:userId reads the authenticated user profile', async () => {
    await request('GET', `/projects/profile/${USERS.owner.id}`, USERS.intruder.token)

    expect(ProfileDB.getProfileByUser).toHaveBeenCalledWith(USERS.intruder.id)
  })

  test('PUT /profile/:userId updates the authenticated user profile', async () => {
    await request('PUT', `/projects/profile/${USERS.owner.id}`, USERS.intruder.token, { username: 'x', avatar_url: '/' })

    expect(ProfileDB.updateProfileByUser).toHaveBeenCalledWith(USERS.intruder.id, 'x', '/')
  })

  test('GET /user/:userId lists the authenticated user projects', async () => {
    await request('GET', `/projects/user/${USERS.owner.id}`, USERS.intruder.token)

    expect(ProjectDB.getProjectsByUser).toHaveBeenCalledWith(USERS.intruder.id)
  })

  test('GET /summaries/user/:userId summarizes the authenticated user projects', async () => {
    await request('GET', `/projects/summaries/user/${USERS.owner.id}`, USERS.intruder.token)

    expect(ProjectDB.getProjectSummaryData).toHaveBeenCalledWith(USERS.intruder.id)
  })
})
