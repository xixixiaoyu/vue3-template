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
          <!-- 主题切换按钮 -->
          <n-button circle @click="toggleTheme" size="small">
            <template #icon>
              <n-icon>
                <Sun v-if="isDark" />
                <Moon v-else />
              </n-icon>
            </template>
          </n-button>

          <!-- 语言切换按钮 -->
          <n-button circle @click="toggleLocale" size="small">
            <template #icon>
              <n-icon>
                <Languages />
              </n-icon>
            </template>
          </n-button>

          <!-- 用户信息 -->
          <n-dropdown trigger="hover" :options="userMenuOptions" @select="handleUserMenuSelect">
            <div class="flex items-center space-x-3 cursor-pointer">
              <n-avatar
                round
                size="small"
                :src="userAvatar"
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

          <!-- 统计卡片 -->
          <n-grid :cols="1" :x-gap="16" :y-gap="16" responsive="screen" class="mb-6">
            <n-grid-item :span="1" :s="2" :m="2" :l="3">
              <n-card hoverable class="stat-card">
                <n-statistic label="总用户数" value="1,234">
                  <template #prefix>
                    <n-icon color="#18a058">
                      <Users />
                    </n-icon>
                  </template>
                </n-statistic>
              </n-card>
            </n-grid-item>
            <n-grid-item :span="1" :s="2" :m="2" :l="3">
              <n-card hoverable class="stat-card">
                <n-statistic label="活跃用户" value="892">
                  <template #prefix>
                    <n-icon color="#2080f0">
                      <UserCheck />
                    </n-icon>
                  </template>
                </n-statistic>
              </n-card>
            </n-grid-item>
            <n-grid-item :span="1" :s="2" :m="2" :l="3">
              <n-card hoverable class="stat-card">
                <n-statistic label="新用户" value="156">
                  <template #prefix>
                    <n-icon color="#f0a020">
                      <UserPlus />
                    </n-icon>
                  </template>
                </n-statistic>
              </n-card>
            </n-grid-item>
            <n-grid-item :span="1" :s="2" :m="2" :l="3">
              <n-card hoverable class="stat-card">
                <n-statistic label="转化率" value="12.5%" suffix="%">
                  <template #prefix>
                    <n-icon color="#d03050">
                      <TrendingUp />
                    </n-icon>
                  </template>
                </n-statistic>
              </n-card>
            </n-grid-item>
          </n-grid>

          <!-- 快速操作卡片 -->
          <n-grid :cols="1" :x-gap="16" :y-gap="16" responsive="screen">
            <n-grid-item :span="1" :s="2" :m="2" :l="1">
              <n-card hoverable class="action-card">
                <template #header>
                  <div class="flex items-center gap-2">
                    <n-icon size="20">
                      <Settings />
                    </n-icon>
                    {{ t('navigation.settings') }}
                  </div>
                </template>
                <n-p depth="3" class="mb-4">
                  {{ t('dashboard.settingsDescription') || '管理您的账户设置和偏好' }}
                </n-p>
                <n-button @click="goToSettings" type="primary" block>
                  {{ t('common.manage') }}
                </n-button>
              </n-card>
            </n-grid-item>

            <n-grid-item :span="1" :s="2" :m="2" :l="1">
              <n-card hoverable class="action-card">
                <template #header>
                  <div class="flex items-center gap-2">
                    <n-icon size="20">
                      <Package />
                    </n-icon>
                    {{ t('dashboard.features') || '新功能' }}
                  </div>
                </template>
                <n-p depth="3" class="mb-4">
                  {{ t('dashboard.featuresDescription') || '查看所有新增的功能和组件' }}
                </n-p>
                <n-button @click="goToFeatures" type="primary" block>
                  {{ t('common.view') }}
                </n-button>
              </n-card>
            </n-grid-item>

            <n-grid-item :span="1" :s="2" :m="2" :l="1">
              <n-card hoverable class="action-card">
                <template #header>
                  <div class="flex items-center gap-2">
                    <n-icon size="20">
                      <BarChart3 />
                    </n-icon>
                    {{ t('dashboard.analytics') || '数据分析' }}
                  </div>
                </template>
                <n-p depth="3" class="mb-4">
                  {{ t('dashboard.analyticsDescription') || '查看详细的数据分析和报告' }}
                </n-p>
                <n-button @click="goToAnalytics" type="primary" block>
                  {{ t('common.view') }}
                </n-button>
              </n-card>
            </n-grid-item>

            <n-grid-item :span="1" :s="2" :m="2" :l="1">
              <n-card hoverable class="action-card">
                <template #header>
                  <div class="flex items-center gap-2">
                    <n-icon size="20">
                      <FileText />
                    </n-icon>
                    {{ t('dashboard.reports') || '报告' }}
                  </div>
                </template>
                <n-p depth="3" class="mb-4">
                  {{ t('dashboard.reportsDescription') || '生成和查看各类业务报告' }}
                </n-p>
                <n-button @click="goToReports" type="primary" block>
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
import { computed, h, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  User,
  LogOut,
  Home,
  Package,
  Settings,
  UserCircle,
  Sun,
  Moon,
  Languages,
  Users,
  UserCheck,
  UserPlus,
  TrendingUp,
  BarChart3,
  FileText,
} from 'lucide-vue-next'
import { useLocale } from '@/composables/useI18n'
import { useMessage, useDialog } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'

const { t, toggleLocale } = useLocale()
const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()
const dialog = useDialog()

// 主题状态
const isDark = ref(false)

// 计算属性
const userEmail = computed(() => authStore.user?.email || '')
const userName = computed(() => authStore.userName)
const userAvatar = computed(() => authStore.userAvatar)

// 用户菜单选项
const userMenuOptions = computed<DropdownOption[]>(() => [
  {
    label: t('navigation.profile'),
    key: 'profile',
    icon: () => h('div', { class: 'flex items-center' }, [h(UserCircle, { size: 16 })]),
  },
  {
    label: t('navigation.settings'),
    key: 'settings',
    icon: () => h('div', { class: 'flex items-center' }, [h(Settings, { size: 16 })]),
  },
  {
    type: 'divider',
  },
  {
    label: t('auth.logout'),
    key: 'logout',
    icon: () => h('div', { class: 'flex items-center' }, [h(LogOut, { size: 16 })]),
  },
])

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
  // 这里可以添加实际的主题切换逻辑
  message.info(isDark.value ? '已切换到暗色主题' : '已切换到亮色主题')
}

// 处理用户菜单选择
const handleUserMenuSelect = (key: string) => {
  switch (key) {
    case 'profile':
      message.info(t('navigation.profile') + '功能开发中')
      break
    case 'settings':
      goToSettings()
      break
    case 'logout':
      handleSignOut()
      break
  }
}

// 退出登录
const handleSignOut = () => {
  dialog.warning({
    title: t('common.confirm'),
    content: t('auth.confirmLogout') || '您确定要退出登录吗？',
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      const result = await authStore.signOut()
      if (result.success) {
        message.success(t('auth.logoutSuccess'))
        router.push({ name: 'login' })
      } else {
        message.error(t('auth.logoutFailed') + ': ' + (result.error || t('errors.unknown')))
      }
    },
  })
}

// 页面导航方法
const goToSettings = () => {
  router.push('/settings')
}

const goToFeatures = () => {
  router.push('/features')
}

const goToAnalytics = () => {
  router.push('/analytics')
}

const goToReports = () => {
  router.push('/reports')
}
</script>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-card {
  height: 100%;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
