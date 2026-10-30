import React from 'react';
import { Taegeukgi } from './Taegeukgi';
import { Plus, Bell, Shield, Sun, Moon, Flame } from 'lucide-react';

interface HeaderProps {
  activeTab: 'all' | 'map' | 'timeline' | 'about';
  setActiveTab: (tab: 'all' | 'map' | 'timeline' | 'about') => void;
  onOpenCreateIncident: () => void;
  onOpenCreatePost: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  urgentHeadline?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateIncident,
  onOpenCreatePost,
  darkMode,
  setDarkMode,
  urgentHeadline = '광화문 광장 시민 언론자유 집회 및 평화 행진 진행 중 · 삼각지 일대 차벽 설치 주의',
}) => {
  return (
    <header className="sticky top-0 z-[500] w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Taegeukgi Dignity Top Ribbon */}
      <div className="bg-slate-900 text-white dark:bg-black px-4 py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          {/* Taegeukgi Flag & Official Constitutional Stance */}
          <div className="flex items-center gap-3">
            <Taegeukgi width={42} height={28} className="rounded-xs ring-1 ring-white/20 shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>대한민국 시민 실시간 신문고</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-600/90 font-mono">LIVE</span>
              </span>
              <span className="hidden lg:inline text-slate-400">|</span>
              <span className="hidden lg:inline text-slate-300 text-[11px]">
                대한민국 헌법 제21조 1항: &ldquo;모든 국민은 언론·출판의 자유와 집회·결사의 자유를 가진다.&rdquo;
              </span>
            </div>
          </div>

          {/* Quick Actions & Dark mode */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              시민 자발적 현장 언론
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-8">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <Taegeukgi width={36} height={24} className="hidden sm:inline-block rounded-xs shadow-xs" />
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('all');
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap"
          >
            대한민국 현장 상황판
          </a>
        </div>

        {/* Navigation Tabs (Single line whitespace-nowrap) */}
        <nav className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-bold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            종합 현황판
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
              activeTab === 'map'
                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-bold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            실시간 지도
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
              activeTab === 'timeline'
                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-bold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            시민 제보 타임라인
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-bold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            언론 자유 선언문
          </button>
        </nav>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenCreatePost}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            + 현장 제보하기
          </button>
        </div>
      </div>

      {/* Emergency Live Alert Ticker */}
      <div className="bg-rose-50 dark:bg-rose-950/40 border-t border-b border-rose-200 dark:border-rose-900/50 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-rose-800 dark:text-rose-300 overflow-hidden">
          <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 shrink-0">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>실시간 속보:</span>
          </span>
          <div className="truncate font-medium text-[11px] sm:text-xs">
            {urgentHeadline}
          </div>
        </div>
      </div>
    </header>
  );
};
