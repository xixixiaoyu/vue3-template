<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User, LogOut, Home, Settings, FileText } from 'lucide-vue-next'

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
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <Home class="h-8 w-8 text-indigo-600" />
            <h1 class="ml-3 text-xl font-semibold text-gray-900">仪表板</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- 用户信息 -->
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User class="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <div class="hidden md:block">
                <div class="text-sm font-medium text-gray-900">{{ userName }}</div>
                <div class="text-xs text-gray-500">{{ userEmail }}</div>
              </div>
            </div>
            
            <!-- 退出登录按钮 -->
            <button
              @click="handleSignOut"
              :disabled="authStore.loading"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <LogOut class="h-4 w-4 mr-1" />
              退出登录
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- 欢迎信息 -->
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              欢迎回来，{{ userName }}！
            </h2>
            <p class="text-gray-600 mb-6">
              这是您的个人仪表板，您可以在这里管理您的账户和查看相关信息。
            </p>
            
            <!-- 用户信息卡片 -->
            <div class="bg-white shadow overflow-hidden sm:rounded-lg max-w-2xl mx-auto">
              <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <User class="h-5 w-5 mr-2 text-indigo-600" />
                  账户信息
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  您的个人账户详细信息
                </p>
              </div>
              <div class="border-t border-gray-200">
                <dl>
                  <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">用户 ID</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ authStore.user?.id || '未知' }}
                    </dd>
                  </div>
                  <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">邮箱地址</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ userEmail }}
                    </dd>
                  </div>
                  <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">注册时间</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ authStore.user?.created_at ? new Date(authStore.user.created_at).toLocaleDateString('zh-CN') : '未知' }}
                    </dd>
                  </div>
                  <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">最后登录</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ authStore.user?.last_sign_in_at ? new Date(authStore.user.last_sign_in_at).toLocaleDateString('zh-CN') : '未知' }}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <!-- 快速操作 -->
            <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <Settings class="h-6 w-6 text-gray-400" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">账户设置</dt>
                        <dd class="text-lg font-medium text-gray-900">管理您的账户</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-5 py-3">
                  <div class="text-sm">
                    <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                      查看设置 <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <FileText class="h-6 w-6 text-gray-400" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">文档</dt>
                        <dd class="text-lg font-medium text-gray-900">查看文档</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-5 py-3">
                  <div class="text-sm">
                    <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                      查看文档 <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>