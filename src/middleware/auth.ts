import { useAuthStore } from '@/stores/auth'

// 认证中间件
export function authMiddleware(to: any, from: any, next: any) {
  const authStore = useAuthStore()

  // 如果用户状态尚未初始化，先初始化
  if (!authStore.user && !authStore.loading) {
    authStore.initialize()
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 需要认证但用户未登录，重定向到登录页
    return next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
  }

  // 检查是否需要游客状态（已登录用户不应访问登录/注册页）
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // 需要游客状态但用户已登录，重定向到仪表板
    return next({ name: 'dashboard' })
  }

  return next()
}
