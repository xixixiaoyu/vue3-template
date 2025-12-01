<template>
  <div
    ref="containerRef"
    class="overflow-y-auto relative"
    :style="{ height: `${containerHeight}px` }"
    @scroll="handleScroll"
  >
    <div class="absolute inset-x-0 top-0 -z-10" :style="{ height: `${totalHeight}px` }"></div>
    <div class="relative" :style="{ transform: `translateY(${offsetY}px)` }">
      <div
        v-for="item in visibleItems"
        :key="getItemKey(item)"
        class="flex items-center border-b px-4 hover:bg-accent/10"
        :style="{ height: `${itemHeight}px` }"
      >
        <slot :item="item" :index="item.index" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'

interface Props {
  items: any[]
  itemHeight?: number
  containerHeight?: number
  overscan?: number
  getItemKey?: (item: any) => string | number
}

const props = withDefaults(defineProps<Props>(), {
  itemHeight: 50,
  containerHeight: 400,
  overscan: 5,
  getItemKey: (item: any) => item.id || item.key,
})

const containerRef = ref<HTMLElement>()

const virtualizer = useVirtualizer({
  count: props.items.length,
  getScrollElement: () => containerRef.value || null,
  estimateSize: () => props.itemHeight,
  overscan: props.overscan,
})

const totalHeight = computed(() => virtualizer.value.getTotalSize())
const visibleItems = computed(() => virtualizer.value.getVirtualItems())
const offsetY = computed(() => visibleItems.value[0]?.start || 0)

const handleScroll = () => {
  virtualizer.value.scrollToOffset(containerRef.value?.scrollTop || 0)
}

onMounted(() => {
  if (containerRef.value) {
    virtualizer.value.scrollToOffset(0)
  }
})

// 监听 items 变化
watch(
  () => props.items,
  () => {
    virtualizer.value.scrollToOffset(0)
  },
  { deep: true }
)
</script>
