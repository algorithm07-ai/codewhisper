# InstantCoder MVP 开发文档

## 项目概述

InstantCoder MVP是一个基于DeepSeekAI的代码生成工具，允许用户通过描述需求直接生成可用代码。该项目参考了Hugging Face上的InstantCoder设计，但使用DeepSeekAI作为底层大语言模型，提供更专业的代码生成能力。

### 核心功能

- 基于自然语言描述生成代码
- 支持8种主流编程语言
- 提供多种任务类型选项
- 代码语法高亮和一键复制
- 使用提示工程优化代码质量

## 技术架构

### 前端技术栈

- **框架**: Next.js
- **UI组件**: React
- **语法高亮**: react-syntax-highlighter
- **HTTP请求**: axios

### 后端技术栈

- **API路由**: Next.js API Routes
- **LLM集成**: DeepSeekAI API
- **容器化**: Docker

### 系统架构图

```
┌─────────────────┐        ┌──────────────┐        ┌─────────────┐
│                 │        │              │        │             │
│  React 前端     │───────▶│  Next.js API │───────▶│ DeepSeekAI │
│  (用户界面)     │◀───────│  (代码生成)  │◀───────│    API     │
│                 │        │              │        │             │
└─────────────────┘        └──────────────┘        └─────────────┘
```

## 目录结构

```
InstantCoder-MVP/
├── public/                    # 静态资源
├── src/
│   ├── components/            # React组件
│   │   └── CodeGenerator.js   # 代码生成器组件
│   ├── pages/                 # 页面
│   │   ├── _app.js            # Next.js应用入口
│   │   ├── index.js           # 首页
│   │   └── api/               # API路由
│   │       └── generate.js    # 代码生成API
│   ├── styles/                # 样式文件
│   │   ├── Home.module.css    # 首页样式
│   │   ├── CodeGenerator.module.css # 代码生成器样式
│   │   └── globals.css        # 全局样式
│   └── utils/                 # 工具函数
│       └── deepseekPrompts.js # DeepSeekAI提示工程
├── Dockerfile                 # Docker配置
├── docker-compose.yml         # Docker Compose配置
├── .env.example               # 环境变量示例
├── next.config.js             # Next.js配置
└── package.json               # 依赖配置
```

## 关键组件说明

### 1. CodeGenerator 组件 (`src/components/CodeGenerator.js`)

这是应用的核心组件，负责：
- 用户输入处理
- 提供代码示例
- 语言和任务类型选择
- 发送API请求
- 展示生成的代码
- 代码复制功能

### 2. DeepSeekAI 提示工程 (`src/utils/deepseekPrompts.js`)

提供针对不同编程语言和任务类型的优化提示，包括：
- 语言特定系统提示
- 任务类型提示
- 提示优化函数
- 代码块提取处理

### 3. 代码生成API (`src/pages/api/generate.js`)

后端API路由，负责：
- 接收前端请求
- 处理用户输入
- 调用DeepSeekAI API
- 返回生成的代码
- 错误处理和回退逻辑

## Docker配置详解

### Dockerfile

```dockerfile
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
```

### docker-compose.yml

```yaml
version: '3'

services:
  app:
    container_name: instantcoder-container
    build:
      context: .
      dockerfile: Dockerfile
      target: dev # 使用dev阶段专门为开发环境配置
    volumes:
      - .:/app
      - /app/node_modules # 使用容器内的node_modules
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=development
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
    restart: unless-stopped
```

## 开发过程关键点

1. **环境配置**:
   - 使用Docker解决依赖安装问题
   - 配置Next.js开发环境
   - 通过环境变量注入API密钥

2. **DeepSeekAI集成**:
   - 实现API调用接口
   - 设计针对代码生成的提示词
   - 优化不同语言的提示模板

3. **前端实现**:
   - 设计简洁直观的用户界面
   - 实现代码高亮和复制功能
   - 添加示例和任务类型选择

4. **Docker容器化**:
   - 使用多阶段构建
   - 解决Next.js在容器中运行的问题
   - 配置卷映射和端口转发

5. **问题解决**:
   - 修复端口冲突问题
   - 解决Next.js命令未找到的问题
   - 优化容器中的依赖安装

## 启动和使用指南

### 本地开发

1. 克隆仓库
   ```bash
   git clone <repository-url>
   cd InstantCoder-MVP
   ```

2. 创建环境变量文件
   ```bash
   # 创建.env.local文件
   echo "DEEPSEEK_API_KEY=your_api_key_here" > .env.local
   echo "NEXT_PUBLIC_APP_URL=http://localhost:3001" >> .env.local
   ```

3. 使用Docker启动
   ```bash
   docker-compose up -d
   ```

4. 访问应用
   ```
   http://localhost:3001
   ```

### 常用Docker命令

- 启动容器: `docker-compose up -d`
- 查看日志: `docker-compose logs -f`
- 停止容器: `docker-compose down`
- 重建容器: `docker-compose build --no-cache`

## API参考

### 代码生成API

**端点**: `/api/generate`

**方法**: POST

**请求体**:
```json
{
  "prompt": "创建一个待办事项管理应用",
  "language": "javascript",
  "taskType": "application"
}
```

**响应**:
```json
{
  "code": "// 生成的代码内容"
}
```

## 性能和限制

- 代码生成最大token数: 2000
- 不支持交互式代码生成
- 每次只生成单个文件
- 依赖DeepSeekAI API可用性

## 未来开发计划

1. **功能增强**:
   - 代码解释功能
   - 用户认证和保存代码
   - 多文件项目生成
   - 代码优化和分析

2. **技术改进**:
   - 流式响应处理
   - 提示词持续优化
   - 缓存常见代码模式
   - 完善错误处理

3. **UI/UX完善**:
   - 代码编辑功能
   - 深色模式
   - 响应式布局优化
   - 国际化支持

## 故障排除

### 常见问题

1. **容器启动失败**
   - 检查Docker是否正在运行
   - 检查端口占用情况
   - 查看日志: `docker-compose logs -f`

2. **API调用失败**
   - 验证DeepSeekAI API密钥
   - 检查环境变量配置
   - 查看API错误响应

3. **界面无法加载**
   - 确认端口映射正确
   - 检查浏览器控制台错误
   - 尝试清除浏览器缓存

## 参考资料

- [Next.js文档](https://nextjs.org/docs)
- [React文档](https://reactjs.org/docs)
- [Docker文档](https://docs.docker.com/)
- [DeepSeekAI API文档](https://platform.deepseek.ai/docs)
