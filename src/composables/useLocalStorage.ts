import { ref, watch, type Ref } from 'vue'
import { storage } from '@/utils/index'

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: {
    serializer?: {
      read: (value: string) => T
      write: (value: T) => string
    }
  } = {}
): {
  state: Ref<any>
  setValue: (value: T) => void
  reset: () => void
  remove: () => void
  cleanup: () => void
} {
  const {
    serializer = {
      read: (value: string) => {
        try {
          return JSON.parse(value)
        } catch {
          return defaultValue
        }
      },
      write: (value: T) => JSON.stringify(value),
    },
  } = options

  // 获取初始值
  const storedValue = storage.get<T>(key, defaultValue) ?? defaultValue
  const state = ref<T>(storedValue)

  // 监听状态变化，同步到本地存储
  watch(
    state,
    (newValue) => {
      storage.set(key, newValue)
    },
    { deep: true }
  )

  // 监听存储变化（跨标签页同步）
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === key && event.newValue !== null) {
      try {
        state.value = serializer.read(event.newValue)
      } catch (error) {
        console.error('解析本地存储数据失败:', error)
        state.value = defaultValue
      }
    }
  }

  // 添加事件监听器
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageChange)
  }

  // 清理函数
  const cleanup = () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorageChange)
    }
  }

  // 设置值的方法
  const setValue = (value: T) => {
    state.value = value
  }

  // 重置为默认值
  const reset = () => {
    state.value = defaultValue
  }

  // 移除存储
  const remove = () => {
    storage.remove(key)
    state.value = defaultValue
  }

  return {
    state,
    setValue,
    reset,
    remove,
    cleanup,
  }
}

// 便捷的 hooks
export function useLocalStorageBoolean(key: string, defaultValue = false) {
  const { state, setValue, reset, remove, cleanup } = useLocalStorage(key, defaultValue)

  const toggle = () => {
    setValue(!state.value)
  }

  const setTrue = () => setValue(true)
  const setFalse = () => setValue(false)

  return {
    value: state,
    toggle,
    setTrue,
    setFalse,
    reset,
    remove,
    cleanup,
  }
}

export function useLocalStorageString(key: string, defaultValue = '') {
  return useLocalStorage<string>(key, defaultValue, {
    serializer: {
      read: (value: string) => value,
      write: (value: string) => value,
    },
  })
}

export function useLocalStorageNumber(key: string, defaultValue = 0) {
  return useLocalStorage(key, defaultValue)
}

export function useLocalStorageObject<T extends Record<string, any>>(key: string, defaultValue: T) {
  return useLocalStorage(key, defaultValue)
}
