// 导入常用的 lodash-es 函数
import {
  cloneDeep,
  debounce,
  throttle,
  get,
  set,
  has,
  isEmpty,
  isEqual,
  isObject,
  isArray,
  isFunction,
  isString,
  isNumber,
  isBoolean,
  uniq,
  uniqBy,
  groupBy,
  orderBy,
  pick,
  omit,
  merge,
  mergeWith,
  capitalize,
  kebabCase,
  snakeCase,
  camelCase,
  startCase,
  truncate,
  random,
  sample,
  shuffle,
  chunk,
  flatten,
  flattenDeep,
  zipObject,
  fromPairs,
  toPairs,
  keys,
  values,
  entries,
  omitBy,
  pickBy,
  filter,
  find,
  findIndex,
  some,
  every,
  map,
  reduce,
  forEach,
  forEachRight,
  size,
  first,
  last,
  head,
  tail,
  initial,
  take,
  takeRight,
  drop,
  dropRight,
  slice,
  join,
  split,
  replace,
  trim,
  trimStart,
  trimEnd,
  toLower,
  toUpper,
  parseInt,
  clamp,
  inRange,
  round,
  ceil,
  floor,
  max,
  min,
  maxBy,
  minBy,
  sum,
  sumBy,
  mean,
  meanBy,
  uniqWith,
  sortedUniq,
  sortedUniqBy,
  intersection,
  union,
  xor,
  difference,
  pull,
  pullAll,
  pullAt,
  remove,
  reverse,
  fill,
  compact,
  countBy,
  partition,
  sortBy,
  sortedIndex,
  sortedIndexOf,
  sortedLastIndex,
  sortedLastIndexOf,
} from 'lodash-es'

// 导出所有函数
export {
  cloneDeep,
  debounce,
  throttle,
  get,
  set,
  has,
  isEmpty,
  isEqual,
  isObject,
  isArray,
  isFunction,
  isString,
  isNumber,
  isBoolean,
  uniq,
  uniqBy,
  groupBy,
  orderBy,
  pick,
  omit,
  merge,
  mergeWith,
  capitalize,
  kebabCase,
  snakeCase,
  camelCase,
  startCase,
  truncate,
  random,
  sample,
  shuffle,
  chunk,
  flatten,
  flattenDeep,
  zipObject,
  fromPairs,
  toPairs,
  keys,
  values,
  entries,
  omitBy,
  pickBy,
  filter,
  find,
  findIndex,
  some,
  every,
  map,
  reduce,
  forEach,
  forEachRight,
  size,
  first,
  last,
  head,
  tail,
  initial,
  take,
  takeRight,
  drop,
  dropRight,
  slice,
  join,
  split,
  replace,
  trim,
  trimStart,
  trimEnd,
  toLower,
  toUpper,
  parseInt,
  clamp,
  inRange,
  round,
  ceil,
  floor,
  max,
  min,
  maxBy,
  minBy,
  sum,
  sumBy,
  mean,
  meanBy,
  uniqWith,
  sortedUniq,
  sortedUniqBy,
  intersection,
  union,
  xor,
  difference,
  pull,
  pullAll,
  pullAt,
  remove,
  reverse,
  fill,
  compact,
  countBy,
  partition,
  sortBy,
  sortedIndex,
  sortedIndexOf,
  sortedLastIndex,
  sortedLastIndexOf,
}

// 自定义常用工具函数

/**
 * 深度合并对象，对于数组会进行合并而不是替换
 * @param objects 要合并的对象
 * @returns 合并后的对象
 */
export function deepMerge(...objects: any[]): any {
  return mergeWith({}, ...objects, (objValue: any, srcValue: any) => {
    if (isArray(objValue) && isArray(srcValue)) {
      return [...objValue, ...srcValue]
    }
  })
}

/**
 * 安全地获取嵌套对象的属性值
 * @param object 对象
 * @param path 属性路径
 * @param defaultValue 默认值
 * @returns 属性值或默认值
 */
export function safeGet(object: any, path: string, defaultValue?: any): any {
  const result = get(object, path)
  return result !== undefined ? result : defaultValue
}

/**
 * 检查值是否为空（包括 null、undefined、空字符串、空数组、空对象）
 * @param value 要检查的值
 * @returns 是否为空
 */
export function isEmptyValue(value: any): boolean {
  if (value === null || value === undefined) return true
  if (isString(value) && value.trim() === '') return true
  if (isArray(value) && value.length === 0) return true
  if (isObject(value) && Object.keys(value).length === 0) return true
  return false
}

/**
 * 生成唯一 ID
 * @param prefix 前缀
 * @returns 唯一 ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 延迟执行
 * @param ms 延迟时间（毫秒）
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 重试函数
 * @param fn 要重试的函数
 * @param times 重试次数
 * @param delayMs 重试间隔（毫秒）
 * @returns Promise
 */
export async function retry<T>(fn: () => Promise<T>, times = 3, delayMs = 1000): Promise<T> {
  let lastError: Error

  for (let i = 0; i < times; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < times - 1) {
        await delay(delayMs)
      }
    }
  }

  throw lastError!
}

/**
 * 数组去重（基于指定属性）
 * @param array 数组
 * @param key 属性名或函数
 * @returns 去重后的数组
 */
export function uniqueBy<T>(array: T[], key: string | ((item: T) => any)): T[] {
  const seen = new Set()
  return filter(array, (item: T) => {
    const value = isFunction(key) ? (key as Function)(item) : get(item, key)
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

/**
 * 将数组转换为树形结构
 * @param array 数组
 * @param options 配置选项
 * @returns 树形结构
 */
export function arrayToTree<T extends Record<string, any>>(
  array: T[],
  options: {
    idKey?: string
    parentKey?: string
    childrenKey?: string
  } = {}
): T[] {
  const { idKey = 'id', parentKey = 'parentId', childrenKey = 'children' } = options

  const tree: T[] = []
  const map = new Map()

  // 创建映射
  forEach(array, (item) => {
    map.set(get(item, idKey), { ...item, [childrenKey]: [] })
  })

  // 构建树
  forEach(array, (item) => {
    const id = get(item, idKey)
    const parentId = get(item, parentKey)
    const node = map.get(id)

    if (parentId && map.has(parentId)) {
      const parent = map.get(parentId)
      get(parent, childrenKey).push(node)
    } else {
      tree.push(node)
    }
  })

  return tree
}

/**
 * 将树形结构转换为数组
 * @param tree 树形结构
 * @param childrenKey 子节点属性名
 * @returns 扁平数组
 */
export function treeToArray<T extends Record<string, any>>(
  tree: T[],
  childrenKey = 'children'
): T[] {
  const result: T[] = []

  function traverse(nodes: T[]) {
    forEach(nodes, (node: T) => {
      const children = get(node, childrenKey)
      const nodeWithoutChildren = omit(node, childrenKey) as T
      result.push(nodeWithoutChildren)

      if (children && children.length > 0) {
        traverse(children)
      }
    })
  }

  traverse(tree)
  return result
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 格式化数字（添加千分位分隔符）
 * @param num 数字
 * @param decimals 小数位数
 * @param decimalSeparator 小数分隔符
 * @param thousandsSeparator 千分位分隔符
 * @returns 格式化后的数字字符串
 */
export function formatNumber(
  num: number,
  decimals = 2,
  decimalSeparator = '.',
  thousandsSeparator = ','
): string {
  const str = num.toFixed(decimals)
  const parts = str.split('.')

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)

  return parts.join(decimalSeparator)
}
