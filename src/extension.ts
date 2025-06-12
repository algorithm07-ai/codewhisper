import * as vscode from 'vscode';

import { AIService } from './services/ai-service';
import { ProjectAnalyzer } from './services/project-analyzer';
import { UserPreferenceManager } from './services/user-preference';

export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('CodeWhisper 扩展已激活！');

    const aiService = new AIService();
    const projectAnalyzer = new ProjectAnalyzer();
    const userPrefs = new UserPreferenceManager(context.globalState);

    // 自动重构命令
    context.subscriptions.push(
        vscode.commands.registerCommand('deepbubble.autoRefactor', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const document = editor.document;
                const selection = editor.selection;
                const text = document.getText(selection);
                const projectContext = await projectAnalyzer.getProjectContext();
                const userContext = userPrefs.getUserPreferences();
                const refactorResult = await aiService.autoRefactor(text, projectContext, userContext);
                const userChoice = await vscode.window.showInformationMessage(
                    `重构建议: ${refactorResult.suggestion}`,
                    '应用重构', '取消'
                );
                if (userChoice === '应用重构') {
                    await editor.edit(editBuilder => {
                        editBuilder.replace(selection, refactorResult.refactoredCode);
                    });
                    vscode.window.showInformationMessage('重构已应用。');
                    userPrefs.addHistory({ type: '自动重构', time: new Date().toLocaleString(), content: refactorResult.refactoredCode });
                }
            }
        })
    );

    // 代码片段推荐命令
    context.subscriptions.push(
        vscode.commands.registerCommand('deepbubble.recommendSnippet', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const document = editor.document;
                const position = editor.selection.active;
                const projectContext = await projectAnalyzer.getProjectContext();
                const userContext = userPrefs.getUserPreferences();
                const snippet = await aiService.recommendSnippet(document.getText(), projectContext, userContext);
                const userChoice = await vscode.window.showInformationMessage(
                    `推荐代码片段:\n${snippet}`,
                    '插入片段', '取消'
                );
                if (userChoice === '插入片段') {
                    await editor.edit(editBuilder => {
                        editBuilder.insert(position, snippet);
                    });
                    vscode.window.showInformationMessage('代码片段已插入。');
                    userPrefs.addHistory({ type: '代码片段推荐', time: new Date().toLocaleString(), content: snippet });
                }
            }
        })
    );

    // 历史记录面板命令
    context.subscriptions.push(
        vscode.commands.registerCommand('deepbubble.showHistory', async () => {
            const panel = vscode.window.createWebviewPanel(
                'deepbubbleHistory',
                'DeepBubble 历史记录',
                vscode.ViewColumn.One,
                {}
            );
            const history = userPrefs.getHistory();
            let html = `<h2>分析与重构历史</h2><ul>`;
            for (const record of history) {
                html += `<li><b>类型:</b> ${record.type} <br/><b>时间:</b> ${record.time} <br/><pre>${record.content}</pre></li>`;
            }
            html += `</ul>`;
            panel.webview.html = html;
        })
    );
}


export function deactivate() {}
