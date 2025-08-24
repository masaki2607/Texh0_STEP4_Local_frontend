// pages/reset-password-request.tsx(パスワードの照合ページ)
import { useState } from "react";
import { useRouter } from "next/router";

export default function ResetPasswordRequest() {
  const router = useRouter();
  const [empId, setEmpId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emp_id: empId, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "照合に失敗しました");
      }

      // 本人確認OK → パスワード再設定ページへ社員IDを持って遷移
      router.push({ pathname: "/reset-password", query: { empId } });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">パスワード再設定 - 本人確認</h1>
      <form onSubmit={handleVerify}>
        <label className="block mb-2">社員番号</label>
        <input
          type="text"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          className="w-full border p-2 mb-4"
          required
        />

        <label className="block mb-2">氏名</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 mb-4"
          required
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "確認中..." : "照合する"}
        </button>
      </form>
    </div>
  );
}
