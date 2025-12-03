<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { setupGlobalErrorHandler } from '@/composables/useErrorHandler'
import { useGlobalLoading } from '@/composables/useLoading'
import { useLocale } from '@/composables/useI18n'
import { RouterView } from 'vue-router'
import { NotificationContainer } from '@/components/ui/notification'
import { LoadingOverlay } from '@/components/ui/loading'
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NLoadingBarProvider,
  darkTheme,
  zhCN,
  enUS,
  type GlobalTheme,
} from 'naive-ui'

const authStore = useAuthStore()
const { isLoading } = useGlobalLoading()
const { currentLocale: locale } = useLocale()

// 根据系统偏好或用户设置决定主题
const theme = computed<GlobalTheme | null>(() => {
  // 检查系统是否偏好暗色主题
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? darkTheme : null
})

// 根据当前语言设置 Naive UI 的语言包
const naiveLocale = computed(() => {
  return locale.value === 'zh' ? zhCN : enUS
})

// 在应用启动时初始化认证状态
onMounted(async () => {
  await authStore.initialize()
  // 设置全局错误处理
  setupGlobalErrorHandler()
})
</script>

<template>
  <NConfigProvider :theme="theme" :locale="naiveLocale">
    <NMessageProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <NLoadingBarProvider>
            <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
              <RouterView />
              <NotificationContainer />
              <LoadingOverlay :show="isLoading" message="加载中..." />
            </div>
          </NLoadingBarProvider>
        </NNotificationProvider>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
