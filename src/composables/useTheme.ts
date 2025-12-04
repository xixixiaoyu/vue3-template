import { ref, computed, watch, readonly } from 'vue'
import { useLocalStorage } from './useLocalStorage'

export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'app-theme'

export function useTheme() {
  const { state: storedTheme } = useLocalStorage<Theme>(THEME_STORAGE_KEY, 'system')

  const theme = ref<Theme>(storedTheme.value)
  const systemTheme = ref<'light' | 'dark'>('light')

  // 检测系统主题
  const detectSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      systemTheme.value = 'dark'
    } else {
      systemTheme.value = 'light'
    }
  }

  // 初始化系统主题检测
  detectSystemTheme()

  // 监听系统主题变化
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', detectSystemTheme)
  }

  // 计算当前实际使用的主题
  const isDark = computed(() => {
    if (theme.value === 'system') {
      return systemTheme.value === 'dark'
    }
    return theme.value === 'dark'
  })

  // 切换主题
  const toggleTheme = () => {
    if (theme.value === 'light') {
      setTheme('dark')
    } else if (theme.value === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  // 设置主题
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    storedTheme.value = newTheme
    applyTheme()
  }

  // 应用主题到 DOM
  const applyTheme = () => {
    const html = document.documentElement

    if (isDark.value) {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
    }

    // 设置主题色到 meta 标签
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', isDark.value ? '#1f2937' : '#ffffff')
    }
  }

  // 监听主题变化并应用
  watch([theme, systemTheme], applyTheme, { immediate: true })

  // 获取主题图标
  const themeIcon = computed(() => {
    if (theme.value === 'system') {
      return isDark.value ? 'moon' : 'sun'
    }
    return theme.value
  })

  // 获取主题名称
  const themeName = computed(() => {
    switch (theme.value) {
      case 'light':
        return '浅色'
      case 'dark':
        return '深色'
      case 'system':
        return '跟随系统'
      default:
        return '浅色'
    }
  })

  return {
    theme: readonly(theme),
    isDark,
    systemTheme: readonly(systemTheme),
    themeIcon,
    themeName,
    toggleTheme,
    setTheme,
    applyTheme,
  }
}
