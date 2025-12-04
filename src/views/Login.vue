<script setup lang="ts">
// 定义组件名称
defineOptions({
  name: 'LoginPage',
})
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  useFormValidation,
  validationRules,
  useSeo,
  useAutoAnimate,
  useLocalStorageBoolean,
  useLocalStorageString,
} from '@/composables'
import { useLocale } from '@/composables/useI18n'
import { z } from 'zod'
import { LogIn, Mail, Lock, Eye, EyeOff, Moon, Sun, Languages } from 'lucide-vue-next'
import OAuthButtons from '@/components/auth/OAuthButtons.vue'

const router = useRouter()
const authStore = useAuthStore()

// 本地存储记住我状态
const { value: rememberMe } = useLocalStorageBoolean('rememberMe', false)
const { state: savedEmail } = useLocalStorageString('savedEmail', '')

// 定义表单验证 schema
const loginSchema = z.object({
  email: validationRules.email,
  password: validationRules.password,
})

// 使用表单验证
const { fields, isSubmitting, serverError, handleSubmit } = useFormValidation({
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

      // 登录成功，重定向到登录页
      router.push({ name: 'login' })
    } else {
      // 登录失败，抛出错误让 composable 处理
      throw new Error(result.error || '登录失败，请重试')
    }
  },
})

// 表单状态
const showPassword = ref(false)
const isDark = ref(false)

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

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
  // 这里可以添加实际的主题切换逻辑
}

// 忘记密码
const handleForgotPassword = async () => {
  if (!fields.email.value) {
    // 使用表单验证的错误提示
    fields.email.validate()
    return
  }

  const result = await authStore.resetPassword(fields.email.value)
  if (result.success) {
    // 显示成功消息
    console.log('密码重置邮件已发送')
  } else {
    // 显示错误消息
    console.error('密码重置失败:', result.error)
  }
}

// 获取国际化函数
const { t, toggleLocale } = useLocale()

// 设置 SEO 元数据
useSeo({
  title: t('auth.login') + ' - Vue 3 Supabase 模板',
  description: t('auth.loginDescription') || '登录您的账户以访问我们的服务',
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
            <LogIn />
          </n-icon>
        </n-avatar>
        <n-h1 class="mb-3 tracking-tight"> {{ t('auth.welcomeBack') || '欢迎回来' }} </n-h1>
        <n-p depth="3" class="text-lg leading-relaxed">
          {{ t('auth.loginSubtitle') || '登录您的账户以继续使用' }}
        </n-p>
      </div>

      <!-- 登录卡片 -->
      <n-card>
        <div class="space-y-6">
          <div class="text-center">
            <n-h2>{{ t('auth.login') }}</n-h2>
            <n-p depth="3" class="text-base leading-relaxed">
              {{ t('auth.noAccount') || '还没有账户？' }}
              <n-button text type="primary" @click="goToRegister">
                {{ t('auth.register') || '立即注册' }}
              </n-button>
            </n-p>
          </div>

          <!-- OAuth 登录 -->
          <OAuthButtons :redirect-path="($route.query.redirect as string) || '/'" />

          <!-- 错误提示 -->
          <n-alert v-if="hasError" type="error" :title="errorMessage" show-icon />

          <form ref="setParent" class="space-y-5" @submit.prevent="handleSubmit">
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
                  <n-button text type="primary" size="tiny" @click="handleForgotPassword">
                    {{ t('auth.forgotPassword') }}
                  </n-button>
                </div>
              </template>
              <n-input
                v-model:value="fields.password.value"
                @blur="fields.password.validate"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
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

            <!-- 记住我和提交按钮 -->
            <div class="space-y-4">
              <n-checkbox v-model:checked="rememberMe"> {{ t('auth.rememberMe') }} </n-checkbox>

              <n-button
                type="primary"
                size="large"
                :loading="isLoading"
                block
                @click="handleSubmit"
              >
                {{ isLoading ? t('auth.loggingIn') || '登录中...' : t('auth.login') }}
              </n-button>
            </div>
          </form>
        </div>
      </n-card>

      <!-- 底部信息 -->
      <div class="text-center mt-6">
        <n-text depth="3" class="text-sm leading-relaxed">
          {{ t('auth.termsNotice') || '登录即表示您同意我们的服务条款和隐私政策' }}
        </n-text>
      </div>
    </div>
  </div>
</template>
