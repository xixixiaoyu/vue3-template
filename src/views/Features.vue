<template>
  <div class="features-container p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-center">
        {{ t('dashboard.welcome') }}
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 国际化支持 -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Globe class="h-5 w-5" />
              {{ t('common.settings') }}
            </CardTitle>
            <CardDescription> Vue I18n 国际化支持 </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <p class="text-sm text-muted-foreground">支持多语言切换，包含中文和英文语言包。</p>
              <LanguageSwitcher />
            </div>
          </CardContent>
        </Card>

        <!-- 进度条 -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Loader class="h-5 w-5" />
              NProgress 页面加载进度条
            </CardTitle>
            <CardDescription> 路由切换时显示加载进度条 </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <p class="text-sm text-muted-foreground">
                在页面路由切换时自动显示加载进度条，提升用户体验。
              </p>
              <Button @click="simulateProgress" class="w-full">
                {{ t('common.refresh') }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- 图片懒加载 -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Image class="h-5 w-5" />
              Vue Lazyload 图片懒加载
            </CardTitle>
            <CardDescription> 图片懒加载优化性能 </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <p class="text-sm text-muted-foreground">
                自动懒加载图片，减少初始加载时间，提升页面性能。
              </p>
              <div class="grid grid-cols-2 gap-4">
                <LazyImage
                  src="https://picsum.photos/200/200?random=1"
                  alt="示例图片 1"
                  class="w-full h-32 object-cover rounded"
                />
                <LazyImage
                  src="https://picsum.photos/200/200?random=2"
                  alt="示例图片 2"
                  class="w-full h-32 object-cover rounded"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- PWA 支持 -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Smartphone class="h-5 w-5" />
              PWA 支持
            </CardTitle>
            <CardDescription> 渐进式 Web 应用 </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <p class="text-sm text-muted-foreground">
                支持 PWA 功能，可以安装到设备桌面，离线可用。
              </p>
              <div class="flex gap-2">
                <Button variant="outline" @click="checkPWAInstall">
                  {{ t('pwa.install') }}
                </Button>
                <Button variant="outline" @click="checkOnlineStatus">
                  {{ t('pwa.offline') }}/{{ t('pwa.online') }}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 虚拟滚动 -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <List class="h-5 w-5" />
              虚拟滚动列表
            </CardTitle>
            <CardDescription> 高性能大列表渲染 </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <p class="text-sm text-muted-foreground">
                使用虚拟滚动技术，高效渲染大量数据，提升性能。
              </p>
              <div class="h-64 border rounded">
                <VirtualList :items="virtualItems" :item-height="50" :container-height="250">
                  <template #item="{ item }">
                    <div class="p-2 border-b">
                      <span class="text-sm">项目 {{ item.id }}: {{ item.name }}</span>
                    </div>
                  </template>
                </VirtualList>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 拖拽功能 -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Move class="h-5 w-5" />
              拖拽排序
            </CardTitle>
            <CardDescription> 可拖拽排序列表 </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <p class="text-sm text-muted-foreground">支持拖拽排序功能，直观地重新排列列表项。</p>
              <div class="border rounded p-4">
                <DraggableList v-model="draggableItems" item-key="id" :animation="200">
                  <template #item="{ item }">
                    <div class="p-2 bg-accent rounded mb-2 cursor-move">
                      <span class="text-sm">{{ item.name }}</span>
                    </div>
                  </template>
                </DraggableList>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 错误监控 -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Shield class="h-5 w-5" />
              Sentry 错误监控
            </CardTitle>
            <CardDescription> 生产环境错误追踪 </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <p class="text-sm text-muted-foreground">
                集成 Sentry 错误监控，自动收集生产环境错误信息。
              </p>
              <Button @click="simulateError" variant="destructive" class="w-full">
                {{ t('errors.unknown') }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- PWA 安装提示 -->
    <PWAInstall />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Globe, Loader, Image, Smartphone, List, Move, Shield } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { LazyImage } from '@/components/ui/lazy-image'
import { VirtualList } from '@/components/ui/virtual-list'
import { DraggableList } from '@/components/ui/draggable-list'
import { PWAInstall } from '@/components/ui/pwa-install'
import { useLocale } from '@/composables/useI18n'
import { reportError } from '@/lib/sentry'

// 定义组件名称
defineOptions({
  name: 'FeaturesView',
})

const { t } = useLocale()

// 虚拟列表数据
const virtualItems = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `项目 ${i + 1}`,
  }))
)

// 拖拽列表数据
const draggableItems = ref([
  { id: 1, name: '任务 A' },
  { id: 2, name: '任务 B' },
  { id: 3, name: '任务 C' },
  { id: 4, name: '任务 D' },
  { id: 5, name: '任务 E' },
])

// 模拟进度条
const simulateProgress = () => {
  console.log('进度条功能已移除')
}

// 检查 PWA 安装
const checkPWAInstall = () => {
  if ('serviceWorker' in navigator) {
    console.log('PWA is supported')
  } else {
    console.log('PWA is not supported')
  }
}

// 检查在线状态
const checkOnlineStatus = () => {
  console.log('Online status:', navigator.onLine ? 'Online' : 'Offline')
}

// 模拟错误
const simulateError = () => {
  try {
    throw new Error('这是一个测试错误')
  } catch (error) {
    reportError(error as Error, {
      component: 'Features',
      action: 'simulateError',
    })
  }
}
</script>

<style scoped>
.features-container {
  min-height: 100vh;
}
</style>
