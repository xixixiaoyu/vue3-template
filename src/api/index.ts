import { supabase } from '@/lib/supabase'
import type { ApiResponse, ListResponse, Pagination } from '@/types'

// 通用 API 响应处理
function handleApiResponse<T>(data: T | null, error: any): ApiResponse<T> {
  if (error) {
    console.error('API 请求失败:', error)
    return {
      success: false,
      error: error.message || '请求失败',
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
    return {
      success: false,
      error: error.message || '请求失败',
    }
  }

  return {
    success: true,
  }
}

// 通用 CRUD 操作
export class ApiService<T> {
  constructor(private tableName: string) {}

  // 获取单个记录
  async getById(id: string): Promise<ApiResponse<T>> {
    const { data, error } = await supabase.from(this.tableName).select('*').eq('id', id).single()

    return handleApiResponse(data, error)
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

    let query = supabase.from(this.tableName).select('*', { count: 'exact' })

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
    const { data, error } = await supabase.from(this.tableName).insert(item).select().single()

    return handleApiResponse(data, error)
  }

  // 更新记录
  async update(id: string, updates: Partial<T>): Promise<ApiResponse<T>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return handleApiResponse(data, error)
  }

  // 删除记录
  async delete(id: string): Promise<ApiResponse<void>> {
    const { error } = await supabase.from(this.tableName).delete().eq('id', id)

    return handleVoidResponse(error)
  }

  // 批量删除
  async deleteMany(ids: string[]): Promise<ApiResponse<void>> {
    const { error } = await supabase.from(this.tableName).delete().in('id', ids)

    return handleVoidResponse(error)
  }

  // 搜索
  async search(searchTerm: string, searchColumn = 'name'): Promise<ApiResponse<T[]>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .ilike(searchColumn, `%${searchTerm}%`)

    return handleApiResponse(data, error)
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
