<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface CardProps {
  class?: string
}

const props = withDefaults(defineProps<CardProps>(), {})

const cardClass = computed(() => {
  return cn('rounded-lg border bg-card text-card-foreground shadow-sm', props.class)
})
</script>

<template>
  <div :class="cardClass" v-bind="$attrs">
    <slot />
  </div>
</template>
