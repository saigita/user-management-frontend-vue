import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from './HomeView.vue'
import UserList from '@/components/UserList.vue'

// Mock the UserList component
vi.mock('@/components/UserList.vue', () => ({
  default: {
    name: 'UserList',
    template: '<div data-testid="user-list">UserList Component</div>'
  }
}))

describe('HomeView', () => {
  it('renders the component', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.exists()).toBe(true)
  })

  it('contains a main element', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.find('main').exists()).toBe(true)
  })

  it('includes the UserList component', () => {
    const wrapper = mount(HomeView)
    const userList = wrapper.findComponent(UserList)
    expect(userList.exists()).toBe(true)
  })

  it('renders the UserList component inside the main element', () => {
    const wrapper = mount(HomeView)
    const main = wrapper.find('main')
    const userList = main.findComponent(UserList)
    expect(userList.exists()).toBe(true)
  })
})
