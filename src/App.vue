<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { setupGlobalErrorHandler } from '@/composables/useErrorHandler'
import { useGlobalLoading } from '@/composables/useLoading'
import { RouterView } from 'vue-router'
import { NotificationContainer } from '@/components/ui/notification'
import { LoadingOverlay } from '@/components/ui/loading'

const authStore = useAuthStore()
const { isLoading } = useGlobalLoading()

// 在应用启动时初始化认证状态
onMounted(async () => {
  await authStore.initialize()
  // 设置全局错误处理
  setupGlobalErrorHandler()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <RouterView />
    <NotificationContainer />
    <LoadingOverlay :show="isLoading" message="加载中..." />
  </div>
</template>
