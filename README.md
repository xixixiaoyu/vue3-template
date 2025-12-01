# Vue 3 + Supabase SaaS 模板

一个基于 Vue 3 和 Supabase 的现代化 SaaS 产品起步模板，专注于开发效率和代码可维护性。

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

- **shadcn-vue** - 基于 Radix Vue 的组件库
- **lucide-vue-next** - 现代化图标库
- **@formkit/auto-animate** - 流畅的动画效果
- **@tanstack/vue-virtual** - 虚拟滚动组件
- **vuedraggable** - 拖拽功能

### 数据处理与工具

- **@tanstack/vue-query** - 强大的数据获取和状态管理
- **Axios** - HTTP 请求库，已封装请求拦截器和错误处理
- **date-fns** - 日期处理工具，支持中文本地化
- **lodash-es** - 常用工具函数集合
- **zod** + **vee-validate** - 表单验证

### 开发工具与监控

- **@vue/devtools** - Vue 3 开发者工具
- **@sentry/vue** - 错误监控和性能分析
- **Vitest** + **Playwright** - 单元测试和 E2E 测试
- **ESLint** + **Prettier** + **Husky** - 代码质量和格式化

### 国际化与 PWA

- **Vue I18n** - 国际化支持
- **Vite PWA** - 渐进式 Web 应用支持

## 快速开始

### 方法一：使用启动脚本（推荐）

```bash
# macOS/Linux
chmod +x start.sh
./start.sh

# Windows
start.bat
```

### 方法二：手动设置

1. 克隆此模板
2. 安装依赖: `pnpm install`
3. 复制 `.env.example` 到 `.env` 并填入你的 Supabase 配置
4. 启动开发服务器: `pnpm dev`

### 配置 Supabase

1. 访问 [Supabase](https://supabase.com) 并创建一个新项目
2. 在项目设置中找到 API 配置：
   - 进入 Project Settings → API
   - 复制 Project URL 和 anon public key
3. 编辑 `.env` 文件，填入你的 Supabase 配置：
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

应用将在 `http://localhost:5173` 启动。

## 项目结构

```
src/
├── api/              # API 调用封装
├── assets/           # 静态资源
├── components/       # 可复用组件
│   ├── ui/          # 基础 UI 组件（shadcn-vue）
│   └── auth/        # 认证相关组件
├── composables/      # 组合式函数（Vue 3 Composition API）
├── constants/        # 常量定义
├── lib/             # 工具库和第三方配置
│   ├── http.ts      # Axios HTTP 客户端配置
│   ├── supabase.ts  # Supabase 客户端配置
│   ├── date.ts      # 日期处理工具
│   ├── lodash.ts    # 工具函数库
│   ├── vue-query.ts # Vue Query 封装
│   └── sentry.ts    # Sentry 错误监控配置
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

- 基于 shadcn-vue 的完整组件库
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

## 使用指南

### HTTP 请求 (Axios)

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

### 开发工具 (@vue/devtools)

项目已集成 Vue 3 开发者工具，在开发模式下可以：

- 查看组件树和组件状态
- 检查 Vuex/Pinia 状态
- 性能分析
- 事件追踪

## 开发指南

### 添加新页面

1. 在 `src/views/` 目录下创建新的 Vue 组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 如果需要认证保护，添加 `meta: { requiresAuth: true }`

### 使用 Supabase 数据库

```typescript
import { supabase } from '@/lib/supabase'

// 示例：查询数据
const { data, error } = await supabase.from('your_table').select('*')

// 示例：插入数据
const { data, error } = await supabase.from('your_table').insert({ name: 'Example' })
```

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

## 部署

### 构建生产版本

```bash
# 使用 npm
npm run build

# 使用 yarn
yarn build

# 使用 pnpm
pnpm build
```

构建后的文件将在 `dist` 目录中。

### 部署到静态托管服务

这个模板可以部署到任何支持静态文件的托管服务，如：

- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

确保在部署时设置正确的环境变量。

## 常见问题

### 1. TypeScript 错误

如果遇到 TypeScript 错误，确保已安装所有依赖：

```bash
pnpm install
```

### 2. Supabase 连接问题

检查 `.env` 文件中的 Supabase URL 和 API 密钥是否正确。

### 3. 路由守卫不工作

确保在 `App.vue` 中调用了 `authStore.initialize()` 来初始化认证状态。

## 扩展建议

1. **添加更多认证方式**：OAuth（Google、GitHub 等）
2. **实现角色权限系统**：基于用户角色的访问控制
3. **添加 UI 组件库**：如 Headless UI、Element Plus 等
4. **实现国际化**：使用 Vue I18n
5. **添加测试**：Vitest + Vue Test Utils
6. **添加状态持久化**：使用 pinia-plugin-persistedstate

## 资源链接

- [Vue 3 文档](https://vuejs.org/)
- [Supabase 文档](https://supabase.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Vue Router 文档](https://router.vuejs.org/)

更多使用示例可以在项目的实际代码中找到，这些工具函数已在整个项目中集成使用。
