"use client";

import { useRouter } from "next/navigation";
import Login from './login';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    // ログイン成功時にダッシュボードに遷移
    router.push("/dashboard");
  };

  return <Login onLoginSuccess={handleLoginSuccess} />;
}
