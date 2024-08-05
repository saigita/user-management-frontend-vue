import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createApp, type App as VueApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'

// Mock the modules
vi.mock('vue')
vi.mock('pinia')
vi.mock('@/router', () => ({ default: { install: vi.fn() } }))
vi.mock('@/App.vue', () => ({ default: { render: vi.fn() } }))

describe('Main app setup', () => {
  let app: VueApp

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks()

    // Mock createApp to return a minimal app object
    app = {
      use: vi.fn().mockReturnThis(),
      mount: vi.fn()
    } as unknown as VueApp
    vi.mocked(createApp).mockReturnValue(app)

    // Clear the module cache
    vi.resetModules()
  })

  afterEach(() => {
    // Clear all mocks after each test
    vi.clearAllMocks()
  })

  it('creates the app', async () => {
    await import('@/main')
    expect(createApp).toHaveBeenCalled()
  })

  it('uses Pinia', async () => {
    const mockPinia = { install: vi.fn() }
    vi.mocked(createPinia).mockReturnValue(mockPinia as any)

    await import('@/main')

    expect(createPinia).toHaveBeenCalled()
    expect(app.use).toHaveBeenCalledWith(mockPinia)
  })

  it('uses the router', async () => {
    await import('@/main')
    expect(app.use).toHaveBeenCalledWith(router)
  })

  it('mounts the app', async () => {
    await import('@/main')
    expect(app.mount).toHaveBeenCalledWith('#app')
  })
})
