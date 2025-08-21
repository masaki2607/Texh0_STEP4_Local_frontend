export interface ChatMessage {
  session_id: string;
  message: string;
  sender: 'user' | 'assistant';
  created_at: string;
}

export interface ChatHistoryResponse {
  session_id: string;
  messages: ChatMessage[];
}

export interface ChatMessageRequest {
  session_id?: string;
  message: string;
  user_id?: string;
}

export interface ChatMessageResponse {
  session_id: string;
  message: string;
  sender: 'user' | 'assistant';
  created_at: string;
}
