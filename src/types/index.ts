// typesのインポートをしやすくするために集約

export * from './seekers'
export * from './chats';
// export * from './common';
// export * from './auth';
// export * from './ocr';


// インポートするときは以下のコードを使う(使用例)
// import { Job, Candidate, ChatMessage } from "@/types";



// あべちゃんコード
// export interface ChatMessage {
//   session_id: string;
//   message: string;
//   sender: 'user' | 'assistant';
//   created_at: string;
// }

// export interface ChatHistoryResponse {
//   session_id: string;
//   messages: ChatMessage[];
// }

// export interface ChatMessageRequest {
//   session_id?: string;
//   message: string;
//   user_id?: string;
// }

// export interface ChatMessageResponse {
//   session_id: string;
//   message: string;
//   sender: 'user' | 'assistant';
//   created_at: string;
// }
