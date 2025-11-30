import { ref, reactive, readonly } from 'vue'
import type { Notification } from '@/types'

const notifications = ref<Notification[]>([])

export function useNotification() {
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      id,
      duration: 5000, // 默认 5 秒后自动消失
      ...notification,
    }

    notifications.value.push(newNotification)

    // 如果不是持久通知，设置自动移除
    if (!newNotification.persistent) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAllNotifications = () => {
    notifications.value = []
  }

  // 便捷方法
  const success = (
    title: string,
    message?: string,
    options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>
  ) => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options,
    })
  }

  const error = (
    title: string,
    message?: string,
    options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>
  ) => {
    return addNotification({
      type: 'error',
      title,
      message,
      persistent: true, // 错误消息默认持久显示
      ...options,
    })
  }

  const warning = (
    title: string,
    message?: string,
    options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>
  ) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options,
    })
  }

  const info = (
    title: string,
    message?: string,
    options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>
  ) => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options,
    })
  }

  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
  }
}
