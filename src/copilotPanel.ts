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
