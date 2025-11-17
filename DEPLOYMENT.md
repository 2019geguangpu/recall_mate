# 部署指南 / Deployment Guide

## 🐳 Docker 部署

### 前置要求

- Docker 20.10+
- Docker Compose 2.0+
- 至少 2GB 可用内存

### 快速开始

#### 1. 准备环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
nano .env  # 或使用你喜欢的编辑器
```

**必须配置的环境变量：**
- `DATABASE_URL`: MySQL 数据库连接字符串
- `DEEPSEEK_API_KEY`: DeepSeek API 密钥

#### 2. 使用 Docker Compose 部署（推荐）

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 停止并删除数据卷（注意：会删除数据库数据）
docker-compose down -v
```

#### 3. 数据库迁移

**自动迁移（推荐）**：
容器启动时会自动运行数据库迁移，无需手动操作。

**手动迁移（如果需要）**：

```bash
# 进入应用容器
docker-compose exec app sh

# 运行 Prisma 迁移
prisma migrate deploy

# 退出容器
exit
```

或者一行命令：

```bash
docker-compose exec app prisma migrate deploy
```

#### 4. 访问应用

- 应用地址：http://localhost:3000
- 数据库端口：3306（仅容器内访问）

### 单独使用 Dockerfile

如果你不想使用 Docker Compose：

```bash
# 构建镜像
docker build -t recall-mate:latest .

# 运行容器（需要先启动 MySQL）
docker run -d \
  --name recall-mate \
  -p 3000:3000 \
  -e DATABASE_URL="mysql://user:password@host:3306/database" \
  -e DEEPSEEK_API_KEY="your_api_key" \
  recall-mate:latest
```

## 🔧 生产环境部署

### 1. 使用环境变量文件

创建 `.env.production` 文件：

```bash
DATABASE_URL=mysql://user:password@db_host:3306/recall_mate
DEEPSEEK_API_KEY=your_production_api_key
NODE_ENV=production
```

在 `docker-compose.yml` 中指定：

```yaml
services:
  app:
    env_file:
      - .env.production
```

### 2. 使用外部数据库

如果使用外部数据库（如云数据库），修改 `docker-compose.yml`：

```yaml
services:
  app:
    environment:
      - DATABASE_URL=mysql://user:password@external_db_host:3306/database
    # 移除 depends_on
```

并删除 `db` 服务。

### 3. 配置 HTTPS

#### 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

然后使用 Let's Encrypt 配置 SSL：

```bash
sudo certbot --nginx -d your-domain.com
```

#### 使用 Traefik（推荐用于 Docker）

在 `docker-compose.yml` 中添加 Traefik 配置。

### 4. 数据持久化

数据库数据已通过 Docker volume 持久化：

```yaml
volumes:
  mysql_data:  # 数据会保存在这里
```

查看 volume：

```bash
docker volume ls
docker volume inspect recall_mate_mysql_data
```

### 5. 备份数据库

```bash
# 备份
docker-compose exec db mysqldump -u recall_mate -precall_mate_password recall_mate > backup.sql

# 恢复
docker-compose exec -T db mysql -u recall_mate -precall_mate_password recall_mate < backup.sql
```

## 📊 监控和日志

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看应用日志
docker-compose logs -f app

# 查看数据库日志
docker-compose logs -f db
```

### 健康检查

```bash
# 检查容器状态
docker-compose ps

# 检查应用健康
curl http://localhost:3000/health  # 如果有健康检查端点
```

## 🔄 更新应用

### 常规更新（无数据库变更）

```bash
# 1. 拉取最新代码
git pull

# 2. 重新构建镜像
docker-compose build

# 3. 停止旧容器
docker-compose down

# 4. 启动新容器（会自动运行数据库迁移）
docker-compose up -d
```

### 更新数据库 Schema

当你修改了 `prisma/schema.prisma` 后，需要按以下步骤操作：

#### 1. 本地开发环境

```bash
# 创建迁移文件
pnpm prisma migrate dev --name your_migration_name

# 这会：
# - 创建迁移文件在 prisma/migrations/ 目录
# - 应用到本地开发数据库
# - 重新生成 Prisma Client
```

#### 2. 提交到 Git

```bash
# 提交 schema 和迁移文件
git add prisma/schema.prisma prisma/migrations/
git commit -m "更新数据库 schema"
git push
```

#### 3. 部署到生产环境

```bash
# 1. 拉取最新代码（包含新的迁移文件）
git pull

# 2. 重新构建镜像
docker-compose build

# 3. 停止旧容器
docker-compose down

# 4. 启动新容器
# 注意：容器启动时会自动运行 prisma migrate deploy
# 这会应用所有未应用的迁移
docker-compose up -d

# 5. 查看日志确认迁移成功
docker-compose logs app | grep -i migrate
```

#### 4. 验证迁移

```bash
# 检查迁移状态
docker-compose exec app prisma migrate status

# 或者手动运行迁移（如果需要）
docker-compose exec app prisma migrate deploy
```

**重要提示**：
- ✅ **Dockerfile 已配置自动迁移**：容器启动时会自动运行 `prisma migrate deploy`
- ✅ 迁移文件必须包含在 Docker 镜像中（已通过 `COPY prisma` 实现）
- ⚠️ 确保生产环境的 `DATABASE_URL` 配置正确
- ⚠️ 在生产环境运行迁移前，建议先备份数据库

## 🚀 云平台部署

### Vercel（推荐，最简单）

1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

**注意**：Vercel 是无服务器平台，需要配置外部数据库。

### Railway

1. 连接 GitHub 仓库
2. 添加 MySQL 服务
3. 配置环境变量
4. 自动部署

### DigitalOcean App Platform

1. 连接 GitHub 仓库
2. 选择 Dockerfile
3. 添加 MySQL 数据库
4. 配置环境变量

### AWS / GCP / Azure

使用各自的容器服务（ECS、Cloud Run、Container Instances）部署 Docker 镜像。

## 🔐 安全建议

1. **更改默认密码**：修改 `docker-compose.yml` 中的数据库密码
2. **使用密钥管理**：生产环境使用密钥管理服务（AWS Secrets Manager、HashiCorp Vault 等）
3. **限制网络访问**：只暴露必要的端口
4. **定期更新**：保持 Docker 镜像和依赖更新
5. **启用 HTTPS**：生产环境必须使用 HTTPS

## 📝 故障排查

### 应用无法启动

```bash
# 查看详细日志
docker-compose logs app

# 检查环境变量
docker-compose exec app env | grep -E "DATABASE_URL|DEEPSEEK_API_KEY"
```

### 数据库连接失败

```bash
# 检查数据库是否运行
docker-compose ps db

# 测试数据库连接
docker-compose exec db mysql -u recall_mate -precall_mate_password -e "SELECT 1"
```

### 端口被占用

```bash
# 检查端口占用
lsof -i :3000
lsof -i :3306

# 修改 docker-compose.yml 中的端口映射
```

## 📚 相关文档

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Prisma 部署指南](https://www.prisma.io/docs/guides/deployment)

