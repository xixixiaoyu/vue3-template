<template>
  <div class="language-switcher">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="sm" class="language-trigger">
          <Globe class="h-4 w-4 mr-2" />
          {{ currentLanguage }}
          <ChevronDown class="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          v-for="lang in languages"
          :key="lang.code"
          @click="switchLanguage(lang.code)"
          :class="{ 'bg-accent': isCurrentLanguage(lang.code) }"
        >
          <span class="mr-2">{{ lang.flag }}</span>
          {{ lang.name }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Globe, ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLocale } from '@/composables/useI18n'

const { currentLocale, setLocale } = useLocale()

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
}
</script>

<style scoped>
.language-switcher {
  display: inline-block;
}

.language-trigger {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
