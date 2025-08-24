"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from './dashboard';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // ログイン状態をチェック
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (isLoggedIn !== "true") {
      // 未ログインの場合はログインページへリダイレクト
      router.replace("/login");
    }
  }, [router]);

  return <Dashboard />;
}
