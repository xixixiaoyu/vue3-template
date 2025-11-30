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