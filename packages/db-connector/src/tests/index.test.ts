import { describe, test, expect, vi, beforeEach } from 'vitest'

const MOCK_ENV = {
  SUPABASE_URL: 'https://test-project.supabase.co',
  SUPABASE_ANON_KEY: 'test-anon-key-123',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key-456',
}

const MOCK_SUPABASE_CLIENT = {
  from: vi.fn(),
  auth: {
    signIn: vi.fn(),
    signOut: vi.fn(),
  },
}

const MOCK_SERVICE_CLIENT = {
  from: vi.fn(),
  auth: {
    admin: {
      listUsers: vi.fn(),
    },
  },
}

const mockCreateClient = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient,
}))

describe('db-connector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()

    process.env.SUPABASE_URL = MOCK_ENV.SUPABASE_URL
    process.env.SUPABASE_ANON_KEY = MOCK_ENV.SUPABASE_ANON_KEY
    process.env.SUPABASE_SERVICE_ROLE_KEY = MOCK_ENV.SUPABASE_SERVICE_ROLE_KEY
  })

  describe('supabase client', () => {
    test.each([
      {
        scenario: 'creates supabase client with correct URL and anon key',
        expectedUrl: MOCK_ENV.SUPABASE_URL,
        expectedKey: MOCK_ENV.SUPABASE_ANON_KEY,
        callIndex: 0,
      },
    ])('$scenario', async ({ expectedUrl, expectedKey, callIndex }) => {
      mockCreateClient.mockReturnValue(MOCK_SUPABASE_CLIENT)

      await import('../index.js')

      expect(mockCreateClient).toHaveBeenNthCalledWith(
        callIndex + 1,
        expectedUrl,
        expectedKey
      )
    })
  })

  describe('serviceClient', () => {
    test.each([
      {
        scenario: 'creates service client with correct URL and service role key',
        expectedUrl: MOCK_ENV.SUPABASE_URL,
        expectedKey: MOCK_ENV.SUPABASE_SERVICE_ROLE_KEY,
        callIndex: 1,
      },
    ])('$scenario', async ({ expectedUrl, expectedKey, callIndex }) => {
      mockCreateClient.mockReturnValue(MOCK_SERVICE_CLIENT)

      await import('../index.js')

      expect(mockCreateClient).toHaveBeenNthCalledWith(
        callIndex + 1,
        expectedUrl,
        expectedKey
      )
    })
  })

  describe('exports', () => {
    test('exports both supabase and serviceClient', async () => {
      mockCreateClient
        .mockReturnValueOnce(MOCK_SUPABASE_CLIENT)
        .mockReturnValueOnce(MOCK_SERVICE_CLIENT)

      const module = await import('../index.js')

      expect(module.supabase).toBeDefined()
      expect(module.serviceClient).toBeDefined()
    })

    test('createClient is called exactly twice (once for each client)', async () => {
      mockCreateClient
        .mockReturnValueOnce(MOCK_SUPABASE_CLIENT)
        .mockReturnValueOnce(MOCK_SERVICE_CLIENT)

      await import('../index.js')

      expect(mockCreateClient).toHaveBeenCalledTimes(2)
    })
  })
})
