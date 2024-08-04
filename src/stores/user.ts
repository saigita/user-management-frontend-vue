import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Ref, ComputedRef } from 'vue'

import { API_SEED } from '@/constants/common'
import type { Filters, User } from '@/interfaces/userList'
import { debounce } from '@/utilities/common'
import userService from '@/services/user'
import { INCLUDE_FILTER } from '@/constants/userList'

interface UserTableData {
  id: string
  name: string
  email: string
  location: string
  registered_date: string
}

interface UserStore {
  users: Ref<User[]>
  filteredUsers: Ref<User[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  filters: Ref<Filters>
  searchQuery: Ref<string | undefined>
  fetchUsers: () => Promise<void>
  filterUsers: (searchQueryString?: string) => void
  usersTableData: ComputedRef<UserTableData[]>
}

export const useUserStore = defineStore('user', (): UserStore => {
  const users = ref<User[]>([])
  const filteredUsers = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<Filters>({
    seed: API_SEED,
    include: INCLUDE_FILTER,
    results: 40,
    page: 1
  })
  const searchQuery = ref<string>()

  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      const newUsers = await userService.fetchUsers(filters.value)
      if (newUsers.length > 0) {
        users.value = [...users.value, ...newUsers]
        filterUsers(searchQuery.value)
        if (filters.value.page) {
          filters.value.page++
        }
      }
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const filterUsersByNameAndEmail = (query: string) => {
    filteredUsers.value = users.value.filter(
      (user) =>
        user.name.first.toLowerCase().includes(query) ||
        user.name.last.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    )
  }

  const filterUsers = (searchQueryString?: string) => {
    if (!searchQueryString) {
      filteredUsers.value = users.value
      return
    }
    const query = searchQueryString.toLowerCase().trim()
    if (query === '') {
      filteredUsers.value = users.value
      return
    }
    filterUsersByNameAndEmail(query)
  }

  watch(
    searchQuery,
    debounce((newSearchQuery) => {
      filterUsers(newSearchQuery)
    }, 300)
  )

  const usersTableData = computed(() =>
    filteredUsers.value.map(({ login, name, location, email, registered }) => ({
      id: login.uuid,
      name: name.first + ' ' + name.last,
      email,
      location: location.city + ', ' + location.country,
      registered_date: new Date(registered.date).toDateString()
    }))
  )

  return {
    users,
    filteredUsers,
    loading,
    error,
    filters,
    searchQuery,
    fetchUsers,
    filterUsers,
    usersTableData
  }
})
