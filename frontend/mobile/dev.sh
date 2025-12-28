#!/bin/bash

# 开发服务器启动脚本
# 解决 Node.js 版本兼容性问题

echo "🚀 启动开发服务器..."
echo "当前目录: $(pwd)"

# 检查 Homebrew Node.js
HOMEBREW_NODE="/opt/homebrew/bin/node"
HOMEBREW_NPM="/opt/homebrew/bin/npm"

if [ -f "$HOMEBREW_NODE" ]; then
    echo "✅ 找到 Homebrew Node.js: $($HOMEBREW_NODE --version)"
else
    echo "❌ 未找到 Homebrew Node.js"
    exit 1
fi

if [ -f "$HOMEBREW_NPM" ]; then
    echo "✅ 找到 Homebrew npm: $($HOMEBREW_NPM --version)"
else
    echo "❌ 未找到 Homebrew npm"
    exit 1
fi

echo "🔧 使用正确的 Node.js 版本启动开发服务器..."

# 设置环境变量并运行开发服务器
export PATH="/opt/homebrew/bin:$PATH"
$HOMEBREW_NPM run dev

echo "🎉 开发服务器已启动！"
