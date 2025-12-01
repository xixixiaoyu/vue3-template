<template>
  <div class="w-full">
    <draggable
      v-model="modelValue"
      :item-key="itemKey"
      :animation="animation"
      :disabled="disabled"
      :ghost-class="ghostClass"
      :chosen-class="chosenClass"
      :drag-class="dragClass"
      @start="onDragStart"
      @end="onDragEnd"
      @change="onChange"
    >
      <template #item="{ element, index }">
        <div
          class="cursor-move select-none transition-all duration-200 ease-in-out hover:bg-primary/10"
        >
          <slot name="item" :item="element" :index="index" />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'

interface Props {
  modelValue: any[]
  itemKey?: string
  animation?: number
  disabled?: boolean
  ghostClass?: string
  chosenClass?: string
  dragClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  itemKey: 'id',
  animation: 200,
  disabled: false,
  ghostClass: 'ghost',
  chosenClass: 'chosen',
  dragClass: 'dragging',
})

const emit = defineEmits<{
  'update:modelValue': [value: any[]]
  'drag-start': [event: any]
  'drag-end': [event: any]
  change: [event: any]
}>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (value: any[]) => emit('update:modelValue', value),
})

const onDragStart = (event: any) => {
  emit('drag-start', event)
}

const onDragEnd = (event: any) => {
  emit('drag-end', event)
}

const onChange = (event: any) => {
  emit('change', event)
}
</script>

<style scoped>
/* 拖拽时的样式 */
:deep(.ghost) {
  @apply opacity-50 bg-primary/10 border-2 border-dashed border-primary;
}

:deep(.chosen) {
  @apply bg-primary/10 border-2 border-solid border-primary;
}

:deep(.dragging) {
  @apply opacity-80 rotate-3 shadow-lg;
}
</style>
