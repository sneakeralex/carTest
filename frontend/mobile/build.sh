#!/bin/bash

# 构建脚本 - 使用正确的 Node.js 版本
# 解决 Node.js v8.17.0 不兼容 Vite 的问题

echo "🚀 开始构建项目..."
echo "当前目录: $(pwd)"

# 检查是否存在 Homebrew 的 Node.js
if [ -f "/opt/homebrew/bin/node" ]; then
    echo "✅ 找到 Homebrew Node.js: $(/opt/homebrew/bin/node --version)"
    echo "✅ 找到 Homebrew npm: $(/opt/homebrew/bin/npm --version)"
    
    # 临时设置 PATH
    export PATH="/opt/homebrew/bin:$PATH"
    
    echo "🔧 使用正确的 Node.js 版本构建..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "🎉 构建成功完成！"
        echo "📁 构建文件位于: dist/"
        echo "📊 构建统计:"
        du -sh dist/
        echo "📋 主要文件:"
        ls -lah dist/index.html
        ls -lah dist/assets/*.js | head -5
    else
        echo "❌ 构建失败"
        exit 1
    fi
else
    echo "❌ 未找到 Homebrew Node.js (/opt/homebrew/bin/node)"
    echo "当前 Node.js 版本: $(node --version)"
    echo "⚠️  需要 Node.js 14.18+ 版本才能运行 Vite"
    exit 1
fi
