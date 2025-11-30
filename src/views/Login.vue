<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const formData = reactive({
  email: '',
  password: ''
})

// 表单状态
const showPassword = ref(false)
const isSubmitting = ref(false)

// 错误处理
const formError = ref('')

// 处理登录
const handleLogin = async () => {
  if (!formData.email || !formData.password) {
    formError.value = '请填写所有必填字段'
    return
  }

  isSubmitting.value = true
  formError.value = ''

  try {
    const result = await authStore.signIn(formData.email, formData.password)
    
    if (result.success) {
      // 登录成功，重定向到仪表板
      router.push({ name: 'dashboard' })
    } else {
      // 登录失败，显示错误信息
      formError.value = result.error || '登录失败，请重试'
    }
  } catch (error) {
    formError.value = '登录过程中发生错误，请重试'
    console.error('登录错误:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 切换到注册页面
const goToRegister = () => {
  router.push({ name: 'register' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- 头部 -->
      <div class="text-center">
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
          <LogIn class="h-6 w-6 text-indigo-600" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登录您的账户
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          或者
          <button @click="goToRegister" class="font-medium text-indigo-600 hover:text-indigo-500">
            创建新账户
          </button>
        </p>
      </div>

      <!-- 登录表单 -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <!-- 错误提示 -->
        <div v-if="formError || authStore.error" class="rounded-md bg-red-50 p-4">
          <div class="text-sm text-red-800">
            {{ formError || authStore.error }}
          </div>
        </div>

        <!-- 邮箱输入 -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            邮箱地址
          </label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <!-- 密码输入 -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            密码
          </label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              class="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              @click="showPassword = !showPassword"
            >
              <Eye v-if="!showPassword" class="h-5 w-5 text-gray-400" />
              <EyeOff v-else class="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div>
          <button
            type="submit"
            :disabled="isSubmitting || authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting || authStore.loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              登录中...
            </span>
            <span v-else>登录</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>