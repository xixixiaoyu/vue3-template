// 通用类型定义
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
  message?: string
}

// 用户相关类型
export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  created_at: string
  updated_at: string
  last_sign_in_at?: string
  user_metadata?: Record<string, any>
}

// 表单相关类型
export interface FormError {
  field: string
  message: string
}

// 分页相关类型
export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// 列表响应类型
export interface ListResponse<T> {
  items: T[]
  pagination: Pagination
}

// 通知类型
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

// 路由元信息
export interface RouteMeta {
  requiresAuth?: boolean
  requiresGuest?: boolean
  title?: string
  description?: string
  icon?: string
  layout?: string
}
