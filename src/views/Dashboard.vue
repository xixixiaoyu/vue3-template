<template>
  <n-layout class="min-h-screen">
    <!-- 顶部导航栏 -->
    <n-layout-header bordered class="h-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto h-full flex justify-between items-center">
        <div class="flex items-center">
          <n-icon size="32" color="#2563eb">
            <Home />
          </n-icon>
          <h1 class="ml-3 text-xl font-semibold">
            {{ t('navigation.dashboard') }}
          </h1>
        </div>

        <div class="flex items-center space-x-4">
          <!-- 用户信息 -->
          <n-dropdown trigger="hover" :options="userMenuOptions">
            <div class="flex items-center space-x-3 cursor-pointer">
              <n-avatar
                round
                size="small"
                :fallback-style="{ backgroundColor: '#2563eb', color: 'white' }"
              >
                <n-icon size="16">
                  <User />
                </n-icon>
              </n-avatar>
              <div class="hidden md:block">
                <div class="text-sm font-medium">{{ userName }}</div>
                <div class="text-xs opacity-70">{{ userEmail }}</div>
              </div>
            </div>
          </n-dropdown>

          <!-- 退出登录按钮 -->
          <n-button @click="handleSignOut" :loading="authStore.loading" type="primary" size="small">
            <template #icon>
              <n-icon>
                <LogOut />
              </n-icon>
            </template>
            {{ t('auth.logout') }}
          </n-button>
        </div>
      </div>
    </n-layout-header>

    <!-- 主要内容区域 -->
    <n-layout-content class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- 欢迎信息 -->
      <n-card class="mb-6">
        <div class="text-center">
          <n-h2 class="mb-4"> {{ t('dashboard.welcome') }}，{{ userName }}！ </n-h2>
          <n-p class="mb-6">
            {{
              t('dashboard.description') ||
              '这是您的个人仪表板，您可以在这里管理您的账户和查看相关信息。'
            }}
          </n-p>

          <!-- 快速操作卡片 -->
          <n-grid :cols="1" :x-gap="16" :y-gap="16" responsive="screen">
            <n-grid-item :span="1" s:2 m:2 l:1>
              <n-card hoverable>
                <template #header>
                  <div class="flex items-center gap-2">
                    <n-icon size="20">
                      <Globe />
                    </n-icon>
                    {{ t('navigation.settings') }}
                  </div>
                </template>
                <n-p depth="3">
                  {{ t('dashboard.description') || '主仪表板页面' }}
                </n-p>
              </n-card>
            </n-grid-item>

            <n-grid-item :span="1" s:2 m:2 l:1>
              <n-card hoverable>
                <template #header>
                  <div class="flex items-center gap-2">
                    <n-icon size="20">
                      <Package />
                    </n-icon>
                    新功能
                  </div>
                </template>
                <n-p depth="3" class="mb-4"> 查看所有新增的功能和组件 </n-p>
                <n-button @click="goToFeatures" type="primary" block>
                  {{ t('common.view') }}
                </n-button>
              </n-card>
            </n-grid-item>
          </n-grid>
        </div>
      </n-card>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User, LogOut, Home, Package, Settings, UserCircle } from 'lucide-vue-next'
import { useLocale } from '@/composables/useI18n'
import { useMessage, useDialog } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'

const { t } = useLocale()
const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()
const dialog = useDialog()

// 计算属性
const userEmail = computed(() => authStore.user?.email || '')
const userName = computed(() => {
  const user = authStore.user
  if (!user) return ''

  // 尝试从 user_metadata 中获取姓名，如果没有则使用邮箱前缀
  const nameFromMetadata = user.user_metadata?.name || user.user_metadata?.full_name
  if (nameFromMetadata) return nameFromMetadata

  // 如果没有姓名，使用邮箱前缀
  return userEmail.value.split('@')[0]
})

// 用户菜单选项
const userMenuOptions = computed<DropdownOption[]>(() => [
  {
    label: '个人资料',
    key: 'profile',
    icon: () => h('div', { class: 'flex items-center' }, [h(UserCircle, { size: 16 })]),
  },
  {
    label: '设置',
    key: 'settings',
    icon: () => h('div', { class: 'flex items-center' }, [h(Settings, { size: 16 })]),
  },
  {
    type: 'divider',
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h('div', { class: 'flex items-center' }, [h(LogOut, { size: 16 })]),
  },
])

// 处理用户菜单选择
const handleUserMenuSelect = (key: string) => {
  switch (key) {
    case 'profile':
      message.info('个人资料功能开发中')
      break
    case 'settings':
      message.info('设置功能开发中')
      break
    case 'logout':
      handleSignOut()
      break
  }
}

// 退出登录
const handleSignOut = () => {
  dialog.warning({
    title: '确认退出',
    content: '您确定要退出登录吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const result = await authStore.signOut()
      if (result.success) {
        message.success('退出登录成功')
        // 退出成功，重定向到登录页
        router.push({ name: 'login' })
      } else {
        message.error('退出登录失败: ' + (result.error || '未知错误'))
      }
    },
  })
}

// 跳转到功能页面
const goToFeatures = () => {
  router.push('/features')
}
</script>
