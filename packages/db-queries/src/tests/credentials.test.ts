import { describe, test, expect, vi, beforeEach } from 'vitest'
import { AwsCredentialsDB } from '../credentials.js'

const MOCK_CREDENTIALS = {
  valid: {
    id: 'cred-123',
    project_id: 'project-123',
    access_key_id: 'AKIAIOSFODNN7EXAMPLE',
    secret_access_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    region: 'us-east-1',
  },
  created: {
    id: 'cred-456',
    project_id: 'project-123',
    access_key_id: 'AKIAIOSFODNN7NEWKEY',
    secret_access_key: 'newSecretAccessKey123',
    region: 'us-west-2',
  },
  list: [
    {
      id: 'cred-123',
      project_id: 'project-123',
      access_key_id: 'AKIAIOSFODNN7EXAMPLE',
      secret_access_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      region: 'us-east-1',
    },
    {
      id: 'cred-456',
      project_id: 'project-123',
      access_key_id: 'AKIAIOSFODNN7SECOND',
      secret_access_key: 'secondSecretKey123',
      region: 'eu-west-1',
    },
  ],
  withProject: [
    {
      id: 'cred-123',
      project_id: 'project-123',
      access_key_id: 'AKIAIOSFODNN7EXAMPLE',
      secret_access_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      region: 'us-east-1',
      projects: { user_id: 'user-123', name: 'Test Project', id: 'project-123' },
    },
  ],
}

const MOCK_INPUT_CREDENTIALS = {
  accessKeyId: 'AKIAIOSFODNN7NEWKEY',
  secretAccessKey: 'newSecretAccessKey123',
  region: 'us-west-2',
}

const MOCK_ERRORS = {
  notFound: { message: 'Credential not found', code: 'PGRST116' },
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
    supabase: { from: mockFrom },
    __mocks: { mockFrom, mockSelect, mockSelectEq, mockInsert, mockDelete, mockDeleteEq, mockSingle },
  }
})

const { mockFrom, mockSelect, mockSelectEq, mockInsert, mockDelete, mockDeleteEq, mockSingle } = (
  await vi.importMock('@repo/db-connector/db') as any
).__mocks

describe('AwsCredentialsDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('insertCredentials', () => {
    test.each([
      {
        scenario: 'inserts credentials successfully',
        input: { projectId: 'project-123', creds: MOCK_INPUT_CREDENTIALS },
        mockResponse: { data: MOCK_CREDENTIALS.created, error: null },
        expected: { data: MOCK_CREDENTIALS.created, error: null },
      },
      {
        scenario: 'returns error when insert fails',
        input: { projectId: 'project-123', creds: MOCK_INPUT_CREDENTIALS },
        mockResponse: { data: null, error: MOCK_ERRORS.insertFailed },
        expected: { data: null, error: MOCK_ERRORS.insertFailed },
      },
    ])('$scenario', async ({ input, mockResponse, expected }) => {
      mockSingle.mockResolvedValue(mockResponse)

      const result = await AwsCredentialsDB.insertCredentials(input.projectId, input.creds)

      expect(mockFrom).toHaveBeenCalledWith('aws_credentials')
      expect(mockInsert).toHaveBeenCalledWith({
        project_id: input.projectId,
        access_key_id: input.creds.accessKeyId,
        secret_access_key: input.creds.secretAccessKey,
        region: input.creds.region,
      })
      expect(result).toEqual(expected)
    })
  })

  describe('getCredentialsByProject', () => {
    test.each([
      {
        scenario: 'returns credentials when project has credentials',
        projectId: 'project-123',
        mockResponse: { data: MOCK_CREDENTIALS.list, error: null },
        expected: { data: MOCK_CREDENTIALS.list, error: null },
      },
      {
        scenario: 'returns empty array when project has no credentials',
        projectId: 'project-456',
        mockResponse: { data: [], error: null },
        expected: { data: [], error: null },
      },
    ])('$scenario', async ({ projectId, mockResponse, expected }) => {
      mockSelectEq.mockResolvedValue(mockResponse)

      const result = await AwsCredentialsDB.getCredentialsByProject(projectId)

      expect(mockFrom).toHaveBeenCalledWith('aws_credentials')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockSelectEq).toHaveBeenCalledWith('project_id', projectId)
      expect(result).toEqual(expected)
    })
  })

  describe('getCredentialById', () => {
    test.each([
      {
        scenario: 'returns credential when it exists',
        credentialId: 'cred-123',
        mockResponse: { data: MOCK_CREDENTIALS.valid, error: null },
        expected: { data: MOCK_CREDENTIALS.valid, error: null },
      },
      {
        scenario: 'returns error when credential does not exist',
        credentialId: 'non-existent',
        mockResponse: { data: null, error: MOCK_ERRORS.notFound },
        expected: { data: null, error: MOCK_ERRORS.notFound },
      },
    ])('$scenario', async ({ credentialId, mockResponse, expected }) => {
      mockSelectEq.mockReturnValue({ single: mockSingle })
      mockSingle.mockResolvedValue(mockResponse)

      const result = await AwsCredentialsDB.getCredentialById(credentialId)

      expect(mockFrom).toHaveBeenCalledWith('aws_credentials')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockSelectEq).toHaveBeenCalledWith('id', credentialId)
      expect(result).toEqual(expected)
    })
  })

  describe('getCredentialsByUser', () => {
    test.each([
      {
        scenario: 'returns credentials with project info when user has credentials',
        userId: 'user-123',
        mockResponse: { data: MOCK_CREDENTIALS.withProject, error: null },
        expected: { data: MOCK_CREDENTIALS.withProject, error: null },
      },
      {
        scenario: 'returns empty array when user has no credentials',
        userId: 'user-456',
        mockResponse: { data: [], error: null },
        expected: { data: [], error: null },
      },
    ])('$scenario', async ({ userId, mockResponse, expected }) => {
      mockSelectEq.mockResolvedValue(mockResponse)

      const result = await AwsCredentialsDB.getCredentialsByUser(userId)

      expect(mockFrom).toHaveBeenCalledWith('aws_credentials')
      expect(mockSelect).toHaveBeenCalledWith('*, projects!inner(user_id, name, id)')
      expect(mockSelectEq).toHaveBeenCalledWith('projects.user_id', userId)
      expect(result).toEqual(expected)
    })
  })

  describe('deleteCredentialsByProject', () => {
    test.each([
      {
        scenario: 'deletes credentials successfully',
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

      const result = await AwsCredentialsDB.deleteCredentialsByProject(projectId)

      expect(mockFrom).toHaveBeenCalledWith('aws_credentials')
      expect(mockDelete).toHaveBeenCalled()
      expect(mockDeleteEq).toHaveBeenCalledWith('project_id', projectId)
      expect(result).toEqual(expected)
    })
  })
})
