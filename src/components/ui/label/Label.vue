<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface LabelProps {
  class?: string
  for?: string
}

const props = withDefaults(defineProps<LabelProps>(), {})

const labelClass = computed(() => {
  return cn(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    props.class
  )
})
</script>

<template>
  <label :class="labelClass" :for="props.for" v-bind="$attrs">
    <slot />
  </label>
</template>
