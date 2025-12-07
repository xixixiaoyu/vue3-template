# Vue 3 + Supabase 项目开发规范

## 项目概述

这是一个基于 Vue 3 和 Supabase 的现代化 SaaS 产品模板，专注于开发效率和代码可维护性。项目采用 TypeScript 严格模式，使用 Composition API，集成了丰富的工具库和最佳实践。

## 技术栈

### 核心框架

- **Vue 3** (Composition API) + **Vite** - 现代化前端框架和构建工具
- **TypeScript** (严格模式) - 类型安全的 JavaScript 超集
- **Tailwind CSS** - 实用优先的 CSS 框架

### 状态管理与路由

- **Pinia** - Vue 3 官方推荐的状态管理库，支持持久化
- **Vue Router** - 包含路由守卫的官方路由管理器

### 后端与数据库

- **Supabase** - 提供认证、数据库、存储和实时功能的 BaaS 服务

### UI 与交互

- **Naive UI** - Vue 3 组件库，主题可定制，TypeScript 支持
- **@vicons/ionicons5** - Ionicons 图标库
- **lucide-vue-next** - 现代化图标库
- **@formkit/auto-animate** - 流畅的动画效果
- **@tanstack/vue-virtual** - 虚拟滚动组件
- **vuedraggable** - 拖拽功能
- **vue-upload-component** - 文件上传组件
- **vfonts** - 字体支持

### 数据处理与工具

- **@tanstack/vue-query** - 强大的数据获取和状态管理
- **Axios** - HTTP 请求库，已封装请求拦截器和错误处理
- **date-fns** - 日期处理工具，支持中文本地化
- **lodash-es** - 常用工具函数集合
- **zod** + **vee-validate** - 表单验证
- **echarts** - 数据可视化图表库

### 开发工具与监控

- **@vue/devtools** - Vue 3 开发者工具
- **@sentry/vue** - 错误监控和性能分析
- **Vitest** + **Playwright** - 单元测试和 E2E 测试
- **ESLint** + **Prettier** + **Husky** - 代码质量和格式化
- **lint-staged** - Git 暂存文件检查
- **@vueuse/core** - Vue 组合式工具集

### 国际化与 PWA

- **Vue I18n** - 国际化支持
- **Vite PWA** - 渐进式 Web 应用支持
- **@unhead/vue** - 现代 HTML 文档头管理

## 项目结构

```
src/
├── api/              # API 调用封装
├── assets/           # 静态资源
├── components/       # 可复用组件
│   ├── ui/          # 基础 UI 组件（Naive UI）
│   │   ├── dev-alert/
│   │   ├── draggable-list/
│   │   ├── icon/
│   │   ├── language-switcher/
│   │   ├── lazy-image/
│   │   ├── loading/
│   │   ├── notification/
│   │   ├── pwa-install/
│   │   └── virtual-list/
│   └── auth/        # 认证相关组件
├── composables/      # 组合式函数（Vue 3 Composition API）
├── constants/        # 常量定义
├── lib/             # 工具库和第三方配置
│   ├── http.ts      # Axios HTTP 客户端配置
│   ├── supabase.ts  # Supabase 客户端配置
│   ├── date.ts      # 日期处理工具
│   ├── lodash.ts    # 工具函数库
│   ├── vue-query.ts # Vue Query 封装
│   ├── sentry.ts    # Sentry 错误监控配置
│   ├── icons.ts     # 图标配置
│   ├── index.ts     # 库入口文件
│   └── utils.ts     # 通用工具函数
├── locales/         # 国际化文件
├── middleware/      # 路由中间件
├── router/          # 路由配置和守卫
├── stores/          # Pinia 状态管理
├── test/            # 测试配置和工具
│   └── components/  # 测试组件
├── types/           # TypeScript 类型定义
│   ├── database.types.ts # Supabase 数据库类型
│   └── index.ts     # 通用类型定义
├── utils/           # 工具函数
└── views/           # 页面组件
```

## 核心功能与特性

### 认证系统

- 完整的用户认证流程（注册、登录、退出）
- OAuth 登录支持（Google、GitHub 等）
- 密码重置和更新功能
- 用户资料管理
- 会话管理和自动刷新
- 基于角色的权限控制

### 路由系统

- 动态路由加载
- 路由守卫（认证和游客状态检查）
- 元信息管理（标题、描述、权限等）
- 404 错误处理

### 状态管理

