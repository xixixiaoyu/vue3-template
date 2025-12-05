<template>
  <n-dropdown
    :options="languageOptions"
    :value="currentLocale"
    @select="handleLanguageSelect"
    placement="bottom-end"
    trigger="click"
  >
    <n-button text>
      <template #icon>
        <Icon name="Globe" size="16" />
      </template>
      {{ currentLanguage }}
      <Icon name="ChevronDown" size="16" class="ml-1" />
    </n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { Icon } from '@/components/ui'
import { useLocale } from '@/composables/useI18n'
import type { DropdownOption } from 'naive-ui'

const { currentLocale, setLocale } = useLocale()

const languages = [
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
]

const currentLanguage = computed(() => {
  const lang = languages.find((l) => l.code === currentLocale.value)
  return lang?.name || 'Language'
})

const languageOptions = computed<DropdownOption[]>(() =>
  languages.map((lang) => ({
    label: () =>
      h('div', { class: 'flex items-center gap-2' }, [h('span', lang.flag), h('span', lang.name)]),
    key: lang.code,
    value: lang.code,
  }))
)

const handleLanguageSelect = (key: string) => {
  setLocale(key)
}
</script>
