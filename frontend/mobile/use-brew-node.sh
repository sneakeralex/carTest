#!/bin/bash

# 配置项目使用Homebrew安装的Node.js
echo "配置项目使用Homebrew的Node.js..."

# 设置环境变量，优先使用Homebrew的Node.js
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:$PATH"

# 显示当前使用的Node.js版本
echo "当前Node.js版本: $(node --version)"
echo "当前npm版本: $(npm --version)"
echo "Node.js路径: $(which node)"

# 如果传入参数，则执行相应的npm命令
if [ $# -gt 0 ]; then
    echo "执行命令: $@"
    exec "$@"
else
    echo "使用方法: ./use-brew-node.sh [command]"
    echo "例如: ./use-brew-node.sh npm install"
    echo "例如: ./use-brew-node.sh npm run dev"
fi
