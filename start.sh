#!/bin/sh
set -e

echo "🚀 启动 Recall Mate..."

# 等待数据库就绪（最多等待 30 秒）
if [ -n "$DATABASE_URL" ]; then
  echo "⏳ 等待数据库连接..."
  max_attempts=15
  attempt=0
  
  while [ $attempt -lt $max_attempts ]; do
    # 尝试使用 prisma 检查数据库连接
    if prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1 || \
       npx --yes prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1; then
      echo "✅ 数据库已就绪"
      break
    fi
    attempt=$((attempt + 1))
    echo "等待数据库... ($attempt/$max_attempts)"
    sleep 2
  done
  
  if [ $attempt -eq $max_attempts ]; then
    echo "⚠️  数据库连接超时，继续启动..."
  fi
fi

# 运行数据库迁移
echo "📊 运行数据库迁移..."
prisma migrate deploy || npx --yes prisma migrate deploy || {
  echo "⚠️  迁移失败或无需迁移"
}

# 启动应用
echo "🚀 启动 Next.js 应用..."
exec node server.js

