#!/bin/bash
cd "$(dirname "$0")"

echo "========================================"
echo "  [1/2] 正在打包前端..."
echo "========================================"
npm run build
if [ $? -ne 0 ]; then
    echo ""
    echo "  前端打包失败！"
    exit 1
fi

echo ""
echo "========================================"
echo "  [2/2] 生成发布目录..."
echo "========================================"

OUT="./release"
rm -rf "$OUT"
mkdir -p "$OUT/dist"

# 复制 dist 产物
cp -r dist/* "$OUT/dist/"

# 复制 nginx 配置和启动脚本
cp nginx.conf "$OUT/"
cp start.command "$OUT/"
chmod +x "$OUT/start.command"

echo ""
echo "========================================"
echo "  完成！"
echo "========================================"
echo ""
echo "  发布目录: $OUT"
echo ""
echo "  Mac 使用方法:"
echo "    把 release 目录拷贝到 Mac 上"
echo "    双击 start.command 即可自动启动服务并打开浏览器"
echo "    无需安装任何软件（Mac 自带 Python3）"
echo ""
echo "  如需使用 nginx:"
echo "    brew install nginx"
echo "    nginx -p \$(pwd)/release -c release/nginx.conf"
echo "========================================"
