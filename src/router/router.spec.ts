import { describe, it, expect, vi } from 'vitest'
import type { RouteRecordRaw, RouteComponent } from 'vue-router'
import router from './index'

// Mock the import.meta.env.BASE_URL
vi.mock('import.meta', () => ({
  env: {
    BASE_URL: '/base'
  }
}))

// Mock the lazy-loaded component
vi.mock('../views/HomeView.vue', () => ({
  default: { name: 'HomeView' }
}))

describe('Router', () => {
  it('creates a router instance', () => {
    expect(router).toBeDefined()
    expect(router.options.history).toBeDefined()
    expect(router.options.routes).toBeDefined()
  })

  //   it('uses web history mode', () => {
  //     expect(router.options.history.base).toBe('/base')
  //   })

  it('defines the correct routes', () => {
    const routes = router.options.routes
    expect(routes).toHaveLength(1)

    const homeRoute = routes[0] as RouteRecordRaw
    expect(homeRoute.path).toBe('/')
    expect(homeRoute.name).toBe('home')
  })

  it('uses lazy loading for the home route', async () => {
    const routes = router.options.routes
    const homeRoute = routes[0] as RouteRecordRaw

    expect(typeof homeRoute.component).toBe('function')

    if (typeof homeRoute.component === 'function') {
      const lazyLoadFn = homeRoute.component as () => Promise<{ default: RouteComponent }>
      const module = await lazyLoadFn()
      expect(module.default).toEqual({ name: 'HomeView' })
    }
  })
})
