"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferenceManager = void 0;
class UserPreferenceManager {
    constructor(globalState) {
        this.globalState = globalState;
    }
    getUserPreferences() {
        // TODO: 获取用户偏好
        return {};
    }
    updateFromInteraction(interaction) {
        // TODO: 根据 AI 交互更新用户偏好
    }
    addHistory(record) {
        let history = this.globalState.get(UserPreferenceManager.HISTORY_KEY, []);
        history.unshift(record); // 新记录插到最前
        // 最多保存 50 条
        if (history.length > 50)
            history = history.slice(0, 50);
        this.globalState.update(UserPreferenceManager.HISTORY_KEY, history);
    }
    getHistory() {
        return this.globalState.get(UserPreferenceManager.HISTORY_KEY, []);
    }
}
exports.UserPreferenceManager = UserPreferenceManager;
UserPreferenceManager.HISTORY_KEY = 'deepbubble.history';
//# sourceMappingURL=user-preference.js.map