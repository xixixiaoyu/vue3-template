<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/composables/useNotification'
import { useAutoAnimate } from '@/composables/useAutoAnimate'
import type { OAuthProvider } from '@/types/database.types'
import { Chrome, Github, Facebook, Twitter, Loader2 } from 'lucide-vue-next'

interface Props {
  redirectPath?: string
  showDivider?: boolean
  size?: 'small' | 'medium' | 'large'
  layout?: 'grid' | 'list'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDivider: true,
  size: 'medium',
  layout: 'grid',
  disabled: false,
})

const authStore = useAuthStore()
const { error, info } = useNotification()
const [, setParentRef] = useAutoAnimate()

const loadingProvider = ref<OAuthProvider | null>(null)

// OAuth 提供商配置
const oauthProviders = [
  {
    provider: 'google' as OAuthProvider,
    name: 'Google',
    icon: Chrome,
    color: '#4285F4',
    bgColor: '#fff',
    textColor: '#000',
    hoverBg: '#f8f9fa',
    description: '使用 Google 账号登录',
  },
  {
    provider: 'github' as OAuthProvider,
    name: 'GitHub',
    icon: Github,
    color: '#24292e',
    bgColor: '#fff',
    textColor: '#000',
    hoverBg: '#f6f8fa',
    description: '使用 GitHub 账号登录',
  },
  {
    provider: 'facebook' as OAuthProvider,
    name: 'Facebook',
    icon: Facebook,
    color: '#1877F2',
    bgColor: '#fff',
    textColor: '#000',
    hoverBg: '#f0f2f5',
    description: '使用 Facebook 账号登录',
  },
  {
    provider: 'twitter' as OAuthProvider,
    name: 'Twitter',
    icon: Twitter,
    color: '#1DA1F2',
    bgColor: '#fff',
    textColor: '#000',
    hoverBg: '#f7f9fa',
    description: '使用 Twitter 账号登录',
  },
]

const isLoading = computed(() => authStore.loading || loadingProvider.value !== null)

const handleOAuthLogin = async (provider: OAuthProvider) => {
  if (isLoading.value || props.disabled) return

  try {
    loadingProvider.value = provider

    const result = await authStore.signInWithOAuth(provider, {
      redirectTo: props.redirectPath ? `${window.location.origin}${props.redirectPath}` : undefined,
    })

    if (!result.success) {
      throw new Error(result.error || 'OAuth 登录失败')
    }

    info('登录成功', `正在跳转到 ${provider} 授权页面...`)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'OAuth 登录失败'
    error('登录失败', errorMessage)
    console.error('OAuth 登录失败:', err)
  } finally {
    loadingProvider.value = null
  }
}

const getButtonClasses = (provider: (typeof oauthProviders)[0]) => [
  'oauth-button',
  `oauth-button--${props.size}`,
  `oauth-button--${props.layout}`,
  {
    'oauth-button--loading': loadingProvider.value === provider.provider,
    'oauth-button--disabled': props.disabled || isLoading.value,
  },
]

const getIconSize = () => {
  switch (props.size) {
    case 'small':
      return 16
    case 'medium':
      return 20
    case 'large':
      return 24
    default:
      return 20
  }
}
</script>

<template>
  <div ref="setParentRef" class="oauth-container">
    <!-- OAuth 按钮 -->
    <div v-if="layout === 'grid'" class="oauth-grid" :class="`oauth-grid--${size}`">
      <button
        v-for="provider in oauthProviders"
        :key="provider.provider"
        :class="getButtonClasses(provider)"
        :disabled="disabled || isLoading"
        @click="handleOAuthLogin(provider.provider)"
        :title="provider.description"
      >
        <component
          :is="loadingProvider === provider.provider ? Loader2 : provider.icon"
          :size="getIconSize()"
          :class="{
            'animate-spin': loadingProvider === provider.provider,
          }"
        />
        <span class="oauth-button__text">{{ provider.name }}</span>
      </button>
    </div>

    <div v-else class="oauth-list">
      <button
        v-for="provider in oauthProviders"
        :key="provider.provider"
        :class="getButtonClasses(provider)"
        :disabled="disabled || isLoading"
        @click="handleOAuthLogin(provider.provider)"
        :title="provider.description"
      >
        <component
          :is="loadingProvider === provider.provider ? Loader2 : provider.icon"
          :size="getIconSize()"
          :class="{
            'animate-spin': loadingProvider === provider.provider,
          }"
        />
        <span class="oauth-button__text">{{ provider.name }}</span>
      </button>
    </div>

    <!-- 分割线 -->
    <div v-if="showDivider" class="oauth-divider">
      <div class="oauth-divider__line"></div>
      <span class="oauth-divider__text">或使用邮箱</span>
      <div class="oauth-divider__line"></div>
    </div>
  </div>
</template>

<style scoped>
.oauth-container {
  @apply w-full space-y-4;
}

.oauth-grid {
  @apply grid gap-3;
}

.oauth-grid--small {
  @apply grid-cols-2;
}

.oauth-grid--medium {
  @apply grid-cols-2;
}

.oauth-grid--large {
  @apply grid-cols-2;
}

.oauth-list {
  @apply space-y-3;
}

.oauth-button {
  @apply relative flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800 disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700;
}

.oauth-button--small {
  @apply px-3 py-2 text-sm;
}

.oauth-button--large {
  @apply px-6 py-3 text-base;
}

.oauth-button--loading {
  @apply opacity-75;
}

.oauth-button__text {
  @apply truncate;
}

.oauth-divider {
  @apply relative flex items-center justify-center my-6;
}

.oauth-divider__line {
  @apply flex-1 h-px bg-gray-200 dark:bg-gray-700;
}

.oauth-divider__text {
  @apply px-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .oauth-grid--small,
  .oauth-grid--medium,
  .oauth-grid--large {
    @apply grid-cols-1;
  }
}

/* 动画效果 */
.oauth-button {
  transform: translateY(0);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.oauth-button:hover:not(.oauth-button--disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.oauth-button:active:not(.oauth-button--disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 加载状态动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  .oauth-divider__text {
    @apply bg-gray-900;
  }
}
</style>
