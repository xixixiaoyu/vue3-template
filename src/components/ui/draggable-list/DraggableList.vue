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
          class="cursor-move select-none transition-all duration-200 ease-in-out hover:bg-blue-100 dark:hover:bg-blue-900/20"
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
  opacity: 0.5;
  background-color: rgba(59, 130, 246, 0.1);
  border: 2px dashed rgb(59, 130, 246);
}

:deep(.chosen) {
  background-color: rgba(59, 130, 246, 0.1);
  border: 2px solid rgb(59, 130, 246);
}

:deep(.dragging) {
  opacity: 0.8;
  transform: rotate(3deg);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
