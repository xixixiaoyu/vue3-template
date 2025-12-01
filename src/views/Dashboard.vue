<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部导航栏 -->
    <header class="border-b bg-card shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <Home class="h-8 w-8 text-primary" />
            <h1 class="ml-3 text-xl font-semibold text-foreground">
              {{ t('navigation.dashboard') }}
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <!-- 用户信息 -->
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User class="h-5 w-5 text-primary" />
                </div>
              </div>
              <div class="hidden md:block">
                <div class="text-sm font-medium text-foreground">{{ userName }}</div>
                <div class="text-xs text-muted-foreground">{{ userEmail }}</div>
              </div>
            </div>

            <!-- 退出登录按钮 -->
            <Button
              @click="handleSignOut"
              :disabled="authStore.loading"
              variant="default"
              size="sm"
            >
              <LogOut class="h-4 w-4 mr-1" />
              {{ t('auth.logout') }}
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- 欢迎信息 -->
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-border rounded-lg p-8">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-foreground mb-4">
              {{ t('dashboard.welcome') }}，{{ userName }}！
            </h2>
            <p class="text-muted-foreground mb-6">
              {{
                t('dashboard.description') ||
                '这是您的个人仪表板，您可以在这里管理您的账户和查看相关信息。'
              }}
            </p>

            <!-- 快速操作卡片 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center gap-2">
                    <Globe class="h-5 w-5" />
                    {{ t('navigation.settings') }}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="text-sm text-muted-foreground">
                    {{ t('dashboard.description') || '主仪表板页面' }}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center gap-2">
                    <Package class="h-5 w-5" />
                    新功能
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="text-sm text-muted-foreground mb-4">查看所有新增的功能和组件</p>
                  <Button @click="goToFeatures" class="w-full">
                    {{ t('common.view') }}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User, LogOut, Home, Package } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLocale } from '@/composables/useI18n'

const { t } = useLocale()
const router = useRouter()
const authStore = useAuthStore()

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

// 退出登录
const handleSignOut = async () => {
  const result = await authStore.signOut()
  if (result.success) {
    // 退出成功，重定向到登录页
    router.push({ name: 'login' })
  } else {
    console.error('退出登录失败:', result.error)
  }
}

// 跳转到功能页面
const goToFeatures = () => {
  router.push('/features')
}
</script>
