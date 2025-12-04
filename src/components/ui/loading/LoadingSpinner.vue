<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large'
  stroke?: string
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
})
</script>

<template>
  <n-spin :size="size" :stroke="stroke" />
</template>
