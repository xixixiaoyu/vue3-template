import { createI18n } from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'

const i18n = createI18n({
  legacy: false,
  locale: 'zh', // 初始语言设置为中文
  fallbackLocale: 'en',
  messages: {
    zh,
    en,
  },
  silentTranslationWarn: true, // 静默翻译警告
  silentFallbackWarn: true, // 静默回退警告
})

export default i18n
