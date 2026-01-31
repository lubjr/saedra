import { describe, test, expect, vi, beforeEach } from 'vitest'
import { LoginDB } from '../auth.js'

const MOCK_USER = {
  id: 'user-123',
  email: 'test@example.com',
  aud: 'authenticated',
}

const MOCK_SESSION = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
}

const MOCK_RESPONSES = {
  signUpSuccess: {
    data: { user: MOCK_USER, session: MOCK_SESSION },
    error: null,
  },
  signInSuccess: {
    data: { user: MOCK_USER, session: MOCK_SESSION },
    error: null,
  },
  validateSuccess: {
    data: { user: MOCK_USER },
    error: null,
  },
}

const MOCK_ERRORS = {
  invalidCredentials: { message: 'Invalid login credentials', code: 'invalid_credentials' },
  emailTaken: { message: 'User already registered', code: 'user_already_exists' },
  invalidToken: { message: 'Invalid token', code: 'invalid_token' },
}

vi.mock('@repo/db-connector/db', () => {
  const mockSignUp = vi.fn()
  const mockSignInWithPassword = vi.fn()
  const mockGetUser = vi.fn()

  return {
    supabase: {
      auth: {
        signUp: mockSignUp,
        signInWithPassword: mockSignInWithPassword,
      },
    },
    serviceClient: {
      auth: {
        getUser: mockGetUser,
      },
    },
    __mocks: { mockSignUp, mockSignInWithPassword, mockGetUser },
  }
})

const { mockSignUp, mockSignInWithPassword, mockGetUser } = (
  await vi.importMock('@repo/db-connector/db') as any
).__mocks

describe('LoginDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signUpUser', () => {
    test.each([
      {
        scenario: 'signs up user successfully',
        input: { email: 'test@example.com', password: 'password123' },
        mockResponse: MOCK_RESPONSES.signUpSuccess,
        expected: MOCK_RESPONSES.signUpSuccess,
      },
      {
        scenario: 'returns error when email is already taken',
        input: { email: 'existing@example.com', password: 'password123' },
        mockResponse: { data: { user: null, session: null }, error: MOCK_ERRORS.emailTaken },
        expected: { data: { user: null, session: null }, error: MOCK_ERRORS.emailTaken },
      },
    ])('$scenario', async ({ input, mockResponse, expected }) => {
      mockSignUp.mockResolvedValue(mockResponse)

      const result = await LoginDB.signUpUser(input.email, input.password)

      expect(mockSignUp).toHaveBeenCalledWith({ email: input.email, password: input.password })
      expect(result).toEqual(expected)
    })
  })

  describe('signInUser', () => {
    test.each([
      {
        scenario: 'signs in user successfully',
        input: { email: 'test@example.com', password: 'password123' },
        mockResponse: MOCK_RESPONSES.signInSuccess,
        expected: MOCK_RESPONSES.signInSuccess,
      },
      {
        scenario: 'returns error when credentials are invalid',
        input: { email: 'test@example.com', password: 'wrongpassword' },
        mockResponse: { data: { user: null, session: null }, error: MOCK_ERRORS.invalidCredentials },
        expected: { data: { user: null, session: null }, error: MOCK_ERRORS.invalidCredentials },
      },
    ])('$scenario', async ({ input, mockResponse, expected }) => {
      mockSignInWithPassword.mockResolvedValue(mockResponse)

      const result = await LoginDB.signInUser(input.email, input.password)

      expect(mockSignInWithPassword).toHaveBeenCalledWith({ email: input.email, password: input.password })
      expect(result).toEqual(expected)
    })
  })

  describe('validateToken', () => {
    test.each([
      {
        scenario: 'validates token successfully',
        token: 'valid-token',
        mockResponse: MOCK_RESPONSES.validateSuccess,
        expected: MOCK_RESPONSES.validateSuccess,
      },
      {
        scenario: 'returns error when token is invalid',
        token: 'invalid-token',
        mockResponse: { data: { user: null }, error: MOCK_ERRORS.invalidToken },
        expected: { data: { user: null }, error: MOCK_ERRORS.invalidToken },
      },
    ])('$scenario', async ({ token, mockResponse, expected }) => {
      mockGetUser.mockResolvedValue(mockResponse)

      const result = await LoginDB.validateToken(token)

      expect(mockGetUser).toHaveBeenCalledWith(token)
      expect(result).toEqual(expected)
    })
  })
})
