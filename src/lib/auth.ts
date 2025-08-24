// ブラウザの localStorage に保存する際のキー名
const TOKEN_KEY = "auth_token";

/**
 * トークンを保存
 * @param token - 認証用アクセストークン
 */
export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * トークンを取得
 * @returns 保存されているトークン（存在しない場合はnull）
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * トークンを削除
 */
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * 認証状態を確認
 * @returns トークンがあればtrue（認証済み）
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * ログイン処理の例
 * @param username - ユーザー名
 * @param password - パスワード
 * @throws ログインに失敗した場合は例外を投げる
 */
export async function login(username: string, password: string) {
  // APIへログインリクエスト
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  // ステータスコードが200系以外ならエラー扱い
  if (!res.ok) {
    throw new Error("ログインに失敗しました");
  }

  // レスポンスからトークンを取得して保存
  const { token } = await res.json();
  saveToken(token);
}

/**
 * ログアウト処理
 * 保存されているトークンを削除
 */
export function logout() {
  clearToken();
}
