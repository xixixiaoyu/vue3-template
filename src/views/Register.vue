<script setup lang="ts">
// 定义组件名称
defineOptions({
  name: 'RegisterPage',
})
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFormValidation, validationRules, useAutoAnimate } from '@/composables'
import { z } from 'zod'
import { UserPlus, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-vue-next'
import OAuthButtons from '@/components/auth/OAuthButtons.vue'

const router = useRouter()
const authStore = useAuthStore()

// 定义表单验证 schema
const registerSchema = z
  .object({
    email: validationRules.email,
    password: validationRules.password,
    confirmPassword: z.string().min(1, '请确认密码'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

// 使用表单验证
const { fields, isSubmitting, serverError, handleSubmit } = useFormValidation({
  schema: registerSchema,
  onSubmit: async (values) => {
    const result = await authStore.signUp(values.email, values.password)

    if (result.success) {
      // 注册成功，重定向到仪表板
      router.push({ name: 'dashboard' })
    } else {
      // 注册失败，抛出错误让 composable 处理
      throw new Error(result.error || '注册失败，请重试')
    }
  },
})

// 表单状态
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 计算属性
const isLoading = computed(() => isSubmitting.value || authStore.loading)
const hasError = computed(() => !!(serverError.value || authStore.error))
const errorMessage = computed(() => serverError.value || authStore.error || '')

// 切换到登录页面
const goToLogin = () => {
  router.push({ name: 'login' })
}

// 切换密码显示状态
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 切换确认密码显示状态
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

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
        <n-avatar
          :size="64"
          :style="{ backgroundColor: '#2563eb' }"
          class="mb-6 transition-all duration-300 hover:scale-105"
        >
          <n-icon size="32" color="white">
            <UserPlus />
          </n-icon>
        </n-avatar>
        <n-h1 class="mb-3 tracking-tight"> 创建新账户 </n-h1>
        <n-p depth="3" class="text-lg leading-relaxed"> 注册以开始使用我们的服务 </n-p>
      </div>

      <!-- 注册卡片 -->
      <n-card>
        <div class="space-y-6">
          <div class="text-center">
            <n-h2>注册</n-h2>
            <n-p depth="3" class="text-base leading-relaxed">
              已有账户？
              <n-button text type="primary" @click="goToLogin"> 立即登录 </n-button>
            </n-p>
          </div>

          <!-- OAuth 注册 -->
          <OAuthButtons :redirect-path="'/'" />

          <!-- 错误提示 -->
          <n-alert v-if="hasError" type="error" :title="errorMessage" show-icon />

          <form ref="setParent" class="space-y-5" @submit.prevent="handleSubmit">
            <!-- 邮箱输入 -->
            <n-form-item
              :validation-status="fields.email.errorMessage ? 'error' : undefined"
              :feedback="fields.email.errorMessage"
            >
              <template #label> 邮箱地址 </template>
              <n-input
                v-model:value="fields.email.value"
                @blur="fields.email.validate"
                type="text"
                inputmode="email"
                autocomplete="email"
                placeholder="your@email.com"
                size="large"
                :input-props="{ class: 'pl-10' }"
              >
                <template #prefix>
                  <n-icon>
                    <Mail />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>

            <!-- 密码输入 -->
            <n-form-item
              :validation-status="fields.password.errorMessage ? 'error' : undefined"
              :feedback="fields.password.errorMessage"
            >
              <template #label> 密码 </template>
              <n-input
                v-model:value="fields.password.value"
                @blur="fields.password.validate"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="••••••••"
                size="large"
                :input-props="{ class: 'pl-10 pr-10' }"
              >
                <template #prefix>
                  <n-icon>
                    <Lock />
                  </n-icon>
                </template>
                <template #suffix>
                  <n-button
                    text
                    size="small"
                    @click="togglePasswordVisibility"
                    :disabled="isLoading"
                  >
                    <n-icon>
                      <Eye v-if="!showPassword" />
                      <EyeOff v-else />
                    </n-icon>
                  </n-button>
                </template>
              </n-input>
            </n-form-item>

            <!-- 确认密码输入 -->
            <n-form-item
              :validation-status="fields.confirmPassword.errorMessage ? 'error' : undefined"
              :feedback="fields.confirmPassword.errorMessage"
            >
              <template #label> 确认密码 </template>
              <n-input
                v-model:value="fields.confirmPassword.value"
                @blur="fields.confirmPassword.validate"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="••••••••"
                size="large"
                :input-props="{ class: 'pl-10 pr-10' }"
              >
                <template #prefix>
                  <n-icon>
                    <Lock />
                  </n-icon>
                </template>
                <template #suffix>
                  <n-button
                    text
                    size="small"
                    @click="toggleConfirmPasswordVisibility"
                    :disabled="isLoading"
                  >
                    <n-icon>
                      <Eye v-if="!showConfirmPassword" />
                      <EyeOff v-else />
                    </n-icon>
                  </n-button>
                </template>
              </n-input>
            </n-form-item>

            <!-- 提交按钮 -->
            <n-button type="primary" size="large" :loading="isLoading" block @click="handleSubmit">
              {{ isLoading ? '注册中...' : '创建账户' }}
            </n-button>
          </form>
        </div>
      </n-card>

      <!-- 底部信息 -->
      <div class="text-center mt-6">
        <n-text depth="3" class="text-sm leading-relaxed">
          注册即表示您同意我们的服务条款和隐私政策
        </n-text>
      </div>
    </div>
  </div>
</template>
