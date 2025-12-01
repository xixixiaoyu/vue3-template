# Vue 3 + Supabase SaaS 模板

一个基于 Vue 3 和 Supabase 的现代化 SaaS 产品起步模板，专注于开发效率和代码可维护性。

## 技术栈

- **核心框架**: Vue 3 (Composition API) + Vite
- **语言**: TypeScript (严格模式)
- **样式方案**: Tailwind CSS
- **状态管理**: Pinia
- **路由**: Vue Router (包含路由守卫)
- **后端/数据库**: Supabase
- **图标/UI**: lucide-vue-next
- **HTTP 请求**: Axios (封装了请求拦截器和错误处理)
- **日期处理**: date-fns (支持中文本地化)
- **工具函数**: lodash-es (常用工具函数集合)
- **开发工具**: @vue/devtools (Vue 3 开发者工具)

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

## 项目结构

```
src/
├── api/              # API 调用封装
├── assets/           # 静态资源
├── components/       # 可复用组件
│   ├── ui/          # 基础 UI 组件
│   └── layout/      # 布局组件
├── composables/      # 组合式函数
├── lib/             # 工具库和第三方配置
│   └── supabase.ts  # Supabase 客户端配置
├── router/          # 路由配置
├── stores/          # Pinia 状态管理
│   └── auth.ts      # 认证状态管理
├── types/           # TypeScript 类型定义
├── utils/           # 工具函数
├── views/           # 页面组件
│   ├── auth/        # 认证相关页面
│   └── dashboard/   # 仪表板相关页面
├── App.vue          # 根组件
└── main.ts          # 应用入口
```

## 特性

- ✅ TypeScript 严格模式
- ✅ 响应式设计 (Tailwind CSS)
- ✅ 用户认证 (Supabase Auth)
- ✅ 路由守卫
- ✅ 状态管理 (Pinia)
- ✅ 现代化开发体验 (Vite)
- ✅ HTTP 请求封装 (Axios)
- ✅ 日期处理工具 (date-fns)
- ✅ 工具函数库 (lodash-es)
- ✅ Vue 3 开发者工具集成

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

更多使用示例可以在项目的实际代码中找到，这些工具函数已在整个项目中集成使用。
