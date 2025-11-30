import { ref, computed, readonly } from 'vue'

interface LoadingState {
  [key: string]: boolean
}

const globalLoading = ref<LoadingState>({})

export function useLoading(key = 'global') {
  const isLoading = computed(() => globalLoading.value[key] || false)

  const setLoading = (loading: boolean) => {
    globalLoading.value = {
      ...globalLoading.value,
      [key]: loading,
    }
  }

  const startLoading = () => setLoading(true)
  const stopLoading = () => setLoading(false)

  // 获取所有加载状态
  const allLoadingStates = computed(() => globalLoading.value)

  // 检查是否有任何加载中的状态
  const hasAnyLoading = computed(() => {
    return Object.values(globalLoading.value).some((state) => state)
  })

  // 清除所有加载状态
  const clearAllLoading = () => {
    globalLoading.value = {}
  }

  // 包装异步函数，自动处理加载状态
  const withLoading = async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    try {
      startLoading()
      return await asyncFn()
    } finally {
      stopLoading()
    }
  }

  return {
    isLoading: readonly(isLoading),
    setLoading,
    startLoading,
    stopLoading,
    allLoadingStates: readonly(allLoadingStates),
    hasAnyLoading: readonly(hasAnyLoading),
    clearAllLoading,
    withLoading,
  }
}

// 全局加载状态管理
export function useGlobalLoading() {
  return useLoading('global')
}
