// AIService: 提供 AI 相关服务方法
import fetch from 'node-fetch';

export class AIService {
    async analyzeCode(text: string, projectContext: any, userContext: any): Promise<any> {
        // TODO: 调用 AI 分析代码
        return { summary: '代码分析结果', interaction: {} };
    }

    async autoRefactor(text: string, projectContext: any, userContext: any): Promise<{suggestion: string, refactoredCode: string}> {
        // TODO: 调用 AI 返回重构建议和重构后代码
        return {
            suggestion: '建议将变量名改为更具描述性',
            refactoredCode: text // 实际应为重构后的代码
        };
    }

    async askCopilot(question: string): Promise<string> {
        // TODO: 替换为你的 DeepSeek API Key
        const apiKey = 'sk-db4e5f1ec5e64a678197146bf0355be3';
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'user', content: question }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`DeepSeek API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || '未获取到有效回答';
    }

    async recommendSnippet(contextText: string, projectContext: any, userContext: any): Promise<string> {
        // TODO: 调用 AI 推荐代码片段
        return '// 推荐代码片段\nconsole.log("Hello, world!");';
    }
}
