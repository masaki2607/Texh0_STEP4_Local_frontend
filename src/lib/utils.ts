// クラス名結合（Tailwind用）
export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// 日付フォーマット
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// ランダムID生成
export function randomId(length = 8) {
  return Math.random().toString(36).substr(2, length);
}


