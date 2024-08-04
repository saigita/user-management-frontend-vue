import { defineStore } from 'pinia'

import { API_SEED } from '@/constants/common'
import type { Filters, User } from '@/interfaces/userList'
import userService from '@/services/user'
import { INCLUDE_FILTER } from '@/constants/userList'

export interface UserTableData {
  id: string
  name: string
  email: string
  location: string
  registered_date: string
}

interface UserStoreState {
  users: User[]
  filteredUsers: User[]
  loading: boolean
  error: string | null
  filters: Filters
  searchQuery?: string
  // fetchUsers: () => Promise<void>
  // filterUsers: (searchQueryString?: string) => void
  // usersTableData: ComputedRef<UserTableData[]>
}

const filterUsersByNameAndEmail = (users: User[], query: string) => {
  return users.filter(
    (user) =>
      user.name.first.toLowerCase().includes(query) ||
      user.name.last.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  )
}

export const useUserStore = defineStore('user', {
  state: (): UserStoreState => {
    return {
      users: [],
      filteredUsers: [],
      loading: false,
      error: null,
      filters: {
        seed: API_SEED,
        include: INCLUDE_FILTER,
        results: 40,
        page: 1
      }
    }
  },
  getters: {
    getUserTableData(state): UserTableData[] {
      const usersTableData = state.filteredUsers.map(
        ({ login, name, location, email, registered }) => ({
          id: login.uuid,
          name: name.first + ' ' + name.last,
          email,
          location: location.city + ', ' + location.country,
          registered_date: new Date(registered.date).toDateString()
        })
      )
      return usersTableData
    }
  },
  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        const newUsers = await userService.fetchUsers(this.filters)
        if (newUsers.length > 0) {
          this.users = [...this.users, ...newUsers]
          this.filterUsers(this.searchQuery)
          if (this.filters.page) {
            this.filters.page++
          }
        }
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    filterUsers(searchQueryString?: string) {
      if (!searchQueryString) {
        this.filteredUsers = [...this.users]
        return
      }
      const query = searchQueryString.toLowerCase().trim()
      if (query === '') {
        this.filteredUsers = [...this.users]
        return
      }
      this.filteredUsers = filterUsersByNameAndEmail(this.users, query)
    }
  }
})
