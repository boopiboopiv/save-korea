import React, { useState } from 'react';
import { MapIncident, CommentItem } from '../types';
import { CATEGORY_LABELS } from '../data/initialData';
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  Share2, 
  AlertTriangle, 
  Flame, 
  User, 
  Heart,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';

interface IncidentDiscussionModalProps {
  incident: MapIncident | null;
  onClose: () => void;
  onAddComment: (incidentId: string, comment: CommentItem) => void;
  onVerify: (incidentId: string) => void;
  onOpenPhotoLightbox?: (imageUrl: string) => void;
}

export const IncidentDiscussionModal: React.FC<IncidentDiscussionModalProps> = ({
  incident,
  onClose,
  onAddComment,
  onVerify,
  onOpenPhotoLightbox,
}) => {
  if (!incident) return null;

  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [hasVerified, setHasVerified] = useState(false);
  const [copied, setCopied] = useState(false);

  const category = CATEGORY_LABELS[incident.category] || {
    label: '기타 사건',
    color: 'text-slate-700',
    dot: '#64748B',
    bg: 'bg-slate-100',
  };

  const handleVerifyClick = () => {
    if (!hasVerified) {
      onVerify(incident.id);
      setHasVerified(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: `comm-${Date.now()}`,
      author: authorName.trim() || '익명 시민',
      content: commentText.trim(),
      createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      likes: 0,
    };

    onAddComment(incident.id, newComment);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: category.dot }}
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {category.label}
            </span>
            {incident.urgent && (
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-sm">
                <Flame className="w-3.5 h-3.5" /> 실시간 속보
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors"
              title="이슈 링크 복사"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨' : '공유'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Metadata */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-2.5">
              {incident.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                {incident.locationName}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {incident.createdAt}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                제보자: {incident.author}
              </span>
            </div>
          </div>

          {/* Photo if present */}
          {incident.imageUrl && (
            <div 
              className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 cursor-pointer group relative"
              onClick={() => onOpenPhotoLightbox?.(incident.imageUrl!)}
            >
              <img
                src={incident.imageUrl}
                alt={incident.title}
                className="w-full max-h-80 object-cover group-hover:scale-[1.01] transition-transform duration-200"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                클릭하여 원본 사진 크게 보기
              </div>
            </div>
          )}

          {/* Main Description */}
          <div className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            {incident.description}
          </div>

          {/* Verification & Citizen Credibility Action */}
          <div className="flex items-center justify-between p-3.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                  현장 검증 참여
                </p>
                <p className="text-[11px] text-blue-700 dark:text-blue-300">
                  실제 이 장소에 계시거나 현장 상황을 직접 목격하셨다면 확인을 눌러주세요.
                </p>
              </div>
            </div>
            <button
              onClick={handleVerifyClick}
              disabled={hasVerified}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
                hasVerified
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{hasVerified ? '현장 확인 완료' : '나도 현장 확인'}</span>
              <span className="ml-1 px-1.5 py-0.2 bg-black/20 rounded text-[11px] font-mono tabular-nums">
                {incident.verifiedCount}
              </span>
            </button>
          </div>

          {/* Discussion Thread Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>현장 토론 및 시민 발언 ({incident.comments.length})</span>
              </h3>
              <span className="text-xs text-slate-400">
                실시간 업데이트 지원
              </span>
            </div>

            {/* Comment List */}
            <div className="space-y-3 mb-4">
              {incident.comments.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  아직 등록된 시민 의견이 없습니다. 첫 번째 현장 소식을 남겨보세요.
                </div>
              ) : (
                incident.comments.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {comm.author}
                      </span>
                      <span className="text-slate-400 text-[11px] font-mono">
                        {comm.createdAt}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {comm.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* New Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="닉네임 (미입력 시 익명)"
                  className="w-40 px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg border border-transparent focus:border-blue-500 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400">
                  검열 없이 자유롭게 현장 목격담을 나눌 수 있습니다.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <textarea
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="현장 상황이나 목격한 사실, 의견을 남겨주세요..."
                  className="flex-1 px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg border border-transparent focus:border-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors shrink-0 h-14"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>등록</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
