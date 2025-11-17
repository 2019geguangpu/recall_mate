#!/bin/bash

# 部署脚本
# Deployment Script

set -e

echo "🚀 开始部署 Recall Mate..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 检查环境变量文件
if [ ! -f .env ]; then
    echo "⚠️  .env 文件不存在，正在创建..."
    cat > .env << EOF
# 数据库连接
DATABASE_URL="mysql://recall_mate:recall_mate_password@db:3306/recall_mate"

# DeepSeek API Key
DEEPSEEK_API_KEY="your_deepseek_api_key_here"

# Next.js 环境
NODE_ENV="production"
EOF
    echo "✅ 已创建 .env 文件，请编辑并填入正确的配置"
    echo "📝 特别是 DEEPSEEK_API_KEY，请设置为你的实际 API Key"
    read -p "按 Enter 继续，或 Ctrl+C 取消..."
fi

# 加载环境变量
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# 验证 DEEPSEEK_API_KEY
if [ -z "$DEEPSEEK_API_KEY" ] || [ "$DEEPSEEK_API_KEY" = "your_deepseek_api_key_here" ]; then
    echo "❌ DEEPSEEK_API_KEY 未设置或仍为默认值"
    echo "📝 请在 .env 文件中设置有效的 DEEPSEEK_API_KEY"
    exit 1
fi

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down 2>/dev/null || true

# 构建镜像
echo "🔨 构建 Docker 镜像..."
docker-compose build

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 等待数据库就绪
echo "⏳ 等待数据库就绪..."
sleep 10

# 注意：数据库迁移现在会在容器启动时自动运行（通过 start.sh）
# 如果需要手动运行迁移，可以使用：
# docker-compose exec app prisma migrate deploy

echo "✅ 部署完成！"
echo ""
echo "📝 提示：数据库迁移会在容器启动时自动运行"
echo "📝 查看迁移日志：docker-compose logs app | grep -i migrate"
echo ""
echo "📱 应用地址: http://localhost:3000"
echo "📊 查看日志: docker-compose logs -f"
echo "🛑 停止服务: docker-compose down"
echo ""

