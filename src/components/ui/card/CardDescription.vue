<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface CardDescriptionProps {
  class?: string
}

const props = withDefaults(defineProps<CardDescriptionProps>(), {})

const cardDescriptionClass = computed(() => {
  return cn('text-sm text-muted-foreground', props.class)
})
</script>

<template>
  <p :class="cardDescriptionClass" v-bind="$attrs">
    <slot />
  </p>
</template>
