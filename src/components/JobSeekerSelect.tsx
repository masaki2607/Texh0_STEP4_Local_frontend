import React, { useState } from 'react';
import { Search, Plus, Users } from 'lucide-react';
import Modal from './modal';
import { JobSeeker } from '@/types';

interface JobSeekerPanelProps {
    jobSeekers: JobSeeker[];
    selectedJobSeeker: string;
    setSelectedJobSeeker: (value: string) => void;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    onModalSuccess: () => void;
}

const JobSeekerPanel: React.FC<JobSeekerPanelProps> = ({
    jobSeekers,
    selectedJobSeeker,
    setSelectedJobSeeker,
    searchTerm,
    setSearchTerm,
    onModalSuccess
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 求職者の検索
    const filteredJobSeekers = jobSeekers.filter(jobSeeker =>
        jobSeeker.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                    <Users className="mr-2" size={20} />
                    求職者選択
                </h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="relative mb-3">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="求職者を検索..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                value={selectedJobSeeker}
                onChange={(e) => setSelectedJobSeeker(e.target.value)}
            >
                <option value="">求職者を選択してください</option>
                {filteredJobSeekers.map(jobSeeker => (
                    <option key={jobSeeker.id} value={jobSeeker.name}>
                        {jobSeeker.name}
                    </option>
                ))}
            </select>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={onModalSuccess}
            />
        </div>
    );
};

export default JobSeekerPanel;