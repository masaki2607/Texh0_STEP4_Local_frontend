"use client";

import React, { useState, useEffect } from "react";
import { FileText, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

// コンポーネントのインポート
import JobSeekerPanel from '@/components/JobSeekerSelect';
import MatchingControls from '@/components/MatchingControl';
import MatchingJobList from '@/components/MatchingResult';
import { fetchJobSeekers } from "@/services/jobSeekerInfo";
import { JobSeeker, ProcessingStatus, JobOpening } from "@/types";

interface ChatMessage {
    id: number;
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
}

interface ExtractedInfo {
    id: number;
    skills: { [key: string]: string[] };
    job_categories: string[];
    industries: string[];
    experience_years: number | null;
    current_company: string | null;
    desired_location: string[];
    desired_salary: { [key: string]: any };
    education: { [key: string]: string };
    languages: { language: string; level: string }[];
    certifications: string[];
    work_preferences: string[];
    summary: string | null;
}

const Dashboard = () => {
    const router = useRouter();
    const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>([]);
    const [selectedJobSeeker, setSelectedJobSeeker] = useState<string>('');
    const [selectedJobSeekerData, setSelectedJobSeekerData] = useState<JobSeeker | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

    // マッチング関連の状態
    const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({ status: 'pending' });
    const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null);
    const [matchedJobs, setMatchedJobs] = useState<JobOpening[]>([]);
    
    // モーダルの成功コールバック
    const handleModalSuccess = () => {
        loadJobSeekers();
    };

    // 求職者データを取得
    const loadJobSeekers = async () => {
        const data = await fetchJobSeekers();
        setJobSeekers(data);
    };

    useEffect(() => {
        loadJobSeekers();
    }, []);

    // ダミーの求人データ生成
    const generateDummyJobs = (jobSeekerInfo: ExtractedInfo): JobOpening[] => {
        const companies = [
            {
                name: "株式会社テクノロジー革新",
                industry: "IT・ソフトウェア",
                positions: ["フロントエンドエンジニア", "システムエンジニア", "プロジェクトマネージャー"],
                salary: { min: 450, max: 800 },
                location: "東京都渋谷区",
                benefits: ["リモートワーク可", "フレックス制", "年収査定制度"]
            },
            {
                name: "グローバル商事株式会社",
                industry: "商社・貿易",
                positions: ["営業企画", "海外事業企画", "マーケティング"],
                salary: { min: 400, max: 650 },
                location: "東京都千代田区",
                benefits: ["海外研修制度", "語学支援", "住宅手当"]
            },
            {
                name: "株式会社データアナリティクス",
                industry: "データサイエンス",
                positions: ["データサイエンティスト", "機械学習エンジニア", "データアナリスト"],
                salary: { min: 500, max: 900 },
                location: "東京都港区",
                benefits: ["研修制度充実", "書籍購入支援", "カンファレンス参加支援"]
            },
            {
                name: "コンサルティングパートナーズ",
                industry: "コンサルティング",
                positions: ["戦略コンサルタント", "ITコンサルタント", "業務改善コンサルタント"],
                salary: { min: 600, max: 1000 },
                location: "東京都新宿区",
                benefits: ["成果報酬制", "MBA支援制度", "海外プロジェクト参加機会"]
            },
            {
                name: "株式会社クリエイティブソリューション",
                industry: "広告・マーケティング",
                positions: ["Webディレクター", "UI/UXデザイナー", "デジタルマーケッター"],
                salary: { min: 380, max: 600 },
                location: "東京都品川区",
                benefits: ["クリエイティブ環境", "副業OK", "スキルアップ支援"]
            }
        ];

        return companies.map((company, index) => {
            const position = company.positions[Math.floor(Math.random() * company.positions.length)];
            const matchingScore = Math.floor(Math.random() * 20) + 80;
            
            const reasons = [];
            if (jobSeekerInfo.skills && Object.keys(jobSeekerInfo.skills).length > 0) {
                const skillCategories = Object.keys(jobSeekerInfo.skills);
                const randomCategory = skillCategories[Math.floor(Math.random() * skillCategories.length)];
                const skills = jobSeekerInfo.skills[randomCategory];
                if (skills && skills.length > 0) {
                    const skill = skills[Math.floor(Math.random() * skills.length)];
                    reasons.push(`${skill}のスキルが職務要件と合致`);
                }
            }
            if (jobSeekerInfo.experience_years && jobSeekerInfo.experience_years > 0) {
                reasons.push(`${jobSeekerInfo.experience_years}年の経験が求められるレベルに適合`);
            }
            reasons.push(`${company.industry}分野への転職希望と合致`);
            reasons.push(`希望勤務地と勤務地が一致`);

            return {
                id: index + 1,
                company: {
                    name: company.name,
                    industry: company.industry,
                    location: company.location
                },
                position: position,
                salary: company.salary,
                matchingScore: matchingScore,
                matchingReasons: reasons.slice(0, Math.floor(Math.random() * 2) + 2),
                requirements: [
                    `${position}として3年以上の経験`,
                    "チームワークを重視する方",
                    "新しい技術への学習意欲がある方"
                ],
                benefits: company.benefits
            };
        }).sort((a, b) => b.matchingScore - a.matchingScore).slice(0, 3);
    };

    // 求職者選択処理
    const handleJobSeekerChange = (value: string) => {
        setSelectedJobSeeker(value);
        let jobSeeker = jobSeekers.find(js => js.name === value || js.id.toString() === value);
        setSelectedJobSeekerData(jobSeeker || null);
        console.log('選択された求職者:', jobSeeker);
    };

    // マッチング処理開始
    const handleStartMatching = async () => {
        if (!selectedJobSeekerData) {
            alert('求職者を選択してください。');
            return;
        }

        setIsAnalyzing(true);
        setProcessingStatus({ status: 'processing' });

        try {
            console.log('マッチング開始:', selectedJobSeekerData);
            
            setTimeout(() => {
                const sampleExtractedInfo: ExtractedInfo = {
                    id: selectedJobSeekerData.id,
                    skills: {
                        'プログラミング言語': ['Python', 'JavaScript', 'TypeScript'],
                        'フレームワーク': ['React', 'FastAPI', 'Node.js'],
                        'データベース': ['MySQL', 'PostgreSQL']
                    },
                    job_categories: ['エンジニア', 'フルスタック開発者'],
                    industries: ['IT・通信', 'Webサービス'],
                    experience_years: 3,
                    current_company: 'サンプル株式会社',
                    desired_location: ['東京', '神奈川'],
                    desired_salary: {
                        type: 'range',
                        min_amount: 400,
                        max_amount: 600
                    },
                    education: {
                        university: 'サンプル大学',
                        degree: '情報工学科'
                    },
                    languages: [
                        { language: '日本語', level: 'ネイティブ' },
                        { language: '英語', level: '日常会話' }
                    ],
                    certifications: ['基本情報技術者', 'AWS認定ソリューションアーキテクト'],
                    work_preferences: ['リモートワーク', 'フレックス制'],
                    summary: `${selectedJobSeekerData.name}さんのプロフィールをまとめました。`
                };
                
                setExtractedInfo(sampleExtractedInfo);
                const dummyJobs = generateDummyJobs(sampleExtractedInfo);
                setMatchedJobs(dummyJobs);
                
                setProcessingStatus({ status: 'completed', confidence: 0.85 });
                setAnalysisComplete(true);
                setIsAnalyzing(false);
            }, 2000);

        } catch (error) {
            console.error('マッチング処理エラー:', error);
            const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
            setProcessingStatus({ 
                status: 'failed', 
                error_message: errorMessage
            });
            alert(`エラー: ${errorMessage}`);
            setIsAnalyzing(false);
        }
    };

    // チャットメッセージ送信
    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;

        const newMessage: ChatMessage = {
            id: Date.now(),
            type: 'user',
            content: chatMessage,
            timestamp: new Date().toLocaleTimeString('ja-JP')
        };

        setChatHistory(prev => [...prev, newMessage]);
        setChatMessage('');

        setTimeout(() => {
            const responseMessage: ChatMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: `${chatMessage}について詳しく説明いたします。求職者の経験と希望条件を考慮すると、以下の点が重要になります：\n\n1. 技術スキルの適合性\n2. キャリア成長の可能性\n3. 企業文化との親和性\n\n追加でお知りになりたい情報はございますか？`,
                timestamp: new Date().toLocaleTimeString('ja-JP')
            };
            setChatHistory(prev => [...prev, responseMessage]);
        }, 1000);
    };
    
    // リセット処理
    const handleReset = () => {
        setSelectedJobSeeker('');
        setSelectedJobSeekerData(null);
        setSearchTerm('');
        setAnalysisComplete(false);
        setProcessingStatus({ status: 'pending' });
        setExtractedInfo(null);
        setMatchedJobs([]);
    };

    // ログアウト処理
    const handleLogout = () => {
        router.push('/logout');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* サイドバー */}
            <div className="w-80 bg-white shadow-lg flex flex-col">
                {/* サイドバーの上部コンテンツ */}
                <div className="flex-1 p-6">
                    {/* ヘッダー */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">BizReach</h1>
                        <p className="text-gray-600">マッチング支援システム</p>
                    </div>

                    {/* 求職者選択 */}
                    <JobSeekerPanel 
                        jobSeekers={jobSeekers}
                        selectedJobSeeker={selectedJobSeeker}
                        setSelectedJobSeeker={handleJobSeekerChange}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onModalSuccess={handleModalSuccess}
                    />

                    {/* マッチング制御 */}
                    <MatchingControls 
                        isAnalyzing={isAnalyzing}
                        selectedJobSeeker={selectedJobSeeker}
                        processingStatus={processingStatus}
                        onStartMatching={handleStartMatching}
                        onReset={handleReset}
                    />
                </div>

                {/* ログアウトボタン（最下端に固定） */}
                <div className="p-6 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                        <LogOut size={20} className="mr-2" />
                        ログアウト
                    </button>
                </div>
            </div>
            
            {/* メインコンテンツ */}
            <div className="flex-1 p-8">
                {!analysisComplete ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText size={48} className="text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                                マッチング結果を表示
                            </h2>
                            <p className="text-gray-500">求職者を選択し、マッチングを開始してください</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {extractedInfo && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    {selectedJobSeekerData ? `${selectedJobSeekerData.name}さんのマッチング結果` : 'マッチング結果'}
                                </h2>
                                
                                {/* プロフィール要約 */}
                                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                    <h3 className="font-semibold text-gray-700 mb-2">プロフィール要約</h3>
                                    <p className="text-gray-700">{extractedInfo.summary || '要約情報なし'}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* 左列 */}
                                    <div className="space-y-4">
                                        {/* 基本情報 */}
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-2">基本情報</h3>
                                            <div className="space-y-1 text-sm">
                                                <p><span className="font-medium">現職:</span> {extractedInfo.current_company || '不明'}</p>
                                                <p><span className="font-medium">経験年数:</span> {extractedInfo.experience_years ? `${extractedInfo.experience_years}年` : '不明'}</p>
                                                {extractedInfo.education.university && (
                                                    <p><span className="font-medium">学歴:</span> {extractedInfo.education.university}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* 経験職種 */}
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-2">経験職種</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {extractedInfo.job_categories.length > 0 ? (
                                                    extractedInfo.job_categories.map((category, index) => (
                                                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                                            {category}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-sm">情報なし</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* 経験業界 */}
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-2">経験業界</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {extractedInfo.industries.length > 0 ? (
                                                    extractedInfo.industries.map((industry, index) => (
                                                        <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                                            {industry}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-sm">情報なし</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* 語学スキル */}
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-2">語学スキル</h3>
                                            <div className="space-y-1">
                                                {extractedInfo.languages.length > 0 ? (
                                                    extractedInfo.languages.map((lang, index) => (
                                                        <div key={index} className="flex justify-between text-sm">
                                                            <span>{lang.language}</span>
                                                            <span className="text-gray-600">{lang.level}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-sm">情報なし</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 右列 */}
                                    <div className="space-y-4">
                                        {/* スキル */}
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-2">技術スキル</h3>
                                            <div className="space-y-3">
                                                {Object.keys(extractedInfo.skills).length > 0 ? (
                                                    Object.entries(extractedInfo.skills).map(([category, skills]) => (
                                                        <div key={category}>
                                                            <h4 className="text-sm font-medium text-gray-600 mb-1">{category}</h4>
                                                            <div className="flex flex-wrap gap-1">
                                                                {skills.map((skill, index) => (
                                                                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-sm">スキル情報なし</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* 希望条件 */}
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-2">希望条件</h3>
                                            <div className="space-y-2 text-sm">
                                                {/* 希望年収 */}
                                                {extractedInfo.desired_salary && Object.keys(extractedInfo.desired_salary).length > 0 && (
                                                    <div>
                                                        <span className="font-medium">年収:</span>
                                                        {extractedInfo.desired_salary.type === 'range' ? (
                                                            <span className="ml-1">{extractedInfo.desired_salary.min_amount}～{extractedInfo.desired_salary.max_amount}万円</span>
                                                        ) : (
                                                            <span className="ml-1">{extractedInfo.desired_salary.amount}万円{extractedInfo.desired_salary.type === 'minimum' ? '以上' : ''}</span>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* 希望勤務地 */}
                                                {extractedInfo.desired_location.length > 0 && (
                                                    <div>
                                                        <span className="font-medium">勤務地:</span>
                                                        <span className="ml-1">{extractedInfo.desired_location.join('、')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 働き方の希望 */}
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-2">働き方の希望</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {extractedInfo.work_preferences.length > 0 ? (
                                                    extractedInfo.work_preferences.map((pref, index) => (
                                                        <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                                            {pref}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-sm">情報なし</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* 資格 */}
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-2">資格・認定</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {extractedInfo.certifications.length > 0 ? (
                                                    extractedInfo.certifications.map((cert, index) => (
                                                        <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                                                            {cert}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-sm">情報なし</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* マッチング結果 - 求人情報 */}
                                {matchedJobs.length > 0 && (
                                    <MatchingJobList matchedJobs={matchedJobs} />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;