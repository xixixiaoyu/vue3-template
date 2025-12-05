<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEnhancedFormValidation } from '@/composables'
import { useLocalStorageBoolean, useLocalStorageString } from '@/composables/useLocalStorage'
import { useLocale } from '@/composables/useI18n'
import { useSeo } from '@/composables/useSeo'
import { z } from 'zod'
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-vue-next'
import { AuthLayout, EnhancedOAuthButtons } from '@/components/auth'

defineOptions({
  name: 'LoginPage',
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { t } = useLocale()

// 本地存储记住我状态
const { value: rememberMe } = useLocalStorageBoolean('rememberMe', false)
const { state: savedEmail } = useLocalStorageString('savedEmail', '')

// 表单状态
const showPassword = ref(false)
const isFormVisible = ref(false)

// 定义表单验证 schema
const loginSchema = z.object({
  email: z.string().min(1, t('auth.emailRequired')).email(t('validation.emailInvalid')),
  password: z.string().min(6, t('validation.passwordMinLength')),
})

// 使用增强表单验证
const {
  fields,
  isSubmitting,
  serverError,
  handleSubmit,
  parentRef,
  isValid,
  clearAllErrors,
  focusField,
} = useEnhancedFormValidation({
  schema: loginSchema,
  initialValues: {
    email: rememberMe.value ? savedEmail.value : '',
    password: '',
  },
  onSubmit: async (values) => {
    const result = await authStore.signIn(values.email, values.password)

    if (result.success) {
      // 如果选择记住我，保存邮箱
      if (rememberMe.value) {
        savedEmail.value = values.email
      } else {
        savedEmail.value = ''
      }

      // 登录成功，重定向到目标页面
      const redirectPath = (route.query.redirect as string) || '/'
      router.push(redirectPath)
    } else {
      // 登录失败，抛出错误让 composable 处理
      throw new Error(result.error || '登录失败，请重试')
    }
  },
  onSuccess: () => {
    // 登录成功后的额外处理
    isFormVisible.value = false
  },
  showSuccessMessage: false, // 禁用默认成功消息，因为我们有自己的处理逻辑
  showErrorMessage: false, // 禁用默认错误消息，因为我们有自己的错误显示
})

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

// 忘记密码
const handleForgotPassword = () => {
  router.push({
    name: 'reset-password',
    query: fields.email.value ? { email: fields.email.value } : {},
  })
}

// 快捷键处理
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    if (isValid.value) {
      handleSubmit()
    }
  }
}

// 设置 SEO 元数据
useSeo({
  title: t('auth.login') + ' - Vue 3 Supabase 模板',
  description: t('auth.loginDescription') || '登录您的账户以访问我们的服务',
  keywords: '登录,认证,Vue 3,Supabase',
  robots: 'noindex,nofollow',
})

// 页面加载动画
setTimeout(() => {
  isFormVisible.value = true
}, 100)
</script>

