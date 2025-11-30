import { ref, computed } from 'vue'
import type { Pagination } from '@/types'

interface UsePaginationOptions {
  page?: number
  pageSize?: number
  total?: number
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { page: initialPage = 1, pageSize: initialPageSize = 10, total: initialTotal = 0 } = options

  const page = ref(initialPage)
  const pageSize = ref(initialPageSize)
  const total = ref(initialTotal)

  // 计算属性
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value) || 1)
  const isFirstPage = computed(() => page.value === 1)
  const isLastPage = computed(() => page.value >= totalPages.value)
  const startIndex = computed(() => (page.value - 1) * pageSize.value)
  const endIndex = computed(() => Math.min(startIndex.value + pageSize.value, total.value))

  // 分页信息对象
  const pagination = computed<Pagination>(() => ({
    page: page.value,
    pageSize: pageSize.value,
    total: total.value,
    totalPages: totalPages.value,
  }))

  // 页面导航方法
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages.value) {
      page.value = pageNumber
    }
  }

  const nextPage = () => {
    if (!isLastPage.value) {
      page.value++
    }
  }

  const prevPage = () => {
    if (!isFirstPage.value) {
      page.value--
    }
  }

  const firstPage = () => {
    page.value = 1
  }

  const lastPage = () => {
    page.value = totalPages.value
  }

  // 设置页面大小
  const setPageSize = (newPageSize: number) => {
    if (newPageSize > 0) {
      pageSize.value = newPageSize
      // 重置到第一页，因为当前页可能超出范围
      page.value = 1
    }
  }

  // 设置总数
  const setTotal = (newTotal: number) => {
    total.value = newTotal
    // 如果当前页超出范围，调整到最后一页
    if (page.value > totalPages.value) {
      page.value = totalPages.value
    }
  }

  // 重置分页
  const reset = (newOptions?: Partial<UsePaginationOptions>) => {
    if (newOptions) {
      if (newOptions.page !== undefined) page.value = newOptions.page
      if (newOptions.pageSize !== undefined) pageSize.value = newOptions.pageSize
      if (newOptions.total !== undefined) total.value = newOptions.total
    } else {
      page.value = initialPage
      pageSize.value = initialPageSize
      total.value = initialTotal
    }
  }

  // 生成页码数组（用于分页组件）
  const pageNumbers = computed(() => {
    const pages: number[] = []
    const maxVisiblePages = 7 // 最多显示的页码数

    if (totalPages.value <= maxVisiblePages) {
      // 总页数较少，显示所有页码
      for (let i = 1; i <= totalPages.value; i++) {
        pages.push(i)
      }
    } else {
      // 总页数较多，智能显示页码
      const half = Math.floor(maxVisiblePages / 2)
      let start = Math.max(1, page.value - half)
      const end = Math.min(totalPages.value, start + maxVisiblePages - 1)

      // 调整起始位置，确保显示足够的页码
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  })

  // 是否显示省略号
  const showStartEllipsis = computed(() => {
    return pageNumbers.value[0] > 2
  })

  const showEndEllipsis = computed(() => {
    const lastPage = pageNumbers.value[pageNumbers.value.length - 1]
    return lastPage < totalPages.value - 1
  })

  return {
    // 状态
    page,
    pageSize,
    total,

    // 计算属性
    totalPages,
    isFirstPage,
    isLastPage,
    startIndex,
    endIndex,
    pagination,
    pageNumbers,
    showStartEllipsis,
    showEndEllipsis,

    // 方法
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setPageSize,
    setTotal,
    reset,
  }
}
