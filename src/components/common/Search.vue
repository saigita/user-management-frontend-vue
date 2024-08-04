<script setup lang="ts">
  interface SearchProps {
    searchQuery?: string
  }

  const props = defineProps<SearchProps>()

  const emit = defineEmits<{
    (e: 'update:searchQuery', value: string): void
  }>()

  const handleSearch = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:searchQuery', target.value)
  }
</script>

<template>
  <div class="search-container mb-5">
    <div class="relative">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          class="w-4 h-4 search-icon"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        :value="searchQuery"
        @input="handleSearch"
        type="search"
        placeholder="Search with name or email"
        class="bg-zinc-800 border-none border-0 text-sm text-white rounded-lg block w-full p-3 ps-10 input-box"
      />
    </div>
  </div>
</template>

<style scoped>
  .search-container .search-icon {
    color: var(--color-text-secondary);
  }

  .search-container .input-box::placeholder {
    color: var(--color-text);
  }

  .search-container .input-box:focus-visible {
    border-color: var(--color-text-secondary);
    box-shadow: none;
  }

  .search-container .input-box:focus {
    border-color: var(--color-text-secondary);
    box-shadow: none;
  }
</style>
