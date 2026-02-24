import { describe, test, expect, vi, beforeEach } from 'vitest'
import { DiagramDB } from '../diagrams.js'

const MOCK_GRAPH = {
  nodes: [
    { id: 'node-1', type: 'ec2', label: 'Web Server' },
    { id: 'node-2', type: 'rds', label: 'Database' },
  ],
  edges: [
    { source: 'node-1', target: 'node-2' },
  ],
}

const MOCK_DIAGRAMS = {
  valid: {
    id: 'diagram-123',
    project_id: 'project-123',
    graph: MOCK_GRAPH,
  },
  created: {
    id: 'diagram-456',
    project_id: 'project-123',
    graph: MOCK_GRAPH,
  },
  graphOnly: {
    graph: MOCK_GRAPH,
  },
}

const MOCK_ERRORS = {
  notFound: { message: 'Diagram not found', code: 'PGRST116' },
  insertFailed: { message: 'Insert failed', code: 'PGRST204' },
}

vi.mock('@repo/db-connector/db', () => {
  const mockSingle = vi.fn()
  const mockSelectEq = vi.fn(() => ({ single: mockSingle }))
  const mockSelect = vi.fn(() => ({ eq: mockSelectEq }))
  const mockInsert = vi.fn(() => ({ select: () => ({ single: mockSingle }) }))
  const mockFrom = vi.fn(() => ({ select: mockSelect, insert: mockInsert }))

  return {
    serviceClient: { from: mockFrom },
    __mocks: { mockFrom, mockSelect, mockSelectEq, mockInsert, mockSingle },
  }
})

const { mockFrom, mockSelect, mockSelectEq, mockInsert, mockSingle } = (
  await vi.importMock('@repo/db-connector/db') as any
).__mocks

describe('DiagramDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('insertDiagram', () => {
    test.each([
      {
        scenario: 'inserts diagram successfully',
        input: { projectId: 'project-123', graph: MOCK_GRAPH },
        mockResponse: { data: MOCK_DIAGRAMS.created, error: null },
        expected: { data: MOCK_DIAGRAMS.created, error: null },
      },
      {
        scenario: 'returns error when insert fails',
        input: { projectId: 'project-123', graph: MOCK_GRAPH },
        mockResponse: { data: null, error: MOCK_ERRORS.insertFailed },
        expected: { data: null, error: MOCK_ERRORS.insertFailed },
      },
    ])('$scenario', async ({ input, mockResponse, expected }) => {
      mockSingle.mockResolvedValue(mockResponse)

      const result = await DiagramDB.insertDiagram(input.projectId, input.graph)

      expect(mockFrom).toHaveBeenCalledWith('diagrams')
      expect(mockInsert).toHaveBeenCalledWith({
        project_id: input.projectId,
        graph: input.graph,
      })
      expect(result).toEqual(expected)
    })
  })

  describe('getDiagramByProject', () => {
    test.each([
      {
        scenario: 'returns diagram when project has a diagram',
        projectId: 'project-123',
        mockResponse: { data: MOCK_DIAGRAMS.graphOnly, error: null },
        expected: { data: MOCK_DIAGRAMS.graphOnly, error: null },
      },
      {
        scenario: 'returns error when diagram does not exist',
        projectId: 'non-existent',
        mockResponse: { data: null, error: MOCK_ERRORS.notFound },
        expected: { data: null, error: MOCK_ERRORS.notFound },
      },
    ])('$scenario', async ({ projectId, mockResponse, expected }) => {
      mockSelectEq.mockReturnValue({ single: mockSingle })
      mockSingle.mockResolvedValue(mockResponse)

      const result = await DiagramDB.getDiagramByProject(projectId)

      expect(mockFrom).toHaveBeenCalledWith('diagrams')
      expect(mockSelect).toHaveBeenCalledWith('graph')
      expect(mockSelectEq).toHaveBeenCalledWith('project_id', projectId)
      expect(result).toEqual(expected)
    })
  })
})
