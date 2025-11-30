import { supabase } from '@/lib/supabase'
import type { ApiResponse, ListResponse, Pagination } from '@/types'

// 通用 API 响应处理
function handleApiResponse<T>(data: T | null, error: any): ApiResponse<T> {
  if (error) {
    console.error('API 请求失败:', error)
    // 更详细的错误处理
    let errorMessage = '请求失败'

    if (typeof error === 'string') {
      errorMessage = error
    } else if (error instanceof Error) {
      errorMessage = error.message
    } else if (error && typeof error === 'object' && error.message) {
      errorMessage = error.message
    } else if (error && typeof error === 'object' && error.error) {
      errorMessage = error.error
    }

    return {
      success: false,
      error: errorMessage,
    }
  }

  return {
    success: true,
    data: data as T,
  }
}

// 处理无返回值的 API 响应
function handleVoidResponse(error: any): ApiResponse<void> {
  if (error) {
    console.error('API 请求失败:', error)
    // 更详细的错误处理
    let errorMessage = '请求失败'

    if (typeof error === 'string') {
      errorMessage = error
    } else if (error instanceof Error) {
      errorMessage = error.message
    } else if (error && typeof error === 'object' && error.message) {
      errorMessage = error.message
    } else if (error && typeof error === 'object' && error.error) {
      errorMessage = error.error
    }

    return {
      success: false,
      error: errorMessage,
    }
  }

  return {
    success: true,
  }
}

// 通用 CRUD 操作
export class ApiService<T = any> {
  constructor(private tableName: string) {}

  // 获取单个记录
  async getById(id: string): Promise<ApiResponse<T>> {
    // 使用类型断言来绕过 TypeScript 的严格检查
    const { data, error } = await (supabase as any)
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single()

    return handleApiResponse(data as T, error)
  }

  // 获取列表
  async getList(
    options: {
      page?: number
      pageSize?: number
      orderBy?: string
      ascending?: boolean
      filters?: Record<string, any>
    } = {}
  ): Promise<ApiResponse<ListResponse<T>>> {
    const {
      page = 1,
      pageSize = 10,
      orderBy = 'created_at',
      ascending = false,
      filters = {},
    } = options

    let query = (supabase as any).from(this.tableName).select('*', { count: 'exact' })

    // 应用过滤条件
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })

    // 应用排序
    query = query.order(orderBy, { ascending })

    // 应用分页
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      return {
        success: false,
        error: error.message || '请求失败',
      }
    }

    const pagination: Pagination = {
      page,
      pageSize,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize),
    }

    return {
      success: true,
      data: {
        items: data || [],
        pagination,
      },
    }
  }

  // 创建记录
  async create(item: Partial<T>): Promise<ApiResponse<T>> {
    const { data, error } = await (supabase as any)
      .from(this.tableName)
      .insert(item)
      .select()
      .single()

    return handleApiResponse(data as T, error)
  }

  // 更新记录
  async update(id: string, updates: Partial<T>): Promise<ApiResponse<T>> {
    const { data, error } = await (supabase as any)
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return handleApiResponse(data as T, error)
  }

  // 删除记录
  async delete(id: string): Promise<ApiResponse<void>> {
    const { error } = await (supabase as any).from(this.tableName).delete().eq('id', id)

    return handleVoidResponse(error)
  }

  // 批量删除
  async deleteMany(ids: string[]): Promise<ApiResponse<void>> {
    const { error } = await (supabase as any).from(this.tableName).delete().in('id', ids)

    return handleVoidResponse(error)
  }

  // 搜索
  async search(searchTerm: string, searchColumn = 'name'): Promise<ApiResponse<T[]>> {
    if (!searchTerm || searchTerm.trim() === '') {
      return {
        success: false,
        error: '搜索关键词不能为空',
      }
    }

    try {
      const { data, error } = await (supabase as any)
        .from(this.tableName)
        .select('*')
        .ilike(searchColumn, `%${searchTerm.trim()}%`)

      return handleApiResponse(data as T[], error)
    } catch (err) {
      return handleApiResponse([] as T[], err)
    }
  }
}

// 导出常用的 API 服务实例
export const apiService = {
  // 用户相关 API
  users: new ApiService<any>('users'),

  // 可以根据需要添加更多服务
  // posts: new ApiService<Post>('posts'),
  // comments: new ApiService<Comment>('comments'),
}
