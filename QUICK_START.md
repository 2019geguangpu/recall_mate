# 快速部署指南

## 🚀 一键部署（推荐）

```bash
# 运行部署脚本
./deploy.sh
```

脚本会自动：
1. 检查 Docker 环境
2. 创建 `.env` 文件（如果不存在）
3. 验证环境变量配置
4. 构建 Docker 镜像
5. 启动所有服务（数据库迁移会自动运行）

## 📝 手动部署步骤

### 1. 准备环境变量

创建 `.env` 文件：

```bash
cat > .env << EOF
DATABASE_URL="postgresql://recall_mate:recall_mate_password@db:5432/recall_mate"
DEEPSEEK_API_KEY="your_deepseek_api_key_here"
NODE_ENV="production"
EOF
```

**重要**：请将 `your_deepseek_api_key_here` 替换为你的实际 API Key！

### 2. 构建和启动

```bash
# 构建镜像
docker-compose build

# 启动服务（数据库迁移会自动运行）
docker-compose up -d --build
```

### 3. 访问应用

打开浏览器访问：http://localhost:3000

## 🔍 常用命令

```bash
# 查看日志
docker-compose logs -f app

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看容器状态
docker-compose ps

# 进入应用容器
docker-compose exec app sh

# 进入数据库容器
docker-compose exec db psql -U recall_mate -d recall_mate
```

## ⚠️ 注意事项

1. **首次部署**：需要运行数据库迁移
2. **环境变量**：确保 `DEEPSEEK_API_KEY` 已正确配置
3. **端口占用**：确保 3000 和 5432 端口未被占用
4. **HTTPS**：生产环境需要配置 HTTPS（PWA 要求）

## 🐛 故障排查

如果遇到问题，查看详细日志：

```bash
docker-compose logs -f
```

更多信息请查看 `DEPLOYMENT.md`

