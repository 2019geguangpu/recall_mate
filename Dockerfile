# 多阶段构建 Dockerfile for Next.js
# Multi-stage Dockerfile for Next.js

# ============================================
# Stage 1: 依赖安装 (Dependencies)
# ============================================
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 复制包管理文件
COPY package.json pnpm-lock.yaml* ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# ============================================
# Stage 2: 构建应用 (Builder)
# ============================================
FROM node:22-alpine AS builder
WORKDIR /app

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 从 deps 阶段复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置环境变量（构建时）
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV CI=true

# 接收构建参数
ARG DEEPSEEK_API_KEY
ENV DEEPSEEK_API_KEY=$DEEPSEEK_API_KEY

# 生成 Prisma Client
RUN pnpm prisma generate

# 构建 Next.js 应用
RUN pnpm build

# 确保 Prisma 客户端文件存在（用于调试）
RUN ls -la /app/node_modules/.prisma 2>/dev/null || echo "No .prisma directory found" && \
    ls -la /app/.next/standalone/node_modules/.prisma 2>/dev/null || echo "No .prisma in standalone"

# ============================================
# Stage 3: 运行环境 (Runner)
# ============================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要的文件
COPY --from=builder /app/public ./public

# 复制 standalone 输出
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制 Prisma 相关文件
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# 设置正确的权限
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["node", "server.js"]

