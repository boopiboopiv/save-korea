import React, { useEffect } from 'react';
import { X, Download, ZoomIn } from 'lucide-react';

interface PhotoLightboxProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[700] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div className="relative max-w-5xl max-h-[92vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <div className="absolute -top-12 right-0 flex items-center gap-3">
          <a
            href={imageUrl}
            download="korea_citizen_report.jpg"
            target="_blank"
            rel="noreferrer"
            className="text-white/80 hover:text-white px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>다운로드</span>
          </a>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <img
          src={imageUrl}
          alt="현장 사진 원본"
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10 select-none"
        />
        <p className="text-white/60 text-xs mt-3">
          ESC 키 또는 배경을 누르면 닫힙니다.
        </p>
      </div>
    </div>
  );
};
