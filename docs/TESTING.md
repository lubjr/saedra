# Testing Guide - db-queries

This document explains how unit tests work in the `@repo/db-queries` package, how to run them, and how to create new tests.

## Table of Contents

- [Overview](#overview)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Patterns Used](#patterns-used)
- [Creating a New Test](#creating-a-new-test)
- [Quick Reference](#quick-reference)

## Overview

The `db-queries` package uses [Vitest](https://vitest.dev/) as its testing framework. All tests are unit tests that use mocks to simulate Supabase responses, ensuring tests are fast and don't require a real database connection.

### Test Files

```
packages/db-queries/src/tests/
├── auth.test.ts        # Authentication tests (login, signup, token validation)
├── credentials.test.ts # AWS credentials tests
├── diagrams.test.ts    # Diagram tests
├── profiles.test.ts    # User profile tests
└── projects.test.ts    # Project tests
```

## Running Tests

### Available Commands

```bash
# Run all tests once
pnpm run test --filter=@repo/db-queries

# Run tests in watch mode (re-runs on save)
pnpm run test:watch --filter=@repo/db-queries

# Or navigate to the package
cd packages/db-queries
pnpm run test        # Run once
pnpm run test:watch  # Watch mode
```

### Configuration

Vitest is configured through the `vitest.config.ts` file:

```ts
import { createConfig } from '@repo/vitest-config'

export default createConfig()
```

The base configuration comes from the `@repo/vitest-config` package, ensuring consistency across all monorepo packages.

## Test Structure

All tests follow a consistent structure with four main parts:

### 1. Mock Data

We define test data constants at the beginning of each file:

```ts
const MOCK_USER = {
  id: 'user-123',
  email: 'test@example.com',
  aud: 'authenticated',
}

const MOCK_ERRORS = {
  invalidCredentials: { message: 'Invalid login credentials', code: 'invalid_credentials' },
  emailTaken: { message: 'User already registered', code: 'user_already_exists' },
}

const MOCK_RESPONSES = {
  signUpSuccess: {
    data: { user: MOCK_USER, session: MOCK_SESSION },
    error: null,
  },
}
```

### 2. Supabase Mock

Supabase is mocked using `vi.mock()`, replacing real functions with controlled mocks:

```ts
vi.mock('@repo/db-connector/db', () => {
  const mockSignUp = vi.fn()
  const mockSignInWithPassword = vi.fn()

  return {
    supabase: {
      auth: {
        signUp: mockSignUp,
        signInWithPassword: mockSignInWithPassword,
      },
    },
    __mocks: { mockSignUp, mockSignInWithPassword },
  }
})

// Import mocks for use in tests
const { mockSignUp, mockSignInWithPassword } = (
  await vi.importMock('@repo/db-connector/db') as any
).__mocks
```

### 3. Describe Blocks

Tests are organized in nested `describe` blocks:

```ts
describe('LoginDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()  // Clear mocks between each test
  })

  describe('signUpUser', () => {
    // signUpUser tests
  })

  describe('signInUser', () => {
    // signInUser tests
  })
})
```

### 4. Test Cases with `test.each`

Tests use `test.each` for parameterization, allowing multiple scenarios to be tested with the same structure:

```ts
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
```

## Patterns Used

### Naming Conventions

- Test files: `<module>.test.ts`
- Mock data: `MOCK_<ENTITY>` or `MOCK_<TYPE>S` (plural for lists)
- Mock errors: `MOCK_ERRORS`
- Mock responses: `MOCK_RESPONSES`

### Supabase Mock Structure

For chained Supabase queries (like `supabase.from().select().eq()`), we create mocks that return other mocks:

```ts
vi.mock('@repo/db-connector/db', () => {
  const mockSingle = vi.fn()
  const mockEq = vi.fn(() => ({ single: mockSingle }))
  const mockSelect = vi.fn(() => ({ eq: mockEq }))
  const mockFrom = vi.fn(() => ({ select: mockSelect }))

  return {
    supabase: { from: mockFrom },
    __mocks: { mockFrom, mockSelect, mockEq, mockSingle },
  }
})
```

### AAA Pattern (Arrange-Act-Assert)

Each test follows the AAA pattern:

```ts
test('example', async () => {
  // Arrange: set up the mock
  mockSingle.mockResolvedValue(mockResponse)

  // Act: execute the function being tested
  const result = await ProfileDB.getProfileByUser(userId)

  // Assert: verify the result
  expect(mockFrom).toHaveBeenCalledWith('profiles')
  expect(result).toEqual(expected)
})
```

### `beforeEach` for Cleanup

Always use `beforeEach` to clear mocks between tests:

```ts
beforeEach(() => {
  vi.clearAllMocks()
})
```

## Creating a New Test

### Step by Step

1. **Create the test file** at `packages/db-queries/src/tests/<module>.test.ts`

2. **Import Vitest dependencies:**

```ts
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { YourModuleDB } from '../yourModule.js'
```

3. **Define mock data:**

```ts
const MOCK_ITEMS = {
  valid: {
    id: 'item-123',
    name: 'Test Item',
  },
  created: {
    id: 'item-456',
    name: 'New Item',
  },
}

const MOCK_ERRORS = {
  notFound: { message: 'Item not found', code: 'PGRST116' },
}
```

4. **Set up the Supabase mock:**

```ts
vi.mock('@repo/db-connector/db', () => {
  const mockSingle = vi.fn()
  const mockEq = vi.fn(() => ({ single: mockSingle }))
  const mockSelect = vi.fn(() => ({ eq: mockEq }))
  const mockFrom = vi.fn(() => ({ select: mockSelect }))

  return {
    supabase: { from: mockFrom },
    __mocks: { mockFrom, mockSelect, mockEq, mockSingle },
  }
})

const { mockFrom, mockSelect, mockEq, mockSingle } = (
  await vi.importMock('@repo/db-connector/db') as any
).__mocks
```

5. **Write the tests:**

```ts
describe('YourModuleDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getItemById', () => {
    test.each([
      {
        scenario: 'returns item when it exists',
        itemId: 'item-123',
        mockResponse: { data: MOCK_ITEMS.valid, error: null },
        expected: { data: MOCK_ITEMS.valid, error: null },
      },
      {
        scenario: 'returns error when item does not exist',
        itemId: 'non-existent',
        mockResponse: { data: null, error: MOCK_ERRORS.notFound },
        expected: { data: null, error: MOCK_ERRORS.notFound },
      },
    ])('$scenario', async ({ itemId, mockResponse, expected }) => {
      mockSingle.mockResolvedValue(mockResponse)

      const result = await YourModuleDB.getItemById(itemId)

      expect(mockFrom).toHaveBeenCalledWith('items')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('id', itemId)
      expect(result).toEqual(expected)
    })
  })
})
```

6. **Run the tests:**

```bash
cd packages/db-queries
pnpm run test
```

### Complete Template

```ts
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { YourModuleDB } from '../yourModule.js'

// ============================================
// Mock Data
// ============================================
const MOCK_ITEMS = {
  valid: { id: 'item-123', name: 'Test Item' },
  created: { id: 'item-456', name: 'New Item' },
  list: [
    { id: 'item-123', name: 'Item 1' },
    { id: 'item-456', name: 'Item 2' },
  ],
}

const MOCK_ERRORS = {
  notFound: { message: 'Item not found', code: 'PGRST116' },
  insertFailed: { message: 'Insert failed', code: 'PGRST204' },
}

// ============================================
// Mock Setup
// ============================================
vi.mock('@repo/db-connector/db', () => {
  const mockSingle = vi.fn()
  const mockEq = vi.fn(() => ({ single: mockSingle }))
  const mockSelect = vi.fn(() => ({ eq: mockEq }))
  const mockInsert = vi.fn(() => ({ select: () => ({ single: mockSingle }) }))
  const mockFrom = vi.fn(() => ({ select: mockSelect, insert: mockInsert }))

  return {
    supabase: { from: mockFrom },
    __mocks: { mockFrom, mockSelect, mockEq, mockInsert, mockSingle },
  }
})

const { mockFrom, mockSelect, mockEq, mockInsert, mockSingle } = (
  await vi.importMock('@repo/db-connector/db') as any
).__mocks

// ============================================
// Tests
// ============================================
describe('YourModuleDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getItemById', () => {
    test.each([
      {
        scenario: 'returns item when it exists',
        itemId: 'item-123',
        mockResponse: { data: MOCK_ITEMS.valid, error: null },
        expected: { data: MOCK_ITEMS.valid, error: null },
      },
      {
        scenario: 'returns error when item does not exist',
        itemId: 'non-existent',
        mockResponse: { data: null, error: MOCK_ERRORS.notFound },
        expected: { data: null, error: MOCK_ERRORS.notFound },
      },
    ])('$scenario', async ({ itemId, mockResponse, expected }) => {
      mockSingle.mockResolvedValue(mockResponse)

      const result = await YourModuleDB.getItemById(itemId)

      expect(mockFrom).toHaveBeenCalledWith('items')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('id', itemId)
      expect(result).toEqual(expected)
    })
  })

  describe('insertItem', () => {
    test.each([
      {
        scenario: 'creates item successfully',
        input: { name: 'New Item' },
        mockResponse: { data: MOCK_ITEMS.created, error: null },
        expected: { data: MOCK_ITEMS.created, error: null },
      },
      {
        scenario: 'returns error when insert fails',
        input: { name: 'New Item' },
        mockResponse: { data: null, error: MOCK_ERRORS.insertFailed },
        expected: { data: null, error: MOCK_ERRORS.insertFailed },
      },
    ])('$scenario', async ({ input, mockResponse, expected }) => {
      mockSingle.mockResolvedValue(mockResponse)

      const result = await YourModuleDB.insertItem(input.name)

      expect(mockFrom).toHaveBeenCalledWith('items')
      expect(mockInsert).toHaveBeenCalledWith({ name: input.name })
      expect(result).toEqual(expected)
    })
  })
})
```

## Quick Reference

### Running Tests

```bash
# Once
pnpm run test --filter=@repo/db-queries

# Watch mode
pnpm run test:watch --filter=@repo/db-queries
```

### Required Imports

```ts
import { describe, test, expect, vi, beforeEach } from 'vitest'
```

### Basic Supabase Mock

```ts
vi.mock('@repo/db-connector/db', () => {
  const mockSingle = vi.fn()
  const mockEq = vi.fn(() => ({ single: mockSingle }))
  const mockSelect = vi.fn(() => ({ eq: mockEq }))
  const mockFrom = vi.fn(() => ({ select: mockSelect }))

  return {
    supabase: { from: mockFrom },
    __mocks: { mockFrom, mockSelect, mockEq, mockSingle },
  }
})
```

### Most Used Vitest Functions

| Function | Description |
|----------|-------------|
| `vi.fn()` | Creates a mock function |
| `vi.mock()` | Mocks an entire module |
| `vi.clearAllMocks()` | Clears all mocks |
| `mockFn.mockResolvedValue()` | Sets Promise return value |
| `mockFn.mockReturnValue()` | Sets synchronous return value |
| `expect().toEqual()` | Checks deep equality |
| `expect().toHaveBeenCalledWith()` | Verifies call with arguments |

## Related Documentation

- [DEVELOPMENT.md](./DEVELOPMENT.md) - General development guide
- [Vitest Documentation](https://vitest.dev/) - Official Vitest documentation

---

**Last updated:** February 2026
