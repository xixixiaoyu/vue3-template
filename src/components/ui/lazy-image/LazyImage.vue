<template>
  <div
    class="relative overflow-hidden"
    :class="{ 'opacity-100': imageLoaded, 'opacity-0': !imageLoaded }"
  >
    <img
      v-lazy="src"
      :alt="alt"
      :class="imageClass"
      class="transition-opacity duration-300 ease-in-out"
      @load="onImageLoad"
      @error="onImageError"
    />
    <div
      v-if="!imageLoaded"
      class="absolute inset-0 flex items-center justify-center bg-muted rounded-inherit"
    >
      <div class="flex flex-col items-center gap-2">
        <LoadingSpinner v-if="showLoadingSpinner" size="sm" />
        <span v-if="placeholderText" class="text-sm text-muted-foreground">{{
          placeholderText
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LoadingSpinner } from '@/components/ui/loading'

interface Props {
  src: string
  alt?: string
  imageClass?: string
  placeholderText?: string
  showLoadingSpinner?: boolean
}

withDefaults(defineProps<Props>(), {
  alt: '',
  imageClass: '',
  placeholderText: '',
  showLoadingSpinner: true,
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

const imageLoaded = ref(false)

const onImageLoad = (event: Event) => {
  imageLoaded.value = true
  emit('load', event)
}

const onImageError = (event: Event) => {
  imageLoaded.value = true
  emit('error', event)
}
</script>
