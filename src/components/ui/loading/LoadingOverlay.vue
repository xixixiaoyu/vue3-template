<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
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
  return cn(
    'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300',
    props.show ? 'opacity-100' : 'opacity-0 pointer-events-none',
    props.class
  )
})
</script>

<template>
  <Transition name="loading-overlay">
    <div v-if="show" :class="overlayClasses">
      <div class="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p v-if="message" class="text-sm text-gray-600">
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
