// 这个文件应该由 Supabase CLI 自动生成
// 运行命令：supabase gen types typescript --local > src/types/database.types.ts
// 这里提供一个基本的类型定义作为示例

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      // 在这里添加你的表类型定义
      // 示例：
      // users: {
      //   Row: {
      //     id: string
      //     email: string
      //     created_at: string
      //   }
      //   Insert: {
      //     id?: string
      //     email: string
      //     created_at?: string
      //   }
      //   Update: {
      //     id?: string
      //     email?: string
      //     created_at?: string
      //   }
      // }
    }
    Views: {
      // 在这里添加你的视图类型定义
    }
    Functions: {
      // 在这里添加你的函数类型定义
    }
    Enums: {
      // 在这里添加你的枚举类型定义
    }
  }
}
