export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          bio: string | null
          role: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          role?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          role?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string | null
          name: string
          description: string | null
          color: string | null
          icon: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          name: string
          description?: string | null
          color?: string | null
          icon?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          name?: string
          description?: string | null
          color?: string | null
          icon?: string | null
          user_id?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          name: string
          description: string | null
          status: string | null
          priority: string | null
          due_date: string | null
          user_id: string | null
          category_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          name: string
          description?: string | null
          status?: string | null
          priority?: string | null
          due_date?: string | null
          user_id?: string | null
          category_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          name?: string
          description?: string | null
          status?: string | null
          priority?: string | null
          due_date?: string | null
          user_id?: string | null
          category_id?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          title: string
          description: string | null
          status: string | null
          priority: string | null
          due_date: string | null
          project_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          title: string
          description?: string | null
          status?: string | null
          priority?: string | null
          due_date?: string | null
          project_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          title?: string
          description?: string | null
          status?: string | null
          priority?: string | null
          due_date?: string | null
          project_id?: string | null
          user_id?: string | null
        }
      }
      files: {
        Row: {
          id: string
          created_at: string | null
          name: string
          size: number | null
          type: string | null
          path: string
          bucket: string | null
          user_id: string | null
          project_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          name: string
          size?: number | null
          type?: string | null
          path: string
          bucket?: string | null
          user_id?: string | null
          project_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          name?: string
          size?: number | null
          type?: string | null
          path?: string
          bucket?: string | null
          user_id?: string | null
          project_id?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          created_at: string | null
          read_at: string | null
          title: string
          message: string | null
          type: string | null
          user_id: string | null
          data: Json | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          read_at?: string | null
          title: string
          message?: string | null
          type?: string | null
          user_id?: string | null
          data?: Json | null
        }
        Update: {
          id?: string
          created_at?: string | null
          read_at?: string | null
          title?: string
          message?: string | null
          type?: string | null
          user_id?: string | null
          data?: Json | null
        }
      }
      user_settings: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          user_id: string
          theme: string | null
          language: string | null
          email_notifications: boolean | null
          push_notifications: boolean | null
          settings: Json | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          user_id: string
          theme?: string | null
          language?: string | null
          email_notifications?: boolean | null
          push_notifications?: boolean | null
          settings?: Json | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          user_id?: string
          theme?: string | null
          language?: string | null
          email_notifications?: boolean | null
          push_notifications?: boolean | null
          settings?: Json | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          created_at: string | null
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          user_id?: string | null
          action: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          user_id?: string | null
          action?: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_stats: {
        Args: {
          user_uuid: string
        }
        Returns: Json
      }
      mark_all_notifications_read: {
        Args: {
          user_uuid: string
        }
        Returns: void
      }
      get_recent_activities: {
        Args: {
          user_uuid: string
          limit_count?: number
        }
        Returns: {
          id: string
          created_at: string | null
          action: string
          table_name: string | null
          details: Json | null
        }[]
      }
    }
    Enums: {
      project_status: 'active' | 'completed' | 'archived' | 'cancelled'
      task_status: 'todo' | 'in_progress' | 'completed' | 'cancelled'
      priority: 'low' | 'medium' | 'high' | 'urgent'
      notification_type: 'info' | 'success' | 'warning' | 'error'
      user_role: 'user' | 'admin' | 'moderator'
      theme: 'light' | 'dark' | 'system'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// 扩展类型定义
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export type File = Database['public']['Tables']['files']['Row']
export type FileInsert = Database['public']['Tables']['files']['Insert']
export type FileUpdate = Database['public']['Tables']['files']['Update']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']

export type UserSettings = Database['public']['Tables']['user_settings']['Row']
export type UserSettingsInsert = Database['public']['Tables']['user_settings']['Insert']
export type UserSettingsUpdate = Database['public']['Tables']['user_settings']['Update']

export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert']
export type AuditLogUpdate = Database['public']['Tables']['audit_logs']['Update']

// 函数类型定义
export type GetUserStatsFunction = Database['public']['Functions']['get_user_stats']
export type MarkAllNotificationsReadFunction =
  Database['public']['Functions']['mark_all_notifications_read']
export type GetRecentActivitiesFunction = Database['public']['Functions']['get_recent_activities']

// 枚举类型定义
export type ProjectStatus = Database['public']['Enums']['project_status']
export type TaskStatus = Database['public']['Enums']['task_status']
export type Priority = Database['public']['Enums']['priority']
export type NotificationType = Database['public']['Enums']['notification_type']
export type UserRole = Database['public']['Enums']['user_role']
export type Theme = Database['public']['Enums']['theme']

// 联合类型定义
export type Status = ProjectStatus | TaskStatus
export type UserStats = {
  projects_count: number
  tasks_count: number
  completed_tasks_count: number
  categories_count: number
  files_count: number
  unread_notifications_count: number
}

export type RecentActivity = {
  id: string
  created_at: string | null
  action: string
  table_name: string | null
  details: Json | null
}

// 实时订阅事件类型
export type RealtimeEvent<T = any> = {
  event: 'INSERT' | 'UPDATE' | 'DELETE'
  schema: 'public'
  table: string
  commit_timestamp: string
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T
  old: T
}

// API 响应类型
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
}

export type ListResponse<T = any> = {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// 文件上传类型
export type UploadOptions = {
  bucket?: string
  upsert?: boolean
  cacheControl?: string
  contentType?: string
  metadata?: Record<string, string>
}

export type UploadResult = {
  data: {
    path: string
    id: string
    fullPath: string
  } | null
  error: any
}

// 认证相关类型
export type AuthUser = {
  id: string
  email: string
  email_confirmed_at: string | null
  phone: string | null
  phone_confirmed_at: string | null
  created_at: string
  updated_at: string
  last_sign_in_at: string | null
  user_metadata: Json
  app_metadata: Json
  providers: string[]
}

export type AuthSession = {
  access_token: string
  refresh_token: string | null
  expires_in: number
  expires_at: number | null
  token_type: string
  user: AuthUser
}

// OAuth 提供商类型
export type OAuthProvider =
  | 'google'
  | 'github'
  | 'gitlab'
  | 'bitbucket'
  | 'azure'
  | 'facebook'
  | 'apple'
  | 'discord'
  | 'twitch'
  | 'twitter'

// 搜索和过滤类型
export type SearchFilters = {
  query?: string
  status?: Status
  priority?: Priority
  category_id?: string
  project_id?: string
  user_id?: string
  date_from?: string
  date_to?: string
}

export type SortOptions = {
  column: string
  ascending: boolean
}

// 仪表板统计类型
export type DashboardStats = {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  totalFiles: number
  unreadNotifications: number
}

// 表单验证类型
export type ValidationError = {
  field: string
  message: string
}

export type FormErrors = Record<string, string>

// 通知系统类型
export type NotificationPayload = {
  title: string
  message?: string
  type?: NotificationType
  user_id: string
  data?: Json
}

// 审计日志类型
export type AuditLogPayload = {
  action: string
  table_name: string
  record_id?: string
  old_values?: Json
  new_values?: Json
  ip_address?: string
  user_agent?: string
}
