import { httpService } from './http'
import type { Filters, User } from '@/interfaces/userList'

export const userService = {
  async fetchUsers(filters: Filters): Promise<User[]> {
    const params = {
      seed: filters.seed,
      inc: filters.include?.join(','),
      results: filters.results?.toString(),
      page: filters.page?.toString()
    }

    const response = await httpService.get<{ results: User[] }>('/api', params)
    return response.results
  }
}
