<script setup lang="ts">
// 定义组件名称
defineOptions({
  name: 'RegisterPage',
})
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFormValidation, validationRules, useAutoAnimate, useSeo } from '@/composables'
import { useLocale } from '@/composables/useI18n'
import { z } from 'zod'
import {
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Languages,
  User,
  Shield,
} from 'lucide-vue-next'
import OAuthButtons from '@/components/auth/OAuthButtons.vue'

const router = useRouter()
const authStore = useAuthStore()

// 定义表单验证 schema
const registerSchema = z
  .object({
    email: validationRules.email,
    password: validationRules.password,
    confirmPassword: z.string().min(1, '请确认密码'),
    name: z.string().min(2, '姓名至少需要 2 个字符').max(50, '姓名不能超过 50 个字符'),
    agreeToTerms: z.boolean().refine((val) => val === true, '请同意服务条款和隐私政策'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

// 使用表单验证
const { fields, isSubmitting, serverError, handleSubmit } = useFormValidation({
  schema: registerSchema,
  initialValues: {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
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
      // 注册成功，显示成功消息
      showSuccessMessage()
      // 延迟重定向到登录页
      setTimeout(() => {
        router.push({ name: 'login' })
      }, 2000)
    } else {
      // 注册失败，抛出错误让 composable 处理
      throw new Error(result.error || '注册失败，请重试')
    }
  },
})

// 表单状态
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isDark = ref(false)
const showSuccessDialog = ref(false)

// 计算属性
const isLoading = computed(() => isSubmitting.value || authStore.loading)
const hasError = computed(() => !!(serverError.value || authStore.error))
const errorMessage = computed(() => serverError.value || authStore.error || '')
const passwordStrength = computed(() => {
  const password = fields.password.value || ''
  let strength = 0

  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  return strength
})

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 0:
    case 1:
      return '弱'
    case 2:
    case 3:
      return '中等'
    case 4:
    case 5:
      return '强'
    default:
      return ''
  }
})

const passwordStrengthColor = computed(() => {
  switch (passwordStrength.value) {
    case 0:
    case 1:
      return '#d03050'
    case 2:
    case 3:
      return '#f0a020'
    case 4:
    case 5:
      return '#18a058'
    default:
      return '#909399'
  }
})

// 获取国际化函数
const { t, toggleLocale } = useLocale()

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

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
  // 这里可以添加实际的主题切换逻辑
}

// 显示成功消息
const showSuccessMessage = () => {
  showSuccessDialog.value = true
}

