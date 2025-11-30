# Vue 3 + Supabase 模板设置指南

## 快速开始

### 1. 安装依赖

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install

# 使用 pnpm (推荐)
pnpm install
```

### 2. 配置 Supabase

1. 访问 [Supabase](https://supabase.com) 并创建一个新项目
2. 在项目设置中找到 API 配置：
   - 进入 Project Settings → API
   - 复制 Project URL 和 anon public key
3. 在项目根目录创建 `.env` 文件（基于 `.env.example`）：
   ```bash
   cp .env.example .env
   ```
4. 编辑 `.env` 文件，填入你的 Supabase 配置：
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. 启动开发服务器

```bash
# 使用 npm
npm run dev

# 使用 yarn
yarn dev

# 使用 pnpm
pnpm dev
```

应用将在 `http://localhost:5173` 启动。

## 项目结构说明

```
src/
├── api/              # API 调用封装（预留）
├── assets/           # 静态资源
│   └── main.css      # 主样式文件（Tailwind CSS）
├── components/       # 可复用组件（预留）
│   ├── ui/          # 基础 UI 组件（预留）
│   └── layout/      # 布局组件（预留）
├── composables/      # 组合式函数（预留）
├── lib/             # 工具库和第三方配置
│   └── supabase.ts  # Supabase 客户端配置
├── router/          # 路由配置
│   └── index.ts     # 路由定义和守卫
├── stores/          # Pinia 状态管理
│   └── auth.ts      # 认证状态管理
├── types/           # TypeScript 类型定义（预留）
├── utils/           # 工具函数（预留）
├── views/           # 页面组件
│   ├── Login.vue    # 登录页面
│   ├── Register.vue # 注册页面
│   └── Dashboard.vue # 仪表板页面
├── App.vue          # 根组件
└── main.ts          # 应用入口
```

## 核心功能说明

### 认证系统

项目已集成 Supabase Auth，提供以下功能：

1. **用户注册**：邮箱密码注册
2. **用户登录**：邮箱密码登录
3. **会话管理**：自动检查和恢复用户会话
4. **路由守卫**：保护需要认证的页面

### 路由系统

- `/` - 仪表板（需要认证）
- `/login` - 登录页面（游客访问）
- `/register` - 注册页面（游客访问）

### 状态管理

使用 Pinia 管理应用状态，目前包含：

- `auth` store：管理用户认证状态、用户信息和认证操作

## 开发指南

### 添加新页面

1. 在 `src/views/` 目录下创建新的 Vue 组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 如果需要认证保护，添加 `meta: { requiresAuth: true }`

### 使用 Supabase 数据库

```typescript
import { supabase } from '@/lib/supabase'

// 示例：查询数据
const { data, error } = await supabase
  .from('your_table')
  .select('*')

// 示例：插入数据
const { data, error } = await supabase
  .from('your_table')
  .insert({ name: 'Example' })
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
    updateState
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