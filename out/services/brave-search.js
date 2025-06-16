"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.braveSearch = void 0;
// Brave Search API 调用封装
const axios_1 = __importDefault(require("axios"));
async function braveSearch(query, apiKey) {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`;
    const response = await axios_1.default.get(url, {
        headers: {
            'Accept': 'application/json',
            'X-Subscription-Token': apiKey
        }
    });
    return response.data;
}
exports.braveSearch = braveSearch;
//# sourceMappingURL=brave-search.js.map