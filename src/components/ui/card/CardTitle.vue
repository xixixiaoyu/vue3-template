<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface CardTitleProps {
  class?: string
}

const props = withDefaults(defineProps<CardTitleProps>(), {})

const cardTitleClass = computed(() => {
  return cn('text-2xl font-semibold leading-none tracking-tight', props.class)
})
</script>

<template>
  <h3 :class="cardTitleClass" v-bind="$attrs">
    <slot />
  </h3>
</template>
