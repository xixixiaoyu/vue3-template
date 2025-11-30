<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/ui'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const formData = reactive({
  email: '',
  password: '',
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
  <div
    class="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8"
  >
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
          <LogIn class="h-6 w-6 text-primary" />
        </div>
        <CardTitle class="mt-6">登录您的账户</CardTitle>
        <CardDescription>
          或者
          <Button variant="link" @click="goToRegister" class="p-0 h-auto font-normal">
            创建新账户
          </Button>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form class="space-y-4" @submit.prevent="handleLogin">
          <!-- 错误提示 -->
          <div v-if="formError || authStore.error" class="rounded-md bg-destructive/15 p-4">
            <div class="text-sm text-destructive">
              {{ formError || authStore.error }}
            </div>
          </div>

          <!-- 邮箱输入 -->
          <div class="space-y-2">
            <Label for="email">邮箱地址</Label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="email"
                v-model="formData.email"
                type="email"
                autocomplete="email"
                required
                class="pl-10"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <!-- 密码输入 -->
          <div class="space-y-2">
            <Label for="password">密码</Label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="pl-10 pr-10"
                placeholder="••••••••"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                class="absolute inset-y-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                @click="showPassword = !showPassword"
              >
                <Eye v-if="!showPassword" class="h-4 w-4 text-muted-foreground" />
                <EyeOff v-else class="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <!-- 提交按钮 -->
          <Button type="submit" :disabled="isSubmitting || authStore.loading" class="w-full">
            <span v-if="isSubmitting || authStore.loading" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4"
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
        </form>
      </CardContent>
    </Card>
  </div>
</template>
