<script setup lang="ts">
// 定义组件名称
defineOptions({
  name: 'LoginPage',
})
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFormValidation, validationRules, useSeo, useAutoAnimate } from '@/composables'
import { z } from 'zod'
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-vue-next'
import OAuthButtons from '@/components/auth/OAuthButtons.vue'

const router = useRouter()
const authStore = useAuthStore()

// 定义表单验证 schema
const loginSchema = z.object({
  email: validationRules.email,
  password: validationRules.password,
})

// 使用表单验证
const { fields, isSubmitting, serverError, handleSubmit } = useFormValidation({
  schema: loginSchema,
  onSubmit: async (values) => {
    const result = await authStore.signIn(values.email, values.password)

    if (result.success) {
      // 登录成功，重定向到仪表板
      router.push({ name: 'dashboard' })
    } else {
      // 登录失败，抛出错误让 composable 处理
      throw new Error(result.error || '登录失败，请重试')
    }
  },
})

// 表单状态
const showPassword = ref(false)

// 计算属性
const isLoading = computed(() => isSubmitting.value || authStore.loading)
const hasError = computed(() => !!(serverError.value || authStore.error))
const errorMessage = computed(() => serverError.value || authStore.error || '')

// 切换到注册页面
const goToRegister = () => {
  router.push({ name: 'register' })
}

// 切换密码显示状态
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 设置 SEO 元数据
useSeo({
  title: '登录 - Vue 3 Supabase 模板',
  description: '登录您的账户以访问我们的服务',
  keywords: '登录,认证,Vue 3,Supabase',
  robots: 'noindex,nofollow',
})

// 设置动画
const [, setParent] = useAutoAnimate()
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4"
  >
    <div class="w-full max-w-md">
      <!-- 品牌标识区域 -->
      <div class="text-center mb-8">
        <div
          class="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-blue-600 shadow-lg mb-6 transition-all duration-300 hover:scale-105"
        >
          <LogIn class="h-8 w-8 text-white" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          欢迎回来
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          登录您的账户以继续使用
        </p>
      </div>

      <!-- 登录卡片 -->
      <div class="shadow-xl border-0 backdrop-blur-sm bg-white dark:bg-gray-800 rounded-lg">
        <div class="space-y-2 pb-6 p-6">
          <h2 class="text-2xl font-semibold text-center text-gray-900 dark:text-white">登录</h2>
          <p class="text-center text-base leading-relaxed text-gray-600 dark:text-gray-400">
            还没有账户？
            <button
              @click="goToRegister"
              class="p-0 h-auto font-normal text-blue-600 hover:text-blue-700 transition-colors bg-transparent border-none cursor-pointer"
            >
              立即注册
            </button>
          </p>
        </div>

        <div class="space-y-6 p-6 pt-0">
          <!-- OAuth 登录 -->
          <OAuthButtons :redirect-path="($route.query.redirect as string) || '/'" />
          <!-- 错误提示 -->
          <div
            v-if="hasError"
            class="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 animate-in slide-in-from-top-2 duration-200"
          >
            <AlertCircle class="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div class="text-sm text-destructive break-words">
              {{ errorMessage }}
            </div>
          </div>

          <form ref="setParent" class="space-y-5" @submit.prevent="handleSubmit">
            <!-- 邮箱输入 -->
            <div class="space-y-2">
              <Label for="email" class="text-sm font-medium text-foreground">邮箱地址</Label>
              <div class="relative group">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail
                    class="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors"
                  />
                </div>
                <Input
                  id="email"
                  v-model="fields.email.value"
                  @blur="fields.email.validate"
                  type="email"
                  autocomplete="email"
                  required
                  :class="`pl-12 h-12 text-base transition-all duration-200 ${
                    fields.email.errorMessage
                      ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                      : 'focus:border-primary focus:ring-primary/20'
                  }`"
                  placeholder="your@email.com"
                />
              </div>
              <div
                v-if="fields.email.errorMessage"
                class="flex items-center gap-1.5 text-sm text-destructive mt-1.5 min-h-[1.25rem] animate-in slide-in-from-left-2 duration-200"
              >
                <AlertCircle class="h-4 w-4 flex-shrink-0" />
                {{ fields.email.errorMessage }}
              </div>
            </div>

            <!-- 密码输入 -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label for="password" class="text-sm font-medium text-foreground">密码</Label>
                <Button
                  variant="link"
                  class="p-0 h-auto text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  忘记密码？
                </Button>
              </div>
              <div class="relative group">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock
                    class="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors"
                  />
                </div>
                <Input
                  id="password"
                  v-model="fields.password.value"
                  @blur="fields.password.validate"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  :class="`pl-12 pr-12 h-12 text-base transition-all duration-200 ${
                    fields.password.errorMessage
                      ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                      : 'focus:border-primary focus:ring-primary/20'
                  }`"
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                  @click="togglePasswordVisibility"
                  :disabled="isLoading"
                >
                  <Eye
                    v-if="!showPassword"
                    class="h-5 w-5 text-foreground/70 hover:text-foreground transition-colors"
                  />
                  <EyeOff
                    v-else
                    class="h-5 w-5 text-foreground/70 hover:text-foreground transition-colors"
                  />
                </Button>
              </div>
              <div
                v-if="fields.password.errorMessage"
                class="flex items-center gap-1.5 text-sm text-destructive mt-1.5 min-h-[1.25rem] animate-in slide-in-from-left-2 duration-200"
              >
                <AlertCircle class="h-4 w-4 flex-shrink-0" />
                {{ fields.password.errorMessage }}
              </div>
            </div>

            <!-- 记住我和提交按钮 -->
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <input
                  id="remember"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20 focus:ring-2"
                />
                <Label for="remember" class="text-sm text-foreground cursor-pointer select-none">
                  记住我
                </Label>
              </div>

              <Button
                type="submit"
                :disabled="isLoading"
                class="w-full h-12 text-base font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 hover:scale-[1.02]"
              >
                <span v-if="isLoading" class="flex items-center gap-2">
                  <svg
                    class="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  登录中...
                </span>
                <span v-else>登录</span>
              </Button>
            </div>
          </form>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="text-center mt-6 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        <p>登录即表示您同意我们的服务条款和隐私政策</p>
      </div>
    </div>
  </div>
</template>
