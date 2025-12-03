<script setup lang="ts">
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  show?: boolean
  message?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
})

const overlayClasses = computed(() => {
  return [
    'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300',
    props.show ? 'opacity-100' : 'opacity-0 pointer-events-none',
    props.class || '',
  ]
    .filter(Boolean)
    .join(' ')
})
</script>

<template>
  <Transition name="loading-overlay">
    <div v-if="show" :class="overlayClasses">
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col items-center space-y-4 max-w-sm mx-4"
      >
        <LoadingSpinner size="lg" />
        <p v-if="message" class="text-sm text-gray-600 dark:text-gray-300 text-center">
          {{ message }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-overlay-enter-active,
.loading-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.loading-overlay-enter-from,
.loading-overlay-leave-to {
  opacity: 0;
}
</style>
