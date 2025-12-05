import { createI18n } from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'

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

// 初始时使用默认语言，后续在客户端会更新
const i18n = createI18n({
  legacy: false,
  locale: 'zh', // 初始语言设置为中文，后续会在客户端更新
  fallbackLocale: 'en',
  messages: {
    zh,
    en,
  },
  silentTranslationWarn: true, // 静默翻译警告
  silentFallbackWarn: true, // 静默回退警告
})

// 在客户端初始化语言设置
export const initI18n = () => {
  if (typeof window !== 'undefined') {
    const savedLocale = localStorage.getItem('locale')
    let localeToUse: SupportedLocale = 'zh' // 默认中文

    if (savedLocale) {
      const parsedLocale = parseStoredLocale(savedLocale)
      if (parsedLocale) {
        localeToUse = parsedLocale
      }
    } else {
      // 检测浏览器语言
      localeToUse = detectBrowserLanguage()
      // 保存检测到的语言
      localStorage.setItem('locale', localeToUse)
    }

    i18n.global.locale.value = localeToUse
  }
}

export default i18n
