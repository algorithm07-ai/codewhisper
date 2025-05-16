// DeepSeekAI API集成
import axios from 'axios';
import { generateOptimizedPrompt, extractCodeBlock } from '../../utils/deepseekPrompts';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }

  try {
    const { prompt, language } = req.body;
    
    if (!prompt || !language) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    // 使用环境变量获取API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.error('缺少DeepSeek API密钥');
      return res.status(500).json({ error: 'API配置错误，请联系管理员' });
    }
    
    // 使用提示工程工具生成优化的提示
    // 限制提示长度以避免令牌数量过多
    let { systemPrompt, userPrompt, temperature, maxTokens } = generateOptimizedPrompt(prompt, language);
    
    // 限制提示长度
    const maxPromptLength = 1000;
    if (userPrompt.length > maxPromptLength) {
      userPrompt = userPrompt.substring(0, maxPromptLength) + '...';
    }
    
    // 限制令牌数量
    maxTokens = Math.min(maxTokens, 1000);
    
    try {
      // 输出调试信息
      console.log(`正在调用DeepSeek API，使用密钥: ${apiKey.substring(0, 5)}...`);
      
      // DeepSeek的正确API端点
      // 使用最新的官方API端点
      const endpoint = 'https://api.deepseek.com/v1/chat/completions';
      
      const response = await axios.post(
        endpoint,
        {
          model: 'deepseek-coder',  // 使用DeepSeek专门的代码生成模型
          messages: [
            // 简化系统提示以减少令牌数量
            {
              role: 'system',
              content: '生成简洁高效的代码'
            },
            {
              role: 'user',
              content: `${language}语言: ${prompt}`
            }
          ],
          temperature: 0.3,  // 使用较低的温度增加确定性
          max_tokens: 800    // 限制输出长度
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      // 提取生成的代码，并确保只返回代码部分
      const rawResponse = response.data.choices[0].message.content;
      const generatedCode = extractCodeBlock(rawResponse, language);
      return res.status(200).json({ code: generatedCode });
      
    } catch (apiError) {
      // 输出详细错误信息以便调试
      console.error('DeepSeek API调用失败:', {
        message: apiError.message,
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        data: apiError.response?.data,
        endpoint: 'https://api.deepseek.com/v1/chat/completions',
        headers: apiError.config?.headers ? {
          contentType: apiError.config.headers['Content-Type'],
          hasAuth: !!apiError.config.headers['Authorization']
        } : 'No headers info'
      });
      
      // 如果API调用失败，使用本地模拟响应作为备份
      let fallbackCode = '';
      if (language === 'javascript') {
        fallbackCode = `// 基于您的需求: ${prompt}\n// 注意: DeepSeek API暂时不可用，这是模拟响应\n\nfunction main() {\n  console.log("Generated with DeepSeek");\n  // 这里会是自动生成的代码\n}\n\nmain();`;
      } else if (language === 'python') {
        fallbackCode = `# 基于您的需求: ${prompt}\n# 注意: DeepSeek API暂时不可用，这是模拟响应\n\ndef main():\n    print("Generated with DeepSeek")\n    # 这里会是自动生成的代码\n\nif __name__ == "__main__":\n    main()`;
      } else {
        fallbackCode = `// 基于您的需求: ${prompt}\n// 注意: DeepSeek API暂时不可用，这是模拟响应\n// 这里会是${language}代码`;
      }
      
      return res.status(200).json({ 
        code: fallbackCode,
        warning: 'DeepSeek API暂时不可用，使用模拟响应'
      });
    }
  } catch (error) {
    console.error('生成代码时出错:', {
      message: error.message,
      stack: error.stack
    });
    return res.status(500).json({ error: '服务器错误，请稍后再试' });
  }
}
