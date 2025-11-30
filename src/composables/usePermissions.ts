import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types/database.types'

// 权限定义
export const PERMISSIONS = {
  // 用户管理权限
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  USER_DELETE: 'user:delete',

  // 项目管理权限
  PROJECT_READ: 'project:read',
  PROJECT_WRITE: 'project:write',
  PROJECT_DELETE: 'project:delete',

  // 任务管理权限
  TASK_READ: 'task:read',
  TASK_WRITE: 'task:write',
  TASK_DELETE: 'task:delete',

  // 分类管理权限
  CATEGORY_READ: 'category:read',
  CATEGORY_WRITE: 'category:write',
  CATEGORY_DELETE: 'category:delete',

  // 文件管理权限
  FILE_READ: 'file:read',
  FILE_WRITE: 'file:write',
  FILE_DELETE: 'file:delete',

  // 系统管理权限
  SYSTEM_ADMIN: 'system:admin',
  SYSTEM_MONITOR: 'system:monitor',

  // 审计日志权限
  AUDIT_READ: 'audit:read',
  AUDIT_DELETE: 'audit:delete',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

// 基础用户权限
const USER_PERMISSIONS: Permission[] = [
  PERMISSIONS.USER_READ,
  PERMISSIONS.PROJECT_READ,
  PERMISSIONS.PROJECT_WRITE,
  PERMISSIONS.PROJECT_DELETE,
  PERMISSIONS.TASK_READ,
  PERMISSIONS.TASK_WRITE,
  PERMISSIONS.TASK_DELETE,
  PERMISSIONS.CATEGORY_READ,
  PERMISSIONS.CATEGORY_WRITE,
  PERMISSIONS.CATEGORY_DELETE,
  PERMISSIONS.FILE_READ,
  PERMISSIONS.FILE_WRITE,
  PERMISSIONS.FILE_DELETE,
]

// 角色权限映射
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  user: USER_PERMISSIONS,
  moderator: [...USER_PERMISSIONS, PERMISSIONS.USER_WRITE],
  admin: Object.values(PERMISSIONS),
}

// 权限组（用于更细粒度的控制）
export const PERMISSION_GROUPS = {
  // 基础权限：所有用户都有
  BASIC: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.PROJECT_READ,
    PERMISSIONS.TASK_READ,
    PERMISSIONS.CATEGORY_READ,
    PERMISSIONS.FILE_READ,
  ],

  // 内容管理权限
  CONTENT_MANAGEMENT: [
    PERMISSIONS.PROJECT_WRITE,
    PERMISSIONS.PROJECT_DELETE,
    PERMISSIONS.TASK_WRITE,
    PERMISSIONS.TASK_DELETE,
    PERMISSIONS.CATEGORY_WRITE,
    PERMISSIONS.CATEGORY_DELETE,
    PERMISSIONS.FILE_WRITE,
    PERMISSIONS.FILE_DELETE,
  ],

  // 用户管理权限
  USER_MANAGEMENT: [PERMISSIONS.USER_WRITE, PERMISSIONS.USER_DELETE],

  // 系统管理权限
  SYSTEM_MANAGEMENT: [
    PERMISSIONS.SYSTEM_ADMIN,
    PERMISSIONS.SYSTEM_MONITOR,
    PERMISSIONS.AUDIT_READ,
    PERMISSIONS.AUDIT_DELETE,
  ],
} as const

