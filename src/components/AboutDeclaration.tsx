import React from 'react';
import { Taegeukgi } from './Taegeukgi';
import { Shield, BookOpen, AlertCircle, Eye, Download, Upload, CheckCircle2 } from 'lucide-react';
import { MapIncident, CitizenPost } from '../types';

interface AboutDeclarationProps {
  incidents: MapIncident[];
  posts: CitizenPost[];
  onImportData: (incidents: MapIncident[], posts: CitizenPost[]) => void;
}

export const AboutDeclaration: React.FC<AboutDeclarationProps> = ({
  incidents,
  posts,
  onImportData,
}) => {
  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      incidents,
      posts,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `korea_citizen_records_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.incidents) && Array.isArray(parsed.posts)) {
          onImportData(parsed.incidents, parsed.posts);
          alert('시민 제보 아카이브 데이터를 성공적으로 복원했습니다.');
        } else {
          alert('올바른 아카이브 파일 형식이 아닙니다.');
        }
      } catch (err) {
        alert('데이터 파일을 불러오는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Hero Declaration Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Taegeukgi width={120} height={80} className="shadow-md rounded" />
          
          <div className="space-y-1">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 tracking-wider">
              대한민국 헌법 수호 시민 선언
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              진실은 침묵하지 않는다 · 시민 언론 신문고
            </h1>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            기성 언론의 통제와 보도 왜곡에 맞서, 주권자인 국민이 직접 대한민국의 실제 현장을 기록하고 증언합니다.
            우리의 목격과 기록은 그 어떤 권력도 삭제하거나 왜곡할 수 없습니다.
          </p>
        </div>

        {/* Constitutional Articles Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              대한민국 헌법 제1조 2항
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-serif">
              &ldquo;대한민국의 주권은 국민에게 있고, 모든 권력은 국민으로부터 나온다.&rdquo;
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-rose-600" />
              대한민국 헌법 제21조 1항 및 2항
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-serif">
              &ldquo;모든 국민은 언론·출판의 자유와 집회·결사의 자유를 가진다. 언론·출판에 대한 허가나 검열과 집회·결사에 대한 허가는 인정되지 아니한다.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* 5 Principles of Citizen Journalism */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>시민 현장 기록 및 참여 5대 원칙</span>
        </h2>

        <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
              01. 사실(Fact)에 기반한 객관적 현장 기록
            </span>
            목격한 장소, 시각, 상황을 있는 그대로 전달하며 근거 없는 루머나 추측성 주장은 지양합니다.
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
              02. 사진과 위치를 통한 집단적 현장 검증
            </span>
            현장 사진 및 좌표를 첨부하여 다수의 시민이 현장 상황을 함께 확인하고 교차 검증합니다.
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
              03. 시민 안전 및 익명성 보장
            </span>
            개인 신상정보를 요구하지 않으며, 제보자의 안전과 발언의 자유를 최우선으로 보호합니다.
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
              04. 평화적 의사 표현과 민주적 토론
            </span>
            모든 집회와 시민 행동은 비폭력 평화의 원칙을 견지하며, 서로 다른 목소리에도 귀를 기울입니다.
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
              05. 검열 방지와 분산 아카이빙
            </span>
            기록된 시민 제보 데이터는 언제든 시민 누구나 로컬에 백업(Export)하여 진실의 소실을 막습니다.
          </div>
        </div>
      </div>

      {/* Citizen Data Backup & Resilience Panel */}
      <div className="bg-slate-900 text-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>시민 분산 기록 백업 (검열 대비 데이터 보존)</span>
          </h3>
          <p className="text-xs text-slate-300">
            현재 등록된 {incidents.length}건의 위치 사건과 {posts.length}건의 시민 제보글을 JSON 파일로 즉시 백업할 수 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportData}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>전체 데이터 백업 (JSON)</span>
          </button>

          <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700">
            <Upload className="w-3.5 h-3.5" />
            <span>데이터 복원</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