- Pinia 状态管理，支持持久化
- 模块化状态设计
- 响应式状态更新

### 数据管理

- Vue Query 数据获取和缓存
- Supabase 数据库操作封装
- 实时数据同步
- 分页、过滤、排序支持

### 文件处理

- 完整的文件上传功能
- 文件类型验证和大小限制
- 文件预览和管理
- 多文件上传支持

### UI 组件

- 基于 Naive UI 的完整组件库
- 响应式设计
- 暗色模式支持
- 动画和过渡效果
- 虚拟滚动和拖拽功能

### 错误处理

- 全局错误处理机制
- 用户友好的错误消息
- 错误日志和监控（Sentry）
- 网络错误重试

### 国际化

- Vue I18n 多语言支持
- 动态语言切换
- 本地化日期和数字格式

### PWA 支持

- 离线功能
- 应用安装提示
- 缓存策略
- 更新通知

## 开发规范

### 代码风格

- 使用两空格缩进
- 单引号字符串
- 无分号结尾
- 组件使用 PascalCase 命名
- 文件和目录使用 kebab-case 命名

### TypeScript

- 启用严格模式
- 优先使用类型推断
- 为所有公共 API 提供类型定义
- 使用接口定义对象结构

### 组件开发

- 使用 Composition API 和 `<script setup>` 语法
- 单一职责原则
- Props 和 Emits 明确定义类型
- 使用组合式函数复用逻辑

### 状态管理

- 使用 Pinia 进行状态管理
- 状态按功能模块划分
- 使用计算属性处理派生状态
- 异步操作在 actions 中处理

### 样式规范

- 使用 Tailwind CSS 类名
- 响应式设计优先
- 组件样式隔离
- 语义化 HTML 结构

## 核心工具和函数

### HTTP 请求

项目已封装了 Axios，提供了统一的 HTTP 请求服务：

```typescript
import { httpService } from '@/lib/http'

// GET 请求
const users = await httpService.get('/users')

// POST 请求
const newUser = await httpService.post('/users', { name: 'John', email: 'john@example.com' })

// 文件上传
const formData = new FormData()
formData.append('file', file)
const result = await httpService.upload('/upload', formData)
```

### 日期处理 (date-fns)

提供了丰富的日期处理函数，支持中文本地化：

```typescript
import { formatDate, formatRelativeTime, formatDateTime, isToday, getDaysAgo } from '@/lib/date'

// 格式化日期
const formatted = formatDate(new Date(), 'yyyy年MM月dd日') // 2024年01月01日

// 相对时间
const relative = formatRelativeTime(new Date()) // 3 小时前

// 检查是否为今天
const today = isToday(new Date()) // true

// 获取几天前的日期
const weekAgo = getDaysAgo(7)
```

### 工具函数 (lodash-es)

提供了常用的工具函数，以及一些自定义的实用函数：

```typescript
import {
  debounce,
  throttle,
  cloneDeep,
  isEmpty,
  generateId,
  formatFileSize,
  deepMerge,
  uniqueBy,
  arrayToTree,
} from '@/lib/lodash'

// 防抖函数
const debouncedSearch = debounce((query: string) => {
  console.log('搜索:', query)
}, 300)

// 深拷贝
const cloned = cloneDeep(originalObject)

// 生成唯一 ID
const id = generateId('user') // user_1640995200000_abc123def

// 格式化文件大小
const size = formatFileSize(1024 * 1024 * 5.7) // 5.7 MB

// 数组去重
const unique = uniqueBy(users, 'id')

// 数组转树
const tree = arrayToTree(flatArray)
```

### 通知系统

提供了全局通知管理功能：

```typescript
import { useNotification } from '@/composables/useNotification'

const { success, error, warning, info } = useNotification()

// 显示成功通知
success('操作成功', '数据已保存')

// 显示错误通知
error('操作失败', '请检查网络连接')

// 显示持久错误通知
error('操作失败', '请检查网络连接', { persistent: true })
```

### 表单验证

基于 Zod 和 Vee-Validate 的表单验证系统：

```typescript
import { useFormValidation, validationRules } from '@/composables/useFormValidation'
import { z } from 'zod'

// 定义验证 schema
const schema = z.object({
  email: validationRules.email,
  password: validationRules.password,
})

// 使用表单验证
const { fields, isSubmitting, handleSubmit } = useFormValidation({
  schema,
  onSubmit: async (values) => {
    // 提交逻辑
  },
})
```