<template>
  <AuthLayout
    :title="t('auth.welcomeBack')"
    :subtitle="t('auth.loginSubtitle')"
    :logo-icon="LogIn"
    :footer-text="t('auth.termsNotice')"
  >
    <div ref="parentRef" class="space-y-6">
      <!-- 页面标题 -->
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('auth.login') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('auth.noAccount') }}
          <button
            @click="goToRegister"
            class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            {{ t('auth.register') }}
          </button>
        </p>
      </div>

      <!-- OAuth 登录 -->
      <EnhancedOAuthButtons
        :redirect-path="(route.query.redirect as string) || '/'"
        :size="'medium'"
        :layout="'grid'"
      />

      <!-- 错误提示 -->
      <div v-if="hasError" class="error-alert" role="alert" aria-live="polite">
        <div
          class="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">登录失败</h3>
            <p class="mt-1 text-sm text-red-700 dark:text-red-300">
              {{ errorMessage }}
            </p>
          </div>
          <button
            @click="clearAllErrors"
            class="flex-shrink-0 text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 登录表单 -->
      <form
        @submit.prevent="handleSubmit"
        @keydown="handleKeydown"
        class="space-y-5"
        :class="{ 'form-visible': isFormVisible }"
      >
        <!-- 邮箱输入 -->
        <div class="form-group">
          <label for="email" class="form-label">
            {{ t('auth.email') }}
          </label>
          <div class="form-input-wrapper">
            <div class="form-input-icon">
              <Mail class="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="email"
              v-model="fields.email.value"
              @blur="fields.email.validate"
              type="email"
              inputmode="email"
              autocomplete="email"
              :placeholder="t('auth.emailPlaceholder')"
              class="form-input"
              :class="{
                'form-input--error': fields.email.errorMessage,
                'form-input--focused': fields.email.touched && !fields.email.errorMessage,
              }"
            />
          </div>
          <transition name="error-fade">
            <p v-if="fields.email.errorMessage" class="form-error">
              {{ fields.email.errorMessage }}
            </p>
          </transition>
        </div>

        <!-- 密码输入 -->
        <div class="form-group">
          <label for="password" class="form-label">
            <div class="flex items-center justify-between w-full">
              <span>{{ t('auth.password') }}</span>
              <button
                type="button"
                @click="handleForgotPassword"
                class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                {{ t('auth.forgotPassword') }}
              </button>
            </div>
          </label>
          <div class="form-input-wrapper">
            <div class="form-input-icon">
              <Lock class="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="password"
              v-model="fields.password.value"
              @blur="fields.password.validate"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              :placeholder="t('auth.passwordPlaceholder')"
              class="form-input pr-12"
              :class="{
                'form-input--error': fields.password.errorMessage,
                'form-input--focused': fields.password.touched && !fields.password.errorMessage,
              }"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              :disabled="isLoading"
              class="form-input-suffix"
            >
              <EyeOff v-if="showPassword" class="w-4 h-4 text-gray-400" />
              <Eye v-else class="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <transition name="error-fade">
            <p v-if="fields.password.errorMessage" class="form-error">
              {{ fields.password.errorMessage }}
            </p>
          </transition>
        </div>

        <!-- 记住我和提交按钮 -->
        <div class="space-y-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="rememberMe" type="checkbox" class="form-checkbox" />
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ t('auth.rememberMe') }}
            </span>
          </label>

          <button
            type="submit"
            :disabled="isLoading || !isValid"
            class="form-submit-button"
            :class="{ 'form-submit-button--loading': isLoading }"
          >
            <span v-if="isLoading" class="form-submit-button__loading">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              {{ t('auth.loggingIn') }}
            </span>
            <span v-else class="form-submit-button__content">
              {{ t('auth.login') }}
              <ArrowRight class="w-4 h-4 ml-2" />
            </span>
          </button>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<style scoped>
.form-visible {
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-input-wrapper {
  @apply relative;
}

.form-input-icon {
  @apply absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none;
}

.form-input {
  @apply w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200;
}

.form-input.pr-12 {
  padding-right: 3rem;
}

.form-input--error {
  @apply border-red-300 dark:border-red-600 focus:ring-red-500;
}

.form-input--focused {
  @apply border-blue-300 dark:border-blue-600 focus:ring-blue-500;
}

.form-input-suffix {
  @apply absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors;
}

.form-error {
  @apply text-sm text-red-600 dark:text-red-400 mt-1;
}

.form-checkbox {
  @apply h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900;
}

.form-submit-button {
  @apply w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200;
}

.form-submit-button--loading {
  @apply opacity-75 cursor-not-allowed;
}

.form-submit-button__loading {
  @apply flex items-center;
}

.form-submit-button__content {
  @apply flex items-center;
}

.error-alert {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .form-input {
    @apply py-2 text-base;
  }

  .form-submit-button {
    @apply py-3 text-base;
  }
}
</style>
