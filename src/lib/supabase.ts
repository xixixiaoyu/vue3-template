import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 检查环境变量是否存在
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase 环境变量未设置。请确保在 .env 文件中配置了 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY。'
  )
}

// 在开发环境中，如果没有设置环境变量，使用默认值
const url = supabaseUrl || (import.meta.env.DEV ? 'https://placeholder.supabase.co' : '')
const key = supabaseAnonKey || (import.meta.env.DEV ? 'placeholder-key' : '')

// 在生产环境中，如果没有设置环境变量，抛出错误
if (!import.meta.env.DEV && (!url || !key)) {
  throw new Error(
    'Supabase 环境变量未设置。请确保在生产环境中配置了 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY。'
  )
}

// 添加额外的客户端配置选项
const options = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
}

export const supabase = createClient<Database>(url, key, options)
