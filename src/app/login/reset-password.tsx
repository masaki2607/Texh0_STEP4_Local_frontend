// pages/reset-password.tsx（パスワードの再設定ページ）
import { useState } from "react";
import { useRouter } from "next/router";

export default function ResetPassword() {
  const router = useRouter();
  const { empId } = router.query;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ empId, newPassword }),
      });

      if (!res.ok) {
        throw new Error("パスワードの再設定に失敗しました。");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-4 border rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">パスワード再設定</h1>
      {success ? (
        <div>
          <p className="text-green-500 mb-4">パスワードが正常に更新されました。</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
          ログインに戻る
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">新しいパスワード</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 mb-4"
          />

          <label className="block mb-2">確認用パスワード</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 mb-4"
          />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          再設定する
        </button>
        </form>
      )}
    </div>
  );
}
