<template>
  <div ref="chartRef" :style="{ width, height }" />
</template>

<script setup lang="ts">
// 定义组件名称为多词形式
defineOptions({
  name: 'BaseChart',
})
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts/core'
import type { EChartsOption } from 'echarts'

interface Props {
  option: EChartsOption
  width?: string
  height?: string
  theme?: string
  autoResize?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '400px',
  autoResize: true,
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value, props.theme)
  chartInstance.setOption(props.option)

  if (props.autoResize) {
    window.addEventListener('resize', handleResize)
  }
}

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

const updateChart = () => {
  if (chartInstance) {
    chartInstance.setOption(props.option, true)
  }
}

watch(
  () => props.option,
  () => {
    updateChart()
  },
  { deep: true }
)

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  if (props.autoResize) {
    window.removeEventListener('resize', handleResize)
  }
})

defineExpose({
  getChartInstance: () => chartInstance,
})
</script>
