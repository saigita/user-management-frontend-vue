import type { Filters } from '@/interfaces/userList'

export const constructApiUrl = (baseUrl: string, filters: Filters): string => {
  const params = new URLSearchParams()
  if (filters.seed) {
    params.append('seed', filters.seed)
  }

  if (filters.include && filters.include.length > 0) {
    params.append('inc', filters.include.join(','))
  }

  if (filters.results) {
    params.append('results', filters.results.toString())
  }

  if (filters.page) {
    params.append('page', filters.page.toString())
  }

  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}
