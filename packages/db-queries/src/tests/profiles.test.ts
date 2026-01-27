import { describe, test, expect, vi, beforeEach } from 'vitest'
import { ProfileDB } from '../profiles.js'

const MOCK_PROFILES = {
  valid: {
    id: 'user-123',
    username: 'testuser',
    avatar_url: 'https://example.com/avatar.png',
  },
  updated: {
    id: 'user-123',
    username: 'newusername',
    avatar_url: 'https://example.com/new-avatar.png',
  },
}

const MOCK_ERRORS = {
  notFound: { message: 'Profile not found', code: 'PGRST116' },
  updateFailed: { message: 'Update failed', code: 'PGRST204' },
}

vi.mock('@repo/db-connector/db', () => {
  const mockSingle = vi.fn()
  const mockSelectFinal = vi.fn()
  const mockEq = vi.fn(() => ({ single: mockSingle, select: mockSelectFinal }))
  const mockSelect = vi.fn(() => ({ eq: mockEq }))
  const mockUpdate = vi.fn(() => ({ eq: mockEq }))
  const mockFrom = vi.fn(() => ({ select: mockSelect, update: mockUpdate }))

  return {
    supabase: { from: mockFrom },
    __mocks: { mockFrom, mockSelect, mockEq, mockUpdate, mockSingle, mockSelectFinal },
  }
})

const { mockFrom, mockSelect, mockEq, mockUpdate, mockSingle, mockSelectFinal } = (
  await vi.importMock('@repo/db-connector/db') as any
).__mocks

describe('ProfileDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProfileByUser', () => {
    test.each([
      {
        scenario: 'returns profile when user exists',
        userId: 'user-123',
        mockResponse: { data: MOCK_PROFILES.valid, error: null },
        expected: { data: MOCK_PROFILES.valid, error: null },
      },
      {
        scenario: 'returns error when user does not exist',
        userId: 'non-existent',
        mockResponse: { data: null, error: MOCK_ERRORS.notFound },
        expected: { data: null, error: MOCK_ERRORS.notFound },
      },
    ])('$scenario', async ({ userId, mockResponse, expected }) => {
      mockSingle.mockResolvedValue(mockResponse)

      const result = await ProfileDB.getProfileByUser(userId)

      expect(mockFrom).toHaveBeenCalledWith('profiles')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('id', userId)
      expect(result).toEqual(expected)
    })
  })

  describe('updateProfileByUser', () => {
    test.each([
      {
        scenario: 'updates profile successfully',
        input: { userId: 'user-123', username: 'newusername', avatarUrl: 'https://example.com/new-avatar.png' },
        mockResponse: { data: [MOCK_PROFILES.updated], error: null },
        expected: { data: [MOCK_PROFILES.updated], error: null },
      },
      {
        scenario: 'returns error when update fails',
        input: { userId: 'user-123', username: 'newusername', avatarUrl: 'https://example.com/avatar.png' },
        mockResponse: { data: null, error: MOCK_ERRORS.updateFailed },
        expected: { data: null, error: MOCK_ERRORS.updateFailed },
      },
    ])('$scenario', async ({ input, mockResponse, expected }) => {
      mockSelectFinal.mockResolvedValue(mockResponse)

      const result = await ProfileDB.updateProfileByUser(input.userId, input.username, input.avatarUrl)

      expect(mockFrom).toHaveBeenCalledWith('profiles')
      expect(mockUpdate).toHaveBeenCalledWith({ username: input.username, avatar_url: input.avatarUrl })
      expect(mockEq).toHaveBeenCalledWith('id', input.userId)
      expect(result).toEqual(expected)
    })
  })
})
