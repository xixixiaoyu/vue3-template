import {
  format,
  formatDistanceToNow,
  parseISO,
  isValid,
  addDays,
  subDays,
  startOfDay,
  endOfDay,
  isAfter,
  isBefore,
  isEqual,
} from 'date-fns'
import { zhCN } from 'date-fns/locale'

/**
 * 格式化日期
 * @param date 日期对象、ISO 字符串或时间戳
 * @param pattern 格式化模式，默认为 'yyyy-MM-dd'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string | number, pattern = 'yyyy-MM-dd'): string {
  let dateObj: Date

  if (typeof date === 'string') {
    dateObj = parseISO(date)
  } else if (typeof date === 'number') {
    dateObj = new Date(date)
  } else {
    dateObj = date
  }

  if (!isValid(dateObj)) {
    return ''
  }

  return format(dateObj, pattern, { locale: zhCN })
}

/**
 * 格式化为相对时间（如：3 小时前）
 * @param date 日期对象、ISO 字符串或时间戳
 * @returns 相对时间字符串
 */
export function formatRelativeTime(date: Date | string | number): string {
  let dateObj: Date

  if (typeof date === 'string') {
    dateObj = parseISO(date)
  } else if (typeof date === 'number') {
    dateObj = new Date(date)
  } else {
    dateObj = date
  }

  if (!isValid(dateObj)) {
    return ''
  }

  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: zhCN,
  })
}

/**
 * 格式化为日期时间
 * @param date 日期对象、ISO 字符串或时间戳
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(date: Date | string | number): string {
  return formatDate(date, 'yyyy-MM-dd HH:mm:ss')
}

/**
 * 格式化为友好日期时间
 * @param date 日期对象、ISO 字符串或时间戳
 * @returns 格式化后的友好日期时间字符串
 */
export function formatFriendlyDateTime(date: Date | string | number): string {
  return formatDate(date, 'yyyy年MM月dd日 HH:mm')
}

/**
 * 检查日期是否在指定范围内
 * @param date 要检查的日期
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 是否在范围内
 */
export function isDateInRange(
  date: Date | string | number,
  startDate: Date | string | number,
  endDate: Date | string | number
): boolean {
  let dateObj: Date
  let startObj: Date
  let endObj: Date

  // 转换为 Date 对象
  if (typeof date === 'string') {
    dateObj = parseISO(date)
  } else if (typeof date === 'number') {
    dateObj = new Date(date)
  } else {
    dateObj = date
  }

  if (typeof startDate === 'string') {
    startObj = parseISO(startDate)
  } else if (typeof startDate === 'number') {
    startObj = new Date(startDate)
  } else {
    startObj = startDate
  }

  if (typeof endDate === 'string') {
    endObj = parseISO(endDate)
  } else if (typeof endDate === 'number') {
    endObj = new Date(endDate)
  } else {
    endObj = endDate
  }

  if (!isValid(dateObj) || !isValid(startObj) || !isValid(endObj)) {
    return false
  }

  return (
    (isAfter(dateObj, startObj) || isEqual(dateObj, startObj)) &&
    (isBefore(dateObj, endObj) || isEqual(dateObj, endObj))
  )
}

/**
 * 获取今天的开始时间（00:00:00）
 * @returns 今天的开始时间
 */
export function getStartOfToday(): Date {
  return startOfDay(new Date())
}

/**
 * 获取今天的结束时间（23:59:59）
 * @returns 今天的结束时间
 */
export function getEndOfToday(): Date {
  return endOfDay(new Date())
}

/**
 * 获取几天前的日期
 * @param days 天数
 * @returns 几天前的日期
 */
export function getDaysAgo(days: number): Date {
  return subDays(new Date(), days)
}

/**
 * 获取几天后的日期
 * @param days 天数
 * @returns 几天后的日期
 */
export function getDaysFromNow(days: number): Date {
  return addDays(new Date(), days)
}

/**
 * 检查是否为今天
 * @param date 要检查的日期
 * @returns 是否为今天
 */
export function isToday(date: Date | string | number): boolean {
  let dateObj: Date

  if (typeof date === 'string') {
    dateObj = parseISO(date)
  } else if (typeof date === 'number') {
    dateObj = new Date(date)
  } else {
    dateObj = date
  }

  if (!isValid(dateObj)) {
    return false
  }

  const today = new Date()
  return (
    dateObj.getFullYear() === today.getFullYear() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getDate() === today.getDate()
  )
}

/**
 * 检查是否为昨天
 * @param date 要检查的日期
 * @returns 是否为昨天
 */
export function isYesterday(date: Date | string | number): boolean {
  const yesterday = subDays(new Date(), 1)
  let dateObj: Date

  if (typeof date === 'string') {
    dateObj = parseISO(date)
  } else if (typeof date === 'number') {
    dateObj = new Date(date)
  } else {
    dateObj = date
  }

  if (!isValid(dateObj)) {
    return false
  }

  return (
    dateObj.getFullYear() === yesterday.getFullYear() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getDate() === yesterday.getDate()
  )
}
