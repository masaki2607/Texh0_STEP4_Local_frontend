import React, { useState, useRef } from 'react';
import { X, Upload, User, Save, ArrowLeft } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  resume: File | null;
  orientation: string[];
  availableStartDate: string;
  workStyle: string[];
}

interface OCRResult {
  document_id: number;
  filename: string;
  status: string;
  message: string;
  extracted_text?: string;
  confidence?: number;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    resume: null,
    orientation: [],
    availableStartDate: '',
    workStyle: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // APIベースURL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  // 志向性の選択肢
  const orientationOptions = [
    'キャリアアップ重視',
    'ワークライフバランス重視', 
    '年収アップ重視',
    'スキルアップ重視',
    '安定性重視',
    'チャレンジ重視'
  ];

  // 働き方の選択肢
  const workStyleOptions = [
    'リモートワーク希望',
    'オフィス勤務希望',
    'ハイブリッド勤務希望',
    'フレックス勤務希望',
    '時短勤務希望',
    '週4日勤務希望'
  ];

  // 稼働可能時期の選択肢
  const availabilityOptions = [
    '即日可能',
    '1ヶ月以内',
    '2ヶ月以内',
    '3ヶ月以内',
    '6ヶ月以内',
    '相談の上'
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, resume: file }));
      
      // ファイルが選択された時点でOCR処理を開始
      await processOCR(file);
    }
  };

  // OCR処理を実行
  const processOCR = async (file: File) => {
    setIsProcessingOCR(true);
    setOcrResult(null);

    try {
      // 仮の求職者IDを使用してOCR処理を実行
      // 実際の実装では、求職者を先に作成するか、別のエンドポイントを使用
      const tempJobSeekerId = 999; // 仮のID
      
      const formDataForOCR = new FormData();
      formDataForOCR.append('file', file);

      console.log('OCR処理開始:', file.name);

      const response = await fetch(`${API_BASE_URL}/upload-resume/${tempJobSeekerId}`, {
        method: 'POST',
        body: formDataForOCR,
      });

      if (response.ok) {
        const result: OCRResult = await response.json();
        setOcrResult(result);
        console.log('OCR処理成功:', result);
        
        // OCR結果から求職者名を自動抽出（簡易版）
        if (result.extracted_text && !formData.name.trim()) {
          const extractedName = extractNameFromText(result.extracted_text);
          if (extractedName) {
            setFormData(prev => ({ ...prev, name: extractedName }));
          }
        }
      } else {
        const errorText = await response.text();
        console.error('OCR処理エラー:', errorText);
        alert('OCR処理に失敗しました。手動で情報を入力してください。');
      }
    } catch (error) {
      console.error('OCR処理失敗:', error);
      alert('OCR処理に失敗しました。手動で情報を入力してください。');
    } finally {
      setIsProcessingOCR(false);
    }
  };

  // テキストから名前を抽出する簡易関数
  const extractNameFromText = (text: string): string | null => {
    // 簡易的な名前抽出ロジック
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // 最初の数行から名前らしい文字列を探す
    for (const line of lines.slice(0, 5)) {
      // 日本語の名前パターンを検索
      const nameMatch = line.match(/([一-龯ひ-ゟア-ヾ]+[\s　]*[一-龯ひ-ゟア-ヾ]+)/);
      if (nameMatch && nameMatch[1].length >= 2 && nameMatch[1].length <= 10) {
        return nameMatch[1].replace(/[\s　]+/g, ' ');
      }
    }
    
    return null;
  };

  const handleCheckboxChange = (category: 'orientation' | 'workStyle', value: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('求職者氏名を入力してください。');
      return;
    }

    if (!formData.resume) {
      alert('履歴書をアップロードしてください。');
      return;
    }

    if (formData.orientation.length === 0) {
      alert('志向性を少なくとも1つ選択してください。');
      return;
    }

    if (!formData.availableStartDate) {
      alert('稼働可能時期を選択してください。');
      return;
    }

    if (formData.workStyle.length === 0) {
      alert('働き方を少なくとも1つ選択してください。');
      return;
    }

    setIsSubmitting(true);

    try {
      // FormDataを作成
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('resume', formData.resume);
      submitData.append('orientation', JSON.stringify(formData.orientation));
      submitData.append('availableStartDate', formData.availableStartDate);
      submitData.append('workStyle', JSON.stringify(formData.workStyle));

      const response = await fetch(`${API_BASE_URL}/job-seekers`, {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('求職者登録成功:', result);
        alert('求職者の登録が完了しました。');
        
        // フォームリセット
        setFormData({
          name: '',
          resume: null,
          orientation: [],
          availableStartDate: '',
          workStyle: []
        });
        setOcrResult(null);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json().catch(() => null);
        console.error('求職者登録エラー:', response.status, errorData);
        alert(`登録に失敗しました: ${errorData?.message || response.statusText}`);
      }
    } catch (error) {
      console.error('求職者登録失敗:', error);
      alert(`登録に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting || isProcessingOCR) return;
    
    // フォームデータをリセット
    setFormData({
      name: '',
      resume: null,
      orientation: [],
      availableStartDate: '',
      workStyle: []
    });
    setOcrResult(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <User className="mr-2" size={24} />
            新規求職者登録
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting || isProcessingOCR}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* フォーム内容 */}
        <div className="p-6 space-y-6">
          {/* 求職者氏名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              求職者氏名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="山田 太郎"
              disabled={isSubmitting}
            />
          </div>

          {/* ファイルアップロード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              履歴書・職務経歴書 <span className="text-red-500">*</span>
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => !isSubmitting && !isProcessingOCR && fileInputRef.current?.click()}
            >
              <Upload className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-gray-600 mb-2">
                {isProcessingOCR 
                  ? 'OCR処理中...' 
                  : formData.resume 
                    ? formData.resume.name 
                    : "ファイルをアップロード"
                }
              </p>
              <p className="text-sm text-gray-500">PDF, JPG, PNG対応</p>
              {isProcessingOCR && (
                <div className="mt-2 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-sm text-blue-600">履歴書を解析中...</span>
                </div>
              )}
              {ocrResult && (
                <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                  OCR処理完了 (信頼度: {ocrResult.confidence ? Math.round(ocrResult.confidence * 100) : 'N/A'}%)
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={isSubmitting || isProcessingOCR}
              />
            </div>
          </div>

          {/* 志向性 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              志向性 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {orientationOptions.map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.orientation.includes(option)}
                    onChange={() => handleCheckboxChange('orientation', option)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 稼働可能時期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              稼働可能時期 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.availableStartDate}
              onChange={(e) => setFormData(prev => ({ ...prev, availableStartDate: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="">稼働可能時期を選択してください</option>
              {availabilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* 働き方 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              働き方 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {workStyleOptions.map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.workStyle.includes(option)}
                    onChange={() => handleCheckboxChange('workStyle', option)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ボタン */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="mr-2" size={18} />
              戻る
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || isProcessingOCR}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  登録中...
                </>
              ) : isProcessingOCR ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  OCR処理中...
                </>
              ) : (
                <>
                  <Save className="mr-2" size={18} />
                  登録
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;