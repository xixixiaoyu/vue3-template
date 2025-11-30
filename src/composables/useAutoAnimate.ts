import { autoAnimate } from '@formkit/auto-animate'
import { onUnmounted, ref, type Ref } from 'vue'

export function useAutoAnimate<T extends HTMLElement>(
  options?: any
): [Ref<T | undefined>, (el: T) => void] {
  const parent = ref<T>()
  let cleanup: any

  const setParent = (el: T) => {
    parent.value = el
    if (el) {
      cleanup = autoAnimate(el, options)
    }
  }

  onUnmounted(() => {
    if (cleanup) {
      cleanup()
    }
  })

  return [parent as Ref<T | undefined>, setParent]
}

export default useAutoAnimate
