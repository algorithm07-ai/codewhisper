# CodeWhisper Wiki

欢迎来到CodeWhisper项目的Wiki页面！这里提供了关于CodeWhisper的详细文档，帮助您更好地了解和使用我们的产品。

## 目录

* [项目简介](#项目简介)
* [技术架构](#技术架构)
* [安装指南](#安装指南)
* [使用教程](#使用教程)
* [API文档](#api文档)
* [常见问题](#常见问题)
* [贡献指南](#贡献指南)

## 项目简介

CodeWhisper 是一款基于 DeepSeekAI 的智能代码生成工具，能够将自然语言描述转换为高质量的代码。我们的核心技术基于扩展的Anthropic MCP协议和DeepSeek AI大语言模型，提供了卓越的代码生成能力。

## 技术架构

CodeWhisper采用现代化的Web应用架构：

* **前端**：Next.js框架，提供SSR、良好性能和SEO
* **后端**：Node.js + Express，负责DeepSeek API集成和代码分析逻辑
* **部署**：Vercel (前端)，Railway/Heroku (后端)
* **核心技术**：
  * 双模型引擎：DeepSeekAnalyzer和AnthropicMCPProcessor
  * MCP协议扩展，包含SchemaContext和HistoricalContext
  * 查询管道：预处理、查询生成、查询验证和查询优化

## 安装指南

请访问[本地部署指南](Installation)获取详细的安装步骤。

## 使用教程

请访问[使用教程](Usage)获取详细的使用指南，包括基本操作、高级提示技巧以及最佳实践。

## API文档

如果您是专业版或企业版用户，可以访问[API文档](API)了解如何将CodeWhisper集成到您的开发流程中。

## 常见问题

请访问[常见问题](FAQ)获取常见问题的解答。如果您的问题未被解答，请联系我们的支持团队。

## 贡献指南

我们欢迎社区贡献！请访问[贡献指南](Contributing)了解如何参与项目开发。

---

**注意**：本Wiki仍在不断完善中。如果您有任何建议或发现错误，请提交Issue或Pull Request。
