import { describe, it, vi, expect, beforeEach } from 'vitest'
import { debounce } from './common'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should delay function execution', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 1000)

    debouncedFn()
    expect(mockFn).not.toBeCalled()

    vi.advanceTimersByTime(999)
    expect(mockFn).not.toBeCalled()

    vi.advanceTimersByTime(1)
    expect(mockFn).toBeCalledTimes(1)
  })

  it('should call the function only once if called multiple times within delay', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 1000)

    debouncedFn()
    debouncedFn()
    debouncedFn()

    vi.advanceTimersByTime(1000)
    expect(mockFn).toBeCalledTimes(1)
  })

  it('should call the function with the latest arguments', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 1000)

    debouncedFn(1)
    debouncedFn(2)
    debouncedFn(3)

    vi.advanceTimersByTime(1000)
    expect(mockFn).toBeCalledWith(3)
  })

  it('should reset the timer on each call within delay', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 1000)

    debouncedFn()
    vi.advanceTimersByTime(500)

    debouncedFn()
    vi.advanceTimersByTime(500)
    expect(mockFn).not.toBeCalled()

    vi.advanceTimersByTime(500)
    expect(mockFn).toBeCalledTimes(1)
  })

  it('should work with methods that use "this"', () => {
    const obj = {
      value: 0,
      increment() {
        this.value++
      }
    }

    const debouncedIncrement = debounce(obj.increment.bind(obj), 1000)

    debouncedIncrement()
    vi.advanceTimersByTime(1000)

    expect(obj.value).toBe(1)
  })
})
