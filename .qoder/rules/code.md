---
trigger: always_on
alwaysApply: true
---

# 核心原则：

1. 深入本质，而非表面。
2. 表达需易懂，自然流畅、精炼准确。
3. 中文与英文/数字间加空格。
4. 如果是 JS、TS 代码，请优先使用两空格缩进、单引号、无分号。
5. 给出答案请尽量基于完整充分的上下文。
6. 代码请避免过度优化。

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
