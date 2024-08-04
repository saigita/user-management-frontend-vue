import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import SearchComponent from '@/components/common/Search.vue'

describe('SearchComponent', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(SearchComponent)
  })

  it('renders input field and svg icon', () => {
    expect(wrapper.find('input[type="search"]').exists()).toBe(true)
    expect(wrapper.find('svg.search-icon').exists()).toBe(true)
  })

  it('has correct placeholder text', () => {
    const input = wrapper.find('input[type="search"]')
    expect(input.attributes('placeholder')).toBe('Search with name or email')
  })

  it('has correct CSS classes applied', () => {
    const input = wrapper.find('input[type="search"]')
    expect(input.classes()).toContain('bg-zinc-800')
    expect(input.classes()).toContain('text-white')
    expect(input.classes()).toContain('rounded-lg')
  })

  it('emits update:searchQuery event on input change', async () => {
    const input = wrapper.find('input[type="search"]')
    await input.setValue('new search')

    expect(wrapper.emitted('update:searchQuery')).toBeTruthy()
    expect(wrapper.emitted('update:searchQuery')?.[0]).toEqual(['new search'])
  })

  it('sets the input value from searchQuery prop', async () => {
    await wrapper.setProps({ searchQuery: 'test query' })

    const input = wrapper.find('input[type="search"]')
    expect((input.element as HTMLInputElement).value).toBe('test query')
  })
})
