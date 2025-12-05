<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEnhancedFormValidation } from '@/composables'
import { useLocale } from '@/composables/useI18n'
import { useSeo } from '@/composables/useSeo'
import { z } from 'zod'
import { Icon } from '@/components/ui'
import { AuthLayout } from '@/components/auth'

defineOptions({
  name: 'ResetPasswordPage',
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { t } = useLocale()

// 表单状态
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isFormVisible = ref(false)
const showSuccessDialog = ref(false)
const isResetMode = ref(false)

// 检查是否有重置令牌
const resetToken = computed(() => route.query.token as string)
const email = computed(() => route.query.email as string)

// 定义表单验证 schema
const requestSchema = z.object({
  email: z.string().min(1, t('auth.emailRequired')).email(t('validation.emailInvalid')),
})

const resetSchema = z
  .object({
    password: z.string().min(6, t('validation.passwordMinLength')),
    confirmPassword: z.string().min(1, t('validation.passwordConfirm')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('validation.passwordMismatch'),
    path: ['confirmPassword'],
  })

// 使用增强表单验证
const { fields, isSubmitting, serverError, handleSubmit, parentRef, isValid, clearAllErrors } =
  useEnhancedFormValidation({
    schema: (isResetMode.value ? resetSchema : requestSchema) as any,
    initialValues: isResetMode.value
      ? { password: '', confirmPassword: '' }
      : { email: email.value || '' },
    onSubmit: async (values) => {
      if (isResetMode.value) {
        // 重置密码
        const result = await authStore.updatePassword(values.password)
        if (result.success) {
          showSuccessDialog.value = true
          setTimeout(() => {
            router.push({ name: 'login' })
          }, 3000)
        } else {
          throw new Error(result.error || '密码重置失败，请重试')
        }
      } else {
        // 请求重置密码
        const result = await authStore.resetPassword(values.email)
        if (result.success) {
          showSuccessDialog.value = true
          setTimeout(() => {
            router.push({ name: 'login' })
          }, 3000)
        } else {
          throw new Error(result.error || '发送重置邮件失败，请重试')
        }
      }
    },
    onSuccess: () => {
      isFormVisible.value = false
    },
    showSuccessMessage: false, // 禁用默认成功消息，因为我们有自己的成功对话框
    showErrorMessage: false, // 禁用默认错误消息，因为我们有自己的错误显示
  })

// 计算属性
const isLoading = computed(() => isSubmitting.value || authStore.loading)
const hasError = computed(() => !!(serverError.value || authStore.error))
const errorMessage = computed(() => serverError.value || authStore.error || '')

// 切换密码显示状态
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 切换确认密码显示状态
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
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
  title: t('auth.resetPassword') + ' - Vue 3 Supabase 模板',
  description: '重置您的账户密码',
  keywords: '重置密码,认证,Vue 3,Supabase',
  robots: 'noindex,nofollow',
})

// 页面加载动画
setTimeout(() => {
  isFormVisible.value = true
}, 100)

// 检查是否有重置令牌
if (resetToken.value) {
  isResetMode.value = true
}
</script>

<template>
  <AuthLayout
    :title="isResetMode ? t('auth.resetPassword') : t('auth.forgotPassword')"
    :subtitle="
      isResetMode
        ? t('auth.resetPasswordSubtitle') || '请输入您的新密码'
        : t('auth.forgotPasswordSubtitle') || '请输入您的邮箱地址，我们将发送重置链接给您'
    "
  >
    <template #logo-icon>
      <Icon name="Lock" size="32" />
    </template>
    <div ref="parentRef" class="space-y-6">
      <!-- 页面切换提示 -->
      <div class="text-center">
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('auth.rememberPassword') || '记起密码了？' }}
          <button
            @click="router.push({ name: 'login' })"
            class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            {{ t('auth.login') }}
          </button>
        </p>
      </div>

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
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              {{
                isResetMode
                  ? t('auth.resetFailed') || '重置失败'
                  : t('auth.sendFailed') || '发送失败'
              }}
            </h3>
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

      <!-- 表单 -->
      <form
        @submit.prevent="handleSubmit"
        @keydown="handleKeydown"
        class="space-y-5"
        :class="{ 'form-visible': isFormVisible }"
      >
        <!-- 邮箱输入（请求重置时） -->
        <div v-if="!isResetMode" class="form-group">
          <label for="email" class="form-label">
            {{ t('auth.email') }}
          </label>
          <div class="form-input-wrapper">
            <div class="form-input-icon">
              <Icon name="Lock" size="20" class="text-gray-400" />
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

        <!-- 密码输入（重置时） -->
        <template v-if="isResetMode">
          <!-- 新密码输入 -->
          <div class="form-group">
            <label for="password" class="form-label">
              {{ t('auth.newPassword') || '新密码' }}
            </label>
            <div class="form-input-wrapper">
              <div class="form-input-icon">
                <Icon name="Lock" size="20" class="text-gray-400" />
              </div>
              <input
                id="password"
                v-model="fields.password.value"
                @blur="fields.password.validate"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
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
                <Icon v-if="showPassword" name="EyeOff" size="16" class="text-gray-400" />
                <Icon v-else name="Eye" size="16" class="text-gray-400" />
              </button>
            </div>
            <transition name="error-fade">
              <p v-if="fields.password.errorMessage" class="form-error">
                {{ fields.password.errorMessage }}
              </p>
            </transition>
          </div>

          <!-- 确认密码输入 -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label">
              {{ t('auth.confirmPassword') }}
            </label>
            <div class="form-input-wrapper">
              <div class="form-input-icon">
                <Icon name="Lock" size="20" class="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                v-model="fields.confirmPassword.value"
                @blur="fields.confirmPassword.validate"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                :placeholder="t('auth.confirmPasswordPlaceholder')"
                class="form-input pr-12"
                :class="{
                  'form-input--error': fields.confirmPassword.errorMessage,
                  'form-input--focused':
                    fields.confirmPassword.touched && !fields.confirmPassword.errorMessage,
                }"
              />
              <button
                type="button"
                @click="toggleConfirmPasswordVisibility"
                :disabled="isLoading"
                class="form-input-suffix"
              >
                <Icon v-if="showConfirmPassword" name="EyeOff" size="16" class="text-gray-400" />
                <Icon v-else name="Eye" size="16" class="text-gray-400" />
              </button>
            </div>
            <transition name="error-fade">
              <p v-if="fields.confirmPassword.errorMessage" class="form-error">
                {{ fields.confirmPassword.errorMessage }}
              </p>
            </transition>
          </div>
        </template>

        <!-- 提交按钮 -->
        <button
          type="submit"
          :disabled="isLoading || !isValid"
          class="form-submit-button"
          :class="{ 'form-submit-button--loading': isLoading }"
        >
          <span v-if="isLoading" class="form-submit-button__loading">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
            {{
              isResetMode ? t('auth.resetting') || '重置中...' : t('auth.sending') || '发送中...'
            }}
          </span>
          <span v-else class="form-submit-button__content">
            {{ isResetMode ? t('auth.resetPassword') : t('auth.sendResetLink') || '发送重置链接' }}
            <Icon name="ArrowRight" size="16" class="ml-2" />
          </span>
        </button>
      </form>
    </div>
  </AuthLayout>

  <!-- 成功对话框 -->
  <div
    v-if="showSuccessDialog"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    @click.self="showSuccessDialog = false"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all"
    >
      <div class="text-center">
        <div
          class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
        >
          <Icon name="CheckCircle" size="32" class="text-green-600 dark:text-green-400" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {{
            isResetMode
              ? t('auth.passwordResetSuccess') || '密码重置成功'
              : t('auth.emailSentSuccess') || '邮件发送成功'
          }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{
            isResetMode
              ? t('auth.passwordResetSuccessMessage') || '您的密码已成功重置，即将跳转到登录页面...'
              : t('auth.resetLinkSentMessage') ||
                '重置链接已发送到您的邮箱，请查收邮件并按照提示操作...'
          }}
        </p>
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-sm text-gray-500 dark:text-gray-400">
            {{ t('auth.redirectingToLogin') || '正在跳转到登录页面...' }}
          </span>
        </div>
      </div>
    </div>
  </div>
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
