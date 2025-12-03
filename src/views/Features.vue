<template>
  <div class="features-container p-6">
    <div class="max-w-6xl mx-auto">
      <n-h1 class="mb-8 text-center">
        {{ t('dashboard.welcome') }}
      </n-h1>

      <n-grid :cols="1" s:2 l:3 :x-gap="16" :y-gap="16">
        <!-- 国际化支持 -->
        <n-grid-item>
          <n-card hoverable>
            <template #header>
              <div class="flex items-center gap-2">
                <n-icon size="20">
                  <Globe />
                </n-icon>
                {{ t('common.settings') }}
              </div>
            </template>
            <template #header-extra>
              <n-tag size="small" type="info"> Vue I18n </n-tag>
            </template>
            <n-p depth="3"> 支持多语言切换，包含中文和英文语言包。 </n-p>
            <div class="mt-4">
              <LanguageSwitcher />
            </div>
          </n-card>
        </n-grid-item>

        <!-- 进度条 -->
        <n-grid-item>
          <n-card hoverable>
            <template #header>
              <div class="flex items-center gap-2">
                <n-icon size="20">
                  <Loader />
                </n-icon>
                NProgress 页面加载进度条
              </div>
            </template>
            <template #header-extra>
              <n-tag size="small" type="success"> 路由切换 </n-tag>
            </template>
            <n-p depth="3"> 在页面路由切换时自动显示加载进度条，提升用户体验。 </n-p>
            <div class="mt-4">
              <n-button @click="simulateProgress" type="primary" block>
                {{ t('common.refresh') }}
              </n-button>
            </div>
          </n-card>
        </n-grid-item>

        <!-- 图片懒加载 -->
        <n-grid-item>
          <n-card hoverable>
            <template #header>
              <div class="flex items-center gap-2">
                <n-icon size="20">
                  <Image />
                </n-icon>
                Vue Lazyload 图片懒加载
              </div>
            </template>
            <template #header-extra>
              <n-tag size="small" type="warning"> 性能优化 </n-tag>
            </template>
            <n-p depth="3"> 自动懒加载图片，减少初始加载时间，提升页面性能。 </n-p>
            <div class="mt-4 grid grid-cols-2 gap-2">
              <LazyImage
                src="https://picsum.photos/200/200?random=1"
                alt="示例图片 1"
                class="w-full h-24 object-cover rounded"
              />
              <LazyImage
                src="https://picsum.photos/200/200?random=2"
                alt="示例图片 2"
                class="w-full h-24 object-cover rounded"
              />
            </div>
          </n-card>
        </n-grid-item>

        <!-- PWA 支持 -->
        <n-grid-item>
          <n-card hoverable>
            <template #header>
              <div class="flex items-center gap-2">
                <n-icon size="20">
                  <Smartphone />
                </n-icon>
                PWA 支持
              </div>
            </template>
            <template #header-extra>
              <n-tag size="small" type="error"> 渐进式 Web 应用 </n-tag>
            </template>
            <n-p depth="3"> 支持 PWA 功能，可以安装到设备桌面，离线可用。 </n-p>
            <div class="mt-4 flex gap-2">
              <n-button @click="checkPWAInstall" size="small">
                {{ t('pwa.install') }}
              </n-button>
              <n-button @click="checkOnlineStatus" size="small" type="tertiary">
                {{ t('pwa.offline') }}/{{ t('pwa.online') }}
              </n-button>
            </div>
          </n-card>
        </n-grid-item>

        <!-- 虚拟滚动 -->
        <n-grid-item>
          <n-card hoverable>
            <template #header>
              <div class="flex items-center gap-2">
                <n-icon size="20">
                  <List />
                </n-icon>
                虚拟滚动列表
              </div>
            </template>
            <template #header-extra>
              <n-tag size="small" type="info"> 高性能 </n-tag>
            </template>
            <n-p depth="3"> 使用虚拟滚动技术，高效渲染大量数据，提升性能。 </n-p>
            <div class="mt-4 h-64 border rounded">
              <VirtualList :items="virtualItems" :item-height="50" :container-height="250">
                <template #item="{ item }">
                  <div class="p-2 border-b">
                    <span class="text-sm">项目 {{ item.id }}: {{ item.name }}</span>
                  </div>
                </template>
              </VirtualList>
            </div>
          </n-card>
        </n-grid-item>

        <!-- 拖拽功能 -->
        <n-grid-item>
          <n-card hoverable>
            <template #header>
              <div class="flex items-center gap-2">
                <n-icon size="20">
                  <Move />
                </n-icon>
                拖拽排序
              </div>
            </template>
            <template #header-extra>
              <n-tag size="small" type="success"> 交互体验 </n-tag>
            </template>
            <n-p depth="3"> 支持拖拽排序功能，直观地重新排列列表项。 </n-p>
            <div class="mt-4 border rounded p-4">
              <DraggableList v-model="draggableItems" item-key="id" :animation="200">
                <template #item="{ item }">
                  <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded mb-2 cursor-move">
                    <span class="text-sm">{{ item.name }}</span>
                  </div>
                </template>
              </DraggableList>
            </div>
          </n-card>
        </n-grid-item>

        <!-- Vue Query 数据管理 -->
        <n-grid-item>
          <n-card hoverable>
            <template #header>
              <div class="flex items-center gap-2">
                <n-icon size="20">
                  <Database />
                </n-icon>
                Vue Query 数据管理
              </div>
            </template>
            <template #header-extra>
              <n-tag size="small" type="warning"> 数据获取和缓存 </n-tag>
            </template>
            <n-p depth="3">
              集成 Vue Query，提供自动缓存、后台重新获取、请求去重、乐观更新等功能。
            </n-p>
            <div class="mt-4">
              <n-button @click="goToUploadExample" type="tertiary" block> 查看使用示例 </n-button>
            </div>
          </n-card>
        </n-grid-item>

        <!-- 错误监控 -->
        <n-grid-item>
          <n-card hoverable>
            <template #header>
              <div class="flex items-center gap-2">
                <n-icon size="20">
                  <Shield />
                </n-icon>
                Sentry 错误监控
              </div>
            </template>
            <template #header-extra>
              <n-tag size="small" type="error"> 生产环境错误追踪 </n-tag>
            </template>
            <n-p depth="3"> 集成 Sentry 错误监控，自动收集生产环境错误信息。 </n-p>
            <div class="mt-4">
              <n-button @click="simulateError" type="error" block>
                {{ t('errors.unknown') }}
              </n-button>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
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
import { useMessage } from 'naive-ui'

// 定义组件名称
defineOptions({
  name: 'FeaturesView',
})

const { t } = useLocale()
const router = useRouter()
const message = useMessage()

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
  message.info('进度条功能已移除')
}

// 检查 PWA 安装
const checkPWAInstall = () => {
  if ('serviceWorker' in navigator) {
    message.success('PWA is supported')
  } else {
    message.error('PWA is not supported')
  }
}

// 检查在线状态
const checkOnlineStatus = () => {
  const status = navigator.onLine ? 'Online' : 'Offline'
  message.info(`Online status: ${status}`)
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
    message.error('测试错误已发送到 Sentry')
  }
}
</script>

<style scoped>
.features-container {
  min-height: 100vh;
}
</style>
