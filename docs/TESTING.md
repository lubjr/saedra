# Testing Guide - db-queries

Este documento explica como funcionam os testes unitários do pacote `@repo/db-queries`, como rodá-los e como criar novos testes.

## Table of Contents

- [Visão Geral](#visão-geral)
- [Executando os Testes](#executando-os-testes)
- [Estrutura dos Testes](#estrutura-dos-testes)
- [Padrões Utilizados](#padrões-utilizados)
- [Criando um Novo Teste](#criando-um-novo-teste)
- [Referência Rápida](#referência-rápida)

## Visão Geral

O pacote `db-queries` utiliza [Vitest](https://vitest.dev/) como framework de testes. Todos os testes são unitários e utilizam mocks para simular as respostas do Supabase, garantindo que os testes sejam rápidos e não dependam de uma conexão real com o banco de dados.

### Arquivos de Teste

```
packages/db-queries/src/tests/
├── auth.test.ts        # Testes de autenticação (login, signup, validação de token)
├── credentials.test.ts # Testes de credenciais AWS
├── diagrams.test.ts    # Testes de diagramas
├── profiles.test.ts    # Testes de perfis de usuário
└── projects.test.ts    # Testes de projetos
```

## Executando os Testes

### Comandos Disponíveis

```bash
# Rodar todos os testes uma vez
pnpm run test --filter=@repo/db-queries

# Rodar testes em modo watch (re-executa ao salvar)
pnpm run test:watch --filter=@repo/db-queries

# Ou navegue até o pacote
cd packages/db-queries
pnpm run test        # Executa uma vez
pnpm run test:watch  # Modo watch
```

### Configuração

O Vitest é configurado através do arquivo `vitest.config.ts`:

```ts
import { createConfig } from '@repo/vitest-config'

export default createConfig()
```

A configuração base vem do pacote `@repo/vitest-config`, garantindo consistência entre todos os pacotes do monorepo.

## Estrutura dos Testes

Todos os testes seguem uma estrutura consistente com quatro partes principais:

### 1. Mock Data (Dados de Teste)

Definimos constantes com dados de teste no início do arquivo:

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

### 2. Mock do Supabase

O Supabase é mockado usando `vi.mock()`, substituindo as funções reais por mocks controlados:

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

// Importa os mocks para uso nos testes
const { mockSignUp, mockSignInWithPassword } = (
  await vi.importMock('@repo/db-connector/db') as any
).__mocks
```

### 3. Describe Blocks

Os testes são organizados em blocos `describe` aninhados:

```ts
describe('LoginDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()  // Limpa os mocks entre cada teste
  })

  describe('signUpUser', () => {
    // testes de signUpUser
  })

  describe('signInUser', () => {
    // testes de signInUser
  })
})
```

### 4. Test Cases com `test.each`

Os testes utilizam `test.each` para parametrização, permitindo testar múltiplos cenários com a mesma estrutura:

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

## Padrões Utilizados

### Convenção de Nomenclatura

- Arquivos de teste: `<module>.test.ts`
- Mock data: `MOCK_<ENTITY>` ou `MOCK_<TYPE>S` (plural para listas)
- Mock errors: `MOCK_ERRORS`
- Mock responses: `MOCK_RESPONSES`

### Estrutura do Mock do Supabase

Para queries encadeadas do Supabase (como `supabase.from().select().eq()`), criamos mocks que retornam outros mocks:

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

### Padrão AAA (Arrange-Act-Assert)

Cada teste segue o padrão AAA:

```ts
test('exemplo', async () => {
  // Arrange: configura o mock
  mockSingle.mockResolvedValue(mockResponse)

  // Act: executa a função sendo testada
  const result = await ProfileDB.getProfileByUser(userId)

  // Assert: verifica o resultado
  expect(mockFrom).toHaveBeenCalledWith('profiles')
  expect(result).toEqual(expected)
})
```

### `beforeEach` para Limpeza

Sempre use `beforeEach` para limpar os mocks entre os testes:

```ts
beforeEach(() => {
  vi.clearAllMocks()
})
```

## Criando um Novo Teste

### Passo a Passo

1. **Crie o arquivo de teste** em `packages/db-queries/src/tests/<module>.test.ts`

2. **Importe as dependências do Vitest:**

```ts
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { SeuModuloDB } from '../seuModulo.js'
```

3. **Defina os mock data:**

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

4. **Configure o mock do Supabase:**

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

5. **Escreva os testes:**

```ts
describe('SeuModuloDB', () => {
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

      const result = await SeuModuloDB.getItemById(itemId)

      expect(mockFrom).toHaveBeenCalledWith('items')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('id', itemId)
      expect(result).toEqual(expected)
    })
  })
})
```

6. **Execute os testes:**

```bash
cd packages/db-queries
pnpm run test
```

### Template Completo

```ts
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { SeuModuloDB } from '../seuModulo.js'

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
describe('SeuModuloDB', () => {
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

      const result = await SeuModuloDB.getItemById(itemId)

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

      const result = await SeuModuloDB.insertItem(input.name)

      expect(mockFrom).toHaveBeenCalledWith('items')
      expect(mockInsert).toHaveBeenCalledWith({ name: input.name })
      expect(result).toEqual(expected)
    })
  })
})
```

## Referência Rápida

### Executar Testes

```bash
# Uma vez
pnpm run test --filter=@repo/db-queries

# Watch mode
pnpm run test:watch --filter=@repo/db-queries
```

### Importações Necessárias

```ts
import { describe, test, expect, vi, beforeEach } from 'vitest'
```

### Mock Básico do Supabase

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

### Funções do Vitest Mais Usadas

| Função | Descrição |
|--------|-----------|
| `vi.fn()` | Cria uma função mock |
| `vi.mock()` | Mocka um módulo inteiro |
| `vi.clearAllMocks()` | Limpa todos os mocks |
| `mockFn.mockResolvedValue()` | Define retorno de Promise |
| `mockFn.mockReturnValue()` | Define retorno síncrono |
| `expect().toEqual()` | Verifica igualdade profunda |
| `expect().toHaveBeenCalledWith()` | Verifica chamada com args |

## Related Documentation

- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guia geral de desenvolvimento
- [Vitest Documentation](https://vitest.dev/) - Documentação oficial do Vitest

---

**Last updated:** February 2026
