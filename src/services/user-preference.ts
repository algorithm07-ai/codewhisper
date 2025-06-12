// UserPreferenceManager: 管理用户偏好与历史记录
import * as vscode from 'vscode';

export class UserPreferenceManager {
    private globalState: vscode.Memento;
    private static HISTORY_KEY = 'deepbubble.history';

    constructor(globalState: vscode.Memento) {
        this.globalState = globalState;
    }

    getUserPreferences(): any {
        // TODO: 获取用户偏好
        return {};
    }

    updateFromInteraction(interaction: any) {
        // TODO: 根据 AI 交互更新用户偏好
    }

    addHistory(record: {type: string, time: string, content: string}) {
        let history = this.globalState.get<any[]>(UserPreferenceManager.HISTORY_KEY, []);
        history.unshift(record); // 新记录插到最前
        // 最多保存 50 条
        if (history.length > 50) history = history.slice(0, 50);
        this.globalState.update(UserPreferenceManager.HISTORY_KEY, history);
    }

    getHistory(): any[] {
        return this.globalState.get<any[]>(UserPreferenceManager.HISTORY_KEY, []);
    }
}
