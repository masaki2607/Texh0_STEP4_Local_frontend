// 利用可能なHTTPメソッドの型定義
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * 共通API呼び出し関数
 * @param endpoint - APIエンドポイントURL（フルURLまたは相対パス）
 * @param method - HTTPメソッド（GET, POST, PUT, PATCH, DELETE）
 * @param body - リクエストボディ（オブジェクト形式）
 * @param token - Bearer認証用のアクセストークン（任意）
 * @returns - APIから返されたJSONデータを型Tとして返す
 */
export async function apiFetch<T>(
  endpoint: string,
  method: HttpMethod = "GET", // デフォルトはGET
  body?: unknown,             // POSTやPUT時に送信するデータ
  token?: string              // 認証トークン（任意）
): Promise<T> {
  // リクエストヘッダーを設定
  const headers: HeadersInit = {
    "Content-Type": "application/json", // JSON形式のリクエスト
  };

  // 認証トークンが渡された場合は Authorization ヘッダーに追加
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // fetch APIを使ってリクエスト送信
  const res = await fetch(endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined, // bodyがある場合はJSON化
  });

  // ステータスコードが200系以外ならエラー扱い
  if (!res.ok) {
    const errorText = await res.text(); // エラーメッセージ取得
    throw new Error(`API Error ${res.status}: ${errorText}`);
  }

  // レスポンスをJSONとしてパースして返す（型Tに変換）
  return res.json() as Promise<T>;
}

/**
 * OCRテキストを送信してデータベースに保存
 * @param jobSeekerId - 求職者ID
 * @param ocrText - OCRで抽出されたテキスト
 * @param token - Bearer認証用のアクセストークン（任意）
 * @returns - 保存されたレジュメ情報
 */
export const postResumeOCRText = async (
  jobSeekerId: number, 
  ocrText: string, 
  token?: string
) => {
  try {
    const result = await apiFetch<any>(
      "/api/resumes",
      "POST",
      {
        job_seeker_id: jobSeekerId,
        ocr_text: ocrText,
      },
      token
    );
    return result;
  } catch (error) {
    throw new Error("OCRテキストの送信に失敗しました");
  }
};
