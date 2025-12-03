<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { OAuthProvider } from '@/types/database.types'

interface Props {
  redirectPath?: string
  showDivider?: boolean
  size?: 'sm' | 'default' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  showDivider: true,
  size: 'default',
})

const authStore = useAuthStore()

// OAuth 提供商配置
const oauthProviders = [
  {
    provider: 'google' as OAuthProvider,
    name: 'Google',
    icon: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z',
    color: '#4285F4',
    bgColor: '#fff',
    textColor: '#000',
  },
  {
    provider: 'github' as OAuthProvider,
    name: 'GitHub',
    icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
    color: '#24292e',
    bgColor: '#fff',
    textColor: '#000',
  },
  {
    provider: 'facebook' as OAuthProvider,
    name: 'Facebook',
    icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    color: '#1877F2',
    bgColor: '#fff',
    textColor: '#000',
  },
  {
    provider: 'twitter' as OAuthProvider,
    name: 'Twitter',
    icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
    color: '#1DA1F2',
    bgColor: '#fff',
    textColor: '#000',
  },
]

const isLoading = computed(() => authStore.loading)

const handleOAuthLogin = async (provider: OAuthProvider) => {
  const result = await authStore.signInWithOAuth(provider, {
    redirectTo: props.redirectPath ? `${window.location.origin}${props.redirectPath}` : undefined,
  })

  if (!result.success) {
    console.error('OAuth 登录失败:', result.error)
  }
}

const buttonSizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 text-sm'
    case 'lg':
      return 'h-12 text-base'
    default:
      return 'h-10 text-sm'
  }
})
</script>

<template>
  <div class="w-full space-y-3">
    <!-- OAuth 按钮 -->
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="provider in oauthProviders"
        :key="provider.provider"
        :disabled="isLoading"
        :class="`w-full ${buttonSizeClass} flex items-center justify-start gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50`"
        @click="handleOAuthLogin(provider.provider)"
      >
        <svg :class="`h-4 w-4`" viewBox="0 0 24 24" fill="currentColor">
          <path :d="provider.icon" />
        </svg>
        <span class="truncate">{{ provider.name }}</span>
      </button>
    </div>

    <!-- 分割线 -->
    <div v-if="showDivider" class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t border-gray-300 dark:border-gray-600" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400"
          >或使用邮箱</span
        >
      </div>
    </div>
  </div>
</template>
