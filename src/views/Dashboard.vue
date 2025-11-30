<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User, LogOut, Home, Settings, FileText } from 'lucide-vue-next'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

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

// 跳转到登录页
const goToLogin = () => {
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部导航栏 -->
    <header class="border-b bg-card shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <Home class="h-8 w-8 text-primary" />
            <h1 class="ml-3 text-xl font-semibold text-foreground">仪表板</h1>
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
              退出登录
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
            <h2 class="text-2xl font-bold text-foreground mb-4">欢迎回来，{{ userName }}！</h2>
            <p class="text-muted-foreground mb-6">
              这是您的个人仪表板，您可以在这里管理您的账户和查看相关信息。
            </p>

            <!-- 用户信息卡片 -->
            <Card class="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle class="flex items-center">
                  <User class="h-5 w-5 mr-2 text-primary" />
                  账户信息
                </CardTitle>
                <CardDescription> 您的个人账户详细信息 </CardDescription>
              </CardHeader>
              <CardContent>
                <dl>
                  <div
                    class="bg-secondary/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md"
                  >
                    <dt class="text-sm font-medium text-muted-foreground">用户 ID</dt>
                    <dd class="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2">
                      {{ authStore.user?.id || '未知' }}
                    </dd>
                  </div>
                  <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-muted-foreground">邮箱地址</dt>
                    <dd class="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2">
                      {{ userEmail }}
                    </dd>
                  </div>
                  <div
                    class="bg-secondary/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md"
                  >
                    <dt class="text-sm font-medium text-muted-foreground">注册时间</dt>
                    <dd class="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2">
                      {{
                        authStore.user?.created_at
                          ? new Date(authStore.user.created_at).toLocaleDateString('zh-CN')
                          : '未知'
                      }}
                    </dd>
                  </div>
                  <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-muted-foreground">最后登录</dt>
                    <dd class="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2">
                      {{
                        authStore.user?.last_sign_in_at
                          ? new Date(authStore.user.last_sign_in_at).toLocaleDateString('zh-CN')
                          : '未知'
                      }}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <!-- 快速操作 -->
            <div
              class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto"
            >
              <Card>
                <CardContent class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <Settings class="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-muted-foreground truncate">账户设置</dt>
                        <dd class="text-lg font-medium text-foreground">管理您的账户</dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
                <div class="bg-secondary/50 px-5 py-3">
                  <div class="text-sm">
                    <a href="#" class="font-medium text-primary hover:text-primary/80">
                      查看设置 <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </Card>

              <Card>
                <CardContent class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <FileText class="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-muted-foreground truncate">文档</dt>
                        <dd class="text-lg font-medium text-foreground">查看文档</dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
                <div class="bg-secondary/50 px-5 py-3">
                  <div class="text-sm">
                    <a href="#" class="font-medium text-primary hover:text-primary/80">
                      查看文档 <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
