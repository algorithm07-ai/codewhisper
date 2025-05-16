FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app

# 复制package.json文件
COPY package.json ./
# 安装全局和本地依赖
RUN npm install -g next
RUN npm install

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 开发环境
FROM base AS dev
WORKDIR /app

# 复制所有文件
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# 安装全局next命令
RUN npm install -g next

# 设置开发环境
ENV NODE_ENV development
EXPOSE 3000

# 使用npm run dev作为启动命令
CMD ["npm", "run", "dev"]
