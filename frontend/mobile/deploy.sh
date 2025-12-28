#!/bin/bash

# SPA部署脚本
set -e

echo "🚀 开始部署Vue SPA应用..."

# 检查Node.js版本
echo "📋 检查环境..."
node --version
npm --version

# 安装依赖
echo "📦 安装依赖..."
npm ci

# 构建应用
echo "🔨 构建应用..."
npm run build

# 检查构建结果
if [ ! -d "dist" ]; then
    echo "❌ 构建失败：找不到dist目录"
    exit 1
fi

echo "✅ 构建完成"

# 如果有Docker，构建镜像
if command -v docker &> /dev/null; then
    echo "🐳 构建Docker镜像..."
    docker build -t car-test-mobile .
    echo "✅ Docker镜像构建完成"
    
    echo "🚢 运行容器..."
    docker stop car-test-mobile 2>/dev/null || true
    docker rm car-test-mobile 2>/dev/null || true
    docker run -d --name car-test-mobile -p 8080:80 car-test-mobile
    echo "✅ 应用已部署到 http://localhost:8080"
else
    echo "📁 构建文件位于 ./dist 目录"
    echo "📋 请将 dist 目录内容部署到Web服务器"
    echo "📋 并使用提供的nginx配置文件"
fi

echo "🎉 部署完成！"
