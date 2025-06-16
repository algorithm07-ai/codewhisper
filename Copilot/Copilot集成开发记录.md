# IntelliScript Coder Copilot 模块集成开发记录

## 目录结构

```
intelliScriptCoder-extension/
├── Copilot/
│   └── Copilot集成开发记录.md   ← 本文档
├── src/
│   ├── copilotPanel.ts         ← Copilot 聊天面板主逻辑
│   ├── extension.ts            ← 插件主入口，注册 Copilot 相关命令
│   └── services/
│       └── ai-service.ts       ← AIService，集成 DeepSeek API
...
```

---

## 1. 需求与目标

- 在 VS Code 插件 intelliScriptCoder-extension 中集成一个类似 Ask Copilot 的 AI 聊天模块。
- 支持调用 DeepSeek API 实现智能问答。
- 支持弹窗问答和 Webview 聊天两种使用方式。

---

## 2. 主要开发过程

### 步骤一：AIService 集成 DeepSeek API

**文件：src/services/ai-service.ts**

```typescript
import fetch from 'node-fetch';

export class AIService {
    // ...已有方法

    async askCopilot(question: string): Promise<string> {
        // TODO: 替换为你的 DeepSeek API Key
        const apiKey = 'YOUR_DEEPSEEK_API_KEY';
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
}
```

### 步骤二：注册命令支持 Copilot 问答

**文件：src/extension.ts**

```typescript
import { CopilotPanel } from './copilotPanel';

// ...

// 注册弹窗问答命令
context.subscriptions.push(
    vscode.commands.registerCommand('intelliScriptCoder.askCopilot', async () => {
        const question = await vscode.window.showInputBox({ prompt: '请输入你的问题 (Copilot)' });
        if (!question) return;
        try {
            const answer = await aiService.askCopilot(question);
            vscode.window.showInformationMessage(`Copilot 回答: ${answer}`);
        } catch (err: any) {
            vscode.window.showErrorMessage('Copilot API 调用失败: ' + (err.message || err.toString()));
        }
    })
);

// 注册 Webview 聊天面板命令
context.subscriptions.push(
    vscode.commands.registerCommand('intelliScriptCoder.openCopilotPanel', () => {
        CopilotPanel.createOrShow(context.extensionUri);
    })
);
```

### 步骤三：Webview 聊天面板实现

**文件：src/copilotPanel.ts**

```typescript
import * as vscode from 'vscode';
import { AIService } from './services/ai-service';

export class CopilotPanel {
    public static currentPanel: CopilotPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        if (CopilotPanel.currentPanel) {
            CopilotPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'copilotChat',
            'Ask Copilot',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
            }
        );

        CopilotPanel.currentPanel = new CopilotPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        this._panel.webview.html = this._getHtmlForWebview();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // 监听前端消息
        this._panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'ask':
                        // 调用 AIService.askCopilot
                        const aiService = new AIService();
                        let answer = '';
                        try {
                            answer = await aiService.askCopilot(message.text);
                        } catch (err: any) {
                            answer = 'API 调用失败: ' + (err.message || err.toString());
                        }
                        this._panel.webview.postMessage({ command: 'answer', text: answer });
                        break;
                }
            },
            null,
            this._disposables
        );
    }

    public dispose() {
        CopilotPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _getHtmlForWebview() {
        // 聊天界面
        return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Segoe UI, sans-serif; margin: 0; padding: 0; }
        #chat { height: 350px; overflow-y: auto; border: 1px solid #eee; margin-bottom: 10px; padding: 10px; background: #fafafa;}
        #input { width: 80%; }
        #send { width: 18%; }
        .msg { margin: 5px 0; }
        .user { color: #007acc; }
        .bot { color: #333; }
    </style>
</head>
<body>
    <div id="chat"></div>
    <input id="input" type="text" placeholder="请输入你的问题..." />
    <button id="send">发送</button>
    <script>
        const vscode = acquireVsCodeApi();
        const chat = document.getElementById('chat');
        const input = document.getElementById('input');
        const send = document.getElementById('send');

        send.onclick = () => {
            const text = input.value.trim();
            if (!text) return;
            appendMessage('你', text, 'user');
            vscode.postMessage({ command: 'ask', text });
            input.value = '';
        };

        function appendMessage(sender, text, cls) {
            const div = document.createElement('div');
            div.className = 'msg ' + cls;
            div.innerHTML = '<b>' + sender + ':</b> ' + text;
            chat.appendChild(div);
            chat.scrollTop = chat.scrollHeight;
        }

        window.addEventListener('message', event => {
            const message = event.data;
            if (message.command === 'answer') {
                appendMessage('Copilot', message.text, 'bot');
            }
        });
    </script>
</body>
</html>
        `;
    }
}
```

---

## 3. 依赖说明

- 需在项目根目录执行：
  ```sh
  npm install node-fetch@3
  ```
- 请将 AIService 代码中的 `YOUR_DEEPSEEK_API_KEY` 替换为你的真实 DeepSeek API Key。

---

## 4. 使用方式

- 命令面板输入 `IntelliScript Coder: Ask Copilot` 可弹窗问答。
- 命令面板输入 `IntelliScript Coder: Open Copilot Panel` 可打开聊天面板。

---

## 5. 备注

- 聊天面板支持多轮对话，适合持续交互。
- 若需将命令加入 package.json 的 contributes.commands，可进一步完善。
- 如需美化 UI 或接入其它大模型 API，可在此基础上扩展。

---

开发记录时间：2025-06-13
