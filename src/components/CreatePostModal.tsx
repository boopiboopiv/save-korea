import React, { useState } from 'react';
import { CitizenPost, IncidentCategory } from '../types';
import { CATEGORY_LABELS } from '../data/initialData';
import { X, Camera, MapPin, Check, AlertCircle, Sparkles } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Omit<CitizenPost, 'id' | 'createdAt' | 'empathyCount' | 'verifiedCount' | 'comments'>) => void;
}

const PRESET_LOCATIONS = [
  '서울 종로구 광화문광장',
  '서울 영등포구 여의도 국회의사당',
  '서울 용산구 삼각지·대통령실 앞',
  '서울 강남역 사거리',
  '부산 서면 쥬디스태화 광장',
  '대구 동성로 한일극장 앞',
  '광주 금남로 5·18민주광장',
  '대전 으능정이 문화의거리',
  '온라인·네트워크 제보'
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('witness');
  const [locationName, setLocationName] = useState('');
  const [author, setAuthor] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('이미지 파일(PNG, JPG, WEBP)만 업로드 가능합니다.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('파일 용량은 8MB 이하로 업로드해주세요.');
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setImageUrl(uploadEvent.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !locationName.trim()) {
      alert('제목, 현장 위치, 상세 내용을 모두 작성해주세요.');
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      locationName: locationName.trim(),
      author: author.trim() || '현장 시민 기자',
      urgent,
      imageUrl: imageUrl || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" />
              <span>실시간 현장 사진 &amp; 시민 제보 등록</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              언론이 다루지 않는 한국의 생생한 현실을 사진과 함께 실시간으로 전해주세요.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              분류 카테고리 <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(CATEGORY_LABELS) as IncidentCategory[]).map((catKey) => {
                const info = CATEGORY_LABELS[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-slate-900 dark:border-white bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: info.dot }} />
                    <span className="truncate">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              제보 제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 광화문 사거리 실시간 현장 상황 사진 공유합니다"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              현장 위치 / 장소 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="예: 서울 종로구 광화문광장 북측"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 mb-2"
            />
            {/* Quick preset locations */}
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500">
              <span className="text-slate-400">자주 찾는 장소:</span>
              {PRESET_LOCATIONS.slice(0, 5).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocationName(loc)}
                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded text-[11px] transition-colors"
                >
                  {loc.split(' ').pop()}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              현장 사진 첨부 (필수 추천)
            </label>

            {imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-56 bg-slate-100 group">
                <img src={imageUrl} alt="첨부 사진 미리보기" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <span className="bg-black/60 text-white text-[11px] px-2 py-0.5 rounded backdrop-blur-xs">
                    사진 첨부 완료
                  </span>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="p-1 bg-black/70 hover:bg-black text-white rounded-full text-xs"
                    title="사진 삭제"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/30">
                <Camera className="w-7 h-7 text-blue-500 mb-2" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  현장 사진 선택 또는 드래그하여 업로드
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  스마트폰 현장 촬영 사진, 캡처본 (JPG, PNG, WEBP, 최대 8MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            {errorMessage && (
              <p className="text-rose-500 text-[11px] mt-1">{errorMessage}</p>
            )}
          </div>

          {/* Content Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              현장 글 내용 <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="지금 현장에서 목격하신 실제 상황, 인원 규모, 경찰 대치 여부, 대중교통 운행 현황 등을 사실에 기반하여 자유롭게 작성해주세요."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
            />
          </div>

          {/* Author & Urgent Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="작성자 닉네임 (미입력 시 익명)"
                className="w-48 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                긴급 속보로 상단 강조 표시
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>실시간 피드에 즉시 공유하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
