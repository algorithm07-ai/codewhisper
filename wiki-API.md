# API 文档

本文档详细介绍了CodeWhisper提供的API接口，适用于专业版和企业版用户。通过这些API，您可以将CodeWhisper集成到自己的开发工作流中。

## 认证

所有API请求都需要使用API密钥进行认证。您可以在个人账户设置页面生成和管理API密钥。

**认证方式**：在请求头中添加`X-API-Key`字段：

```
X-API-Key: your_api_key_here
```

## 基础URL

```
https://api.codewhisper.tech/v1
```

## 接口列表

### 代码生成

#### POST /generate

生成代码的主要接口。

**请求参数**：

```json
{
  "language": "javascript",  // 编程语言，必填
  "prompt": "创建一个HTTP请求函数",  // 代码生成提示，必填
  "maxTokens": 1000,  // 最大生成token数量，选填，默认1000
  "temperature": 0.7,  // 创意度，0-1之间，选填，默认0.7
  "timeout": 30  // 超时时间(秒)，选填，默认30
}
```

**响应**：

```json
{
  "success": true,
  "data": {
    "code": "// 生成的代码\nasync function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    return await response.json();\n  } catch (error) {\n    console.error('请求出错:', error);\n    throw error;\n  }\n}",
    "language": "javascript",
    "tokens": 85,
    "requestId": "req_1234567890"
  }
}
```

#### POST /analyze

分析代码并提供改进建议。

**请求参数**：

```json
{
  "code": "function add(a, b) { return a + b }",  // 要分析的代码，必填
  "language": "javascript",  // 编程语言，必填
  "analysisType": "all"  // 分析类型: "quality", "security", "performance", "all"，选填，默认"all"
}
```

**响应**：

```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "type": "quality",
        "message": "缺少参数类型声明",
        "lineNumber": 1,
        "severity": "info",
        "suggestedFix": "function add(a: number, b: number): number { return a + b }"
      }
    ],
    "summary": "代码质量良好，可添加类型声明提高可维护性",
    "requestId": "req_0987654321"
  }
}
```

### 用户账户

#### GET /usage

获取当前API密钥的使用情况。

**响应**：

```json
{
  "success": true,
  "data": {
    "plan": "pro",
    "usageThisMonth": 245,
    "limit": "unlimited",
    "tokensGenerated": 124568,
    "updateAt": "2025-05-18T10:15:30Z"
  }
}
```

## 错误处理

API使用标准HTTP状态码表示请求状态：

- 200: 成功
- 400: 请求参数错误
- 401: 认证失败
- 402: 支付相关错误（如配额不足）
- 429: 请求过于频繁
- 500: 服务器错误

错误响应格式：

```json
{
  "success": false,
  "error": {
    "code": "invalid_parameter",
    "message": "语言参数无效",
    "requestId": "req_1234567890"
  }
}
```

## 速率限制

为确保服务质量，API请求存在速率限制：

- 专业版: 100次请求/分钟
- 企业版: 300次请求/分钟

超过限制会返回429状态码。

## SDK

我们提供以下编程语言的官方SDK：

- JavaScript/TypeScript: [codewhisper-node](https://github.com/algorithm07-ai/codewhisper-node)
- Python: [codewhisper-python](https://github.com/algorithm07-ai/codewhisper-python)

### Node.js SDK示例

```javascript
const { CodeWhisperClient } = require('codewhisper-node');

const client = new CodeWhisperClient('your_api_key');

async function generateCode() {
  try {
    const result = await client.generate({
      language: 'javascript',
      prompt: '创建一个日期格式化函数'
    });
    console.log(result.code);
  } catch (error) {
    console.error('生成失败:', error);
  }
}

generateCode();
```

## Webhook集成

企业版用户可以设置Webhook接收异步通知，适用于长时间运行的分析任务。

### Webhook配置

在企业版控制面板中可以配置Webhook URL和事件类型。支持的事件包括：

- `code.generated`: 代码生成完成
- `analysis.completed`: 代码分析完成
- `error.occurred`: 发生错误

### Webhook格式

```json
{
  "event": "code.generated",
  "timestamp": "2025-05-18T10:20:30Z",
  "requestId": "req_1234567890",
  "data": {
    // 事件相关数据
  }
}
```

## 联系支持

如有API相关问题，请联系我们的技术支持：

- 邮箱: 1459351107@qq.com
- 备注: 请在邮件主题前添加"[API]"标识
