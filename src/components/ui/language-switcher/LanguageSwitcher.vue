<template>
  <div class="language-switcher relative">
    <button
      @click="toggleDropdown"
      class="language-trigger flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <Globe class="h-4 w-4" />
      {{ currentLanguage }}
      <ChevronDown class="h-4 w-4" />
    </button>
    <div
      v-if="isOpen"
      class="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
    >
      <div
        v-for="lang in languages"
        :key="lang.code"
        @click="switchLanguage(lang.code)"
        class="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
        :class="{ 'bg-gray-100 dark:bg-gray-700': isCurrentLanguage(lang.code) }"
      >
        <span>{{ lang.flag }}</span>
        {{ lang.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Globe, ChevronDown } from 'lucide-vue-next'
import { useLocale } from '@/composables/useI18n'

const { currentLocale, setLocale } = useLocale()
const isOpen = ref(false)

const languages = [
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
]

const currentLanguage = computed(() => {
  const lang = languages.find((l) => l.code === currentLocale.value)
  return lang?.name || 'Language'
})

const isCurrentLanguage = (code: string) => {
  return currentLocale.value === code
}

const switchLanguage = (code: string) => {
  setLocale(code)
  isOpen.value = false
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 点击外部关闭下拉菜单
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  if (!target.closest('.language-switcher')) {
    isOpen.value = false
  }
})
</script>

<style scoped>
.language-switcher {
  display: inline-block;
}
</style>
