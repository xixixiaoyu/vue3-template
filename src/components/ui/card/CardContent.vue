<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface CardContentProps {
  class?: string
}

const props = withDefaults(defineProps<CardContentProps>(), {})

const cardContentClass = computed(() => {
  return cn('p-6 pt-0', props.class)
})
</script>

<template>
  <div :class="cardContentClass" v-bind="$attrs">
    <slot />
  </div>
</template>
