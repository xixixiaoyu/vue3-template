import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalStorageString } from './useLocalStorage'

export function useLocale() {
  const { locale, t, availableLocales } = useI18n()
  const { setValue: setStoredLocale } = useLocalStorageString('locale', 'zh')

  const currentLocale = computed({
    get: () => locale.value,
    set: (value: string) => {
      locale.value = value
      setStoredLocale(value)
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

  return {
    currentLocale,
    t,
    availableLocales,
    toggleLocale,
    setLocale,
    isCurrentLocale,
  }
}
