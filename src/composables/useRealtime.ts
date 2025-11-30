import { ref, onUnmounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

// 实时事件类型
export type RealtimeEventType = 'INSERT' | 'UPDATE' | 'DELETE'

// 实时事件载荷
export interface RealtimeEventPayload<T = any> {
  eventType: RealtimeEventType
  new?: T
  old?: T
  errors: any[]
}

// 实时订阅配置
export interface RealtimeSubscriptionConfig {
  table: keyof Database['public']['Tables']
  filter?: string
  event?: RealtimeEventType[]
  callback?: (payload: RealtimeEventPayload) => void
}

// 实时订阅状态
export interface RealtimeSubscription {
  id: string
  channel: any
  config: RealtimeSubscriptionConfig
  isActive: boolean
}

export function useRealtime() {
  const subscriptions = ref<Map<string, RealtimeSubscription>>(new Map())
  const isConnected = ref(false)
  const connectionError = ref<string | null>(null)

  // 监听连接状态
  const connectionChannel = supabase.channel('connection-status')

  connectionChannel
    .on('system', {}, (payload: any) => {
      if (payload.extension === 'postgres_changes') {
        isConnected.value = true
        connectionError.value = null
      }
    })
    .subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        isConnected.value = true
        connectionError.value = null
      } else if (status === 'CHANNEL_ERROR') {
        isConnected.value = false
        connectionError.value = '连接错误'
      } else if (status === 'TIMED_OUT') {
        isConnected.value = false
        connectionError.value = '连接超时'
      }
    })

  // 订阅表变化
  const subscribe = (config: RealtimeSubscriptionConfig): string => {
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // 构建频道名称
    const channelName = `public:${config.table}`

    // 创建频道
    const channel = supabase.channel(channelName)

    // 配置事件监听
    const events = config.event || ['INSERT', 'UPDATE', 'DELETE']

    events.forEach((eventType) => {
      channel.on(
        'postgres_changes' as any,
        {
          event: eventType,
          schema: 'public',
          table: config.table as string,
          filter: config.filter,
        },
        (payload: any) => {
          if (config.callback) {
            config.callback({
              eventType: payload.eventType,
              new: payload.new,
              old: payload.old,
              errors: payload.errors || [],
            })
          }
        }
      )
    })

    // 订阅频道
    channel.subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        const subscription = subscriptions.value.get(subscriptionId)
        if (subscription) {
          subscription.isActive = true
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        const subscription = subscriptions.value.get(subscriptionId)
        if (subscription) {
          subscription.isActive = false
        }
      }
    })

    // 保存订阅
    subscriptions.value.set(subscriptionId, {
      id: subscriptionId,
      channel,
      config,
      isActive: false,
    })

    return subscriptionId
  }

  // 取消订阅
  const unsubscribe = (subscriptionId: string): boolean => {
    const subscription = subscriptions.value.get(subscriptionId)

    if (subscription) {
      subscription.channel.unsubscribe()
      subscriptions.value.delete(subscriptionId)
      return true
    }

    return false
  }

  // 取消所有订阅
  const unsubscribeAll = (): void => {
    subscriptions.value.forEach((subscription) => {
      subscription.channel.unsubscribe()
    })
    subscriptions.value.clear()
  }

  // 暂停订阅
  const pauseSubscription = (subscriptionId: string): boolean => {
    const subscription = subscriptions.value.get(subscriptionId)

    if (subscription) {
      subscription.channel.unsubscribe()
      subscription.isActive = false
      return true
    }

    return false
  }

  // 恢复订阅
  const resumeSubscription = (subscriptionId: string): boolean => {
    const subscription = subscriptions.value.get(subscriptionId)

    if (subscription) {
      subscription.channel.subscribe()
      return true
    }

    return false
  }

  // 获取订阅状态
  const getSubscriptionStatus = (subscriptionId: string): boolean | null => {
    const subscription = subscriptions.value.get(subscriptionId)
    return subscription ? subscription.isActive : null
  }

  // 获取所有订阅
  const getAllSubscriptions = (): RealtimeSubscription[] => {
    return Array.from(subscriptions.value.values())
  }

  // 获取活跃订阅数量
  const activeSubscriptionsCount = computed(() => {
    return Array.from(subscriptions.value.values()).filter((sub) => sub.isActive).length
  })

  // 广播自定义事件
  const broadcast = (channel: string, event: string, payload: any): void => {
    supabase.channel(channel).send({
      type: 'broadcast',
      event,
      payload,
    })
  }

  // 监听广播事件
  const listenToBroadcast = (
    channel: string,
    event: string,
    callback: (payload: any) => void
  ): string => {
    const listenerId = `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const broadcastChannel = supabase.channel(channel)
    broadcastChannel.on('broadcast', { event }, callback)
    broadcastChannel.subscribe()

    return listenerId
  }

  // 停止监听广播事件
  const stopListeningToBroadcast = (channel: string): void => {
    supabase.removeChannel(supabase.channel(channel))
  }

  // 组件卸载时清理
  onUnmounted(() => {
    unsubscribeAll()
  })

  return {
    // 状态
    isConnected,
    connectionError,
    subscriptions,
    activeSubscriptionsCount,

    // 方法
    subscribe,
    unsubscribe,
    unsubscribeAll,
    pauseSubscription,
    resumeSubscription,
    getSubscriptionStatus,
    getAllSubscriptions,
    broadcast,
    listenToBroadcast,
    stopListeningToBroadcast,
  }
}

// 便捷的表订阅 hooks
export function useTableSubscription<T extends keyof Database['public']['Tables']>(
  table: T,
  options: {
    filter?: string
    event?: RealtimeEventType[]
    immediate?: boolean
  } = {}
) {
  const { subscribe, unsubscribe } = useRealtime()

  const data = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const subscriptionId = ref<string | null>(null)

  // 处理实时事件
  const handleRealtimeEvent = (payload: RealtimeEventPayload) => {
    try {
      switch (payload.eventType) {
        case 'INSERT':
          if (payload.new) {
            data.value.push(payload.new)
          }
          break
        case 'UPDATE':
          if (payload.new) {
            const index = data.value.findIndex((item) => item.id === payload.new?.id)
            if (index !== -1) {
              data.value[index] = payload.new
            }
          }
          break
        case 'DELETE':
          if (payload.old) {
            data.value = data.value.filter((item) => item.id !== payload.old?.id)
          }
          break
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '处理实时事件失败'
      console.error('处理实时事件失败:', err)
    }
  }

  // 开始订阅
  const startSubscription = () => {
    if (subscriptionId.value) {
      unsubscribe(subscriptionId.value)
    }

    loading.value = true
    error.value = null

    subscriptionId.value = subscribe({
      table,
      filter: options.filter,
      event: options.event,
      callback: handleRealtimeEvent,
    })

    loading.value = false
  }

  // 停止订阅
  const stopSubscription = () => {
    if (subscriptionId.value) {
      unsubscribe(subscriptionId.value)
      subscriptionId.value = null
    }
  }

  // 自动开始订阅
  if (options.immediate !== false) {
    startSubscription()
  }

  // 组件卸载时清理
  onUnmounted(() => {
    stopSubscription()
  })

  return {
    data,
    loading,
    error,
    subscriptionId,
    startSubscription,
    stopSubscription,
  }
}

// 通知系统的实时订阅
export function useNotificationsSubscription(userId: string) {
  const { subscribe, unsubscribe } = useRealtime()

  const notifications = ref<any[]>([])
  const unreadCount = ref(0)
  const subscriptionId = ref<string | null>(null)

  // 处理新通知
  const handleNewNotification = (payload: RealtimeEventPayload) => {
    if (payload.eventType === 'INSERT' && payload.new) {
      const notification = payload.new
      notifications.value.unshift(notification)

      if (!notification.read_at) {
        unreadCount.value++
      }
    } else if (payload.eventType === 'UPDATE' && payload.new && payload.old) {
      const index = notifications.value.findIndex((n) => n.id === payload.new?.id)
      if (index !== -1) {
        const oldNotification = notifications.value[index]
        const newNotification = payload.new

        notifications.value[index] = newNotification

        // 更新未读计数
        if (!oldNotification.read_at && newNotification.read_at) {
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        } else if (oldNotification.read_at && !newNotification.read_at) {
          unreadCount.value++
        }
      }
    }
  }

  // 开始订阅
  const startSubscription = () => {
    if (subscriptionId.value) {
      unsubscribe(subscriptionId.value)
    }

    subscriptionId.value = subscribe({
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
      event: ['INSERT', 'UPDATE'],
      callback: handleNewNotification,
    })
  }

  // 停止订阅
  const stopSubscription = () => {
    if (subscriptionId.value) {
      unsubscribe(subscriptionId.value)
      subscriptionId.value = null
    }
  }

  // 标记为已读
  const markAsRead = async (notificationId: string) => {
    const { error } = await (supabase as any)
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)

    if (!error) {
      const notification = notifications.value.find((n) => n.id === notificationId)
      if (notification && !notification.read_at) {
        notification.read_at = new Date().toISOString()
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    }
  }

  // 标记全部为已读
  const markAllAsRead = async () => {
    const { error } = await (supabase as any)
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('read_at', null)

    if (!error) {
      notifications.value.forEach((notification) => {
        if (!notification.read_at) {
          notification.read_at = new Date().toISOString()
        }
      })
      unreadCount.value = 0
    }
  }

  // 组件卸载时清理
  onUnmounted(() => {
    stopSubscription()
  })

  return {
    notifications,
    unreadCount,
    startSubscription,
    stopSubscription,
    markAsRead,
    markAllAsRead,
  }
}
