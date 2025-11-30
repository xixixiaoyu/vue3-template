<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'white'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-4 w-4'
    case 'lg':
      return 'h-8 w-8'
    default:
      return 'h-6 w-6'
  }
})

const colorClasses = computed(() => {
  switch (props.color) {
    case 'secondary':
      return 'text-gray-500 dark:text-gray-400'
    case 'white':
      return 'text-white'
    default:
      return 'text-primary dark:text-primary-foreground'
  }
})
</script>

<template>
  <div :class="cn('animate-spin', sizeClasses, colorClasses, props.class)">
    <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
</template>
