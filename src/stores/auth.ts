import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore(
  'auth',
  () => {
    // 状态
    const user = ref<User | null>(null)
    const session = ref<Session | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // 计算属性
    const isAuthenticated = computed(() => !!user.value)

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

      // 方法
      initialize,
      signIn,
      signUp,
      signOut,
      clearError,
    }
  },
  {
    persist: {
      key: 'auth-store',
      storage: localStorage,
      pick: ['session', 'user'], // 只持久化 session 和 user 状态
    },
  }
)
