import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { userService } from '@/services/user'
import { API_SEED } from '@/constants/common'
import { INCLUDE_FILTER } from '@/constants/userList'

import { useUserStore } from './user'

vi.mock('@/services/user', () => ({
  userService: {
    fetchUsers: vi.fn()
  }
}))

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with correct default values', () => {
    const store = useUserStore()
    expect(store.users).toEqual([])
    expect(store.filteredUsers).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
    expect(store.filters).toEqual({
      seed: API_SEED,
      include: INCLUDE_FILTER,
      results: 40,
      page: 1
    })
    expect(store.searchQuery).toBeUndefined()
  })

  it('fetchUsers updates store correctly on success', async () => {
    const mockUsers = [
      {
        name: { first: 'John', last: 'Doe' },
        email: 'john@example.com',
        location: { city: 'New York', country: 'USA' },
        login: { uuid: '123' },
        registered: { date: '2023-01-01' }
      },
      {
        name: { first: 'Jane', last: 'Doe' },
        email: 'jane@example.com',
        location: { city: 'London', country: 'UK' },
        login: { uuid: '456' },
        registered: { date: '2023-02-01' }
      }
    ]
    vi.mocked(userService.fetchUsers).mockResolvedValue(mockUsers)

    const store = useUserStore()
    await store.fetchUsers()

    expect(store.users).toEqual(mockUsers)
    expect(store.filteredUsers).toEqual(mockUsers)
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
    expect(store.filters.page).toBe(2)
  })

  it('fetchUsers handles errors correctly', async () => {
    const errorMessage = 'Network error'
    vi.mocked(userService.fetchUsers).mockRejectedValue(new Error(errorMessage))

    const store = useUserStore()
    await store.fetchUsers()

    expect(store.loading).toBe(false)
    expect(store.error).toBe(errorMessage)
  })

  it('filterUsers filters users correctly', () => {
    const store = useUserStore()
    store.users = [
      {
        name: { first: 'John', last: 'Doe' },
        email: 'john@example.com',
        location: { city: 'New York', country: 'USA' },
        login: { uuid: '123' },
        registered: { date: '2023-01-01' }
      },
      {
        name: { first: 'Jane', last: 'Doe' },
        email: 'jane@example.com',
        location: { city: 'London', country: 'UK' },
        login: { uuid: '456' },
        registered: { date: '2023-02-01' }
      }
    ]

    store.filterUsers('john')
    expect(store.filteredUsers).toHaveLength(1)
    expect(store.filteredUsers[0].name.first).toBe('John')

    store.filterUsers('doe')
    expect(store.filteredUsers).toHaveLength(2)

    store.filterUsers('nonexistent')
    expect(store.filteredUsers).toHaveLength(0)
  })

  it('usersTableData computes correctly', () => {
    const store = useUserStore()
    store.filteredUsers = [
      {
        name: { first: 'John', last: 'Doe' },
        email: 'john@example.com',
        location: { city: 'New York', country: 'USA' },
        login: { uuid: '123' },
        registered: { date: '2023-01-01' }
      }
    ]

    const tableData = store.usersTableData
    expect(tableData).toHaveLength(1)
    expect(tableData[0]).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      location: 'New York, USA',
      registered_date: new Date('2023-01-01').toDateString()
    })
  })
})
