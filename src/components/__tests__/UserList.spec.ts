import { nextTick } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import { useUserStore } from '@/stores/user'
import { USER_COLUMNS } from '@/constants/userList'

import Search from '@/components/common/Search.vue'
import Table from '@/components/common/Table.vue'

import UserList from '../UserList.vue'

describe('UserList', () => {
  let wrapper: any
  let userStore: any

  beforeEach(() => {
    wrapper = mount(UserList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
    userStore = useUserStore()
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
    expect(table.props('fetchData')).toBe(userStore.fetchUsers)
  })

  it('calls fetchUsers on mount', () => {
    expect(userStore.fetchUsers).toHaveBeenCalledOnce()
  })

  it('displays error message when error exists', async () => {
    userStore.error = 'Error fetching users'
    await nextTick()
    const errorMessage = wrapper.find('[data-testid="error-message"]')
    expect(errorMessage.exists()).toBe(true)
    expect(errorMessage.text()).toBe('Error fetching users')
  })

  it('debounces filterUsers call when searchQuery changes', async () => {
    vi.useFakeTimers()
    const searchQuery = 'test'

    userStore.searchQuery = searchQuery
    await nextTick()

    expect(userStore.filterUsers).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)

    expect(userStore.filterUsers).toHaveBeenCalledTimes(1)
    expect(userStore.filterUsers).toHaveBeenCalledWith(searchQuery)
  })
})
