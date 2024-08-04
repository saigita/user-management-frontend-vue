import HttpService from './http'
import type { Filters, User } from '@/interfaces/userList'

export class UserService extends HttpService {
  async fetchUsers(filters: Filters): Promise<User[]> {
    const params = {
      seed: filters.seed,
      inc: filters.include?.join(','),
      results: filters.results?.toString(),
      page: filters.page?.toString()
    }

    const response = await this.get<{ results: User[] }>('/api', params)
    return response.results
  }
}

const userService = new UserService(import.meta.env.VITE_API_BASE_URL)

export default userService
