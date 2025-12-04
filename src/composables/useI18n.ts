import { computed, onMounted, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalStorageString } from './useLocalStorage'

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
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.toLowerCase()

      // 检测中文
      if (browserLang.includes('zh') || browserLang.includes('chinese')) {
        return 'zh'
      }

      // 检测英文
      if (browserLang.includes('en')) {
        return 'en'
      }
    }

    // 默认返回中文
    return 'zh'
  }

  // 初始化时自动设置语言
  onMounted(() => {
    const savedLocale = localStorage.getItem('locale')

    // 如果没有保存的语言，则自动检测
    if (!savedLocale) {
      const detectedLocale = detectUserLanguage()
      if (detectedLocale && availableLocales.includes(detectedLocale)) {
        currentLocale.value = detectedLocale
        setStoredLocale(detectedLocale)
      }
    } else {
      // 确保当前语言与保存的语言一致
      if (locale.value !== savedLocale && availableLocales.includes(savedLocale)) {
        locale.value = savedLocale
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