export function usePermissions() {
  const authStore = useAuthStore()

  // 获取用户角色
  const userRole = computed<UserRole>(() => {
    return authStore.user?.user_metadata?.role || 'user'
  })

  // 获取用户权限列表
  const userPermissions = computed<Permission[]>(() => {
    return ROLE_PERMISSIONS[userRole.value] || []
  })

  // 检查是否有特定权限
  const hasPermission = (permission: Permission): boolean => {
    return userPermissions.value.includes(permission)
  }

  // 检查是否有多个权限中的任意一个
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission))
  }

  // 检查是否有所有指定权限
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission))
  }

  // 检查是否有权限组中的所有权限
  const hasPermissionGroup = (groupName: keyof typeof PERMISSION_GROUPS): boolean => {
    const groupPermissions = [...PERMISSION_GROUPS[groupName]]
    return hasAllPermissions(groupPermissions)
  }

  // 检查是否有权限组中的任意权限
  const hasAnyPermissionInGroup = (groupName: keyof typeof PERMISSION_GROUPS): boolean => {
    const groupPermissions = [...PERMISSION_GROUPS[groupName]]
    return hasAnyPermission(groupPermissions)
  }

  // 检查是否为管理员
  const isAdmin = computed(() => userRole.value === 'admin')

  // 检查是否为版主或管理员
  const isModeratorOrAdmin = computed(
    () => userRole.value === 'moderator' || userRole.value === 'admin'
  )

  // 检查是否可以访问用户管理
  const canManageUsers = computed(
    () => hasPermission(PERMISSIONS.USER_WRITE) || hasPermission(PERMISSIONS.USER_DELETE)
  )

  // 检查是否可以管理系统
  const canManageSystem = computed(
    () => hasPermission(PERMISSIONS.SYSTEM_ADMIN) || hasPermission(PERMISSIONS.SYSTEM_MONITOR)
  )

  // 检查是否可以查看审计日志
  const canViewAuditLogs = computed(() => hasPermission(PERMISSIONS.AUDIT_READ))

  // 检查是否可以删除审计日志
  const canDeleteAuditLogs = computed(() => hasPermission(PERMISSIONS.AUDIT_DELETE))

  // 检查是否可以管理内容
  const canManageContent = computed(() => hasAnyPermissionInGroup('CONTENT_MANAGEMENT'))

  return {
    // 权限常量
    PERMISSIONS,
    PERMISSION_GROUPS,
    ROLE_PERMISSIONS,

    // 计算属性
    userRole,
    userPermissions,
    isAdmin,
    isModeratorOrAdmin,
    canManageUsers,
    canManageSystem,
    canViewAuditLogs,
    canDeleteAuditLogs,
    canManageContent,

    // 方法
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasPermissionGroup,
    hasAnyPermissionInGroup,
  }
}

// 权限指令（用于模板中）
export const vPermission = {
  mounted(el: HTMLElement, binding: { value: Permission | Permission[] }) {
    const { hasPermission, hasAnyPermission } = usePermissions()

    let hasAccess = false
    if (Array.isArray(binding.value)) {
      hasAccess = hasAnyPermission(binding.value)
    } else {
      hasAccess = hasPermission(binding.value)
    }

    if (!hasAccess) {
      el.style.display = 'none'
    }
  },

  updated(el: HTMLElement, binding: { value: Permission | Permission[] }) {
    const { hasPermission, hasAnyPermission } = usePermissions()

    let hasAccess = false
    if (Array.isArray(binding.value)) {
      hasAccess = hasAnyPermission(binding.value)
    } else {
      hasAccess = hasPermission(binding.value)
    }

    el.style.display = hasAccess ? '' : 'none'
  },
}

// 权限组件（用于更复杂的权限控制）
export function PermissionGuard({
  permissions,
  permissionGroup,
  requireAll = false,
  fallback,
}: {
  permissions?: Permission | Permission[]
  permissionGroup?: keyof typeof PERMISSION_GROUPS
  requireAll?: boolean
  fallback?: any
}) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasPermissionGroup,
    hasAnyPermissionInGroup,
  } = usePermissions()

  let hasAccess = false

  if (permissionGroup) {
    hasAccess = requireAll
      ? hasPermissionGroup(permissionGroup)
      : hasAnyPermissionInGroup(permissionGroup)
  } else if (permissions) {
    if (Array.isArray(permissions)) {
      hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions)
    } else {
      hasAccess = hasPermission(permissions)
    }
  }

  return hasAccess ? null : fallback
}
