import React, { useState, useEffect } from 'react';
import { MapIncident, IncidentCategory } from '../types';
import { CATEGORY_LABELS } from '../data/initialData';
import { X, Upload, MapPin, AlertCircle, Camera, Check, Image as ImageIcon } from 'lucide-react';

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: Omit<MapIncident, 'id' | 'createdAt' | 'comments' | 'verifiedCount'>) => void;
  initialCoords?: { lat: number; lng: number } | null;
}

const QUICK_LOCATIONS = [
  { name: '광화문광장', lat: 37.5759, lng: 126.9768 },
  { name: '여의도 국회의사당', lat: 37.5326, lng: 126.9142 },
  { name: '용산 삼각지', lat: 37.5345, lng: 126.9734 },
  { name: '강남역 사거리', lat: 37.4979, lng: 127.0276 },
  { name: '부산 서면광장', lat: 35.1553, lng: 129.0596 },
  { name: '광주 5·18민주광장', lat: 35.1466, lng: 126.9223 },
  { name: '대구 동성로', lat: 35.8714, lng: 128.5947 },
];

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialCoords,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('witness');
  const [locationName, setLocationName] = useState('');
  const [lat, setLat] = useState<number>(initialCoords?.lat || 37.5665);
  const [lng, setLng] = useState<number>(initialCoords?.lng || 126.9780);
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [previewError, setPreviewError] = useState('');

  useEffect(() => {
    if (initialCoords) {
      setLat(Number(initialCoords.lat.toFixed(6)));
      setLng(Number(initialCoords.lng.toFixed(6)));
      setLocationName(`위도 ${initialCoords.lat.toFixed(4)}, 경도 ${initialCoords.lng.toFixed(4)} 인근`);
    }
  }, [initialCoords]);

  // Handle image upload from file system
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPreviewError('이미지 파일(PNG, JPG, WEBP)만 업로드 가능합니다.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setPreviewError('파일 용량은 8MB 이하로 업로드해주세요.');
      return;
    }

    setPreviewError('');
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setImageUrl(uploadEvent.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectQuickLocation = (loc: typeof QUICK_LOCATIONS[0]) => {
    setLocationName(loc.name);
    setLat(loc.lat);
    setLng(loc.lng);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim() || !description.trim()) {
      alert('제목, 발생 장소, 현장 설명을 모두 입력해주세요.');
      return;
    }

    onSubmit({
      title: title.trim(),
      category,
      locationName: locationName.trim(),
      lat: Number(lat),
      lng: Number(lng),
      description: description.trim(),
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
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>지도에 사건·이슈 위치 마킹 제보하기</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              대한민국 어디서든 언론에 가려진 실제 현장 상황을 시민의 눈으로 기록합니다.
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
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              이슈 분류 <span className="text-rose-500">*</span>
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
              placeholder="예: 광화문 사거리 시민 평화 행진 및 현장 상황"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Location Name & Quick picks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              발생 장소 명칭 및 주소 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="예: 서울 종로구 세종대로 광화문광장 북측"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 mb-2"
            />
            {/* Quick picks */}
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500">
              <span className="text-slate-400">주요 거점:</span>
              {QUICK_LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => handleSelectQuickLocation(loc)}
                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded text-[11px] transition-colors"
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Coordinates display */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]">
            <div>
              <span className="text-slate-400">위도 (Latitude):</span>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                className="w-full mt-0.5 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 font-mono text-xs"
              />
            </div>
            <div>
              <span className="text-slate-400">경도 (Longitude):</span>
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                className="w-full mt-0.5 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 font-mono text-xs"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              현장 상황 및 상세 설명 <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="목격하신 사실 관계, 경찰 배치 여부, 통행 가능 여부, 시민 반응 등 현장 상황을 가감 없이 사실대로 작성해주세요."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              현장 사진 첨부 (선택)
            </label>
            
            {imageUrl ? (
              <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 max-h-44 bg-slate-100 group">
                <img src={imageUrl} alt="제보 사진 미리보기" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black text-white rounded-full text-xs"
                  title="사진 삭제"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/30">
                <Camera className="w-6 h-6 text-slate-400 mb-1.5" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  클릭하여 사진 파일 첨부
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  JPG, PNG, WEBP (최대 8MB) · 현장 증거 기록
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            {previewError && (
              <p className="text-rose-500 text-[11px] mt-1">{previewError}</p>
            )}
          </div>

          {/* Author & Urgent Checkbox */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="제보자 닉네임 (미입력 시 익명)"
                className="w-44 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
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
                긴급 속보 / 안전 유의 사항으로 등록
              </span>
            </label>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>지도에 이슈 핀 등록 및 시민 공론화</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
