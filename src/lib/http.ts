import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useNotification } from '@/composables/useNotification'

// 创建 axios 实例
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证 token
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    const { error: showError } = useNotification()

    // 处理常见的 HTTP 错误
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 400:
          showError('请求错误', data.message || '请求参数错误')
          break
        case 401:
          showError('认证失败', '未授权，请重新登录')
          // 可以在这里处理登出逻辑
          break
        case 403:
          showError('权限错误', '拒绝访问')
          break
        case 404:
          showError('资源不存在', '请求的资源不存在')
          break
        case 500:
          showError('服务器错误', '服务器内部错误')
          break
        default:
          showError('请求失败', data.message || '请求失败')
      }
    } else if (error.request) {
      showError('网络错误', '网络连接失败，请检查网络')
    } else {
      showError('配置错误', '请求配置错误')
    }

    return Promise.reject(error)
  }
)

// 封装常用的请求方法
export const httpService = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return http.get(url, config)
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return http.post(url, data, config)
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return http.put(url, data, config)
  },

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return http.patch(url, data, config)
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return http.delete(url, config)
  },

  // 上传文件
  upload: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> => {
    return http.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    })
  },
}

export default http
