<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEnhancedFormValidation } from '@/composables'
import { useLocale } from '@/composables/useI18n'
import { useSeo } from '@/composables/useSeo'
import { z } from 'zod'
import {
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Shield,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-vue-next'
import { AuthLayout, EnhancedOAuthButtons } from '@/components/auth'

defineOptions({
  name: 'RegisterPage',
})

const router = useRouter()
const authStore = useAuthStore()
const { t } = useLocale()

// 表单状态
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isFormVisible = ref(false)
const showSuccessDialog = ref(false)

// 使用 usePasswordStrength 组合式函数
import { usePasswordStrength } from '@/composables/useEnhancedFormValidation'
const { calculateStrength } = usePasswordStrength()

// 定义表单验证 schema
const registerSchema = z
  .object({
    name: z.string().min(2, t('validation.nameMinLength')).max(50, t('validation.nameMaxLength')),
    email: z.string().min(1, t('auth.emailRequired')).email(t('validation.emailInvalid')),
    password: z.string().min(6, t('validation.passwordMinLength')),
    confirmPassword: z.string().min(1, t('validation.passwordConfirm')),
    agreeToTerms: z.boolean().refine((val) => val === true, t('validation.agreeToTermsRequired')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('validation.passwordMismatch'),
    path: ['confirmPassword'],
  })

// 使用增强表单验证
const { fields, isSubmitting, serverError, handleSubmit, parentRef, isValid, clearAllErrors } =
  useEnhancedFormValidation({
    schema: registerSchema as any,
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
    onSubmit: async (values) => {
      const result = await authStore.signUp(values.email, values.password)

      // 注册成功后更新用户资料
      if (result.success && values.name) {
        await authStore.updateProfile({
          full_name: values.name,
        })
      }

      if (result.success) {
        // 显示成功对话框
        showSuccessDialog.value = true

        // 延迟重定向到登录页
        setTimeout(() => {
          router.push({ name: 'login' })
        }, 3000)
      } else {
        // 注册失败，抛出错误让 composable 处理
        throw new Error(result.error || '注册失败，请重试')
      }
    },
    onSuccess: () => {
      // 注册成功后的额外处理
      isFormVisible.value = false
    },
    showSuccessMessage: false, // 禁用默认成功消息，因为我们有自己的成功对话框
    showErrorMessage: false, // 禁用默认错误消息，因为我们有自己的错误显示
  })

// 计算属性
const isLoading = computed(() => isSubmitting.value || authStore.loading)
const hasError = computed(() => !!(serverError.value || authStore.error))
const errorMessage = computed(() => serverError.value || authStore.error || '')

// 密码强度计算
const passwordStrength = computed(() => {
  return calculateStrength(fields.password?.value || '')
})

// 密码要求检查
const passwordRequirements = computed(() => {
  const password = fields.password?.value || ''
  return [
    {
      text: t('validation.passwordMinLength'),
      met: password.length >= 6,
    },
    {
      text: t('validation.passwordUppercase') || '包含大写字母',
      met: /[A-Z]/.test(password),
    },
    {
      text: t('validation.passwordLowercase') || '包含小写字母',
      met: /[a-z]/.test(password),
    },
    {
      text: t('validation.passwordNumber') || '包含数字',
      met: /\d/.test(password),
    },
    {
      text: t('validation.passwordSpecial') || '包含特殊字符',
      met: /[^a-zA-Z0-9]/.test(password),
    },
  ]
})

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

// 安全的输入处理函数
const handleInput = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement
  if (fields[fieldName] && target) {
    fields[fieldName].value = target.value
  }
}

// 安全的复选框处理函数
const handleCheckboxChange = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement
  if (fields[fieldName] && target) {
    fields[fieldName].value = target.checked
  }
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
  title: t('auth.register') + ' - Vue 3 Supabase 模板',
  description: t('auth.registerDescription') || '创建新账户以开始使用我们的服务',
  keywords: '注册,认证,Vue 3,Supabase',
  robots: 'noindex,nofollow',
})

