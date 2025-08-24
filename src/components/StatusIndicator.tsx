"use client";

import React from "react"; 
import { Clock, CheckCircle, AlertCircle } from "lucide-react"; 


// コンポーネントが受け取るpropsの型を定義
interface Props {
    status: 'pending' | 'processing' | 'completed' | 'failed'; 
    // 処理状況の状態
    confidence?: number; 
    // 完了時のマッチング度（任意）
    error_message?: string; 
    // 失敗時のエラーメッセージ（任意）
}

// StatusIndicatorコンポーネント本体
const StatusIndicator: React.FC<Props> = ({ status, confidence, error_message }) => {
    // statusの値に応じて表示を切り替える
    switch (status) {
        case 'pending':
            // 待機中
            return (
                <div className="flex items-center text-gray-500">
                    <Clock className="mr-2" size={16} />待機中
                </div>
            );
        case 'processing':
            // 処理中（スピナー表示）
            return (
                <div className="flex items-center text-blue-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                    処理中...
                </div>
            );
        case 'completed':
            // 処理完了
            return (
                <div className="flex items-center text-green-500">
                    <CheckCircle className="mr-2" size={16} />
                    完了 {confidence && `(マッチング度: ${Math.round(confidence*100)}%)`}
                    {/* confidenceがある場合は百分率表示 */}
                </div>
            );
        case 'failed':
            // 処理失敗
            return (
                <div className="flex items-center text-red-500">
                    <AlertCircle className="mr-2" size={16} />
                    エラー: {error_message}
                </div>
            );
        default:
            return null;
            // 不正なstatusの場合は何も表示しない
    }
};

export default StatusIndicator;