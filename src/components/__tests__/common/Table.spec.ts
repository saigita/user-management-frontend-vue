import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import Table from '@/components/common/Table.vue'

describe('Table Component', () => {
  let wrapper: VueWrapper
  const mockColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' }
  ]
  const mockData = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
  ]
  const mockFetchData = vi.fn()

  beforeEach(() => {
    mockFetchData.mockReset()

    wrapper = mount(Table, {
      props: {
        columns: mockColumns,
        data: mockData,
        loading: false,
        fetchData: mockFetchData
      }
    })
  })

  it('renders the table with correct structure', () => {
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('thead').exists()).toBe(true)
    expect(wrapper.find('tbody').exists()).toBe(true)
  })

  it('renders correct number of columns with proper labels', () => {
    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(mockColumns.length)
    headers.forEach((header, index) => {
      expect(header.text()).toBe(mockColumns[index].label)
    })
  })

  it('renders correct number of rows', () => {
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(mockData.length)
  })

  it('displays correct data in cells', () => {
    const firstRow = wrapper.findAll('tbody tr').at(0)
    expect(firstRow?.findAll('td').at(0)?.text()).toBe(mockData[0].id.toString())
    expect(firstRow?.findAll('td').at(1)?.text()).toBe(mockData[0].name)
  })

  it('shows initial loading state when loading is true and no data is present', async () => {
    await wrapper.setProps({ loading: true, data: [] })
    expect(wrapper.find('.initial-loading').exists()).toBe(true)
  })

  it('shows loading more state when loading is true and data is present', async () => {
    await wrapper.setProps({ loading: true })
    expect(wrapper.find('.loading-more').exists()).toBe(true)
  })

  it('calls fetchData when scrolled to bottom', async () => {
    const tableContainer = wrapper.find('.table-container').element

    Object.defineProperty(tableContainer, 'scrollHeight', { value: 2200 })
    Object.defineProperty(tableContainer, 'clientHeight', { value: 600 })
    tableContainer.scrollTop = 120

    await wrapper.find('.table-container').trigger('scroll')
    expect(mockFetchData).toHaveBeenCalled()
  })

  it('calls fetchData when scrolled to exact threshold', async () => {
    const longData = Array.from({ length: 11 }, (_, i) => ({ id: i, name: `Name ${i}` }))
    await wrapper.setProps({ data: longData })

    const tableContainer = wrapper.find('.table-container').element
    Object.defineProperty(tableContainer, 'scrollHeight', { value: 2100 })
    Object.defineProperty(tableContainer, 'clientHeight', { value: 600 })

    // Set scrollTop to exactly trigger the threshold
    tableContainer.scrollTop = 0

    await wrapper.find('.table-container').trigger('scroll')
    expect(mockFetchData).toHaveBeenCalledTimes(1)
  })

  it('does not call fetchData when scrolled just above threshold', async () => {
    const longData = Array.from({ length: 11 }, (_, i) => ({ id: i, name: `Name ${i}` }))
    await wrapper.setProps({ data: longData })

    const tableContainer = wrapper.find('.table-container').element
    Object.defineProperty(tableContainer, 'scrollHeight', { value: 2200 })
    Object.defineProperty(tableContainer, 'clientHeight', { value: 600 })

    // Set scrollTop to just above the threshold
    tableContainer.scrollTop = 50

    await wrapper.find('.table-container').trigger('scroll')
    expect(mockFetchData).not.toHaveBeenCalled()
  })

  it('handles null tableContainer', async () => {
    // Force tableContainer to be null
    wrapper.unmount()

    // Trigger scroll event
    await wrapper.find('.table-container').trigger('scroll')

    // Expect fetchData not to be called
    expect(mockFetchData).not.toHaveBeenCalled()
  })

  it('does not call fetchData when already loading', async () => {
    await wrapper.setProps({ loading: true })
    const tableContainer = wrapper.find('.table-container').element

    Object.defineProperty(tableContainer, 'scrollHeight', { value: 1000 })
    Object.defineProperty(tableContainer, 'clientHeight', { value: 600 })
    tableContainer.scrollTop = 380

    await wrapper.find('.table-container').trigger('scroll')
    expect(mockFetchData).not.toHaveBeenCalled()
  })

  it('applies correct CSS classes to rows', () => {
    const rows = wrapper.findAll('tbody tr')
    expect(rows.at(0)?.classes()).toContain('hover:bg-gray-400')
    expect(rows.at(0)?.classes()).toContain('hover:bg-opacity-5')
    expect(rows.at(0)?.classes()).toContain('border-b')
    expect(rows.at(0)?.classes()).toContain('border-gray-700')
  })

  it('applies correct CSS classes to last row', () => {
    const rows = wrapper.findAll('tbody tr')
    expect(rows.at(1)?.classes()).not.toContain('border-b')
    expect(rows.at(1)?.classes()).not.toContain('border-gray-700')
  })
})
