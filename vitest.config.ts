import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        exclude: [
          '**/node_modules/**',
          '**/dist/**',
          '**/e2e/**',
          '**/.{git,cache,output,temp}/**',
          '**/*.config.{js,ts}',
          '**/.eslintrc.cjs',
          '**/env.d.ts',
          '**/*.spec.{js,ts}',
          '**/__tests__/**',
          '**/constants/**',
          '**/interfaces/**'
        ]
      }
    }
  })
)