### 文件上传

完整的文件上传功能，支持多种文件类型和验证：

```typescript
import { useFileUpload, FILE_TYPE_LIMITS } from '@/composables/useFileUpload'

const {
  uploadFile,
  uploadMultipleFiles,
  isUploading,
  uploadProgress,
  validateFileType,
  validateFileSize,
  detectFileType,
} = useFileUpload()

// 上传单个文件
const result = await uploadFile(file, {
  bucket: 'avatars',
  category: 'image',
})

// 上传多个文件
const results = await uploadMultipleFiles(files, {
  bucket: 'documents',
  category: 'document',
})

// 验证文件类型
validateFileType(file, 'image')

// 自动检测文件类型
const fileType = detectFileType(file)
```

### Supabase 数据库操作

```typescript
import { supabase } from '@/lib/supabase'

// 查询数据
const { data, error } = await supabase.from('your_table').select('*')

// 插入数据
const { data, error } = await supabase.from('your_table').insert({ name: 'Example' })

// 实时订阅
const subscription = supabase
  .channel('your_channel')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'your_table' }, (payload) => {
    console.log('Change received!', payload)
  })
  .subscribe()
```

### Vue Query 数据管理

基于 TanStack Query 的数据获取和状态管理：

```typescript
import {
  useSupabaseQuery,
  useSupabaseList,
  useSupabaseCreate,
  useSupabaseUpdate,
  useSupabaseDelete,
  useSupabasePaginatedQuery,
} from '@/lib/vue-query'

// 查询单个记录
const { data: user, isLoading, error } = useSupabaseQuery('users', userId)

// 查询列表
const {
  data: users,
  isLoading,
  error,
} = useSupabaseList('users', {
  filters: { active: true },
  orderBy: 'created_at',
  ascending: false,
  pageSize: 20,
})

// 分页查询
const {
  data: paginatedUsers,
  isLoading,
  error,
  page,
  nextPage,
  prevPage,
  goToPage,
} = useSupabasePaginatedQuery('users', {
  pageSize: 10,
  orderBy: 'created_at',
})

// 创建记录
const createMutation = useSupabaseCreate('users')
const handleCreate = async (userData) => {
  await createMutation.mutateAsync(userData)
}

// 更新记录
const updateMutation = useSupabaseUpdate('users')
const handleUpdate = async (id, updates) => {
  await updateMutation.mutateAsync({ id, updates })
}

// 删除记录
const deleteMutation = useSupabaseDelete('users')
const handleDelete = async (id) => {
  await deleteMutation.mutateAsync(id)
}
```

### 错误监控 (Sentry)

全局错误监控和性能分析：

```typescript
import { reportError, reportMessage, setUser, setTag } from '@/lib/sentry'

// 手动报告错误
try {
  // 可能出错的代码
} catch (error) {
  reportError(error, {
    context: 'user_action',
    userId: '123',
    action: 'submit_form',
  })
}

// 报告消息
reportMessage('User completed onboarding', 'info')

// 设置用户信息
setUser({
  id: '123',
  email: 'user@example.com',
  username: 'john_doe',
})

// 设置标签
setTag('feature', 'premium')
setTag('version', '1.0.0')
```

### 主题管理

支持明暗主题切换：

```typescript
import { useTheme } from '@/composables/useTheme'

const { theme, isDark, toggleTheme, setTheme } = useTheme()

// 切换主题
toggleTheme()

// 设置特定主题
setTheme('dark')

// 检查当前主题
if (isDark.value) {
  console.log('当前是暗色主题')
}
```

### 国际化支持

多语言切换功能：

```typescript
import { useI18n } from '@/composables/useI18n'

const { locale, t, setLocale, availableLocales } = useI18n()

// 切换语言
setLocale('en')

// 获取翻译文本
const message = t('welcome.message')

// 获取可用语言列表
console.log(availableLocales.value)
```

### 权限管理

基于角色的权限控制：

```typescript
import { usePermissions } from '@/composables/usePermissions'

const { hasPermission, hasRole, can } = usePermissions()

// 检查权限
if (hasPermission('users:create')) {
  // 显示创建用户按钮
}

// 检查角色
if (hasRole('admin')) {
  // 显示管理员功能
}

// 使用权限检查函数
if (can('edit', 'post')) {
  // 显示编辑按钮
}
```

### 实时数据同步

Supabase 实时订阅封装：

