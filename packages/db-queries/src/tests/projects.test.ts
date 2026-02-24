import { describe, test, expect, vi, beforeEach } from 'vitest'
import { ProjectDB } from '../projects.js'

const MOCK_PROJECTS = {
  valid: {
    id: 'project-123',
    user_id: 'user-123',
    name: 'Test Project',
  },
  created: {
    id: 'project-456',
    user_id: 'user-123',
    name: 'New Project',
  },
  list: [
    { id: 'project-123', user_id: 'user-123', name: 'Project 1' },
    { id: 'project-456', user_id: 'user-123', name: 'Project 2' },
  ],
}

const MOCK_ERRORS = {
  notFound: { message: 'Project not found', code: 'PGRST116' },
  insertFailed: { message: 'Insert failed', code: 'PGRST204' },
  deleteFailed: { message: 'Delete failed', code: 'PGRST204' },
}

vi.mock('@repo/db-connector/db', () => {
  const mockSingle = vi.fn()
  const mockDeleteEq = vi.fn()
  const mockSelectEq = vi.fn(() => ({ single: mockSingle }))
  const mockSelect = vi.fn(() => ({ eq: mockSelectEq }))
  const mockInsert = vi.fn(() => ({ select: () => ({ single: mockSingle }) }))
  const mockDelete = vi.fn(() => ({ eq: mockDeleteEq }))
  const mockFrom = vi.fn(() => ({ select: mockSelect, insert: mockInsert, delete: mockDelete }))

  return {
    serviceClient: { from: mockFrom },
    __mocks: { mockFrom, mockSelect, mockSelectEq, mockInsert, mockDelete, mockDeleteEq, mockSingle },
  }
})

const { mockFrom, mockSelect, mockSelectEq, mockInsert, mockDelete, mockDeleteEq, mockSingle } = (
  await vi.importMock('@repo/db-connector/db') as any
).__mocks

describe('ProjectDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('insertProject', () => {
    test.each([
      {
        scenario: 'creates project successfully',
        input: { userId: 'user-123', name: 'New Project' },
        mockResponse: { data: MOCK_PROJECTS.created, error: null },
        expected: { data: MOCK_PROJECTS.created, error: null },
      },
      {
        scenario: 'returns error when insert fails',
        input: { userId: 'user-123', name: 'New Project' },
        mockResponse: { data: null, error: MOCK_ERRORS.insertFailed },
        expected: { data: null, error: MOCK_ERRORS.insertFailed },
      },
    ])('$scenario', async ({ input, mockResponse, expected }) => {
      mockSingle.mockResolvedValue(mockResponse)

      const result = await ProjectDB.insertProject(input.userId, input.name)

      expect(mockFrom).toHaveBeenCalledWith('projects')
      expect(mockInsert).toHaveBeenCalledWith({ user_id: input.userId, name: input.name })
      expect(result).toEqual(expected)
    })
  })

  describe('getProjectsByUser', () => {
    test.each([
      {
        scenario: 'returns projects when user has projects',
        userId: 'user-123',
        mockResponse: { data: MOCK_PROJECTS.list, error: null },
        expected: { data: MOCK_PROJECTS.list, error: null },
      },
      {
        scenario: 'returns empty array when user has no projects',
        userId: 'user-456',
        mockResponse: { data: [], error: null },
        expected: { data: [], error: null },
      },
    ])('$scenario', async ({ userId, mockResponse, expected }) => {
      mockSelectEq.mockResolvedValue(mockResponse)

      const result = await ProjectDB.getProjectsByUser(userId)

      expect(mockFrom).toHaveBeenCalledWith('projects')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockSelectEq).toHaveBeenCalledWith('user_id', userId)
      expect(result).toEqual(expected)
    })
  })

  describe('getProjectById', () => {
    test.each([
      {
        scenario: 'returns project when it exists',
        projectId: 'project-123',
        mockResponse: { data: MOCK_PROJECTS.valid, error: null },
        expected: { data: MOCK_PROJECTS.valid, error: null },
      },
      {
        scenario: 'returns error when project does not exist',
        projectId: 'non-existent',
        mockResponse: { data: null, error: MOCK_ERRORS.notFound },
        expected: { data: null, error: MOCK_ERRORS.notFound },
      },
    ])('$scenario', async ({ projectId, mockResponse, expected }) => {
      mockSelectEq.mockReturnValue({ single: mockSingle })
      mockSingle.mockResolvedValue(mockResponse)

      const result = await ProjectDB.getProjectById(projectId)

      expect(mockFrom).toHaveBeenCalledWith('projects')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockSelectEq).toHaveBeenCalledWith('id', projectId)
      expect(result).toEqual(expected)
    })
  })

  describe('deleteProjectById', () => {
    test.each([
      {
        scenario: 'deletes project successfully',
        projectId: 'project-123',
        mockResponse: { data: null, error: null },
        expected: { data: null, error: null },
      },
      {
        scenario: 'returns error when delete fails',
        projectId: 'project-123',
        mockResponse: { data: null, error: MOCK_ERRORS.deleteFailed },
        expected: { data: null, error: MOCK_ERRORS.deleteFailed },
      },
    ])('$scenario', async ({ projectId, mockResponse, expected }) => {
      mockDeleteEq.mockResolvedValue(mockResponse)

      const result = await ProjectDB.deleteProjectById(projectId)

      expect(mockFrom).toHaveBeenCalledWith('projects')
      expect(mockDelete).toHaveBeenCalled()
      expect(mockDeleteEq).toHaveBeenCalledWith('id', projectId)
      expect(result).toEqual(expected)
    })
  })
})
