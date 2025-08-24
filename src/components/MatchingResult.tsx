"use client";

import React from "react";
import { Building, MapPin, DollarSign, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// JobOpening 型の定義（dashboard.tsx と共通）
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
    matchingScore: number;
    matchingReasons: string[];
    requirements: string[];
    benefits: string[];
}

// Props 型
interface Props {
    matchedJobs: JobOpening[];
}

const MatchingJobList: React.FC<Props> = ({ matchedJobs }) => {
    const router = useRouter();
    
    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Building className="mr-2" size={20} />
                マッチング求人（上位3社）
            </h3>

            <div className="space-y-4">
                {matchedJobs.map((job, index) => (
                    <div 
                        key={job.id}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition"
                        onClick={() => router.push(`/chat?jobId=${job.id}`)}
                    >
                        {/* 求人ヘッダー */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium mr-3">
                                        {index + 1}位
                                    </span>
                                    <h4 className="text-lg font-bold text-gray-900">{job.company.name}</h4>
                                    <span className="ml-3 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                        {job.company.industry}
                                    </span>
                                </div>
                                <p className="text-blue-700 font-semibold text-lg mb-1">{job.position}</p>
                                <div className="flex items-center text-gray-600 text-sm mb-3">
                                    <MapPin size={14} className="mr-1" />
                                    <span className="mr-4">{job.company.location}</span>
                                    <DollarSign size={14} className="mr-1" />
                                    <span>{job.salary.min}～{job.salary.max}万円</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-2">
                                    マッチング度 {job.matchingScore}%
                                </div>
                            </div>
                        </div>

                        {/* マッチング理由 */}
                        <div className="bg-white bg-opacity-80 rounded-lg p-4 mb-4">
                            <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                                <CheckCircle size={16} className="mr-2 text-green-500" />
                                マッチング理由
                            </h5>
                            <ul className="space-y-1">
                                {job.matchingReasons.map((reason, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                                        <span className="text-green-500 mr-2 mt-0.5">•</span>
                                        {reason}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 求人要件と福利厚生 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white bg-opacity-80 rounded-lg p-3">
                                <h6 className="font-medium text-gray-800 mb-2 text-sm">求められるスキル・経験</h6>
                                <ul className="space-y-1">
                                    {job.requirements.map((req, idx) => (
                                        <li key={idx} className="text-xs text-gray-600 flex items-start">
                                            <span className="text-blue-400 mr-1 mt-0.5">▪</span>
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white bg-opacity-80 rounded-lg p-3">
                                <h6 className="font-medium text-gray-800 mb-2 text-sm">福利厚生・特徴</h6>
                                <div className="flex flex-wrap gap-1">
                                    {job.benefits.map((benefit, idx) => (
                                        <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs">
                                            {benefit}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MatchingJobList;
