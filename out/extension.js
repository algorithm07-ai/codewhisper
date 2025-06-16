"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const ai_service_1 = require("./services/ai-service");
const project_analyzer_1 = require("./services/project-analyzer");
const user_preference_1 = require("./services/user-preference");
const openai_1 = __importDefault(require("openai"));
const copilotPanel_1 = require("./copilotPanel");
function activate(context) {
    vscode.window.showInformationMessage('CodeWhisper 扩展已激活！');
    const aiService = new ai_service_1.AIService();
    const projectAnalyzer = new project_analyzer_1.ProjectAnalyzer();
    const userPrefs = new user_preference_1.UserPreferenceManager(context.globalState);
    // 自动重构命令
    context.subscriptions.push(vscode.commands.registerCommand('deepbubble.autoRefactor', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const text = document.getText(selection);
            const projectContext = await projectAnalyzer.getProjectContext();
            const userContext = userPrefs.getUserPreferences();
            const refactorResult = await aiService.autoRefactor(text, projectContext, userContext);
            const userChoice = await vscode.window.showInformationMessage(`重构建议: ${refactorResult.suggestion}`, '应用重构', '取消');
            if (userChoice === '应用重构') {
                await editor.edit(editBuilder => {
                    editBuilder.replace(selection, refactorResult.refactoredCode);
                });
                vscode.window.showInformationMessage('重构已应用。');
                userPrefs.addHistory({ type: '自动重构', time: new Date().toLocaleString(), content: refactorResult.refactoredCode });
            }
        }
    }));
    // 代码片段推荐命令
    context.subscriptions.push(vscode.commands.registerCommand('deepbubble.recommendSnippet', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const position = editor.selection.active;
            const projectContext = await projectAnalyzer.getProjectContext();
            const userContext = userPrefs.getUserPreferences();
            const snippet = await aiService.recommendSnippet(document.getText(), projectContext, userContext);
            const userChoice = await vscode.window.showInformationMessage(`推荐代码片段:\n${snippet}`, '插入片段', '取消');
            if (userChoice === '插入片段') {
                await editor.edit(editBuilder => {
                    editBuilder.insert(position, snippet);
                });
                vscode.window.showInformationMessage('代码片段已插入。');
                userPrefs.addHistory({ type: '代码片段推荐', time: new Date().toLocaleString(), content: snippet });
            }
        }
    }));
    // 历史记录面板命令
    context.subscriptions.push(vscode.commands.registerCommand('deepbubble.showHistory', async () => {
        const panel = vscode.window.createWebviewPanel('deepbubbleHistory', 'DeepBubble 历史记录', vscode.ViewColumn.One, {});
        const history = userPrefs.getHistory();
        let html = `<h2>分析与重构历史</h2><ul>`;
        for (const record of history) {
            html += `<li><b>类型:</b> ${record.type} <br/><b>时间:</b> ${record.time} <br/><pre>${record.content}</pre></li>`;
        }
        html += `</ul>`;
        panel.webview.html = html;
    }));
    // Copilot 问答命令 (codewhisper.askCopilot)
    context.subscriptions.push(vscode.commands.registerCommand('codewhisper.askCopilot', async () => {
        const question = await vscode.window.showInputBox({ prompt: '请输入你的问题 (Copilot)' });
        if (!question)
            return;
        try {
            const answer = await aiService.askCopilot(question);
            vscode.window.showInformationMessage(`Copilot 回答: ${answer}`);
        }
        catch (err) {
            vscode.window.showErrorMessage('Copilot API 调用失败: ' + (err.message || err.toString()));
        }
    }));
    // Copilot 聊天面板命令 (codewhisper.openCopilotPanel)
    context.subscriptions.push(vscode.commands.registerCommand('codewhisper.openCopilotPanel', () => {
        copilotPanel_1.CopilotPanel.createOrShow(context.extensionUri);
    }));
    // Brave 搜索命令 (codewhisper.searchBrave)
    context.subscriptions.push(vscode.commands.registerCommand('codewhisper.searchBrave', async () => {
        const query = await vscode.window.showInputBox({ prompt: '输入要搜索的内容（Brave Search）' });
        if (!query)
            return;
        const config = vscode.workspace.getConfiguration('codewhisper');
        const braveApiKey = config.get('braveApiKey');
        if (!braveApiKey) {
            vscode.window.showErrorMessage('请先在设置中配置 Brave Search API Key (codewhisper.braveApiKey)。');
            return;
        }
        try {
            const { braveSearch } = await Promise.resolve().then(() => __importStar(require('./services/brave-search')));
            const result = await braveSearch(query, braveApiKey);
            const results = result.web?.results || [];
            let html = `<h2>Brave 搜索结果</h2>`;
            if (results.length === 0) {
                html += '<p>未找到相关结果。</p>';
            }
            else {
                html += '<ul>' + results.map(r => `<li><a href="${r.url}" target="_blank">${r.title}</a><br/><small>${r.description}</small></li>`).join('') + '</ul>';
            }
            const panel = vscode.window.createWebviewPanel('braveSearchResults', 'Brave 搜索结果', vscode.ViewColumn.Beside, { enableScripts: true });
            panel.webview.html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>Brave 搜索结果</title><style>body{font-family:sans-serif;padding:1em;}ul{list-style:disc;margin-left:2em;}li{margin-bottom:1em;}a{color:#007acc;text-decoration:none;}a:hover{text-decoration:underline;}</style></head><body>${html}</body></html>`;
        }
        catch (err) {
            vscode.window.showErrorMessage('Brave 搜索失败: ' + (err.message || err.toString()));
        }
    }));
    // 代码解释命令 (codewhisper.explainCode)
    context.subscriptions.push(vscode.commands.registerCommand('codewhisper.explainCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.selection.isEmpty) {
            vscode.window.showInformationMessage('请先在编辑器中选择一段代码。');
            return;
        }
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        const languageId = editor.document.languageId;
        const configuration = vscode.workspace.getConfiguration('deepbubble-genius-ai-25');
        const apiKey = configuration.get('apiKey');
        const model = configuration.get('model');
        if (!apiKey) {
            vscode.window.showErrorMessage('DeepSeek API 密钥未配置。请在设置中检查 "deepbubble-genius-ai-25.apiKey"。');
            return;
        }
        if (!model) {
            vscode.window.showErrorMessage('DeepSeek 模型未配置。请在设置中检查 "deepbubble-genius-ai-25.model"。');
            return;
        }
        const deepseek = new openai_1.default({
            apiKey: apiKey,
            baseURL: 'https://api.deepseek.com', // Updated as per DeepSeek API documentation
        });
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "正在解释代码...",
            cancellable: true
        }, async (progress, token) => {
            token.onCancellationRequested(() => {
                console.log("用户取消了代码解释请求。");
            });
            try {
                progress.report({ increment: 0, message: "正在连接到 DeepSeek API..." });
                const completion = await deepseek.chat.completions.create({
                    model: model,
                    messages: [
                        {
                            role: "system",
                            content: "你是一个代码解释助手。请用清晰、简洁的自然语言解释以下代码片段的功能和主要逻辑。如果可能，请指出代码的编程语言。"
                        },
                        {
                            role: "user",
                            content: `请解释这段 ${languageId} 代码:\n\n\`\`\`${languageId}\n${selectedText}\n\`\`\``
                        }
                    ],
                });
                progress.report({ increment: 100, message: "解释已生成！" });
                const explanation = completion.choices[0]?.message?.content?.trim();
                if (explanation) {
                    const panel = vscode.window.createWebviewPanel('codeExplanationView', '代码解释', vscode.ViewColumn.Beside, {
                        enableScripts: true
                    });
                    panel.webview.html = getWebviewContent(selectedText, explanation, languageId);
                    userPrefs.addHistory({ type: '代码解释', time: new Date().toLocaleString(), content: `代码:\n${selectedText}\n\n解释:\n${explanation}` });
                }
                else {
                    vscode.window.showErrorMessage('未能从 DeepSeek API 获取有效的代码解释。');
                }
            }
            catch (error) {
                console.error("调用 DeepSeek API 出错:", error);
                let errorMessage = '解释代码时发生错误。';
                if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
                    errorMessage += ` 详情: ${error.response.data.error.message}`;
                }
                else if (error.message) {
                    errorMessage += ` 详情: ${error.message}`;
                }
                vscode.window.showErrorMessage(errorMessage);
            }
        });
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
// 辅助函数：生成 Webview 内容
function getWebviewContent(code, explanation, languageId) {
    const escapedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const formattedExplanation = explanation.replace(/\n/g, '<br>');
    return `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>代码解释</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; padding: 20px; }
                pre { background-color: #f4f4f4; padding: 1em; border-radius: 5px; overflow-x: auto; }
                code { font-family: 'Courier New', Courier, monospace; }
                .container { max-width: 800px; margin: 0 auto; }
                h1 { border-bottom: 2px solid #eee; padding-bottom: 10px; }
                .explanation { margin-top: 20px; padding: 15px; background-color: #e9f5ff; border-left: 4px solid #007bff; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>代码解释</h1>
                <h2>原始代码 (${languageId})</h2>
                <pre><code>${escapedCode}</code></pre>
                <h2>解释</h2>
                <div class="explanation">
                    ${formattedExplanation}
                </div>
            </div>
        </body>
        </html>
    `;
}
//# sourceMappingURL=extension.js.map