<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'
import Notification from './Notification.vue'

const { notifications, removeNotification } = useNotification()

const handleClose = (id: string) => {
  removeNotification(id)
}
</script>

<template>
  <n-notification-provider>
    <div
      v-if="notifications.length > 0"
      class="fixed top-4 right-4 z-50 w-96 max-w-sm"
      aria-live="assertive"
    >
      <TransitionGroup name="notification" tag="div" class="space-y-2">
        <Notification
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
          @close="handleClose"
        />
      </TransitionGroup>
    </div>
  </n-notification-provider>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
