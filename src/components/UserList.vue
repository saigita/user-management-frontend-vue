<script setup lang="ts">
  import { ref, onMounted, reactive, computed, watch } from 'vue'

  import { API_BASE_URL, API_SEED } from '@/constants/common'
  import { USER_COLUMNS } from '@/constants/userList'
  import type { Filters, User } from '@/interfaces/userList'

  import Search from '@/components/common/Search.vue'
  import Table from '@/components/common/Table.vue'
  import { constructApiUrl, debounce } from '@/utilities/common'

  const users = ref<User[]>([])
  const filteredUsers = ref<User[]>([])
  const loading = ref(true)
  const error = ref(null)
  const filters = reactive<Filters>({
    seed: API_SEED,
    include: ['name', 'email', 'location', 'registered', 'login'],
    results: 40,
    page: 1
  })
  const searchQuery = ref<string>()

  const fetchUsers = async () => {
    loading.value = true
    try {
      const url = constructApiUrl(API_BASE_URL, filters)
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const responseJson = await response.json()
      if (responseJson.results.length > 0) {
        users.value = [...users.value, ...responseJson.results]
        filterUsers(searchQuery.value)
        if (filters.page) {
          filters.page++
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

  onMounted(fetchUsers)
</script>

<template>
  <div class="users-container">
    <h2 class="mb-4">Users</h2>
    <Search v-model:searchQuery="searchQuery" />
    <div v-if="error">{{ error }}</div>
    <Table
      :columns="USER_COLUMNS"
      :data="usersTableData"
      :loading="loading"
      :fetchData="fetchUsers"
    />
  </div>
</template>

<style scoped>
  .users-container h2 {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text-secondary);
  }
</style>
