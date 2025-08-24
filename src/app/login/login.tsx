'use client'; // 'use client'を追加(yuge)

import { useState, useEffect } from "react";
import { validateDevAuth, logDevAccounts, isDevelopmentMode } from "@/lib/dev-auth";

type LoginProps = {
    onLoginSuccess?: () => void;  // ページ遷移のため追加（yuge）
};

export default function Login({ onLoginSuccess }: LoginProps) {  //ページ遷移用に追加(yuge)
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 開発環境でのテストアカウント情報を表示
  useEffect(() => {
    if (isDevelopmentMode()) {
      logDevAccounts();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション（フロント側）
    if (!empId || !password) {
      setError("すべての項目を入力してください");
      return;
    }

    // 開発環境での簡易認証チェック
    // TODO: 本番環境ではここから下を削除すること
    if (isDevelopmentMode()) {
      const devAuthResult = validateDevAuth(empId, password);
      if (devAuthResult) {
        console.log("🔓 開発用認証成功:", devAuthResult.user);
        localStorage.setItem("token", devAuthResult.access_token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userInfo", JSON.stringify(devAuthResult.user));

        // ログイン成功時の処理
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          window.location.href = "/dashboard";
        }
        return;
      }
    }

    // ここから上までを削除
    // 本番環境用のパスワードバリデーション
    if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/.test(password)) {
      setError("パスワードは半角英数8文字以上、英字・数字を各1文字以上含む必要があります");
      return;
    }

    // 本番環境用のAPI認証
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: empId,
          password: password,
        }),
      });

      if (!res.ok) {
        setError("社員番号またはパスワードが間違っています");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("isLoggedIn", "true");

      // ログイン成功時の処理
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("ログインに失敗しました。ネットワーク接続を確認してください。");
    }
  };

    return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">GROW Next</h1>

      {/* 開発環境での情報表示 */}
      {isDevelopmentMode() && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4 max-w-md">
          <div className="text-sm">
            <strong>🚀 開発環境モード</strong>
            <br />
            テストアカウント: admin/admin123 または user001/test1234
            <br />
            <span className="text-xs">※本番環境では表示されません</span>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit}>


          <label className="block mb-2">社員番号</label>
          <input
            type="text"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
          />

          <label className="block mb-2">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
          />

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button type="submit" className="w-full bg-red-400 text-white py-2 rounded mb-2 hover:bg-red-500">
            ログイン
          </button>

          <div className="text-center">
            <a href="/reset-password-request" className="text-sm text-gray-600 underline">
              パスワードを忘れた方はこちら
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
