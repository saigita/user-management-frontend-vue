import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { Filters } from '@/interfaces/userList'
import { UserService } from '../user'

describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService('https://api.example.com')
    vi.spyOn(userService, 'get').mockImplementation(() => Promise.resolve({ results: [] }))
  })

  describe('fetchUsers', () => {
    it('should call get with correct parameters', async () => {
      const mockFilters: Filters = {
        seed: 'abc123',
        include: ['name', 'email'],
        results: 10,
        page: 1
      }

      const mockResponse = {
        results: [
          { id: '1', name: 'John Doe', email: 'john@example.com' },
          { id: '2', name: 'Jane Doe', email: 'jane@example.com' }
        ]
      }

      vi.mocked(userService.get).mockResolvedValue(mockResponse)

      const result = await userService.fetchUsers(mockFilters)

      expect(userService.get).toHaveBeenCalledWith('/api', {
        seed: 'abc123',
        inc: 'name,email',
        results: '10',
        page: '1'
      })

      expect(result).toEqual(mockResponse.results)
    })

    it('should handle filters with undefined values', async () => {
      const mockFilters: Filters = {
        seed: 'abc123'
      }

      const mockResponse = {
        results: [{ id: '1', name: 'John Doe', email: 'john@example.com' }]
      }

      vi.mocked(userService.get).mockResolvedValue(mockResponse)

      await userService.fetchUsers(mockFilters)

      expect(userService.get).toHaveBeenCalledWith('/api', {
        seed: 'abc123',
        inc: undefined,
        results: undefined,
        page: undefined
      })
    })

    it('should handle empty response', async () => {
      const mockFilters: Filters = {
        seed: 'abc123'
      }

      const mockResponse = {
        results: []
      }

      vi.mocked(userService.get).mockResolvedValue(mockResponse)

      const result = await userService.fetchUsers(mockFilters)

      expect(result).toEqual([])
    })

    it('should throw an error if get fails', async () => {
      const mockFilters: Filters = {
        seed: 'abc123'
      }

      vi.mocked(userService.get).mockRejectedValue(new Error('Network error'))

      await expect(userService.fetchUsers(mockFilters)).rejects.toThrow('Network error')
    })
  })
})
