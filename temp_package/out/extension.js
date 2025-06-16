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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const ai_service_1 = require("./services/ai-service");
const project_analyzer_1 = require("./services/project-analyzer");
const user_preference_1 = require("./services/user-preference");
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
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map