#!/bin/bash
# 获取脚本所在目录
DIR="$(cd "$(dirname "$0")" && pwd)"
DIST="$DIR/dist"

# 检查 dist 目录
if [ ! -d "$DIST" ]; then
    osascript -e 'display dialog "找不到 dist 文件夹，请确保 dist 目录和本文件在同一级。" buttons {"确定"} default button "确定" with icon stop with title "Test Entry"'
    exit 1
fi

# 查找可用端口（默认 3000）
PORT=3000
while true; do
    if ! lsof -i :$PORT > /dev/null 2>&1; then
        break
    fi
    PORT=$((PORT + 1))
done

# 延迟打开浏览器
(sleep 1 && open "http://localhost:$PORT") &

# 用 Python 启动静态服务器
cd "$DIST"
echo ""
echo "  ========================================"
echo "    Test Entry Server Started"
echo "  ========================================"
echo ""
echo "    Local:   http://localhost:$PORT"
echo ""
echo "    按 Ctrl+C 停止服务"
echo ""

python3 -m http.server $PORT
