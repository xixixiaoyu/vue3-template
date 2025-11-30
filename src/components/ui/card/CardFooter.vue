<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface CardFooterProps {
  class?: string
}

const props = withDefaults(defineProps<CardFooterProps>(), {})

const cardFooterClass = computed(() => {
  return cn('flex items-center p-6 pt-0', props.class)
})
</script>

<template>
  <div :class="cardFooterClass" v-bind="$attrs">
    <slot />
  </div>
</template>
