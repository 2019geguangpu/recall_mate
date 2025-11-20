# 项目设置指南

## 环境变量配置

创建 `.env` 文件（参考 `.env.example`）：

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/recall_mate?schema=public"

# DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_BASE_URL=https://api.deepseek.com/v1

# Node Environment
NODE_ENV=development
```

## 数据库设置

1. 创建 PostgreSQL 数据库：
```sql
CREATE DATABASE recall_mate;
```

2. 运行 Prisma 迁移：
```bash
pnpm prisma migrate dev --name init
```

或者使用 Prisma Studio 查看数据：
```bash
pnpm prisma studio
```

## 技术栈

- **tRPC**: 类型安全的 API 框架
- **Prisma**: ORM，连接 PostgreSQL 数据库
- **LangChain**: AI Agent 框架
- **DeepSeek-R1**: 大语言模型（通过 OpenAI 兼容接口）

## 架构说明

### 数据流

1. 用户输入（语音/文字） → `InputSwitcher`
2. 记录完成 → `handleRecordComplete`
3. 调用 tRPC → `ai.parseAndCreateTask`
4. LangChain Agent 解析 → 使用 DeepSeek-R1
5. Agent 调用工具 → `createTaskTool`
6. 保存到数据库 → Prisma + PostgreSQL

### Agent 工作流程

```
用户输入: "请提醒我在晚上10点钟给我的手机充电"
    ↓
LangChain Agent (DeepSeek-R1)
    ↓
解析意图: 创建提醒任务
提取信息: 
  - 标题: "给手机充电"
  - 时间: "晚上10点" → "2024-01-01T22:00:00Z"
  - 优先级: "medium"
    ↓
调用 createTaskTool
    ↓
保存到 PostgreSQL (tasks 表)
```

## 开发命令

```bash
# 安装依赖
pnpm install

# 生成 Prisma Client
pnpm prisma generate

# 运行数据库迁移
pnpm prisma migrate dev

# 启动开发服务器
pnpm dev

# 查看数据库
pnpm prisma studio
```

