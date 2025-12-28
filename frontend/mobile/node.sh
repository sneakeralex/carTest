#!/bin/bash

# 快捷启动脚本 - 自动使用Homebrew的Node.js

# 设置环境变量
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:$PATH"

# 显示版本信息
echo "🔧 配置项目使用Homebrew Node.js"
echo "Node.js版本: $(node --version)"
echo "npm版本: $(npm --version)"
echo ""

# 根据传入的参数执行不同的命令
case "$1" in
  "dev")
    echo "🚀 启动开发服务器..."
    npm run dev
    ;;
  "build")
    echo "🏗️ 构建项目..."
    npm run build
    ;;
  "install")
    echo "📦 安装依赖..."
    npm install
    ;;
  "test")
    echo "🧪 运行测试..."
    npm test
    ;;
  "")
    echo "用法: ./node.sh [command]"
    echo "可用命令:"
    echo "  dev     - 启动开发服务器"
    echo "  build   - 构建项目"
    echo "  install - 安装依赖"
    echo "  test    - 运行测试"
    ;;
  *)
    echo "🔧 执行自定义命令: npm $@"
    npm "$@"
    ;;
esac
