import { ChatMessageRequest, ChatMessageResponse, ChatHistoryResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log('API Request:', { url, options }); // デバッグログ追加
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      console.log('API Response Status:', response.status); // デバッグログ追加
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText); // デバッグログ追加
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const jsonResponse = await response.json();
      console.log('API Response Data:', jsonResponse); // デバッグログ追加
      
      return jsonResponse;
    } catch (fetchError) {
      console.error('Fetch Error:', fetchError); // デバッグログ追加
      if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
        throw new Error('ネットワークエラー: サーバーに接続できません');
      }
      throw fetchError;
    }
  }
  
  static async sendMessage(request: ChatMessageRequest): Promise<ChatMessageResponse> {
    return this.request<ChatMessageResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
  
  static async getChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
    return this.request<ChatHistoryResponse>(`/api/chat/history/${sessionId}`);
  }
}
