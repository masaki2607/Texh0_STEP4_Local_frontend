"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChatBubble } from '@/components/ChatBubble';
import { ChatMessage, ChatMessageRequest } from '@/types';
import { ApiClient } from '@/lib/chat_api';
import { SessionManager } from '@/lib/session';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

interface ChatProps {
  onBackToDashboard?: () => void;
}

export default function Home({ onBackToDashboard }: ChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // セッション初期化
  useEffect(() => {
    const existingSessionId = SessionManager.getSessionId();
    if (existingSessionId) {
      setSessionId(existingSessionId);
    }
  }, []);

  // チャット履歴取得
  const { data: historyData, mutate, error } = useSWR(
    sessionId ? `/api/chat/history/${sessionId}` : null,
    () => sessionId ? ApiClient.getChatHistory(sessionId) : null,
    { 
      refreshInterval: 0,
      onError: (error) => {
        console.error('履歴取得エラー:', error);
      }
    }
  );

  // 履歴データが取得されたら更新
  useEffect(() => {
    if (historyData?.messages) {
      setMessages(historyData.messages);
    }
  }, [historyData]);

  // 自動スクロール
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // メッセージ送信
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      const request: ChatMessageRequest = {
        session_id: sessionId || undefined,
        message: messageText,
      };

      console.log('送信リクエスト:', request); // デバッグログ追加
      const response = await ApiClient.sendMessage(request);
      console.log('レスポンス:', response); // デバッグログ追加
      
      // セッションIDが新規作成された場合は保存
      if (!sessionId && response.session_id) {
        setSessionId(response.session_id);
        SessionManager.setSessionId(response.session_id);
      }

      // メッセージをローカル状態に追加（created_atを文字列に変換）
      const userMessage: ChatMessage = {
        session_id: response.session_id,
        message: messageText,
        sender: 'user',
        created_at: new Date().toISOString(),
      };

      // レスポンスのcreated_atが日付オブジェクトの場合は文字列に変換
      const assistantMessage: ChatMessage = {
        ...response,
        created_at: typeof response.created_at === 'string' 
          ? response.created_at 
          : new Date(response.created_at).toISOString()
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);
      
      // SWRキャッシュを更新
      mutate();
      
    } catch (error) {
      console.error('詳細なメッセージ送信エラー:', error);
      
      // エラーの種類によって分岐
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('サーバーとの接続に失敗しました。バックエンドサーバーが起動しているか確認してください。');
      } else if (error instanceof Error) {
        alert(`メッセージの送信に失敗しました: ${error.message}`);
        console.error('エラー詳細:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      } else {
        alert('メッセージの送信に失敗しました: 不明なエラー');
        console.error('不明なエラー:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 新しいセッション開始
  const handleNewSession = () => {
    SessionManager.clearSession();
    setSessionId(null);
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
            {/* 左：ダッシュボードに戻る */}
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            >
              ← 戻る
            </button>

            {/* 中央：タイトル */}
            <h1 className="text-xl font-semibold text-gray-800">
                人材紹介チャットアシスタント
            </h1>

            {/* 右：新しいチャット */}
            <button
                onClick={handleNewSession}
                className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded border border-gray-300 hover:border-gray-400"
            >
                新しいチャット
            </button>
        </div>
      </header>

      {/* チャットエリア */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto px-4">
          {error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-500">
                <p>サーバーとの接続に問題があります</p>
                <p className="text-sm mt-2">バックエンドサーバーが起動しているか確認してください</p>
                <button
                  onClick={() => mutate()}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  再試行
                </button>
              </div>
            </div>
          ) : (
            <div className="chat-container h-full overflow-y-auto py-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <p className="text-lg mb-2">こんにちは！</p>
                    <p className="text-sm">
                      商談や面談の記録について何でもお聞きください。
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <ChatBubble key={index} message={message} />
                ))
              )}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-200 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* 入力エリア */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="メッセージを入力してください..."
              className="flex-1 input-field border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="btn-primary bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              送信
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