// 设置 SEO 元数据
useSeo({
  title: t('auth.register') + ' - Vue 3 Supabase 模板',
  description: t('auth.registerDescription') || '创建新账户以开始使用我们的服务',
  keywords: '注册,认证,Vue 3,Supabase',
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
      <!-- 顶部工具栏 -->
      <div class="flex justify-between items-center mb-6">
        <!-- 主题切换按钮 -->
        <n-button circle @click="toggleTheme" size="small">
          <template #icon>
            <n-icon>
              <Sun v-if="isDark" />
              <Moon v-else />
            </n-icon>
          </template>
        </n-button>

        <!-- 语言切换按钮 -->
        <n-button circle @click="toggleLocale" size="small">
          <template #icon>
            <n-icon>
              <Languages />
            </n-icon>
          </template>
        </n-button>
      </div>

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
        <n-h1 class="mb-3 tracking-tight"> {{ t('auth.createAccount') || '创建新账户' }} </n-h1>
        <n-p depth="3" class="text-lg leading-relaxed">
          {{ t('auth.registerSubtitle') || '注册以开始使用我们的服务' }}
        </n-p>
      </div>

      <!-- 注册卡片 -->
      <n-card>
        <div class="space-y-6">
          <div class="text-center">
            <n-h2>{{ t('auth.register') }}</n-h2>
            <n-p depth="3" class="text-base leading-relaxed">
              {{ t('auth.hasAccount') || '已有账户？' }}
              <n-button text type="primary" @click="goToLogin">
                {{ t('auth.login') || '立即登录' }}
              </n-button>
            </n-p>
          </div>

          <!-- OAuth 注册 -->
          <OAuthButtons :redirect-path="'/'" />

          <!-- 错误提示 -->
          <n-alert v-if="hasError" type="error" :title="errorMessage" show-icon />

          <form ref="setParent" class="space-y-5" @submit.prevent="handleSubmit">
            <!-- 姓名输入 -->
            <n-form-item
              :validation-status="fields.name.errorMessage ? 'error' : undefined"
              :feedback="fields.name.errorMessage"
            >
              <template #label> {{ t('auth.name') || '姓名' }} </template>
              <n-input
                v-model:value="fields.name.value"
                @blur="fields.name.validate"
                type="text"
                autocomplete="name"
                :placeholder="t('auth.namePlaceholder') || '请输入您的姓名'"
                size="large"
                :input-props="{ class: 'pl-10' }"
              >
                <template #prefix>
                  <n-icon>
                    <User />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>

            <!-- 邮箱输入 -->
            <n-form-item
              :validation-status="fields.email.errorMessage ? 'error' : undefined"
              :feedback="fields.email.errorMessage"
            >
              <template #label> {{ t('auth.email') }} </template>
              <n-input
                v-model:value="fields.email.value"
                @blur="fields.email.validate"
                type="text"
                inputmode="email"
                autocomplete="email"
                :placeholder="t('auth.emailPlaceholder') || 'your@email.com'"
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
              <template #label>
                <div class="flex items-center justify-between w-full">
                  <span>{{ t('auth.password') }}</span>
                  <div class="flex items-center gap-2">
                    <div
                      class="w-12 h-1 rounded-full"
                      :style="{ backgroundColor: passwordStrengthColor }"
                    ></div>
                    <n-text :style="{ color: passwordStrengthColor }" class="text-xs">
                      {{ passwordStrengthText }}
                    </n-text>
                  </div>
                </div>
              </template>
              <n-input
                v-model:value="fields.password.value"
                @blur="fields.password.validate"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                :placeholder="t('auth.passwordPlaceholder') || '••••••••'"
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
              <template #label> {{ t('auth.confirmPassword') }} </template>
              <n-input
                v-model:value="fields.confirmPassword.value"
                @blur="fields.confirmPassword.validate"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                :placeholder="t('auth.confirmPasswordPlaceholder') || '••••••••'"
                size="large"
                :input-props="{ class: 'pl-10 pr-10' }"
              >
                <template #prefix>
                  <n-icon>
                    <Shield />
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

            <!-- 服务条款 -->
            <n-form-item
              :validation-status="fields.agreeToTerms.errorMessage ? 'error' : undefined"
              :feedback="fields.agreeToTerms.errorMessage"
            >
              <n-checkbox
                v-model:checked="fields.agreeToTerms.value"
                @blur="fields.agreeToTerms.validate"
              >
                {{ t('auth.agreeToTerms') || '我同意' }}
                <n-button text type="primary" size="tiny">{{
                  t('auth.termsOfService') || '服务条款'
                }}</n-button>
                {{ t('auth.and') || '和' }}
                <n-button text type="primary" size="tiny">{{
                  t('auth.privacyPolicy') || '隐私政策'
                }}</n-button>
              </n-checkbox>
            </n-form-item>

            <!-- 提交按钮 -->
            <n-button type="primary" size="large" :loading="isLoading" block @click="handleSubmit">
              {{
                isLoading
                  ? t('auth.registering') || '注册中...'
                  : t('auth.createAccount') || '创建账户'
              }}
            </n-button>
          </form>
        </div>
      </n-card>

      <!-- 底部信息 -->
      <div class="text-center mt-6">
        <n-text depth="3" class="text-sm leading-relaxed">
          {{ t('auth.registerTermsNotice') || '注册即表示您同意我们的服务条款和隐私政策' }}
        </n-text>
      </div>
    </div>

    <!-- 注册成功对话框 -->
    <n-modal v-model:show="showSuccessDialog" :mask-closable="false" :closable="false">
      <n-card
        style="max-width: 400px"
        title="注册成功"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button size="small" circle @click="showSuccessDialog = false">
            <template #icon>
              <n-icon>
                <EyeOff />
              </n-icon>
            </template>
          </n-button>
        </template>
        <div class="text-center py-4">
          <n-avatar :size="64" :style="{ backgroundColor: '#18a058' }" class="mb-4">
            <n-icon size="32" color="white">
              <UserPlus />
            </n-icon>
          </n-avatar>
          <n-h3 class="mb-2">{{ t('auth.registrationSuccessful') || '注册成功' }}</n-h3>
          <n-p depth="3">
            {{ t('auth.registrationSuccessMessage') || '您的账户已创建成功，即将跳转到仪表板...' }}
          </n-p>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>
