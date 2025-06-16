// Brave Search API 调用封装
import axios from 'axios';

export interface BraveSearchResult {
    web: {
        results: Array<{
            title: string;
            url: string;
            description: string;
        }>;
    };
}

export async function braveSearch(query: string, apiKey: string): Promise<BraveSearchResult> {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`;
    const response = await axios.get(url, {
        headers: {
            'Accept': 'application/json',
            'X-Subscription-Token': apiKey
        }
    });
    return response.data;
}
