import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { createHead } from '@unhead/vue/client'
import App from './App.vue'
import router from './router'
import i18n from './locales'
import { initSentry } from './lib/sentry'

import './assets/main.css'

// 创建 head 实例
const head = createHead()

const app = createApp(App)

// 初始化 Sentry 错误监控
initSentry(app)

// 安装 head 插件
app.use(head)

// 创建 pinia 实例并添加持久化插件
const pinia = createPinia()
pinia.use(createPersistedState())

app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
