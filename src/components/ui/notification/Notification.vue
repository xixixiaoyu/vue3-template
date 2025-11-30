<script setup lang="ts">
import { computed } from 'vue'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-vue-next'
import type { Notification as NotificationType } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  notification: NotificationType
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: [id: string]
}>()

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const iconComponent = computed(() => iconMap[props.notification.type])

const colorClasses = computed(() => {
  const baseClasses = 'border-l-4 p-4 rounded-md shadow-md'

  switch (props.notification.type) {
    case 'success':
      return cn(baseClasses, 'bg-green-50 border-green-400 text-green-800')
    case 'error':
      return cn(baseClasses, 'bg-red-50 border-red-400 text-red-800')
    case 'warning':
      return cn(baseClasses, 'bg-yellow-50 border-yellow-400 text-yellow-800')
    case 'info':
      return cn(baseClasses, 'bg-blue-50 border-blue-400 text-blue-800')
    default:
      return cn(baseClasses, 'bg-gray-50 border-gray-400 text-gray-800')
  }
})

const handleClose = () => {
  emit('close', props.notification.id)
}
</script>

<template>
  <div :class="colorClasses" class="relative mb-4 transition-all duration-300 ease-in-out">
    <div class="flex">
      <div class="flex-shrink-0">
        <component :is="iconComponent" class="h-5 w-5" aria-hidden="true" />
      </div>
      <div class="ml-3 flex-1">
        <h3 class="text-sm font-medium">
          {{ notification.title }}
        </h3>
        <div v-if="notification.message" class="mt-1 text-sm">
          {{ notification.message }}
        </div>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            type="button"
            :class="
              cn(
                'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                props.notification.type === 'success' &&
                  'focus:ring-green-600 focus:ring-offset-green-50',
                props.notification.type === 'error' &&
                  'focus:ring-red-600 focus:ring-offset-red-50',
                props.notification.type === 'warning' &&
                  'focus:ring-yellow-600 focus:ring-offset-yellow-50',
                props.notification.type === 'info' &&
                  'focus:ring-blue-600 focus:ring-offset-blue-50'
              )
            "
            @click="handleClose"
          >
            <span class="sr-only">关闭</span>
            <X class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
