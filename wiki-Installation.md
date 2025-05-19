# 安装指南

本页面提供了CodeWhisper项目的本地安装和部署说明。

## 前提条件

在开始安装前，请确保您的环境满足以下要求：

* Node.js 16.x或更高版本
* npm 7.x或更高版本
* Git

## 本地开发环境搭建

### 1. 克隆仓库

```bash
git clone https://github.com/algorithm07-ai/codewhisper.git
cd codewhisper
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

在项目根目录创建`.env.local`文件，并添加以下内容：

```
DEEPSEEK_API_KEY=your_deepseek_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

您需要从[DeepSeek AI官网](https://deepseek.com)获取API密钥。

### 4. 启动开发服务器

```bash
npm run dev
```

现在您可以在浏览器中访问`http://localhost:3000`查看应用。

## 生产环境部署

### Vercel部署（推荐）

1. 在[Vercel](https://vercel.com)上注册账号并创建新项目
2. 导入GitHub仓库
3. 配置环境变量（同本地开发环境）
4. 部署

### 自托管部署

如果您希望在自己的服务器上部署CodeWhisper，可以参考以下步骤：

#### 前端部署

1. 构建生产版本：
```bash
npm run build
```

2. 启动生产服务器：
```bash
npm start
```

#### 自动化部署

我们在`scripts`目录提供了自动化部署脚本，适用于国内服务器环境：

1. 服务器初始化：
```bash
bash scripts/setup-server.sh
```

2. 应用部署：
```bash
bash scripts/deploy.sh
```

3. 配置Nginx：
```bash
sudo cp scripts/nginx.conf /etc/nginx/sites-available/codewhisper
sudo ln -s /etc/nginx/sites-available/codewhisper /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

更多详细的自托管指南，请参考`docs/self-hosting-guide.md`。

## 常见问题

### 部署失败

如果在Vercel部署过程中遇到问题，请检查：

1. 确保所有必要的环境变量已正确设置
2. 检查依赖版本冲突，特别是react-json-view与React 18的兼容性
3. 查看构建日志以获取具体错误信息

### 本地运行问题

如果在本地运行时遇到问题：

1. 确保Node.js和npm版本符合要求
2. 尝试删除`node_modules`文件夹并重新安装依赖
3. 检查`.env.local`文件中的API密钥是否正确设置

如果您遇到其他安装问题，请在GitHub上提交Issue或联系我们的支持团队。
