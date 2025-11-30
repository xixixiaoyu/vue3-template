import { ref, readonly } from 'vue'
import { useNotification } from './useNotification'

interface ErrorInfo {
  id: string
  message: string
  stack?: string
  timestamp: Date
  context?: string
  handled: boolean
}

const errors = ref<ErrorInfo[]>([])

export function useErrorHandler() {
  const { error: showError } = useNotification()

  const handleError = (error: Error | string, context?: string, showToUser = true) => {
    const errorMessage = typeof error === 'string' ? error : error.message
    const errorStack = typeof error === 'string' ? undefined : error.stack

    const errorInfo: ErrorInfo = {
      id: Date.now().toString(),
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date(),
      context,
      handled: false,
    }

    // 添加到错误列表
    errors.value.unshift(errorInfo)

    // 限制错误列表长度
    if (errors.value.length > 50) {
      errors.value = errors.value.slice(0, 50)
    }

    // 显示用户友好的错误消息
    if (showToUser) {
      const userMessage = getUserFriendlyMessage(errorMessage)
      showError('发生错误', userMessage)
    }

    // 在开发环境中输出详细错误信息
    if (import.meta.env.DEV) {
      console.error('错误详情:', errorInfo)
    }

    return errorInfo
  }

  const markAsHandled = (errorId: string) => {
    const error = errors.value.find((e) => e.id === errorId)
    if (error) {
      error.handled = true
    }
  }

  const clearErrors = () => {
    errors.value = []
  }

  const clearError = (errorId: string) => {
    const index = errors.value.findIndex((e) => e.id === errorId)
    if (index > -1) {
      errors.value.splice(index, 1)
    }
  }

  const getUnhandledErrors = () => {
    return errors.value.filter((e) => !e.handled)
  }

  // 获取用户友好的错误消息
  const getUserFriendlyMessage = (errorMessage: string): string => {
    // 常见错误消息映射
    const commonErrors: Record<string, string> = {
      'Network Error': '网络连接失败，请检查您的网络设置',
      'Failed to fetch': '网络请求失败，请稍后重试',
      'Request timeout': '请求超时，请稍后重试',
      Unauthorized: '您没有权限执行此操作',
      Forbidden: '访问被拒绝',
      'Not Found': '请求的资源不存在',
      'Internal Server Error': '服务器内部错误，请稍后重试',
      'Service Unavailable': '服务暂时不可用，请稍后重试',
    }

    // 检查是否有匹配的常见错误
    for (const [key, value] of Object.entries(commonErrors)) {
      if (errorMessage.includes(key)) {
        return value
      }
    }

    // 如果没有匹配，返回原始错误消息（但限制长度）
    return errorMessage.length > 100 ? errorMessage.substring(0, 100) + '...' : errorMessage
  }

  // 异步错误处理包装器
  const withErrorHandling = async <T>(
    asyncFn: () => Promise<T>,
    context?: string,
    showToUser = true
  ): Promise<{ data?: T; error?: ErrorInfo }> => {
    try {
      const data = await asyncFn()
      return { data }
    } catch (error) {
      const errorInfo = handleError(
        error instanceof Error ? error : new Error(String(error)),
        context,
        showToUser
      )
      return { error: errorInfo }
    }
  }

  return {
    errors: readonly(errors),
    handleError,
    markAsHandled,
    clearErrors,
    clearError,
    getUnhandledErrors,
    withErrorHandling,
  }
}

// 全局错误处理器
export function setupGlobalErrorHandler() {
  const { handleError } = useErrorHandler()

  // 捕获未处理的 Promise 拒绝
  window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason, 'Unhandled Promise Rejection')
  })

  // 捕获全局错误
  window.addEventListener('error', (event) => {
    handleError(event.error || event.message, 'Global Error')
  })
}
