<template>
  <div class="space-y-8">
    <!-- 柱状图 -->
    <Card>
      <CardHeader>
        <CardTitle>柱状图示例</CardTitle>
        <CardDescription>展示月度销售数据</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart :option="barChartOption" height="300px" />
      </CardContent>
    </Card>

    <!-- 折线图 -->
    <Card>
      <CardHeader>
        <CardTitle>折线图示例</CardTitle>
        <CardDescription>展示用户增长趋势</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart :option="lineChartOption" height="300px" />
      </CardContent>
    </Card>

    <!-- 饼图 -->
    <Card>
      <CardHeader>
        <CardTitle>饼图示例</CardTitle>
        <CardDescription>展示产品类别分布</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart :option="pieChartOption" height="300px" />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Chart } from '.'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card'
import type { EChartsOption } from 'echarts'

// 柱状图配置
const barChartOption = computed<EChartsOption>(() => ({
  title: {
    text: '月度销售数据',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: ['一月', '二月', '三月', '四月', '五月', '六月'],
    axisTick: {
      alignWithLabel: true,
    },
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '销售额',
      type: 'bar',
      barWidth: '60%',
      data: [120, 200, 150, 80, 70, 110],
      itemStyle: {
        color: '#3b82f6',
      },
    },
  ],
}))

// 折线图配置
const lineChartOption = computed<EChartsOption>(() => ({
  title: {
    text: '用户增长趋势',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['新用户', '活跃用户'],
    bottom: 0,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '新用户',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210],
      itemStyle: {
        color: '#10b981',
      },
    },
    {
      name: '活跃用户',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310],
      itemStyle: {
        color: '#f59e0b',
      },
    },
  ],
}))

// 饼图配置
const pieChartOption = computed<EChartsOption>(() => ({
  title: {
    text: '产品类别分布',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: '产品类别',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: '电子产品' },
        { value: 735, name: '服装配饰' },
        { value: 580, name: '家居用品' },
        { value: 484, name: '食品饮料' },
        { value: 300, name: '其他' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}))
</script>
