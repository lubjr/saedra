import { defineConfig, type ViteUserConfig } from 'vitest/config'

export { defineConfig } from 'vitest/config'

export const baseConfig: ViteUserConfig = {
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'dist', '**/*.{test,spec}.{ts,tsx}'],
    },
    passWithNoTests: true,
  },
}

export function createConfig(overrides: ViteUserConfig = {}): ViteUserConfig {
  return defineConfig({
    ...baseConfig,
    ...overrides,
    test: {
      ...baseConfig.test,
      ...overrides.test,
    },
  })
}
