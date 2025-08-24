"use client";

import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = () => {
    // 全ての認証情報を削除
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    
    // ログインページへ遷移
    router.replace("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">ログアウト</h1>
        <p className="text-gray-600 mb-6">
          ログアウトしますか？<br />
          すべてのセッション情報が削除されます。
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            ログアウト
          </button>
        </div>
      </div>
    </div>
  );
}