<script setup lang="ts">
import { computed, type Component } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

// 定义组件名称为多词形式
defineOptions({
  name: 'UiIcon',
})

// 定义所有可用的图标名称类型
export type IconName = keyof typeof LucideIcons

interface Props {
  name: IconName
  size?: number | string
  color?: string
  strokeWidth?: number
  absoluteStrokeWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  strokeWidth: 2,
  absoluteStrokeWidth: false,
})

// 获取对应的图标组件
const iconComponent = computed<Component>(() => {
  const icon = LucideIcons[props.name]
  if (!icon) {
    console.warn(`Icon "${props.name}" not found in lucide-vue-next`)
    // 返回一个默认的占位图标
    return LucideIcons.HelpCircle as Component
  }
  return icon as Component
})

// 计算图标样式
const iconStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.color) {
    style.color = props.color
  }

  return style
})

// 计算图标属性
const iconProps = computed(() => ({
  size: props.size,
  strokeWidth: props.strokeWidth,
  absoluteStrokeWidth: props.absoluteStrokeWidth,
}))
</script>

<template>
  <component :is="iconComponent" v-bind="iconProps" :style="iconStyle" class="icon-component" />
</template>

<style scoped>
.icon-component {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
