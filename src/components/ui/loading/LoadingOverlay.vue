<script setup lang="ts">
interface Props {
  show?: boolean
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
})
</script>

<template>
  <n-modal
    :show="show"
    :mask-closable="false"
    :closable="false"
    :auto-focus="false"
    preset="dialog"
    style="width: 448px"
  >
    <div class="flex flex-col items-center space-y-4 py-6">
      <n-spin size="large" />
      <n-text v-if="message" depth="3">
        {{ message }}
      </n-text>
    </div>
  </n-modal>
</template>
