<script setup lang="ts">
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'

  import { useUserStore } from '@/stores/user'
  import { USER_COLUMNS } from '@/constants/userList'

  import Search from '@/components/common/Search.vue'
  import Table from '@/components/common/Table.vue'

  const userStore = useUserStore()
  const { loading, error, searchQuery, usersTableData } = storeToRefs(userStore)
  const { fetchUsers } = userStore

  onMounted(fetchUsers)

  console.log('usersTableData', usersTableData)
</script>

<template>
  <div class="users-container">
    <h2 class="mb-4">Users</h2>
    <Search v-model:searchQuery="searchQuery" />
    <div v-if="error" data-testid="error-message">{{ error }}</div>
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
