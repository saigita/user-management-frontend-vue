import { describe, it, expect, vi, beforeEach } from 'vitest'
import HttpService from '../http'

describe('HttpService', () => {
  let httpService: HttpService
  const mockBaseUrl = 'https://api.example.com'

  beforeEach(() => {
    httpService = new HttpService(mockBaseUrl)
    global.fetch = vi.fn()
  })

  describe('constructUrl', () => {
    it('should construct URL without query params', () => {
      const url = (httpService as any).constructUrl('/users')
      expect(url).toBe('https://api.example.com/users')
    })

    it('should construct URL with query params', () => {
      const url = (httpService as any).constructUrl('/users', { id: 1, name: 'John' })
      expect(url).toBe('https://api.example.com/users?id=1&name=John')
    })

    // it('should handle null and undefined param values', () => {
    //   const url = (httpService as any).constructUrl('/users', { id: 1, name: null, age: undefined })
    //   expect(url).toBe('https://api.example.com/users?id=1')
    // })
  })

  describe('get', () => {
    it('should make a GET request', async () => {
      const mockResponse = { ok: true, status: 200, json: vi.fn().mockResolvedValue({ id: 1 }) }
      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      const result = await httpService.get('/users', { id: 1 })

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users?id=1',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      )
      expect(result).toEqual({ id: 1 })
    })
  })

  describe('error handling', () => {
    it('should throw an error for non-ok responses', async () => {
      const mockResponse = { ok: false, status: 404 }
      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await expect(httpService.get('/users')).rejects.toThrow('HTTP error! status: 404')
    })
  })
})
