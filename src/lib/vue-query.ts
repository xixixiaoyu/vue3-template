import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/vue-query'
import { supabase } from './supabase'
import { ref } from 'vue'

// 通用查询选项
export const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 分钟
  retry: 3,
  refetchOnWindowFocus: true,
} as const

// 通用变更选项
export const defaultMutationOptions = {
  retry: 1,
} as const

// 获取单个记录的 Hook
export function useSupabaseQuery(
  tableName: string,
  id: string | null | undefined,
  options?: Partial<UseQueryOptions<any>>
) {
  return useQuery({
    queryKey: [tableName, id],
    queryFn: async () => {
      if (!id) return null

      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single()

      if (error) throw error
      return data
    },
    enabled: !!id,
    ...defaultQueryOptions,
    ...options,
  })
}

// 获取列表的 Hook
export function useSupabaseList(
  tableName: string,
  options?: {
    filters?: Record<string, any>
    orderBy?: string
    ascending?: boolean
    limit?: number
    page?: number
    pageSize?: number
  } & Partial<UseQueryOptions<any[]>>
) {
  const {
    filters = {},
    orderBy = 'created_at',
    ascending = false,
    limit,
    page = 1,
    pageSize = 10,
    ...queryOptions
  } = options || {}

  return useQuery({
    queryKey: [tableName, 'list', { filters, orderBy, ascending, limit, page, pageSize }],
    queryFn: async () => {
      let query = supabase.from(tableName).select('*')

      // 应用过滤条件
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })

      // 应用排序
      query = query.order(orderBy, { ascending })

      // 应用分页
      if (limit) {
        query = query.limit(limit)
      } else if (pageSize) {
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1
        query = query.range(from, to)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },
    ...defaultQueryOptions,
    ...queryOptions,
  })
}

// 创建记录的 Hook
export function useSupabaseCreate(
  tableName: string,
  options?: Partial<UseMutationOptions<any, Error, any>>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newData: any) => {
      const { data, error } = await supabase.from(tableName).insert(newData).select().single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      // 使列表查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: [tableName, 'list'] })
    },
    ...defaultMutationOptions,
    ...options,
  })
}

// 更新记录的 Hook
export function useSupabaseUpdate(
  tableName: string,
  options?: Partial<UseMutationOptions<any, Error, { id: string; updates: any }>>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await (supabase as any)
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, { id }) => {
      // 使单个记录查询和列表查询失效
      queryClient.invalidateQueries({ queryKey: [tableName, id] })
      queryClient.invalidateQueries({ queryKey: [tableName, 'list'] })
    },
    ...defaultMutationOptions,
    ...options,
  })
}

// 删除记录的 Hook
export function useSupabaseDelete(
  tableName: string,
  options?: Partial<UseMutationOptions<void, Error, string>>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(tableName).delete().eq('id', id)

      if (error) throw error
    },
    onSuccess: (_, id) => {
      // 使单个记录查询和列表查询失效
      queryClient.invalidateQueries({ queryKey: [tableName, id] })
      queryClient.invalidateQueries({ queryKey: [tableName, 'list'] })
    },
    ...defaultMutationOptions,
    ...options,
  })
}

// 自定义查询 Hook
export function useSupabaseCustomQuery<T = any>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Partial<UseQueryOptions<T>>
) {
  return useQuery({
    queryKey,
    queryFn,
    ...defaultQueryOptions,
    ...options,
  })
}

// 自定义变更 Hook
export function useSupabaseCustomMutation<TData = any, TVariables = void, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Partial<UseMutationOptions<TData, Error, TVariables, TContext>>
) {
  return useMutation({
    mutationFn,
    ...defaultMutationOptions,
    ...options,
  })
}

// 分页查询 Hook
export function useSupabasePaginatedQuery(
  tableName: string,
  options?: {
    filters?: Record<string, any>
    orderBy?: string
    ascending?: boolean
    pageSize?: number
  } & Partial<
    UseQueryOptions<{
      items: any[]
      pagination: {
        page: number
        pageSize: number
        total: number
        totalPages: number
      }
    }>
  >
) {
  const {
    filters = {},
    orderBy = 'created_at',
    ascending = false,
    pageSize = 10,
    ...queryOptions
  } = options || {}

  const page = ref(1)

  const query = useQuery({
    queryKey: [tableName, 'paginated', { filters, orderBy, ascending, pageSize, page: page.value }],
    queryFn: async () => {
      // 获取总数
      const { count: total, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })

      if (countError) throw countError

      // 获取数据
      let query = supabase.from(tableName).select('*')

      // 应用过滤条件
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })

      // 应用排序
      query = query.order(orderBy, { ascending })

      // 应用分页
      const from = (page.value - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error } = await query

      if (error) throw error

      return {
        items: data || [],
        pagination: {
          page: page.value,
          pageSize,
          total: total || 0,
          totalPages: Math.ceil((total || 0) / pageSize),
        },
      }
    },
    ...defaultQueryOptions,
    ...queryOptions,
  })

  const nextPage = () => {
    if (page.value < (query.data.value?.pagination.totalPages || 0)) {
      page.value++
    }
  }

  const prevPage = () => {
    if (page.value > 1) {
      page.value--
    }
  }

  const goToPage = (pageNum: number) => {
    page.value = pageNum
  }

  return {
    ...query,
    page,
    nextPage,
    prevPage,
    goToPage,
  }
}
