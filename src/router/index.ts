import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    },
  ],
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 如果用户状态尚未初始化，先初始化
  if (!authStore.user && !authStore.loading) {
    await authStore.initialize()
  }

  // 如果正在加载中，等待加载完成
  if (authStore.loading) {
    // 可以选择显示加载页面或直接等待
    return next()
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 需要认证但用户未登录，重定向到登录页
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }
  // 检查是否需要游客状态（已登录用户不应访问登录/注册页）
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // 需要游客状态但用户已登录，重定向到仪表板
    return next({ name: 'dashboard' })
  } else {
    // 允许访问
    next()
  }
})

export default router
