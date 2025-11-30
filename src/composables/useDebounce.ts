import { ref, watch, onUnmounted, type Ref } from 'vue'

export function useDebounce<T>(
  value: Ref<T> | (() => T),
  delay: number
): { debouncedValue: Ref<T>; cancel: () => void } {
  const getValue = typeof value === 'function' ? value : () => value.value
  const debouncedValue = ref(getValue()) as Ref<T>
  let timeoutId: number | null = null

  const cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const updateValue = () => {
    cancel()
    timeoutId = setTimeout(() => {
      debouncedValue.value = getValue() as T
    }, delay)
  }

  // 监听值变化
  if (typeof value === 'function') {
    watch(value, updateValue, { immediate: true })
  } else {
    watch(() => value.value, updateValue, { immediate: true })
  }

  // 组件卸载时清理
  onUnmounted(cancel)

  return {
    debouncedValue,
    cancel,
  }
}

// 防抖函数 hook
export function useDebouncedFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): { debouncedFn: T; cancel: () => void } {
  let timeoutId: number | null = null

  const cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const debouncedFn = ((...args: Parameters<T>) => {
    cancel()
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }) as T

  // 组件卸载时清理
  onUnmounted(cancel)

  return {
    debouncedFn,
    cancel,
  }
}
