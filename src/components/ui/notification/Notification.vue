<script setup lang="ts">
import { computed } from 'vue'
import type { Notification as NotificationType } from '@/types'
import { NAlert } from 'naive-ui'

// 添加组件名称以满足多词组件命名规则
defineOptions({
  name: 'UiNotification',
})

interface Props {
  notification: NotificationType
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: [id: string]
}>()

const notificationType = computed(() => {
  switch (props.notification.type) {
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    default:
      return 'default'
  }
})

const handleClose = () => {
  emit('close', props.notification.id)
}
</script>

<template>
  <n-alert
    :type="notificationType"
    :title="notification.title"
    closable
    @close="handleClose"
    class="mb-4"
  >
    {{ notification.message }}
  </n-alert>
</template>
