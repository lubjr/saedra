import { describe, test, expect, vi, beforeEach } from 'vitest'
import { ApiTokenDB, hashToken } from '../apiTokens.js'

const MOCK_USER_ID = 'user-123'
const MOCK_TOKEN_ROW = {
  id: 'token-abc',
  name: 'CI - GitHub Actions',
  token_prefix: 'saedra_pat_',
  created_at: '2026-08-04T00:00:00.000Z',
  last_used_at: null,
  expires_at: null,
}

vi.mock('@repo/db-connector/db', () => {
  const mockSingle = vi.fn()
  const mockMaybeSingle = vi.fn()
  const mockThen = vi.fn((resolve: any) => resolve({ data: null, error: null }))
  const mockOrder = vi.fn()
  const mockEqUpdate = vi.fn(() => ({ then: mockThen }))
  const mockUpdate = vi.fn(() => ({ eq: mockEqUpdate }))
  const mockEqDelete = vi.fn()
  const mockEqSelectHash = vi.fn(() => ({ maybeSingle: mockMaybeSingle }))
  const mockEqSelectUser = vi.fn(() => ({ order: mockOrder }))
  const mockSelectAfterInsert = vi.fn(() => ({ single: mockSingle }))
  const mockInsert = vi.fn(() => ({ select: mockSelectAfterInsert }))

  const mockFrom = vi.fn((table: string) => ({
    insert: mockInsert,
    update: mockUpdate,
    select: vi.fn((cols: string) => {
      if (cols.includes('user_id') && !cols.includes('name')) {
        return { eq: mockEqSelectHash }
      }
      return { eq: mockEqSelectUser }
    }),
    delete: vi.fn(() => ({ eq: mockEqDelete })),
  }))

  return {
    serviceClient: { from: mockFrom },
    __mocks: {
      mockFrom,
      mockInsert,
      mockSingle,
      mockMaybeSingle,
      mockEqSelectHash,
      mockEqSelectUser,
      mockOrder,
      mockEqDelete,
      mockUpdate,
      mockEqUpdate,
    },
  }
})

const {
  mockFrom,
  mockInsert,
  mockSingle,
  mockMaybeSingle,
  mockEqSelectHash,
  mockOrder,
  mockEqDelete,
} = (await vi.importMock('@repo/db-connector/db') as any).__mocks

describe('ApiTokenDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('hashToken', () => {
    test('is deterministic and produces a sha256 hex digest', () => {
      const a = hashToken('saedra_pat_abc123')
      const b = hashToken('saedra_pat_abc123')
      expect(a).toBe(b)
      expect(a).toMatch(/^[0-9a-f]{64}$/)
    })

    test('different tokens hash to different values', () => {
      expect(hashToken('token-a')).not.toBe(hashToken('token-b'))
    })
  })

  describe('createApiToken', () => {
    test('generates a saedra_pat_ token and returns it alongside the inserted row', async () => {
      mockSingle.mockResolvedValue({ data: MOCK_TOKEN_ROW, error: null })

      const result = await ApiTokenDB.createApiToken(MOCK_USER_ID, 'CI - GitHub Actions')

      expect(mockFrom).toHaveBeenCalledWith('api_tokens')
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: MOCK_USER_ID,
          name: 'CI - GitHub Actions',
          token_hash: expect.any(String),
          token_prefix: expect.stringMatching(/^saedra_pat_/),
        })
      )
      expect(result.error).toBeNull()
      expect(result.data.token).toMatch(/^saedra_pat_[0-9a-f]{64}$/)
      expect(result.data.id).toBe(MOCK_TOKEN_ROW.id)
    })

    test('returns the error and no token when insert fails', async () => {
      const dbError = { message: 'duplicate key value' }
      mockSingle.mockResolvedValue({ data: null, error: dbError })

      const result = await ApiTokenDB.createApiToken(MOCK_USER_ID, 'CI')

      expect(result).toEqual({ data: null, error: dbError })
    })
  })

  describe('getUserIdByTokenHash', () => {
    test.each([
      {
        scenario: 'returns the user_id when the hash matches an active token',
        mockResponse: { data: { id: 'token-abc', user_id: MOCK_USER_ID }, error: null },
        expected: MOCK_USER_ID,
      },
      {
        scenario: 'returns null when no token matches the hash',
        mockResponse: { data: null, error: null },
        expected: null,
      },
      {
        scenario: 'returns null when the lookup errors',
        mockResponse: { data: null, error: { message: 'db unreachable' } },
        expected: null,
      },
    ])('$scenario', async ({ mockResponse, expected }) => {
      mockMaybeSingle.mockResolvedValue(mockResponse)

      const result = await ApiTokenDB.getUserIdByTokenHash('some-hash')

      expect(mockEqSelectHash).toHaveBeenCalledWith('token_hash', 'some-hash')
      expect(result).toBe(expected)
    })
  })

  describe('listApiTokensByUser', () => {
    test('selects only safe columns, never token_hash', async () => {
      mockOrder.mockResolvedValue({ data: [MOCK_TOKEN_ROW], error: null })

      await ApiTokenDB.listApiTokensByUser(MOCK_USER_ID)

      const selectCall = mockFrom.mock.results[0]!.value.select as ReturnType<typeof vi.fn>
      const selectedColumns = selectCall.mock.calls[0]![0] as string
      expect(selectedColumns).not.toContain('token_hash')
      expect(selectedColumns).toContain('token_prefix')
    })
  })

  describe('revokeApiToken', () => {
    test('scopes the delete by both id and user_id', async () => {
      mockEqDelete.mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: null, error: null }) })

      await ApiTokenDB.revokeApiToken('token-abc', MOCK_USER_ID)

      expect(mockFrom).toHaveBeenCalledWith('api_tokens')
    })
  })
})
