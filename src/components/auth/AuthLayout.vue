<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useLocale } from '@/composables/useI18n'
import { useTheme } from '@/composables/useTheme'
import { useNotification } from '@/composables/useNotification'
import { Icon } from '@/components/ui'
import { NButton } from 'naive-ui'

interface Props {
  title: string
  subtitle?: string
  showLogo?: boolean
  logoIcon?: any
  maxWidth?: string
  showFooter?: boolean
  footerText?: string
}

const props = withDefaults(defineProps<Props>(), {
  showLogo: true,
  maxWidth: 'max-w-md',
  showFooter: true,
})

const { t, currentLocale, setLocale } = useLocale()
const { isDark, toggleTheme } = useTheme()
const { success } = useNotification()

const showLanguageSwitcher = ref(false)
const languageSwitcherRef = ref<HTMLElement | null>(null)

const containerClasses = computed(() => [
  'min-h-screen flex items-center justify-center p-4 transition-all duration-300',
  isDark.value
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
    : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50',
])

const cardClasses = computed(() => [
  'w-full',
  props.maxWidth,
  'backdrop-blur-lg bg-white/80 dark:bg-gray-800/80',
  'border border-gray-200/50 dark:border-gray-700/50',
  'shadow-2xl rounded-2xl overflow-hidden',
  'transition-all duration-300 hover:shadow-3xl',
])

const logoClasses = computed(() => [
  'w-16 h-16 mx-auto mb-6 rounded-2xl',
  'flex items-center justify-center',
  'bg-gradient-to-br from-blue-500 to-indigo-600',
  'text-white shadow-lg',
  'transition-all duration-300 hover:scale-105 hover:shadow-xl',
])

const handleLanguageChange = (newLocale: string) => {
  showLanguageSwitcher.value = false
  setLocale(newLocale)
  success('语言已切换', `已切换到 ${newLocale === 'zh' ? '中文' : 'English'}`)
}

// 点击外部关闭语言切换器
const handleClickOutside = (event: MouseEvent) => {
  if (languageSwitcherRef.value && !languageSwitcherRef.value.contains(event.target as Node)) {
    showLanguageSwitcher.value = false
  }
}

onMounted(() => {
  // 添加页面加载动画
  document.body.classList.add('auth-page-loaded')

  // 添加点击外部事件监听器
  nextTick(() => {
    document.addEventListener('click', handleClickOutside)
  })
})

onUnmounted(() => {
  // 移除事件监听器
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div :class="containerClasses">
    <!-- 背景装饰 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
      />
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl"
      />
    </div>

    <!-- 主要内容 -->
    <div class="relative z-10 w-full flex flex-col items-center">
      <!-- 顶部工具栏 -->
      <div class="flex justify-between items-center mb-6 px-2">
        <!-- 主题切换按钮 -->
        <n-button
          circle
          @click="toggleTheme"
          size="small"
          class="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50"
        >
          <template #icon>
            <Icon :name="isDark ? 'Sun' : 'Moon'" size="16" />
          </template>
        </n-button>

        <!-- 语言切换按钮 -->
        <div ref="languageSwitcherRef" class="relative">
          <n-button
            circle
            @click.stop="showLanguageSwitcher = !showLanguageSwitcher"
            size="small"
            class="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50"
          >
            <template #icon>
              <Icon name="Languages" size="16" />
            </template>
          </n-button>

          <!-- 语言切换下拉菜单 -->
          <div
            v-if="showLanguageSwitcher"
            class="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50"
          >
            <div class="p-2">
              <button
                v-for="lang in [
                  { code: 'zh', name: '中文' },
                  { code: 'en', name: 'English' },
                ]"
                :key="lang.code"
                @click="handleLanguageChange(lang.code)"
                class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="{
                  'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400':
                    currentLocale === lang.code,
                }"
              >
                {{ lang.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要卡片 -->
      <div :class="cardClasses">
        <!-- Logo 和标题区域 -->
        <div v-if="showLogo" class="p-8 pb-0">
          <div :class="logoClasses">
            <slot name="logo-icon">
              <Icon name="Shield" size="32" />
            </slot>
          </div>

          <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              {{ title }}
            </h1>
            <p v-if="subtitle" class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              {{ subtitle }}
            </p>
          </div>
        </div>

        <!-- 表单内容区域 -->
        <div class="p-8 pt-6">
          <slot />
        </div>
      </div>

      <!-- 底部信息 -->
      <div v-if="showFooter" class="text-center mt-6 px-2">
        <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          {{ footerText || t('auth.termsNotice') }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page-loaded {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>
