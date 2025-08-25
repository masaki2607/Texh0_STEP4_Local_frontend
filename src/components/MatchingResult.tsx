"use client";

/**
 * MatchingResult.tsx
 * - 変更最小の“つなぎ”を追加
 * - localStorage.selectedJobSeekerId があれば /match/rank-ui を呼び出し、上位3件をカード表示
 * - 失敗/未設定時は props.matchedJobs を従来どおり表示（フォールバック）
 */
console.log('[MatchingResult] mounted');
import React, { useEffect, useState } from "react";
import { Building, MapPin, DollarSign, CheckCircle } from "lucide-react";

/** JobOpening 型（dashboard.tsx と共通想定） */
interface JobOpening {
  id: number;
  company: {
    name: string;
    industry: string;
    location: string;
  };
  position: string;
  salary: {
    min: number;
    max: number;
  };
  requirements: string[];
  matchingScore: number;
  matchingReasons: string[];
  benefits: string[];
}

interface MatchingJobListProps {
  matchedJobs: JobOpening[];
}

const MatchingJobList: React.FC<MatchingJobListProps> = ({ matchedJobs }) => {
  // ---- Minimal glue: try fetching backend rankings when seekerId is available ----
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const [backendJobs, setBackendJobs] = useState<JobOpening[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hooks はコンポーネント“内”で呼ぶ（Invalid hook call 回避）
    try {
      const stored =
        typeof window !== "undefined"
          ? window.localStorage.getItem("selectedJobSeekerId")
          : null;
      const seekerId = stored ? parseInt(stored, 10) : NaN;

      if (!Number.isFinite(seekerId) || seekerId <= 0) {
        // ID未設定なら props をフォールバック表示
        return;
      }

      const fetchRankings = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`${API_BASE_URL}/match/rank-ui`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ job_seeker_id: seekerId, top_k: 3 }),
          });
          if (!res.ok) {
            const detail = await res.text();
            throw new Error(`rank-ui ${res.status}: ${detail}`);
          }
          const data = await res.json();
          // backend は UI 互換の配列を返す想定
          setBackendJobs(Array.isArray(data) ? data : []);
        } catch (e: any) {
          setError(e?.message || "fetch failed");
          setBackendJobs(null); // フォールバックで props を使う
        } finally {
          setLoading(false);
        }
      };

      fetchRankings();
    } catch (e: any) {
      console.warn("rank-ui bootstrap error", e);
    }
  }, [API_BASE_URL]);

  // backend 結果があれば優先、なければ従来の matchedJobs を使用
  const jobsToRender: JobOpening[] =
    backendJobs && backendJobs.length > 0 ? backendJobs : matchedJobs;
  // ------------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* 取得中/エラーの軽い表示（既存UIを壊さない） */}
      {loading && (
        <div className="text-sm text-gray-500">バックエンドから取得中...</div>
      )}
      {error && (
        <div className="text-sm text-red-600">取得エラー: {error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobsToRender.map((job, index) => (
          <div
            key={job.id ?? index}
            className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden"
          >
            {/* ヘッダー */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building size={18} className="text-gray-600 mr-2" />
                  <h4 className="text-base font-bold text-gray-900">
                    {job.company?.name ?? "（社名未設定）"}
                  </h4>
                  <span className="ml-3 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {job.company?.industry ?? "（業種未設定）"}
                  </span>
                </div>
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  マッチング度 {job.matchingScore ?? 0}%
                </div>
              </div>
            </div>

            {/* 本文 */}
            <div className="px-6 py-5">
              <p className="text-blue-700 font-semibold text-lg mb-1">
                {job.position ?? "（職種未設定）"}
              </p>
              <div className="flex items-center text-gray-600 text-sm mb-3">
                <MapPin size={14} className="mr-1" />
                <span className="mr-4">
                  {job.company?.location ?? "（勤務地未設定）"}
                </span>
                <DollarSign size={14} className="mr-1" />
                <span>
                  {job.salary?.min ?? 0}～{job.salary?.max ?? 0}万円
                </span>
              </div>

              {/* マッチ理由（上位のみサマリ表示） */}
              {Array.isArray(job.matchingReasons) &&
                job.matchingReasons.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-semibold text-gray-800 mb-1">
                      マッチ理由
                    </div>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {job.matchingReasons.slice(0, 3).map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* 要件の抜粋（タグ風） */}
              {Array.isArray(job.requirements) &&
                job.requirements.length > 0 && (
                  <div className="mb-2">
                    <div className="text-sm font-semibold text-gray-800 mb-1">
                      主な要件
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.slice(0, 6).map((req, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          <CheckCircle size={14} className="mr-1" />
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* 福利厚生など（データがあれば） */}
              {Array.isArray(job.benefits) && job.benefits.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    福利厚生
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.slice(0, 6).map((benefit, i) => (
                      <span
                        key={i}
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchingJobList;