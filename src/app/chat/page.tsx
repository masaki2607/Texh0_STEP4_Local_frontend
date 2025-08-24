"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Chat from './chat';

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    // ログイン状態をチェック
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (isLoggedIn !== "true") {
      // 未ログインの場合はログインページへリダイレクト
      router.replace("/login");
    }
  }, [router]);

  // ダッシュボードに戻る関数
  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  return <Chat onBackToDashboard={handleBackToDashboard} />;
}
