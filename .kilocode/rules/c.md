## 项目概述

这是一个基于 Vue 3 和 Supabase 的现代化 SaaS 产品，专注于开发效率和代码可维护性。项目使用 TypeScript 严格模式，采用 Composition API，集成了丰富的工具库和最佳实践。

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
│   └── utils.ts     # 通用工具函数
├── locales/         # 国际化文件
├── middleware/      # 路由中间件
├── router/          # 路由配置和守卫
├── stores/          # Pinia 状态管理
├── test/            # 测试配置和工具
├── types/           # TypeScript 类型定义
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

## 常用工具和函数

### HTTP 请求

```typescript
import { httpService } from '@/lib/http'

// GET 请求
const data = await httpService.get('/api/users')

// POST 请求
const result = await httpService.post('/api/users', userData)

// 文件上传
const formData = new FormData()
formData.append('file', file)
const uploadResult = await httpService.upload('/api/upload', formData)
```

### 日期处理

```typescript
import { formatDate, formatRelativeTime, isToday } from '@/lib/date'

// 格式化日期
const formatted = formatDate(new Date(), 'yyyy年MM月dd日')

// 相对时间
const relative = formatRelativeTime(new Date()) // 3 小时前

// 检查是否为今天
const today = isToday(new Date())
```

### 工具函数

```typescript
import {
  debounce,
  throttle,
  cloneDeep,
  generateId,
  formatFileSize,
  uniqueBy,
  arrayToTree,
} from '@/lib/lodash'

// 防抖函数
const debouncedSearch = debounce((query: string) => {
  console.log('搜索:', query)
}, 300)

// 生成唯一 ID
const id = generateId('user') // user_1640995200000_abc123def

// 格式化文件大小
const size = formatFileSize(1024 * 1024 * 5.7) // 5.7 MB
```

### 通知系统

```typescript
import { useNotification } from '@/composables/useNotification'

const { success, error, warning, info } = useNotification()

// 显示成功通知
success('操作成功', '数据已保存')

// 显示错误通知
error('操作失败', '请检查网络连接')
```

### 表单验证

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

```typescript
import { useFileUpload } from '@/composables/useFileUpload'

const { uploadFile, isUploading, uploadProgress } = useFileUpload()

// 上传文件
const result = await uploadFile(file, {
  bucket: 'avatars',
  category: 'image',
})
```

## 环境配置

### 必需的环境变量

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=your_api_base_url
VITE_SENTRY_DSN=your_sentry_dsn
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
pnpm test
pnpm test:ui
pnpm test:run
pnpm test:coverage

# E2E 测试
pnpm test:e2e
pnpm test:e2e:ui
pnpm test:e2e:debug
pnpm test:e2e:codegen
pnpm test:e2e:install

# 代码检查和格式化
pnpm lint
pnpm format
pnpm format:check
pnpm type-check

# 数据库操作
pnpm db:init
pnpm db:migrate
pnpm db:reset
pnpm db:types

# Supabase 操作
pnpm supabase:start
pnpm supabase:stop

# 构建分析
pnpm build:analyze
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