```typescript
import { useRealtime } from '@/composables/useRealtime'

const { subscribe, unsubscribe, isConnected } = useRealtime()

// 订阅表变更
const unsubscribeFn = subscribe('posts', (payload) => {
  console.log('Posts table changed:', payload)
  // 处理数据变更
})

// 取消订阅
unsubscribeFn()

// 检查连接状态
if (isConnected.value) {
  console.log('实时连接已建立')
}
```

## 环境配置

### 必需的环境变量

```env
# Supabase 配置
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API 配置
VITE_API_BASE_URL=http://localhost:3000/api

# 错误监控配置（可选）
VITE_SENTRY_DSN=your_sentry_dsn

# 应用基础 URL
BASE_URL=/
```

### 开发脚本

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 运行测试
pnpm test              # 运行单元测试
pnpm test:ui           # 运行测试 UI 界面
pnpm test:run          # 运行测试并退出
pnpm test:coverage     # 生成测试覆盖率报告

# E2E 测试
pnpm test:e2e          # 运行 E2E 测试
pnpm test:e2e:ui       # 运行 E2E 测试 UI 界面
pnpm test:e2e:debug    # 调试模式运行 E2E 测试
pnpm test:e2e:codegen  # 生成 E2E 测试代码
pnpm test:e2e:install  # 安装 E2E 测试依赖

# 代码检查和格式化
pnpm lint              # 运行 ESLint 检查
pnpm format            # 格式化代码
pnpm format:check       # 检查代码格式
pnpm type-check        # TypeScript 类型检查

# 数据库操作
pnpm db:init           # 初始化数据库
pnpm db:migrate        # 运行数据库迁移
pnpm db:reset          # 重置数据库
pnpm db:types          # 生成数据库类型定义

# Supabase 操作
pnpm supabase:start    # 启动 Supabase 本地服务
pnpm supabase:stop     # 停止 Supabase 本地服务

# 构建分析
pnpm build:analyze     # 构建并分析包大小
```

## 最佳实践

### 性能优化

- 使用 Vue 3 的响应式 API 优化渲染
- 虚拟滚动处理大列表
- 图片懒加载
- 代码分割和动态导入
- 缓存策略优化

### 安全考虑

- 输入验证和清理
- XSS 防护
- CSRF 保护
- 敏感信息不在前端存储
- 使用 HTTPS
- Supabase RLS（行级安全）策略
- JWT 令牌管理
- 环境变量保护

### 可访问性

- 语义化 HTML
- ARIA 标签
- 键盘导航支持
- 颜色对比度
- 屏幕阅读器支持

### 测试策略

- 单元测试覆盖核心逻辑
- 组件测试验证 UI 行为
- E2E 测试覆盖关键流程
- 测试驱动开发（TDD）

## 常见问题解决

### 认证问题

- 检查 Supabase 配置是否正确
- 确认环境变量设置
- 查看网络请求是否被阻止

### 状态管理问题

- 确认 Pinia 模块正确注册
- 检查持久化配置
- 验证响应式数据更新

### 样式问题

- 确认 Tailwind CSS 配置
- 检查样式优先级
- 验证响应式断点

### 构建问题

- 清除 node_modules 重新安装
- 检查 TypeScript 配置
- 确认依赖版本兼容性

## 开发指南

### 添加新页面

1. 在 `src/views/` 目录下创建新的 Vue 组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 如果需要认证保护，添加 `meta: { requiresAuth: true }`

### 添加新的状态管理

```typescript
// src/stores/your-store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useYourStore = defineStore('your-store', () => {
  // 状态
  const state = ref('initial value')

  // 计算属性
  const computedValue = computed(() => state.value.toUpperCase())

  // 方法
  const updateState = (newValue: string) => {
    state.value = newValue
  }

  return {
    state,
    computedValue,
    updateState,
  }
})
```

### 添加新的组合式函数

```typescript
// src/composables/useYourComposable.ts
import { ref, computed } from 'vue'

export function useYourComposable() {
  const state = ref('initial value')

  const computedValue = computed(() => state.value.toUpperCase())

  const updateState = (newValue: string) => {
    state.value = newValue
  }

  return {
    state,
    computedValue,
    updateState,
  }
}
```

## 部署

### 构建生产版本

```bash
pnpm build
```

### 部署到静态托管服务

这个模板可以部署到任何支持静态文件的托管服务，如：

- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

确保在部署时设置正确的环境变量。