// 监听密码变化，实时验证确认密码
watch(
  () => fields.password?.value,
  () => {
    if (fields.confirmPassword?.value) {
      fields.confirmPassword.validate()
    }
  }
)

// 页面加载动画
setTimeout(() => {
  isFormVisible.value = true
}, 100)
</script>

<template>
  <AuthLayout
    :title="t('auth.createAccount')"
    :subtitle="t('auth.registerSubtitle')"
    :logo-icon="UserPlus"
    :footer-text="t('auth.registerTermsNotice')"
  >
    <div ref="parentRef" class="space-y-6">
      <!-- 页面标题 -->
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('auth.register') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('auth.hasAccount') }}
          <button
            @click="goToLogin"
            class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            {{ t('auth.login') }}
          </button>
        </p>
      </div>

      <!-- OAuth 注册 -->
      <EnhancedOAuthButtons redirect-path="/" :size="'medium'" :layout="'grid'" />

      <!-- 错误提示 -->
      <div v-if="hasError" class="error-alert" role="alert" aria-live="polite">
        <div
          class="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div class="flex-shrink-0">
            <AlertCircle class="w-5 h-5 text-red-400" />
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">注册失败</h3>
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

      <!-- 注册表单 -->
      <form
        @submit.prevent="handleSubmit"
        @keydown="handleKeydown"
        class="space-y-5"
        :class="{ 'form-visible': isFormVisible }"
      >
        <!-- 姓名输入 -->
        <div class="form-group">
          <label for="name" class="form-label">
            {{ t('auth.name') || '姓名' }}
          </label>
          <div class="form-input-wrapper">
            <div class="form-input-icon">
              <User class="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="name"
              :value="fields.name?.value"
              @input="handleInput('name', $event)"
              @blur="fields.name?.validate"
              type="text"
              autocomplete="name"
              :placeholder="t('auth.namePlaceholder') || '请输入您的姓名'"
              class="form-input"
              :class="{
                'form-input--error': fields.name?.errorMessage,
                'form-input--focused': fields.name?.touched && !fields.name?.errorMessage,
              }"
            />
          </div>
          <transition name="error-fade">
            <p v-if="fields.name?.errorMessage" class="form-error">
              {{ fields.name?.errorMessage }}
            </p>
          </transition>
        </div>

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
              :value="fields.email?.value"
              @input="handleInput('email', $event)"
              @blur="fields.email?.validate"
              type="email"
              inputmode="email"
              autocomplete="email"
              :placeholder="t('auth.emailPlaceholder')"
              class="form-input"
              :class="{
                'form-input--error': fields.email?.errorMessage,
                'form-input--focused': fields.email?.touched && !fields.email?.errorMessage,
              }"
            />
          </div>
          <transition name="error-fade">
            <p v-if="fields.email?.errorMessage" class="form-error">
              {{ fields.email?.errorMessage }}
            </p>
          </transition>
        </div>

        <!-- 密码输入 -->
        <div class="form-group">
          <label for="password" class="form-label">
            <div class="flex items-center justify-between w-full">
              <span>{{ t('auth.password') }}</span>
              <div class="flex items-center gap-2">
                <div class="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    class="h-full transition-all duration-300"
                    :style="{
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      backgroundColor: passwordStrength.color,
                    }"
                  ></div>
                </div>
                <span class="text-xs font-medium" :style="{ color: passwordStrength.color }">
                  {{ passwordStrength.text }}
                </span>
              </div>
            </div>
          </label>
          <div class="form-input-wrapper">
            <div class="form-input-icon">
              <Lock class="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="password"
              :value="fields.password?.value"
              @input="handleInput('password', $event)"
              @blur="fields.password?.validate"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              :placeholder="t('auth.passwordPlaceholder')"
              class="form-input pr-12"
              :class="{
                'form-input--error': fields.password?.errorMessage,
                'form-input--focused': fields.password?.touched && !fields.password?.errorMessage,
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
            <p v-if="fields.password?.errorMessage" class="form-error">
              {{ fields.password?.errorMessage }}
            </p>
          </transition>

          <!-- 密码要求提示 -->
          <div
            v-if="fields.password?.value"
            class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
          >
            <div class="flex items-start gap-2 mb-2">
              <Info class="w-4 h-4 text-blue-500 mt-0.5" />
              <span class="text-sm font-medium text-blue-800 dark:text-blue-200"> 密码要求 </span>
            </div>
            <div class="space-y-1">
              <div
                v-for="requirement in passwordRequirements"
                :key="requirement.text"
                class="flex items-center gap-2 text-sm"
              >
                <CheckCircle v-if="requirement.met" class="w-3 h-3 text-green-500" />
                <div
                  v-else
                  class="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                />
                <span
                  :class="{
                    'text-green-700 dark:text-green-300': requirement.met,
                    'text-gray-600 dark:text-gray-400': !requirement.met,
                  }"
                >
                  {{ requirement.text }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 确认密码输入 -->
        <div class="form-group">
          <label for="confirmPassword" class="form-label">
            {{ t('auth.confirmPassword') }}
          </label>
          <div class="form-input-wrapper">
            <div class="form-input-icon">
              <Shield class="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              :value="fields.confirmPassword?.value"
              @input="handleInput('confirmPassword', $event)"
              @blur="fields.confirmPassword?.validate"
              :type="showConfirmPassword ? 'text' : 'password'"
              autocomplete="new-password"
              :placeholder="t('auth.confirmPasswordPlaceholder')"
              class="form-input pr-12"
              :class="{
                'form-input--error': fields.confirmPassword?.errorMessage,
                'form-input--focused':
                  fields.confirmPassword?.touched && !fields.confirmPassword?.errorMessage,
              }"
            />
            <button
              type="button"
              @click="toggleConfirmPasswordVisibility"
              :disabled="isLoading"
              class="form-input-suffix"
            >
              <EyeOff v-if="showConfirmPassword" class="w-4 h-4 text-gray-400" />
              <Eye v-else class="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <transition name="error-fade">
            <p v-if="fields.confirmPassword?.errorMessage" class="form-error">
              {{ fields.confirmPassword?.errorMessage }}
            </p>
          </transition>
        </div>

        <!-- 服务条款 -->
        <div class="form-group">
          <label class="flex items-start gap-3 cursor-pointer">
            <input
              :checked="fields.agreeToTerms?.value"
              @change="handleCheckboxChange('agreeToTerms', $event)"
              @blur="fields.agreeToTerms?.validate"
              type="checkbox"
              class="form-checkbox mt-1"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ t('auth.agreeToTerms') }}
              <button
                type="button"
                class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                {{ t('auth.termsOfService') }}
              </button>
              {{ t('auth.and') }}
              <button
                type="button"
                class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                {{ t('auth.privacyPolicy') }}
              </button>
            </span>
          </label>
          <transition name="error-fade">
            <p v-if="fields.agreeToTerms?.errorMessage" class="form-error">
              {{ fields.agreeToTerms?.errorMessage }}
            </p>
          </transition>
        </div>

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
            {{ t('auth.registering') }}
          </span>
          <span v-else class="form-submit-button__content">
            {{ t('auth.createAccount') }}
            <ArrowRight class="w-4 h-4 ml-2" />
          </span>
        </button>
      </form>
    </div>
  </AuthLayout>

  <!-- 注册成功对话框 -->
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
          <CheckCircle class="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('auth.registrationSuccessful') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ t('auth.registrationSuccessMessage') }}
        </p>
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-sm text-gray-500 dark:text-gray-400"> 正在跳转到登录页面... </span>
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
