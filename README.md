# Recall Mate

> Your Thoughtful Memory Partner - 智能记忆伙伴

一个基于 AI 的智能提醒和任务管理系统，支持语音输入、智能解析、PWA 安装和跨平台通知。

## ✨ 主要功能

### 🎯 核心功能

- **智能任务创建**：通过语音或文字输入，AI 自动解析并创建任务
- **智能提醒系统**：基于用户画像的个性化提醒，支持定时通知
- **PWA 支持**：可安装为原生应用，支持离线使用和后台通知
- **跨平台通知**：支持桌面端和移动端通知，即使应用关闭也能接收提醒
- **用户画像**：统一的用户画像系统，所有模块共享智能简历数据

### 📱 功能模块

- **提醒管家** ⏰：智能提醒系统，支持定时、重复、智能推荐
- **购物助手** 🛒：购物清单管理
- **健康管理** 💊：健康提醒和记录
- **日程规划** 📅：日程安排和管理
- **财务管家** 💰：财务记录和提醒
- **学习伙伴** 📚：学习计划和复习提醒

## 🛠️ 技术栈

### 前端
- **Next.js 16** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **tRPC** - 类型安全的 API
- **React Query** - 数据获取和缓存

### 后端
- **tRPC** - 类型安全的 API 框架
- **Prisma** - ORM，连接 PostgreSQL
- **LangChain** - AI Agent 框架
- **DeepSeek-R1** - 大语言模型

### 数据库
- **PostgreSQL** - 关系型数据库

### PWA & 通知
- **Service Worker** - 后台运行和离线支持
- **Web Notifications API** - 跨平台通知
- **PWA Manifest** - 应用安装配置

## 🚀 快速开始

### 前置要求

- Node.js 20+
- pnpm（推荐）或 npm/yarn
- PostgreSQL 14+

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd recall_mate
```

2. **安装依赖**

```bash
pnpm install
```

3. **配置环境变量**

创建 `.env` 文件：

```env
# 数据库连接
DATABASE_URL="postgresql://user:password@localhost:5432/recall_mate"

# DeepSeek API Key
DEEPSEEK_API_KEY="your_deepseek_api_key_here"

# 环境
NODE_ENV="development"
```

4. **设置数据库**

```bash
# 生成 Prisma Client
pnpm prisma generate

# 运行数据库迁移
pnpm prisma migrate dev
```

5. **启动开发服务器**

```bash
pnpm dev
```

访问 http://localhost:3000

## 🐳 Docker 部署

### 快速部署

```bash
# 使用部署脚本（推荐，包含环境检查和错误提示）
./deploy.sh

# 或手动部署（迁移会自动运行）
docker-compose up -d --build
```

详细部署说明请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📱 PWA 功能

### 安装为应用

- **Android**：在 Chrome 中访问，点击"安装应用"
- **iOS**：在 Safari 中访问，点击分享 → "添加到主屏幕"
- **桌面端**：浏览器会显示安装提示

### 通知功能

- ✅ 支持浏览器通知（应用打开时）
- ✅ 支持 Service Worker 后台通知（应用关闭时）
- ✅ 支持移动端和桌面端
- ✅ 自动权限请求和管理

### 使用说明

1. 访问应用并授予通知权限
2. 创建提醒任务（如"明天晚上10点给手机充电"）
3. 系统会在指定时间自动发送通知
4. 即使应用关闭也能接收通知（PWA 模式）

## 🎨 项目结构

```
recall_mate/
├── prisma/              # 数据库模型和迁移
├── public/              # 静态资源
│   ├── sw.js           # Service Worker
│   └── site.webmanifest # PWA 配置
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── api/         # API 路由
│   │   └── [pages]/     # 页面路由
│   ├── components/      # React 组件
│   │   ├── notifications/ # 通知相关
│   │   ├── pwa/         # PWA 相关
│   │   └── ...
│   ├── lib/             # 工具库
│   │   ├── ai/         # AI 相关
│   │   ├── notifications/ # 通知服务
│   │   └── ...
│   ├── server/          # 服务端代码
│   │   └── routers/     # tRPC 路由
│   └── hooks/           # React Hooks
├── Dockerfile           # Docker 配置
├── docker-compose.yml   # Docker Compose 配置
└── package.json
```

## 🔧 开发命令

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 数据库管理
pnpm prisma studio      # 打开数据库管理界面
pnpm prisma migrate dev # 创建迁移
pnpm prisma generate    # 生成 Prisma Client
```

## 📚 文档

- [部署指南](./DEPLOYMENT.md) - 详细的部署说明
- [快速开始](./QUICK_START.md) - 快速部署指南
- [PWA 部署](./PWA_DEPLOYMENT.md) - PWA 功能说明
- [项目设置](./README_SETUP.md) - 开发环境设置

## 🌟 核心特性

### 1. 智能任务解析

使用 LangChain Agent 和 DeepSeek-R1 模型，自动解析用户输入：

```
用户输入: "请提醒我明天晚上10点给手机充电"
    ↓
AI Agent 解析
    ↓
提取信息:
  - 标题: "给手机充电"
  - 时间: "明天晚上10点" → ISO 8601 格式
  - 类型: "reminder"
  - 优先级: "medium"
    ↓
创建任务并保存到数据库
```

### 2. 智能提醒系统

- 自动检测时间关键词
- 支持自然语言时间解析
- 基于用户画像的智能推荐
- 跨平台通知支持

### 3. 用户画像系统

统一的用户画像，包含：
- 作息规律
- 工作模式
- 健康需求
- 行为模式
- 记忆特征
- 消费偏好
- 习惯分析
- 个性标签

所有模块共享同一份画像数据，提供个性化体验。

## 🔐 环境变量

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 数据库连接字符串 | ✅ |
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | ✅ |
| `NODE_ENV` | 环境模式（development/production） | ❌ |

## 📦 部署选项

### 推荐平台

1. **Vercel** - 最简单，自动 HTTPS
2. **Railway** - 支持 Docker，包含数据库
3. **DigitalOcean** - 灵活配置
4. **自建服务器** - 使用 Docker Compose

### 部署要求

- ✅ HTTPS（PWA 和通知功能必需）
- ✅ PostgreSQL 数据库
- ✅ Node.js 20+ 运行环境

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[添加你的许可证]

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [LangChain](https://www.langchain.com/)
- [Prisma](https://www.prisma.io/)
- [tRPC](https://trpc.io/)
- [DeepSeek](https://www.deepseek.com/)

---

**Made with ❤️ by Recall Mate Team**
