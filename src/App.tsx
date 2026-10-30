import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KoreaMap } from './components/KoreaMap';
import { TimelineFeed } from './components/TimelineFeed';
import { IncidentDiscussionModal } from './components/IncidentDiscussionModal';
import { CreateIncidentModal } from './components/CreateIncidentModal';
import { CreatePostModal } from './components/CreatePostModal';
import { PhotoLightbox } from './components/PhotoLightbox';
import { AboutDeclaration } from './components/AboutDeclaration';
import { MapIncident, CitizenPost, CommentItem } from './types';
import { INITIAL_INCIDENTS, INITIAL_POSTS } from './data/initialData';
import { 
  MapPin, 
  Camera, 
  Flame, 
  ShieldCheck, 
  Users, 
  Activity, 
  PlusCircle, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const STORAGE_INCIDENTS_KEY = 'korea_citizen_incidents_v1';
const STORAGE_POSTS_KEY = 'korea_citizen_posts_v1';

export default function App() {
  const [incidents, setIncidents] = useState<MapIncident[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_INCIDENTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });

  const [posts, setPosts] = useState<CitizenPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POSTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [activeTab, setActiveTab] = useState<'all' | 'map' | 'timeline' | 'about'>('all');
  const [selectedIncident, setSelectedIncident] = useState<MapIncident | null>(null);
  const [isCreateIncidentOpen, setIsCreateIncidentOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [initialCoordsForNewPin, setInitialCoordsForNewPin] = useState<{ lat: number; lng: number } | null>(null);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_INCIDENTS_KEY, JSON.stringify(incidents));
    } catch (e) {
      console.warn('LocalStorage save failed for incidents', e);
    }
  }, [incidents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
    } catch (e) {
      console.warn('LocalStorage save failed for posts', e);
    }
  }, [posts]);

  // Handler: Request adding pin at map coordinate
  const handleRequestAddIncidentAt = (lat: number, lng: number) => {
    setInitialCoordsForNewPin({ lat, lng });
    setIsCreateIncidentOpen(true);
  };

  // Handler: Add new incident to map & also create a corresponding timeline post
  const handleAddIncident = (
    newIncidentData: Omit<MapIncident, 'id' | 'createdAt' | 'comments' | 'verifiedCount'>
  ) => {
    const newId = `inc-${Date.now()}`;
    const nowStr = new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const createdIncident: MapIncident = {
      ...newIncidentData,
      id: newId,
      createdAt: nowStr,
      verifiedCount: 1,
      comments: [],
    };

    setIncidents((prev) => [createdIncident, ...prev]);

    // Also sync as a timeline post so everyone sees it in the feed
    const createdPost: CitizenPost = {
      id: `post-from-inc-${Date.now()}`,
      author: newIncidentData.author,
      title: newIncidentData.title,
      content: newIncidentData.description,
      category: newIncidentData.category,
      locationName: newIncidentData.locationName,
      lat: newIncidentData.lat,
      lng: newIncidentData.lng,
      imageUrl: newIncidentData.imageUrl,
      createdAt: nowStr,
      empathyCount: 1,
      verifiedCount: 1,
      urgent: newIncidentData.urgent,
      comments: [],
    };

    setPosts((prev) => [createdPost, ...prev]);
    setSelectedIncident(createdIncident);
  };

  // Handler: Add new citizen timeline post
  const handleAddPost = (
    newPostData: Omit<CitizenPost, 'id' | 'createdAt' | 'empathyCount' | 'verifiedCount' | 'comments'>
  ) => {
    const nowStr = new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newPost: CitizenPost = {
      ...newPostData,
      id: `post-${Date.now()}`,
      createdAt: nowStr,
      empathyCount: 1,
      verifiedCount: 1,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  // Handler: Add comment to map incident
  const handleAddIncidentComment = (incidentId: string, comment: CommentItem) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const updated = { ...inc, comments: [...inc.comments, comment] };
          if (selectedIncident?.id === incidentId) {
            setSelectedIncident(updated);
          }
          return updated;
        }
        return inc;
      })
    );
  };

  // Handler: Add comment to timeline post
  const handleAddPostComment = (postId: string, comment: CommentItem) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, comments: [...post.comments, comment] };
        }
        return post;
      })
    );
  };

  // Handler: Verify incident
  const handleVerifyIncident = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const updated = { ...inc, verifiedCount: inc.verifiedCount + 1 };
          if (selectedIncident?.id === incidentId) {
            setSelectedIncident(updated);
          }
          return updated;
        }
        return inc;
      })
    );
  };

  // Handler: Empathy on post
  const handleEmpathyPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, empathyCount: post.empathyCount + 1 } : post))
    );
  };

  // Handler: Verify post
  const handleVerifyPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, verifiedCount: post.verifiedCount + 1 } : post))
    );
  };

  // Jump from timeline to map
  const handleJumpToMap = (locationName: string, lat?: number, lng?: number) => {
    if (lat && lng) {
      const match = incidents.find(
        (i) => Math.abs(i.lat - lat) < 0.01 && Math.abs(i.lng - lng) < 0.01
      );
      if (match) {
        setSelectedIncident(match);
      }
    }
    setActiveTab('map');
  };

  // Restore imported data
  const handleImportData = (newIncidents: MapIncident[], newPosts: CitizenPost[]) => {
    setIncidents(newIncidents);
    setPosts(newPosts);
  };

  // Urgent headline calculation
  const urgentIncident = incidents.find((i) => i.urgent);
  const urgentHeadline = urgentIncident
    ? `[${urgentIncident.locationName}] ${urgentIncident.title}`
    : '전국 시민 제보 현황 실시간 업데이트 중 · 언론 검열 없는 열린 광장';

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Taegeukgi Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateIncident={() => {
          setInitialCoordsForNewPin(null);
          setIsCreateIncidentOpen(true);
        }}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        urgentHeadline={urgentHeadline}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {/* KPI / Live Situation Statistics Strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">지도 등록 사건 핀</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                {incidents.length}
                <span className="text-xs font-normal text-slate-400 ml-1">곳</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">실시간 사진 제보글</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                {posts.length}
                <span className="text-xs font-normal text-slate-400 ml-1">건</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">시민 현장 교차 검증</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                {incidents.reduce((acc, curr) => acc + curr.verifiedCount, 0)}
                <span className="text-xs font-normal text-slate-400 ml-1">회</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">긴급 속보 및 대치</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-0.5">
                {incidents.filter((i) => i.urgent).length}
                <span className="text-xs font-normal text-slate-400 ml-1">건</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
        </section>

        {/* View Switch: All (Comprehensive 2-Column) */}
        {activeTab === 'all' && (
          <div className="space-y-6">
            {/* Top Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  대한민국 실시간 이슈 지도 &amp; 시민 제보 타임라인
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setInitialCoordsForNewPin(null);
                    setIsCreateIncidentOpen(true);
                  }}
                  className="px-3 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold rounded-lg hover:opacity-90 flex items-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>지도에 사건 핀 꽂기</span>
                </button>
                <button
                  onClick={() => setIsCreatePostOpen(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>사진 제보글 작성</span>
                </button>
              </div>
            </div>

            {/* Side-by-side or stacked Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Map (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    전국 실시간 이슈 핀 지도
                  </span>
                  <span className="text-slate-400">
                    지도 상 원하는 지점을 직접 클릭하여 핀을 꽂을 수 있습니다.
                  </span>
                </div>

                <KoreaMap
                  incidents={incidents}
                  selectedIncident={selectedIncident}
                  onSelectIncident={setSelectedIncident}
                  onRequestAddIncidentAt={handleRequestAddIncidentAt}
                  onOpenCreateModal={() => {
                    setInitialCoordsForNewPin(null);
                    setIsCreateIncidentOpen(true);
                  }}
                />
              </div>

              {/* Right Column: Citizen Timeline Feed (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    실시간 시민 현장 피드
                  </span>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className="text-blue-600 hover:underline"
                  >
                    피드 크게 보기 &rarr;
                  </button>
                </div>

                <TimelineFeed
                  posts={posts}
                  onAddPostComment={handleAddPostComment}
                  onEmpathyPost={handleEmpathyPost}
                  onVerifyPost={handleVerifyPost}
                  onOpenCreateModal={() => setIsCreatePostOpen(true)}
                  onSelectMapLocation={handleJumpToMap}
                  onOpenPhotoLightbox={setLightboxImageUrl}
                />
              </div>
            </div>
          </div>
        )}

        {/* View Switch: Map Focus */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>전국 실시간 이슈 &amp; 현장 상황 지도</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  핀을 클릭하여 토론에 참여하거나, &lsquo;지도에 핀 꽂아 제보하기&rsquo;를 눌러 새 위치를 마킹하세요.
                </p>
              </div>

              <button
                onClick={() => {
                  setInitialCoordsForNewPin(null);
                  setIsCreateIncidentOpen(true);
                }}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold hover:opacity-90 flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>새로운 사건 핀 꽂기</span>
              </button>
            </div>

            <KoreaMap
              incidents={incidents}
              selectedIncident={selectedIncident}
              onSelectIncident={setSelectedIncident}
              onRequestAddIncidentAt={handleRequestAddIncidentAt}
              onOpenCreateModal={() => {
                setInitialCoordsForNewPin(null);
                setIsCreateIncidentOpen(true);
              }}
            />
          </div>
        )}

        {/* View Switch: Timeline Focus */}
        {activeTab === 'timeline' && (
          <div className="max-w-3xl mx-auto">
            <TimelineFeed
              posts={posts}
              onAddPostComment={handleAddPostComment}
              onEmpathyPost={handleEmpathyPost}
              onVerifyPost={handleVerifyPost}
              onOpenCreateModal={() => setIsCreatePostOpen(true)}
              onSelectMapLocation={handleJumpToMap}
              onOpenPhotoLightbox={setLightboxImageUrl}
            />
          </div>
        )}

        {/* View Switch: Declaration / Constitution & Backup */}
        {activeTab === 'about' && (
          <AboutDeclaration
            incidents={incidents}
            posts={posts}
            onImportData={handleImportData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              대한민국 시민 실시간 신문고
            </span>
            <span>·</span>
            <span>검열 없는 사실 기록과 열린 참여 광장</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('about')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              언론자유 선언문 &amp; 데이터 백업
            </button>
            <span>·</span>
            <span>대한민국 헌법 제21조 수호</span>
          </div>
        </div>
      </footer>

      {/* Modal: Incident Discussion & Comments */}
      <IncidentDiscussionModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onAddComment={handleAddIncidentComment}
        onVerify={handleVerifyIncident}
        onOpenPhotoLightbox={setLightboxImageUrl}
      />

      {/* Modal: Create Incident Pin on Map */}
      <CreateIncidentModal
        isOpen={isCreateIncidentOpen}
        onClose={() => {
          setIsCreateIncidentOpen(false);
          setInitialCoordsForNewPin(null);
        }}
        onSubmit={handleAddIncident}
        initialCoords={initialCoordsForNewPin}
      />

      {/* Modal: Create Post with Photo */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmit={handleAddPost}
      />

      {/* Modal: Photo Lightbox */}
      <PhotoLightbox
        imageUrl={lightboxImageUrl}
        onClose={() => setLightboxImageUrl(null)}
      />
    </div>
  );
}
