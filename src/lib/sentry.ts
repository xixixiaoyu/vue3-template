import * as Sentry from '@sentry/vue'

export function initSentry(app: any) {
  // 只在生产环境初始化 Sentry
  if (import.meta.env.PROD) {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN || '',
      environment: import.meta.env.MODE,

      // 错误采样率
      tracesSampleRate: 0.1,

      // 过滤错误
      beforeSend(event) {
        // 过滤掉一些不需要的错误
        if (event.exception) {
          const error = event.exception.values?.[0]

          // 过滤掉网络错误
          if (error?.value?.includes('Network Error')) {
            return null
          }

          // 过滤掉用户取消的请求
          if (error?.value?.includes('Request aborted')) {
            return null
          }

          // 过滤掉第三方脚本错误
          if (
            error?.stacktrace?.frames?.some(
              (frame: any) =>
                frame.filename?.includes('cdn') || frame.filename?.includes('third-party')
            )
          ) {
            return null
          }
        }

        return event
      },

      // 添加标签
      beforeBreadcrumb(breadcrumb) {
        // 过滤掉一些不需要的面包屑
        if (breadcrumb.category === 'xhr' && breadcrumb.data?.url?.includes('sentry')) {
          return null
        }
        return breadcrumb
      },
    })
  }
}

// 手动报告错误
export function reportError(error: Error, context?: Record<string, any>) {
  if (import.meta.env.PROD) {
    Sentry.withScope((scope) => {
      if (context) {
        Object.keys(context).forEach((key) => {
          scope.setContext(key, context[key])
        })
      }
      Sentry.captureException(error)
    })
  } else {
    console.error('Error reported:', error, context)
  }
}

// 手动报告消息
export function reportMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  if (import.meta.env.PROD) {
    Sentry.captureMessage(message, level)
  } else {
    console.log(`Message reported (${level}):`, message)
  }
}

// 设置用户信息
export function setUser(user: Sentry.User | null) {
  if (import.meta.env.PROD) {
    Sentry.setUser(user)
  }
}

// 设置标签
export function setTag(key: string, value: string) {
  if (import.meta.env.PROD) {
    Sentry.setTag(key, value)
  }
}

// 设置额外信息
export function setExtra(key: string, extra: any) {
  if (import.meta.env.PROD) {
    Sentry.setExtra(key, extra)
  }
}

// 添加面包屑
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  if (import.meta.env.PROD) {
    Sentry.addBreadcrumb(breadcrumb)
  }
}
