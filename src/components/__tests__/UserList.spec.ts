import { nextTick, ref } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import { useUserStore } from '@/stores/user'
import { USER_COLUMNS } from '@/constants/userList'

import Search from '@/components/common/Search.vue'
import Table from '@/components/common/Table.vue'

import UserList from '../UserList.vue'

vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn()
}))

describe('UserList', () => {
  let wrapper: any
  let mockStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    mockStore = {
      loading: ref(false),
      error: ref(null),
      searchQuery: ref(''),
      usersTableData: ref([]),
      fetchUsers: vi.fn()
    }
    vi.mocked(useUserStore).mockReturnValue(mockStore)
    wrapper = mount(UserList)
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('Users')
  })

  it('renders Search component', () => {
    expect(wrapper.findComponent(Search).exists()).toBe(true)
  })

  it('renders Table component with correct props', () => {
    const table = wrapper.findComponent(Table)
    expect(table.exists()).toBe(true)
    expect(table.props('columns')).toBe(USER_COLUMNS)
    expect(table.props('data')).toStrictEqual([])
    expect(table.props('loading')).toBe(false)
    expect(table.props('fetchData')).toBe(mockStore.fetchUsers)
  })

  it('calls fetchUsers on mount', () => {
    expect(mockStore.fetchUsers).toHaveBeenCalledOnce()
  })

  it('displays error message when error exists', async () => {
    mockStore.error.value = 'Error fetching users'
    await nextTick()
    const errorMessage = wrapper.find('[data-testid="error-message"]')
    expect(errorMessage.exists()).toBe(true)
    expect(errorMessage.text()).toBe('Error fetching users')
  })

  it('updates searchQuery when Search component emits update', async () => {
    const search = wrapper.findComponent(Search)
    await search.vm.$emit('update:searchQuery', 'John')
    expect(mockStore.searchQuery.value).toBe('John')
  })
})
