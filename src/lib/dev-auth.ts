/**
 * 開発環境用の簡易認証設定
 * TODO: 本番環境では削除すること
 * 
 * このファイルは開発中のテスト用途のみに使用し、
 * 本番環境にデプロイする前に必ず削除してください。
 */

// 開発用のテストアカウント
export const DEV_ACCOUNTS = {
  // 管理者用アカウント
  admin: {
    empId: "admin",
    password: "admin123",
    role: "admin",
    name: "管理者"
  },
  // 一般ユーザー用アカウント
  user1: {
    empId: "user001",
    password: "test1234",
    role: "user",
    name: "テストユーザー1"
  },
  user2: {
    empId: "user002", 
    password: "test1234",
    role: "user",
    name: "テストユーザー2"
  }
};

// 開発モードかどうかを判定
export const isDevelopmentMode = (): boolean => {
  return process.env.NODE_ENV === 'development' || 
         process.env.NEXT_PUBLIC_DEV_AUTH_ENABLED === 'true';
};

// 開発用認証チェック
export const validateDevAuth = (empId: string, password: string) => {
  if (!isDevelopmentMode()) {
    return null;
  }

  const account = Object.values(DEV_ACCOUNTS).find(
    acc => acc.empId === empId && acc.password === password
  );

  if (account) {
    return {
      success: true,
      user: {
        empId: account.empId,
        name: account.name,
        role: account.role
      },
      // 開発用のダミートークン
      access_token: `dev_token_${account.empId}_${Date.now()}`
    };
  }

  return null;
};

// 開発用認証情報を表示する関数（コンソールログ用）
export const logDevAccounts = () => {
  if (!isDevelopmentMode()) {
    return;
  }

  console.log("🚀 開発環境用テストアカウント:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  Object.values(DEV_ACCOUNTS).forEach(account => {
    console.log(`👤 ${account.name} (${account.role})`);
    console.log(`   社員番号: ${account.empId}`);
    console.log(`   パスワード: ${account.password}`);
    console.log("   ─────────────────────────");
  });
  console.log("⚠️  注意: このファイルは本番環境では削除してください");
};
