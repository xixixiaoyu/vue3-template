import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'
import type { OAuthProvider } from '@/types/database.types'

export const useAuthStore = defineStore(
  'auth',
  () => {
    // 状态
    const user = ref<SupabaseUser | null>(null)
    const session = ref<Session | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // 计算属性
    const isAuthenticated = computed(() => !!user.value)
    const isAdmin = computed(() => user.value?.user_metadata?.role === 'admin')
    const userRole = computed(() => user.value?.user_metadata?.role || 'user')
    const userName = computed(() => {
      if (!user.value) return ''
      const nameFromMetadata = user.value.user_metadata?.name || user.value.user_metadata?.full_name
      if (nameFromMetadata) return nameFromMetadata
      return user.value.email?.split('@')[0] || ''
    })
    const userAvatar = computed(
      () => user.value?.user_metadata?.avatar_url || user.value?.user_metadata?.picture
    )

    // 初始化 - 检查当前会话
    const initialize = async () => {
      try {
        loading.value = true
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()

        if (currentSession) {
          session.value = currentSession
          user.value = currentSession.user
        }
      } catch (err) {
        error.value = err instanceof Error ? err.message : '初始化认证失败'
        console.error('初始化认证失败:', err)
      } finally {
        loading.value = false
      }
    }

    // 邮箱密码登录
    const signIn = async (email: string, password: string) => {
      try {
        loading.value = true
        error.value = null

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) throw signInError

        session.value = data.session
        user.value = data.user

        return { success: true }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '登录失败'
        error.value = errorMessage
        console.error('登录失败:', err)
        return { success: false, error: errorMessage }
      } finally {
        loading.value = false
      }
    }

    // 邮箱密码注册
    const signUp = async (email: string, password: string) => {
      try {
        loading.value = true
        error.value = null

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (signUpError) throw signUpError

        session.value = data.session
        user.value = data.user

        return { success: true }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '注册失败'
        error.value = errorMessage
        console.error('注册失败:', err)
        return { success: false, error: errorMessage }
      } finally {
        loading.value = false
      }
    }

    // OAuth 登录
    const signInWithOAuth = async (provider: OAuthProvider, options?: { redirectTo?: string }) => {
      try {
        loading.value = true
        error.value = null

        const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: options?.redirectTo || `${window.location.origin}/`,
          },
        })

        if (oauthError) throw oauthError

        // OAuth 登录会重定向到第三方，这里不需要更新状态
        return { success: true, data }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'OAuth 登录失败'
        error.value = errorMessage
        console.error('OAuth 登录失败:', err)
        return { success: false, error: errorMessage }
      } finally {
        loading.value = false
      }
    }

    // 密码重置
    const resetPassword = async (email: string) => {
      try {
        loading.value = true
        error.value = null

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })

        if (resetError) throw resetError

        return { success: true }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '密码重置失败'
        error.value = errorMessage
        console.error('密码重置失败:', err)
        return { success: false, error: errorMessage }
      } finally {
        loading.value = false
      }
    }

    // 更新密码
    const updatePassword = async (newPassword: string) => {
      try {
        loading.value = true
        error.value = null

        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword,
        })

        if (updateError) throw updateError

        return { success: true }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '密码更新失败'
        error.value = errorMessage
        console.error('密码更新失败:', err)
        return { success: false, error: errorMessage }
      } finally {
        loading.value = false
      }
    }

    // 更新用户资料
    const updateProfile = async (updates: {
      full_name?: string
      username?: string
      avatar_url?: string
      website?: string
      bio?: string
    }) => {
      try {
        loading.value = true
        error.value = null

        // 更新 auth.users 中的元数据
        const { error: updateError } = await supabase.auth.updateUser({
          data: updates,
        })

        if (updateError) throw updateError

        // 更新 profiles 表
        if (user.value) {
          const { error: profileError } = await (supabase as any).from('profiles').upsert({
            id: user.value.id,
            ...updates,
            updated_at: new Date().toISOString(),
          })

          if (profileError) throw profileError
        }

        // 重新获取用户信息
        await initialize()

        return { success: true }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '更新资料失败'
        error.value = errorMessage
        console.error('更新资料失败:', err)
        return { success: false, error: errorMessage }
      } finally {
        loading.value = false
      }
    }

    // 刷新会话
    const refreshSession = async () => {
      try {
        loading.value = true
        error.value = null

        const { data, error: refreshError } = await supabase.auth.refreshSession()

        if (refreshError) throw refreshError

        session.value = data.session
        user.value = data.user

        return { success: true }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '刷新会话失败'
        error.value = errorMessage
        console.error('刷新会话失败:', err)
        return { success: false, error: errorMessage }
      } finally {
        loading.value = false
      }
    }

    // 退出登录
    const signOut = async () => {
      try {
        loading.value = true
        error.value = null

        const { error: signOutError } = await supabase.auth.signOut()

        if (signOutError) throw signOutError

        session.value = null
        user.value = null

        return { success: true }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '退出登录失败'
        error.value = errorMessage
        console.error('退出登录失败:', err)
        return { success: false, error: errorMessage }
      } finally {
        loading.value = false
      }
    }

    // 清除错误
    const clearError = () => {
      error.value = null
    }

    return {
      // 状态
      user: readonly(user),
      session: readonly(session),
      loading: readonly(loading),
      error: readonly(error),

      // 计算属性
      isAuthenticated,
      isAdmin,
      userRole,
      userName,
      userAvatar,

      // 方法
      initialize,
      signIn,
      signUp,
      signInWithOAuth,
      resetPassword,
      updatePassword,
      updateProfile,
      refreshSession,
      signOut,
      clearError,
    }
  },
  {
    persist: {
      key: 'auth-store',
      storage: localStorage,
      pick: ['session', 'user'], // 只持久化 session 和 user 状态
      serializer: {
        serialize: JSON.stringify,
        deserialize: (value: string) => {
          try {
            const parsed = JSON.parse(value)
            // 确保恢复的数据类型正确
            return {
              session: parsed.session || null,
              user: parsed.user || null,
            }
          } catch (error) {
            console.error('反序列化认证数据失败:', error)
            return {
              session: null,
              user: null,
            }
          }
        },
      },
    },
  }
)
