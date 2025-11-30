import { useAuthStore } from '@/stores/auth'

// 权限中间件
export function permissionMiddleware(requiredPermissions: string[] = []) {
  return (to: any, from: any, next: (arg?: any) => void) => {
    const authStore = useAuthStore()

    // 如果用户未登录，重定向到登录页
    if (!authStore.isAuthenticated) {
      return next({
        name: 'login',
        query: { redirect: to.fullPath },
      })
    }

    // 如果没有指定权限要求，允许访问
    if (requiredPermissions.length === 0) {
      return next()
    }

    // 获取用户权限（这里需要根据实际的用户权限结构进行调整）
    const userPermissions = authStore.user?.user_metadata?.permissions || []

    // 检查用户是否具有所需权限
    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission)
    )

    if (!hasPermission) {
      // 用户没有所需权限，重定向到无权限页面或仪表板
      return next({
        name: 'dashboard',
        // 可以添加查询参数来显示权限不足的消息
        query: { error: 'permission_denied' },
      })
    }

    return next()
  }
}

// 角色中间件
export function roleMiddleware(requiredRoles: string[] = []) {
  return (to: any, from: any, next: (arg?: any) => void) => {
    const authStore = useAuthStore()

    // 如果用户未登录，重定向到登录页
    if (!authStore.isAuthenticated) {
      return next({
        name: 'login',
        query: { redirect: to.fullPath },
      })
    }

    // 如果没有指定角色要求，允许访问
    if (requiredRoles.length === 0) {
      return next()
    }

    // 获取用户角色（这里需要根据实际的用户角色结构进行调整）
    const userRole = authStore.user?.user_metadata?.role

    // 检查用户是否具有所需角色
    const hasRole = requiredRoles.includes(userRole)

    if (!hasRole) {
      // 用户没有所需角色，重定向到无权限页面或仪表板
      return next({
        name: 'dashboard',
        // 可以添加查询参数来显示权限不足的消息
        query: { error: 'role_denied' },
      })
    }

    return next()
  }
}

// 管理员权限中间件
export const adminMiddleware = roleMiddleware(['admin', 'superadmin'])

// 超级管理员权限中间件
export const superAdminMiddleware = roleMiddleware(['superadmin'])
