#!/bin/bash

echo "🚀 Vue 3 + Supabase 模板启动脚本"
echo "=================================="

# 检查是否存在 .env 文件
if [ ! -f .env ]; then
    echo "📝 创建 .env 文件..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请编辑此文件并填入你的 Supabase 配置"
    echo ""
    echo "📋 获取 Supabase 配置的步骤："
    echo "1. 访问 https://supabase.com 并登录"
    echo "2. 创建新项目或选择现有项目"
    echo "3. 进入 Project Settings → API"
    echo "4. 复制 Project URL 和 anon public key"
    echo "5. 将这些值填入 .env 文件中"
    echo ""
    echo "⚠️  请先配置 .env 文件，然后重新运行此脚本"
    exit 1
fi

# 检查是否已安装依赖
if [ ! -d node_modules ]; then
    echo "📦 安装依赖..."
    pnpm install
fi

# 启动开发服务器
echo "🌟 启动开发服务器..."
pnpm dev