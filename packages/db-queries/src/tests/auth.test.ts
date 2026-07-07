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
  resetEmailSuccess: {
    data: {},
    error: null,
  },
  updateUserSuccess: {
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
  const mockResetPasswordForEmail = vi.fn()
  const mockUpdateUserById = vi.fn()

  return {
    supabase: {
      auth: {
        signUp: mockSignUp,
        signInWithPassword: mockSignInWithPassword,
        resetPasswordForEmail: mockResetPasswordForEmail,
      },
    },
    serviceClient: {
      auth: {
        getUser: mockGetUser,
        admin: {
          updateUserById: mockUpdateUserById,
        },
      },
    },
    __mocks: { mockSignUp, mockSignInWithPassword, mockGetUser, mockResetPasswordForEmail, mockUpdateUserById },
  }
})

const { mockSignUp, mockSignInWithPassword, mockGetUser, mockResetPasswordForEmail, mockUpdateUserById } = (
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

  describe('sendPasswordResetEmail', () => {
    test.each([
      {
        scenario: 'sends reset email successfully',
        input: { email: 'test@example.com', redirectTo: 'https://www.saedra.pro/reset-password' },
        mockResponse: MOCK_RESPONSES.resetEmailSuccess,
        expected: MOCK_RESPONSES.resetEmailSuccess,
      },
      {
        scenario: 'returns error when email is invalid',
        input: { email: 'not-an-email', redirectTo: 'https://www.saedra.pro/reset-password' },
        mockResponse: { data: null, error: { message: 'Invalid email', code: 'invalid_email' } },
        expected: { data: null, error: { message: 'Invalid email', code: 'invalid_email' } },
      },
    ])('$scenario', async ({ input, mockResponse, expected }) => {
      mockResetPasswordForEmail.mockResolvedValue(mockResponse)

      const result = await LoginDB.sendPasswordResetEmail(input.email, input.redirectTo)

      expect(mockResetPasswordForEmail).toHaveBeenCalledWith(input.email, { redirectTo: input.redirectTo })
      expect(result).toEqual(expected)
    })
  })

  describe('updatePasswordWithToken', () => {
    test('updates password successfully when token is valid', async () => {
      mockGetUser.mockResolvedValue(MOCK_RESPONSES.validateSuccess)
      mockUpdateUserById.mockResolvedValue(MOCK_RESPONSES.updateUserSuccess)

      const result = await LoginDB.updatePasswordWithToken('valid-token', 'new-password123')

      expect(mockGetUser).toHaveBeenCalledWith('valid-token')
      expect(mockUpdateUserById).toHaveBeenCalledWith(MOCK_USER.id, { password: 'new-password123' })
      expect(result).toEqual(MOCK_RESPONSES.updateUserSuccess)
    })

    test('returns error without calling admin API when token is invalid', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: MOCK_ERRORS.invalidToken })

      const result = await LoginDB.updatePasswordWithToken('invalid-token', 'new-password123')

      expect(mockGetUser).toHaveBeenCalledWith('invalid-token')
      expect(mockUpdateUserById).not.toHaveBeenCalled()
      expect(result).toEqual({ data: null, error: MOCK_ERRORS.invalidToken })
    })
  })
})
