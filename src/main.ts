import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

// 创建 pinia 实例并添加持久化插件
const pinia = createPinia()
pinia.use(createPersistedState())

app.use(pinia)
app.use(router)

app.mount('#app')
