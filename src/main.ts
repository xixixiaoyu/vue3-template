import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { createHead } from '@unhead/vue/client'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'
import i18n from './locales'
import { initSentry } from './lib/sentry'

import './assets/main.css'

// 创建 head 实例
const head = createHead()

// 创建 Vue Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5 分钟后数据过期
      staleTime: 5 * 60 * 1000,
      // 窗口聚焦时重新获取数据
      refetchOnWindowFocus: true,
      // 网络重连时重新获取数据
      refetchOnReconnect: true,
      // 错误重试次数
      retry: 3,
      // 重试延迟
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // 错误重试次数
      retry: 1,
    },
  },
})

const app = createApp(App)

// 初始化 Sentry 错误监控
initSentry(app)

// 安装插件
app.use(head)
app.use(VueQueryPlugin, { queryClient })

// 创建 pinia 实例并添加持久化插件
const pinia = createPinia()
pinia.use(createPersistedState())

app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
