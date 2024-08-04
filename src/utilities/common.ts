export const debounce = <T extends (...args: any[]) => void>(
  functionToBeDebounced: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      functionToBeDebounced(...args)
    }, delay)
  }
}
