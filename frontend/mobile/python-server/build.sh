#!/bin/bash

# 打包脚本
# 将python-server的必要文件打包到release目录
# 增量打包：只复制修改过的文件

set -e

echo "开始打包 python-server..."

# 创建release目录
RELEASE_DIR="release"
mkdir -p "$RELEASE_DIR"

# 上次打包时间文件
LAST_BUILD_FILE="$RELEASE_DIR/.last_build"

# 获取上次打包时间
if [ -f "$LAST_BUILD_FILE" ]; then
    LAST_BUILD_TIME=$(cat "$LAST_BUILD_FILE")
    echo "上次打包时间: $(date -r "$LAST_BUILD_TIME")"
else
    LAST_BUILD_TIME=0
    echo "首次打包"
fi

# 当前时间
CURRENT_TIME=$(date +%s)

# 要复制的文件列表
FILES=("server.py" "config.py" "db_manager.py" "gunicorn_config.py" "sqlite_handler.py" "verification_code_manager.py" "requirements.txt" ".env.example" "python-server.service")

# 复制必要的文件
echo "复制必要文件..."
updated_count=0

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        FILE_MTIME=$(stat -f "%m" "$file")
        if [ "$FILE_MTIME" -gt "$LAST_BUILD_TIME" ]; then
            echo "  更新: $file"
            cp -f "$file" "$RELEASE_DIR/"
            updated_count=$((updated_count + 1))
        else
            echo "  未修改: $file"
        fi
    else
        echo "  警告: 文件不存在: $file"
    fi
done

# 更新上次打包时间
echo "$CURRENT_TIME" > "$LAST_BUILD_FILE"

# 注意：data和logs目录不需要打包，会在运行时自动创建
if [ "$updated_count" -gt 0 ]; then
    echo "打包完成！"
    echo "更新了 $updated_count 个文件"
else
    echo "打包完成！"
    echo "没有文件需要更新"
fi
echo "文件已复制到 $RELEASE_DIR 目录"
echo ""
echo "下一步操作："
echo "1. 进入 release 目录: cd $RELEASE_DIR"
echo "2. 安装依赖: pip install -r requirements.txt"
echo "3. 配置环境变量: cp .env.example .env && 编辑 .env 文件"
echo "4. 启动服务: python server.py"
echo "   或使用 Gunicorn: gunicorn -c gunicorn_config.py server:app"
echo ""
echo "注意：data和logs目录会在运行时自动创建"
