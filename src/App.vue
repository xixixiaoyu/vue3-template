<script setup lang="ts">
import { onMounted, onUnmounted, computed, provide } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { setupGlobalErrorHandler } from '@/composables/useErrorHandler'
import { useGlobalLoading } from '@/composables/useLoading'
import { useLocale } from '@/composables/useI18n'
import { useTheme } from '@/composables/useTheme'
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
const { isDark, toggleTheme } = useTheme()

// 计算主题
const theme = computed<GlobalTheme | null>(() => {
  return isDark.value ? darkTheme : null
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

// 在组件卸载时清理资源
onUnmounted(() => {
  // 这里可以添加其他清理逻辑
})

// 提供全局主题切换方法
provide('toggleTheme', toggleTheme)
</script>

<template>
  <NConfigProvider :theme="theme" :locale="naiveLocale">
    <NMessageProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <NLoadingBarProvider>
            <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <RouterView />
              <NotificationContainer />
              <LoadingOverlay :show="isLoading" :message="$t('common.loading')" />
            </div>
          </NLoadingBarProvider>
        </NNotificationProvider>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  line-height: 1.6;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 暗色模式过渡 */
.dark {
  color-scheme: dark;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 焦点样式 */
:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* 选择文本样式 */
::selection {
  background-color: #2563eb;
  color: white;
}

.dark ::selection {
  background-color: #1d4ed8;
  color: white;
}

/* 动画类 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 响应式字体大小 */
@media (max-width: 640px) {
  html {
    font-size: 14px;
  }
}

@media (min-width: 1024px) {
  html {
    font-size: 18px;
  }
}
</style>
