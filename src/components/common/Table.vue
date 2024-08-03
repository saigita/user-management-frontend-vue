<script setup lang="ts">
  import { ref } from 'vue'

  import type { Column } from '../../interfaces/common'

  interface TableProps {
    columns: Column[]
    data: any[]
    loading: boolean
    fetchData: () => void
  }

  const props = defineProps<TableProps>()

  const tableContainer = ref<HTMLElement | null>(null)

  const loadMoreData = async () => {
    if (props.loading) return
    props.fetchData()
  }

  const handleScroll = () => {
    if (!tableContainer.value) return

    const { scrollTop, scrollHeight, clientHeight } = tableContainer.value
    if (scrollTop + clientHeight >= scrollHeight - 40) {
      // 20px before the end
      loadMoreData()
    }
  }
</script>

<template>
  <div class="table-container overflow-auto rounded-lg" @scroll="handleScroll" ref="tableContainer">
    <table class="w-full text-sm text-left rtl:text-right table-fixed">
      <thead class="text-xs uppercase bg-zinc-800 sticky top-0">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            class="px-6 py-3 font-semibold"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-gray-500 bg-opacity-5">
        <tr
          v-for="(row, index) in data"
          :key="row.id"
          :class="[
            'hover:bg-gray-400 hover:bg-opacity-5',
            { 'border-b border-gray-700': index !== data.length - 1 }
          ]"
        >
          <td v-for="column in columns" :key="column.key" class="px-6 py-4">
            {{ row[column.key] }}
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="loading"
      :class="[{ 'initial-loading': data.length === 0, 'loading-more': data.length > 0 }]"
    >
      Loading . . .
    </div>
  </div>
</template>

<style scoped>
  .table-container {
    height: 600px;
    min-width: 1000px;
  }

  .table-container thead {
    color: var(--color-text-secondary);
  }

  .initial-loading {
    height: 600px;
    text-align: center;
    margin: 20px;
  }

  .loading-more {
    text-align: center;
    padding: 10px;
  }
</style>
