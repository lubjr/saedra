import { describe, test, expect, vi, beforeEach } from 'vitest'
import { DocumentDB } from '../documents.js'

const MOCK_DOCUMENTS = {
  valid: {
    id: 'doc-123',
    project_id: 'project-123',
    name: 'README.md',
    content: '# My Project',
  },
  created: {
    id: 'doc-456',
    project_id: 'project-123',
    name: 'architecture.md',
    content: '# Architecture',
  },
  list: [
    { id: 'doc-123', project_id: 'project-123', name: 'README.md', content: '# My Project' },
    { id: 'doc-456', project_id: 'project-123', name: 'architecture.md', content: '# Architecture' },
  ],
}

const MOCK_ERRORS = {
  notFound: { message: 'Document not found', code: 'PGRST116' },
  insertFailed: { message: 'Insert failed', code: 'PGRST204' },
  updateFailed: { message: 'Update failed', code: 'PGRST204' },
  deleteFailed: { message: 'Delete failed', code: 'PGRST204' },
}

vi.mock('@repo/db-connector/db', () => {
  const mockSingle = vi.fn()
  const mockDeleteEq = vi.fn()
  const mockUpdateEq = vi.fn()
  const mockSelectEq = vi.fn(() => ({ single: mockSingle }))
  const mockSelect = vi.fn(() => ({ eq: mockSelectEq }))
  const mockInsert = vi.fn(() => ({ select: () => ({ single: mockSingle }) }))
  const mockDelete = vi.fn(() => ({ eq: mockDeleteEq }))
  const mockUpdate = vi.fn(() => ({ eq: mockUpdateEq }))
  const mockFrom = vi.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
    delete: mockDelete,
    update: mockUpdate,
  }))

  return {
    supabase: { from: mockFrom },
    __mocks: { mockFrom, mockSelect, mockSelectEq, mockInsert, mockDelete, mockDeleteEq, mockSingle, mockUpdate, mockUpdateEq },
  }
})

const { mockFrom, mockSelect, mockSelectEq, mockInsert, mockDelete, mockDeleteEq, mockSingle, mockUpdate, mockUpdateEq } = (
  await vi.importMock('@repo/db-connector/db') as any
).__mocks

describe('DocumentDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('insertDocument', () => {
    test.each([
      {
        scenario: 'creates document successfully',
        input: { projectId: 'project-123', name: 'architecture.md', content: '# Architecture' },
        mockResponse: { data: MOCK_DOCUMENTS.created, error: null },
        expected: { data: MOCK_DOCUMENTS.created, error: null },
      },
      {
        scenario: 'returns error when insert fails',
        input: { projectId: 'project-123', name: 'architecture.md', content: '# Architecture' },
        mockResponse: { data: null, error: MOCK_ERRORS.insertFailed },
        expected: { data: null, error: MOCK_ERRORS.insertFailed },
      },
    ])('$scenario', async ({ input, mockResponse, expected }) => {
      mockSingle.mockResolvedValue(mockResponse)

      const result = await DocumentDB.insertDocument(input.projectId, input.name, input.content)

      expect(mockFrom).toHaveBeenCalledWith('documents')
      expect(mockInsert).toHaveBeenCalledWith({
        project_id: input.projectId,
        name: input.name,
        content: input.content,
      })
      expect(result).toEqual(expected)
    })
  })

  describe('getDocumentsByProject', () => {
    test.each([
      {
        scenario: 'returns documents when project has documents',
        projectId: 'project-123',
        mockResponse: { data: MOCK_DOCUMENTS.list, error: null },
        expected: { data: MOCK_DOCUMENTS.list, error: null },
      },
      {
        scenario: 'returns empty array when project has no documents',
        projectId: 'project-456',
        mockResponse: { data: [], error: null },
        expected: { data: [], error: null },
      },
    ])('$scenario', async ({ projectId, mockResponse, expected }) => {
      mockSelectEq.mockResolvedValue(mockResponse)

      const result = await DocumentDB.getDocumentsByProject(projectId)

      expect(mockFrom).toHaveBeenCalledWith('documents')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockSelectEq).toHaveBeenCalledWith('project_id', projectId)
      expect(result).toEqual(expected)
    })
  })

  describe('getDocumentById', () => {
    test.each([
      {
        scenario: 'returns document when it exists',
        documentId: 'doc-123',
        mockResponse: { data: MOCK_DOCUMENTS.valid, error: null },
        expected: { data: MOCK_DOCUMENTS.valid, error: null },
      },
      {
        scenario: 'returns error when document does not exist',
        documentId: 'non-existent',
        mockResponse: { data: null, error: MOCK_ERRORS.notFound },
        expected: { data: null, error: MOCK_ERRORS.notFound },
      },
    ])('$scenario', async ({ documentId, mockResponse, expected }) => {
      mockSelectEq.mockReturnValue({ single: mockSingle })
      mockSingle.mockResolvedValue(mockResponse)

      const result = await DocumentDB.getDocumentById(documentId)

      expect(mockFrom).toHaveBeenCalledWith('documents')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockSelectEq).toHaveBeenCalledWith('id', documentId)
      expect(result).toEqual(expected)
    })
  })

  describe('updateDocumentById', () => {
    test.each([
      {
        scenario: 'updates document successfully',
        input: { documentId: 'doc-123', content: '# Updated Content' },
        mockResponse: { data: null, error: null },
        expected: { data: null, error: null },
      },
      {
        scenario: 'returns error when update fails',
        input: { documentId: 'doc-123', content: '# Updated Content' },
        mockResponse: { data: null, error: MOCK_ERRORS.updateFailed },
        expected: { data: null, error: MOCK_ERRORS.updateFailed },
      },
    ])('$scenario', async ({ input, mockResponse, expected }) => {
      mockUpdateEq.mockResolvedValue(mockResponse)

      const result = await DocumentDB.updateDocumentById(input.documentId, input.content)

      expect(mockFrom).toHaveBeenCalledWith('documents')
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        content: input.content,
        updated_at: expect.any(String),
      }))
      expect(mockUpdateEq).toHaveBeenCalledWith('id', input.documentId)
      expect(result).toEqual(expected)
    })
  })

  describe('deleteDocumentById', () => {
    test.each([
      {
        scenario: 'deletes document successfully',
        documentId: 'doc-123',
        mockResponse: { data: null, error: null },
        expected: { data: null, error: null },
      },
      {
        scenario: 'returns error when delete fails',
        documentId: 'doc-123',
        mockResponse: { data: null, error: MOCK_ERRORS.deleteFailed },
        expected: { data: null, error: MOCK_ERRORS.deleteFailed },
      },
    ])('$scenario', async ({ documentId, mockResponse, expected }) => {
      mockDeleteEq.mockResolvedValue(mockResponse)

      const result = await DocumentDB.deleteDocumentById(documentId)

      expect(mockFrom).toHaveBeenCalledWith('documents')
      expect(mockDelete).toHaveBeenCalled()
      expect(mockDeleteEq).toHaveBeenCalledWith('id', documentId)
      expect(result).toEqual(expected)
    })
  })
})
