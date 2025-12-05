import { computed, onMounted, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalStorageString } from './useLocalStorage'

// 支持的语言列表
const SUPPORTED_LOCALES = ['zh', 'en'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

// 解析存储的语言设置
const parseStoredLocale = (storedValue: string): SupportedLocale | null => {
  // 尝试解析可能的 JSON 格式
  try {
    const parsed = JSON.parse(storedValue)
    if (SUPPORTED_LOCALES.includes(parsed as SupportedLocale)) {
      return parsed as SupportedLocale
    }
  } catch {
    // 如果不是 JSON 格式，直接使用字符串值
    if (SUPPORTED_LOCALES.includes(storedValue as SupportedLocale)) {
      return storedValue as SupportedLocale
    }
  }
  return null
}

// 检测浏览器语言
const detectBrowserLanguage = (): SupportedLocale => {
  if (typeof navigator !== 'undefined' && navigator.language) {
    const browserLang = navigator.language.toLowerCase()

    if (browserLang.includes('zh') || browserLang.includes('chinese')) {
      return 'zh'
    }
    if (browserLang.includes('en')) {
      return 'en'
    }
  }

  // 默认返回中文
  return 'zh'
}

interface LocaleReturn {
  currentLocale: ComputedRef<string>
  t: (key: string, ...args: any[]) => string
  availableLocales: readonly string[]
  toggleLocale: () => void
  setLocale: (lang: string) => void
  isCurrentLocale: (lang: string) => boolean
  detectUserLanguage: () => string
}

/**
 * 国际化 Hook
 * 提供语言切换、翻译和自动语言检测功能
 */
export const useLocale = (): LocaleReturn => {
  const { locale, t, availableLocales } = useI18n()
  const { setValue: setStoredLocale } = useLocalStorageString('locale', 'zh')

  const currentLocale = computed({
    get: () => locale.value,
    set: (value: string) => {
      if (availableLocales.includes(value)) {
        locale.value = value
        setStoredLocale(value)
      }
    },
  })

  const toggleLocale = () => {
    currentLocale.value = currentLocale.value === 'zh' ? 'en' : 'zh'
  }

  const setLocale = (lang: string) => {
    if (availableLocales.includes(lang)) {
      currentLocale.value = lang
    }
  }

  const isCurrentLocale = (lang: string) => {
    return currentLocale.value === lang
  }

  // 自动检测用户系统语言
  const detectUserLanguage = () => {
    return detectBrowserLanguage()
  }

  // 初始化时确保语言设置一致
  onMounted(() => {
    const savedLocale = localStorage.getItem('locale')

    if (savedLocale) {
      const localeToUse = parseStoredLocale(savedLocale)

      // 确保当前语言与保存的语言一致
      if (localeToUse && locale.value !== localeToUse) {
        locale.value = localeToUse
      }
    }
  })

  return {
    currentLocale,
    t,
    availableLocales,
    toggleLocale,
    setLocale,
    isCurrentLocale,
    detectUserLanguage,
  }
}
