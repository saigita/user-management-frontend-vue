<script setup lang="ts">
  import { computed, onMounted, watch } from 'vue'

  import { useUserStore } from '@/stores/user'
  import { USER_COLUMNS } from '@/constants/userList'

  import Search from '@/components/common/Search.vue'
  import Table from '@/components/common/Table.vue'
  import { debounce } from '@/utilities/common'

  const userStore = useUserStore()

  watch(
    () => userStore.searchQuery,
    debounce((newSearchQuery) => {
      userStore.filterUsers(newSearchQuery)
    }, 300)
  )

  const usersTableData = computed(() => userStore.getUserTableData)

  onMounted(userStore.fetchUsers)
</script>

<template>
  <div class="users-container">
    <h2 class="mb-4">Users</h2>
    <Search v-model:searchQuery="userStore.searchQuery" />
    <div v-if="userStore.error" data-testid="error-message">{{ userStore.error }}</div>
    <Table
      :columns="USER_COLUMNS"
      :data="usersTableData"
      :loading="userStore.loading"
      :fetchData="userStore.fetchUsers"
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
