import { useNProgress } from '@/composables/useNProgress'

const { start, done } = useNProgress()

export function setupProgressGuard(router: any) {
  // 路由开始时
  router.beforeEach((to: any, from: any, next: any) => {
    // 如果不是在同一个页面之间跳转，则显示进度条
    if (to.path !== from.path) {
      start()
    }
    next()
  })

  // 路由完成时
  router.afterEach(() => {
    done()
  })

  // 路由错误时
  router.onError(() => {
    done()
  })
}
