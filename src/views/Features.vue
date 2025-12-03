<template>
  <div class="features-container p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-center">
        {{ t('dashboard.welcome') }}
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 国际化支持 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="mb-4">
            <h3 class="flex items-center gap-2 text-lg font-semibold">
              <Globe class="h-5 w-5" />
              {{ t('common.settings') }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Vue I18n 国际化支持</p>
          </div>
          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              支持多语言切换，包含中文和英文语言包。
            </p>
            <LanguageSwitcher />
          </div>
        </div>

        <!-- 进度条 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="mb-4">
            <h3 class="flex items-center gap-2 text-lg font-semibold">
              <Loader class="h-5 w-5" />
              NProgress 页面加载进度条
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">路由切换时显示加载进度条</p>
          </div>
          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              在页面路由切换时自动显示加载进度条，提升用户体验。
            </p>
            <button
              @click="simulateProgress"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {{ t('common.refresh') }}
            </button>
          </div>
        </div>

        <!-- 图片懒加载 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="mb-4">
            <h3 class="flex items-center gap-2 text-lg font-semibold">
              <Image class="h-5 w-5" />
              Vue Lazyload 图片懒加载
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">图片懒加载优化性能</p>
          </div>
          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-300">
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
        </div>

        <!-- PWA 支持 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="mb-4">
            <h3 class="flex items-center gap-2 text-lg font-semibold">
              <Smartphone class="h-5 w-5" />
              PWA 支持
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">渐进式 Web 应用</p>
          </div>
          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              支持 PWA 功能，可以安装到设备桌面，离线可用。
            </p>
            <div class="flex gap-2">
              <button
                @click="checkPWAInstall"
                class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {{ t('pwa.install') }}
              </button>
              <button
                @click="checkOnlineStatus"
                class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {{ t('pwa.offline') }}/{{ t('pwa.online') }}
              </button>
            </div>
          </div>
        </div>

        <!-- 虚拟滚动 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="mb-4">
            <h3 class="flex items-center gap-2 text-lg font-semibold">
              <List class="h-5 w-5" />
              虚拟滚动列表
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">高性能大列表渲染</p>
          </div>
          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-300">
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
        </div>

        <!-- 拖拽功能 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="mb-4">
            <h3 class="flex items-center gap-2 text-lg font-semibold">
              <Move class="h-5 w-5" />
              拖拽排序
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">可拖拽排序列表</p>
          </div>
          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              支持拖拽排序功能，直观地重新排列列表项。
            </p>
            <div class="border rounded p-4">
              <DraggableList v-model="draggableItems" item-key="id" :animation="200">
                <template #item="{ item }">
                  <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded mb-2 cursor-move">
                    <span class="text-sm">{{ item.name }}</span>
                  </div>
                </template>
              </DraggableList>
            </div>
          </div>
        </div>

        <!-- Vue Query 数据管理 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="mb-4">
            <h3 class="flex items-center gap-2 text-lg font-semibold">
              <Database class="h-5 w-5" />
              Vue Query 数据管理
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">强大的数据获取和缓存</p>
          </div>
          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              集成 Vue Query，提供自动缓存、后台重新获取、请求去重、乐观更新等功能。
            </p>
            <button
              @click="goToUploadExample"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              查看使用示例
            </button>
          </div>
        </div>

        <!-- 错误监控 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="mb-4">
            <h3 class="flex items-center gap-2 text-lg font-semibold">
              <Shield class="h-5 w-5" />
              Sentry 错误监控
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">生产环境错误追踪</p>
          </div>
          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              集成 Sentry 错误监控，自动收集生产环境错误信息。
            </p>
            <button
              @click="simulateError"
              class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              {{ t('errors.unknown') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- PWA 安装提示 -->
    <PWAInstall />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Globe, Loader, Image, Smartphone, List, Move, Shield, Database } from 'lucide-vue-next'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { LazyImage } from '@/components/ui/lazy-image'
import { VirtualList } from '@/components/ui/virtual-list'
import { DraggableList } from '@/components/ui/draggable-list'
import { PWAInstall } from '@/components/ui/pwa-install'
import { useLocale } from '@/composables/useI18n'
import { reportError } from '@/lib/sentry'
import { useRouter } from 'vue-router'

// 定义组件名称
defineOptions({
  name: 'FeaturesView',
})

const { t } = useLocale()
const router = useRouter()

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

// 跳转到上传示例页面
const goToUploadExample = () => {
  router.push({ name: 'upload-example' })
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
