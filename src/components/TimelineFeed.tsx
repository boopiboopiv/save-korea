import React, { useState } from 'react';
import { CitizenPost, CommentItem } from '../types';
import { CATEGORY_LABELS } from '../data/initialData';
import { 
  Camera, 
  MapPin, 
  Heart, 
  CheckCircle2, 
  MessageSquare, 
  Share2, 
  Send, 
  Flame, 
  Clock, 
  User, 
  Search, 
  Check, 
  Image as ImageIcon,
  Plus
} from 'lucide-react';

interface TimelineFeedProps {
  posts: CitizenPost[];
  onAddPostComment: (postId: string, comment: CommentItem) => void;
  onEmpathyPost: (postId: string) => void;
  onVerifyPost: (postId: string) => void;
  onOpenCreateModal: () => void;
  onSelectMapLocation?: (locationName: string, lat?: number, lng?: number) => void;
  onOpenPhotoLightbox: (imageUrl: string) => void;
}

export const TimelineFeed: React.FC<TimelineFeedProps> = ({
  posts,
  onAddPostComment,
  onEmpathyPost,
  onVerifyPost,
  onOpenCreateModal,
  onSelectMapLocation,
  onOpenPhotoLightbox,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'urgent' | 'photo' | 'verified'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentAuthors, setCommentAuthors] = useState<Record<string, string>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [verifiedPosts, setVerifiedPosts] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleLike = (postId: string) => {
    if (!likedPosts[postId]) {
      onEmpathyPost(postId);
      setLikedPosts((prev) => ({ ...prev, [postId]: true }));
    }
  };

  const handleVerify = (postId: string) => {
    if (!verifiedPosts[postId]) {
      onVerifyPost(postId);
      setVerifiedPosts((prev) => ({ ...prev, [postId]: true }));
    }
  };

  const handleCopyLink = (postId: string) => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedId(postId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmitComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const author = commentAuthors[postId]?.trim() || '시민 독자';
    const newComment: CommentItem = {
      id: `pc-${Date.now()}`,
      author,
      content: text,
      createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      likes: 0,
    };

    onAddPostComment(postId, newComment);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    // category filter
    if (selectedCategory !== 'all' && post.category !== selectedCategory) {
      return false;
    }

    // sub filter
    if (selectedFilter === 'urgent' && !post.urgent) return false;
    if (selectedFilter === 'photo' && !post.imageUrl) return false;
    if (selectedFilter === 'verified' && post.verifiedCount < 50) return false;

    // search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.locationName.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Callout for Real-Time Dispatch */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              실시간 시민 현장 피드 (Real-time Citizen Timeline)
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            주류 언론의 필터 없이, 국민 누구나 현장 사진과 실제 상황을 실시간으로 기록하고 전파합니다.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>지금 현장 사진·글 제보하기</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              전체 피드 ({posts.length})
            </button>
            <button
              onClick={() => setSelectedFilter('urgent')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedFilter === 'urgent'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>긴급 속보</span>
            </button>
            <button
              onClick={() => setSelectedFilter('photo')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedFilter === 'photo'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>사진 제보만</span>
            </button>
            <button
              onClick={() => setSelectedFilter('verified')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedFilter === 'verified'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>현장 다수 확인</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px] max-w-xs flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="피드 내용, 작성자, 위치 검색..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap text-[11px] mr-1">분류:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            전체
          </button>
          {Object.entries(CATEGORY_LABELS).map(([catKey, cat]) => (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-2.5 py-1 rounded text-xs whitespace-nowrap flex items-center gap-1 transition-colors ${
                selectedCategory === catKey
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.dot }} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <Camera className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              해당하는 실시간 제보글이 없습니다
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              직접 첫 번째 현장 사진과 소식을 공유해보세요.
            </p>
            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold rounded-lg hover:opacity-90"
            >
              현장 제보 작성하기
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const cat = CATEGORY_LABELS[post.category] || {
              label: '일반 소식',
              dot: '#64748B',
            };
            const isCommentsOpen = !!expandedComments[post.id];
            const isLiked = !!likedPosts[post.id];
            const isVerified = !!verifiedPosts[post.id];

            return (
              <article
                key={post.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="p-5 space-y-3.5">
                  {/* Post Top Metadata Bar */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs">
                        {post.author.slice(0, 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {post.author}
                          </span>
                          <span className="text-slate-400 text-[11px] font-mono">
                            {post.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.dot }} />
                        {cat.label}
                      </span>
                      {post.urgent && (
                        <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Flame className="w-3 h-3" /> 속보
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Location Tag */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-1.5">
                      {post.title}
                    </h3>
                    <button
                      onClick={() => onSelectMapLocation?.(post.locationName, post.lat, post.lng)}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      title="지도로 위치 확인하기"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{post.locationName}</span>
                      <span className="text-[11px] text-slate-400">(지도 보기)</span>
                    </button>
                  </div>

                  {/* Body Text */}
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Attached Photo */}
                  {post.imageUrl && (
                    <div
                      className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 cursor-pointer group relative max-h-96"
                      onClick={() => onOpenPhotoLightbox(post.imageUrl!)}
                    >
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white text-[11px] rounded-md flex items-center gap-1 pointer-events-none">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>확대 보기</span>
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2 sm:gap-4">
                      {/* Empathy Button */}
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                          isLiked
                            ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                        <span>공감해요</span>
                        <span className="font-mono tabular-nums text-[11px]">
                          {post.empathyCount + (isLiked ? 1 : 0)}
                        </span>
                      </button>

                      {/* On-site Verified Button */}
                      <button
                        onClick={() => handleVerify(post.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                          isVerified
                            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>현장 확인</span>
                        <span className="font-mono tabular-nums text-[11px]">
                          {post.verifiedCount + (isVerified ? 1 : 0)}
                        </span>
                      </button>

                      {/* Comment Toggle */}
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        <span>댓글</span>
                        <span className="font-mono tabular-nums text-[11px]">
                          {post.comments.length}
                        </span>
                      </button>
                    </div>

                    {/* Share */}
                    <button
                      onClick={() => handleCopyLink(post.id)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                      title="게시글 링크 복사"
                    >
                      {copiedId === post.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[11px] text-emerald-600">복사됨</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">공유</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Inline Comments Section */}
                  {isCommentsOpen && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-150">
                      {/* Comments list */}
                      {post.comments.length > 0 && (
                        <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                          {post.comments.map((comm) => (
                            <div key={comm.id} className="text-xs space-y-0.5">
                              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  {comm.author}
                                </span>
                                <span className="text-[11px] font-mono">{comm.createdAt}</span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {comm.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comment Input */}
                      <form onSubmit={(e) => handleSubmitComment(post.id, e)} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={commentAuthors[post.id] || ''}
                          onChange={(e) => setCommentAuthors((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="닉네임"
                          className="w-24 px-2.5 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="현장 의견이나 격려를 남겨주세요..."
                          className="flex-1 px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={!commentInputs[post.id]?.trim()}
                          className="px-3 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold rounded-md hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
