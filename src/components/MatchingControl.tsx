import React from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { ProcessingStatus } from '@/types';

interface MatchingControlsProps {
    isAnalyzing: boolean;
    selectedJobSeeker: string;
    processingStatus: ProcessingStatus;
    onStartMatching: () => void;
    onReset: () => void;
}

const MatchingControls: React.FC<MatchingControlsProps> = ({
    isAnalyzing,
    selectedJobSeeker,
    processingStatus,
    onStartMatching,
    onReset
}) => {
    return (
        <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
                <button
                    onClick={onStartMatching}
                    disabled={!selectedJobSeeker || isAnalyzing || processingStatus.status === 'processing'}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAnalyzing || processingStatus.status === 'processing' ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            処理中...
                        </>
                    ) : (
                        <>
                            <Play className="mr-2" size={18} />
                            マッチング
                        </>
                    )}
                </button>
                <button
                    onClick={onReset}
                    className="bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-600 transition-colors"
                    title="選択内容をリセット"
                >
                    <RotateCcw size={18} />
                </button>
            </div>
        </div>
    );
};

export default MatchingControls;