import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { RouterView } from 'vue-router'
import App from '../App.vue'

// Mock the vue-router module
vi.mock('vue-router', () => ({
  RouterView: {
    name: 'RouterView',
    template: '<div data-testid="router-view">RouterView Component</div>'
  }
}))

describe('App', () => {
  it('renders the component', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })

  it('includes the RouterView component', () => {
    const wrapper = mount(App)
    const routerView = wrapper.findComponent(RouterView)
    expect(routerView.exists()).toBe(true)
  })

  it('renders only the RouterView component', () => {
    const wrapper = mount(App)
    expect(wrapper.findAll('*').length).toBe(1)
    expect(wrapper.findComponent(RouterView).exists()).toBe(true)
  })

  it('RouterView is the root element', () => {
    const wrapper = mount(App)
    // check why is it uppercase
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.element.dataset.testid).toBe('router-view')
  })
})
