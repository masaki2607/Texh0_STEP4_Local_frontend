// 求職者が持つスキルの型
export interface Skill {
    id: number;       // スキルの一意ID
    name: string;     // スキル名（例: "JavaScript", "Excel"）
}

// 求職者に付与されるタグの型
export interface Tag {
    id: number;       // タグの一意ID
    name: string;     // タグ名（例: "リーダーシップ", "チームプレイヤー"）
}

// 求職者の基本情報をまとめた型
export interface JobSeeker {
    id: number;                       // 求職者ID
    name: string;                      // 氏名
    email: string;                     // メールアドレス
    phone: string;                     // 電話番号
    desired_job: string;               // 希望職種
    desired_industry: string;          // 希望業界
    desired_location: string[];        // 希望勤務地（複数可）
    desired_salary: number | null;     // 希望給与（未設定の場合は null）
    available_start_date: string;      // 入職可能日（ISO形式など）
    work_style_type: string;           // 希望勤務形態（例: "リモート可", "フルタイム"）
    skills: Skill[];                   // 保有スキルリスト
    tags: Tag[];                       // タグリスト（特性や強み）
    created_at: string;                // 登録日時
}

// マッチング処理や解析の状態を表す型
export interface ProcessingStatus {
    status: 'pending' | 'processing' | 'completed' | 'failed'; // 処理状態
    confidence?: number;       // 処理成功時の信頼度（0〜1）
    error_message?: string;    // 処理失敗時のエラーメッセージ
}

// 求人情報の型
export interface JobOpening {
    id: number;                // 求人ID
    company: {                 // 企業情報
        name: string;          // 会社名
        industry: string;      // 業界
        location: string;      // 勤務地
    };
    position: string;          // 募集職種
    salary: {                  // 給与レンジ
        min: number;           // 最低給与
        max: number;           // 最高給与
    };
    matchingScore: number;     // 求職者とのマッチングスコア
    matchingReasons: string[]; // マッチング理由のリスト
    requirements: string[];    // 求人要件（スキルや資格など）
    benefits: string[];        // 待遇や福利厚生
}
