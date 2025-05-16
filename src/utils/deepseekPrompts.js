/**
 * DeepSeekAI提示工程工具
 * 针对不同编程语言和任务类型优化提示词
 */

// 语言特定系统提示
const languageSystemPrompts = {
  javascript: `你是一位专业的JavaScript开发者，专注于生成干净、高效、可维护的代码。
- 使用现代JavaScript语法和最佳实践
- 优先考虑代码可读性和性能
- 添加适当的错误处理
- 包含简洁的注释解释关键逻辑
- 避免过度工程化`,

  python: `你是一位Python专家，遵循PEP 8规范，专注于编写Pythonic风格的代码。
- 使用Python 3.9+的最新特性
- 代码应该简洁、可读，符合Python的设计哲学
- 使用类型提示增强代码可读性
- 实现适当的错误处理
- 添加文档字符串`,

  typescript: `你是TypeScript专家，专注于类型安全和现代Web开发。
- 使用最新的TypeScript语法和特性
- 正确定义接口、类型和泛型
- 利用TypeScript的类型检查保证代码质量
- 遵循函数式编程原则
- 代码应当简洁且自文档化`,

  java: `你是Java开发专家，精通面向对象编程和Java生态系统。
- 使用Java 11+的特性
- 遵循标准Java编码规范
- 应用适当的设计模式
- 代码应具有良好的可测试性
- 考虑性能和内存使用`,

  "c#": `你是C#开发专家，精通.NET生态系统。
- 使用最新的C#语言特性
- 遵循微软推荐的编码规范
- 编写符合SOLID原则的代码
- 利用.NET提供的标准库
- 考虑异步编程和性能优化`,

  go: `你是Go语言专家，专注于简洁、高效的系统编程。
- 遵循Go的惯用模式和最佳实践
- 代码应当简单直接，避免过度抽象
- 正确处理错误而不是使用异常
- 考虑并发安全
- 利用Go的标准库`,

  rust: `你是Rust开发专家，精通内存安全和高性能系统编程。
- 正确使用所有权系统和生命周期
- 遵循Rust的惯用模式和编码规范
- 适当使用泛型和特质
- 无需不必要的unsafe代码
- 编写简洁而富有表现力的代码`,

  cpp: `你是C++开发专家，专注于高性能和底层系统编程。
- 使用现代C++特性(C++17/20)
- 遵循主流C++编码规范
- 正确管理内存和资源
- 代码应具有良好的可维护性
- 考虑跨平台兼容性`
};

// 任务类型特定提示
const taskTypePrompts = {
  application: "创建一个完整的应用程序，包含必要的组件和功能",
  function: "实现一个解决特定问题的函数或方法",
  algorithm: "实现一个高效的算法来解决给定问题",
  dataStructure: "设计并实现一个适合特定需求的数据结构",
  api: "设计一个API或服务接口，包含端点定义和实现",
  ui: "创建用户界面组件或页面",
  test: "编写测试用例验证代码功能"
};

/**
 * 生成优化的提示
 * @param {string} userPrompt 用户原始提示
 * @param {string} language 编程语言
 * @param {string} taskType 任务类型
 * @returns {object} 优化后的提示配置
 */
export function generateOptimizedPrompt(userPrompt, language, taskType = 'function') {
  // 获取语言特定系统提示，默认为JavaScript
  const systemPrompt = languageSystemPrompts[language.toLowerCase()] || languageSystemPrompts.javascript;
  
  // 获取任务类型提示
  const taskPrompt = taskTypePrompts[taskType] || taskTypePrompts.function;
  
  // 构建用户提示
  const enhancedUserPrompt = `${taskPrompt}：${userPrompt}\n\n请仅返回完整、可运行的代码，不需要解释或说明。`;
  
  return {
    systemPrompt,
    userPrompt: enhancedUserPrompt,
    temperature: 0.3, // 较低的温度以获得更确定性的输出
    maxTokens: 2000,  // 默认最大token数量
    language
  };
}

/**
 * 解析代码块
 * 从LLM响应中提取代码块
 * @param {string} text LLM响应文本
 * @param {string} language 编程语言
 * @returns {string} 提取的代码
 */
export function extractCodeBlock(text, language) {
  // 尝试查找代码块
  const codeBlockRegex = /```(?:[\w\+\#]*\n|\n)?([\s\S]*?)```/g;
  const matches = [...text.matchAll(codeBlockRegex)];
  
  if (matches.length > 0) {
    return matches[0][1].trim();
  }
  
  // 如果没有找到代码块，尝试查找行内代码
  const inlineCodeRegex = /`([^`]+)`/g;
  const inlineMatches = [...text.matchAll(inlineCodeRegex)];
  
  if (inlineMatches.length > 0) {
    return inlineMatches.map(match => match[1]).join('\n');
  }
  
  // 如果没有找到任何代码块，返回原始文本
  return text;
}

export default {
  generateOptimizedPrompt,
  extractCodeBlock,
  languageSystemPrompts,
  taskTypePrompts
};
