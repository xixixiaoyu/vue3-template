import { createI18n } from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'

const defaultLocale = localStorage.getItem('locale') || 'zh'

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {
    zh,
    en,
  } as any,
})

export default i18n
