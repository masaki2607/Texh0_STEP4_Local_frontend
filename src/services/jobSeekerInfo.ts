import { JobSeeker } from "@/types";

// 求職者のダミーデータ
const DUMMY_JOB_SEEKERS: JobSeeker[] = [
    { 
        id: 1, name: '田中 太郎', email: 'taro@example.com', phone: '080-0000-0001',
        desired_job: 'エンジニア', desired_industry: 'IT', desired_location: ['東京'],
        desired_salary: 500, available_start_date: '2025-09-01', work_style_type: 'フルタイム',
        skills: [{ id: 1, name: 'Python' }, { id: 2, name: 'React' }], tags: [{ id: 1, name: 'フルリモート希望' }],
        created_at: new Date().toISOString() 
    },
    { 
        id: 2, name: '佐藤 花子', email: 'hanako@example.com', phone: '080-0000-0002',
        desired_job: 'デザイナー', desired_industry: 'Web', desired_location: ['神奈川'],
        desired_salary: 450, available_start_date: '2025-10-01', work_style_type: 'パートタイム',
        skills: [{ id: 3, name: 'Figma' }, { id: 4, name: 'Photoshop' }], tags: [{ id: 2, name: '時短勤務希望' }],
        created_at: new Date().toISOString() 
    },
    { 
        id: 3, name: '鈴木 一郎', email: 'ichiro@example.com', phone: '080-0000-0003',
        desired_job: 'PM', desired_industry: 'コンサル', desired_location: ['東京'],
        desired_salary: 600, available_start_date: '2025-11-01', work_style_type: 'フルタイム',
        skills: [{ id: 5, name: 'プロジェクト管理' }], tags: [],
        created_at: new Date().toISOString() 
    },
    { 
        id: 4, name: '高橋 美咲', email: 'misaki@example.com', phone: '080-0000-0004',
        desired_job: 'マーケッター', desired_industry: '広告', desired_location: ['大阪'],
        desired_salary: 480, available_start_date: '2025-09-15', work_style_type: 'フルタイム',
        skills: [{ id: 6, name: 'SEO' }, { id: 7, name: 'SNS運用' }], tags: [{ id: 3, name: '週休3日希望' }],
        created_at: new Date().toISOString() 
    },
    { 
        id: 5, name: '渡辺 健太', email: 'kenta@example.com', phone: '080-0000-0005',
        desired_job: 'データアナリスト', desired_industry: 'IT', desired_location: ['東京', '神奈川'],
        desired_salary: 550, available_start_date: '2025-10-20', work_style_type: 'フルタイム',
        skills: [{ id: 8, name: 'SQL' }, { id: 9, name: 'Python' }], tags: [],
        created_at: new Date().toISOString() 
    }
];

// 将来的に Azure DB に接続する場合はここを変更
export const fetchJobSeekers = async (): Promise<JobSeeker[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(DUMMY_JOB_SEEKERS);
        }, 500);
    });
};


// Azure DB接続用
// export const fetchJobSeekers = async (): Promise<JobSeeker[]> => {

//     const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

//     try {
//         const response = await fetch(`${API_BASE_URL}/job-seekers`);
//         if (!response.ok) throw new Error('APIエラー');
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.warn('API取得失敗、ダミーデータを使用', error);
//         return DUMMY_JOB_SEEKERS;
//     }
// };
