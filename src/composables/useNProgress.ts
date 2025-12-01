import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置 nprogress
NProgress.configure({
  minimum: 0.1,
  easing: 'ease',
  speed: 200,
  showSpinner: false,
  trickleSpeed: 200,
})

export function useNProgress() {
  const start = () => {
    NProgress.start()
  }

  const done = () => {
    NProgress.done()
  }

  const configure = (options: any) => {
    NProgress.configure(options)
  }

  return {
    start,
    done,
    configure,
  }
}

// 导出原始实例以便直接使用
export { NProgress }
