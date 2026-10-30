import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapIncident, IncidentCategory } from '../types';
import { CATEGORY_LABELS } from '../data/initialData';
import { 
  MapPin, 
  Plus, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Crosshair, 
  Search, 
  ChevronRight,
  Filter,
  Flame
} from 'lucide-react';

interface KoreaMapProps {
  incidents: MapIncident[];
  selectedIncident: MapIncident | null;
  onSelectIncident: (incident: MapIncident | null) => void;
  onRequestAddIncidentAt: (lat: number, lng: number) => void;
  onOpenCreateModal: () => void;
}

const REGION_PRESETS = [
  { name: '전국', center: [36.2, 127.8] as [number, number], zoom: 7 },
  { name: '서울·수도권', center: [37.5665, 126.9780] as [number, number], zoom: 11 },
  { name: '부산·경남', center: [35.1796, 129.0756] as [number, number], zoom: 11 },
  { name: '대구·경북', center: [35.8714, 128.6014] as [number, number], zoom: 11 },
  { name: '광주·호남', center: [35.1595, 126.8526] as [number, number], zoom: 11 },
  { name: '대전·충청', center: [36.3504, 127.3845] as [number, number], zoom: 11 },
  { name: '제주', center: [33.4996, 126.5312] as [number, number], zoom: 10 },
];

export const KoreaMap: React.FC<KoreaMapProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  onRequestAddIncidentAt,
  onOpenCreateModal,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const [isPinDropMode, setIsPinDropMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('전국');

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center of South Korea
    const map = L.map(mapContainerRef.current, {
      center: [36.2, 127.8],
      zoom: 7,
      minZoom: 6,
      maxZoom: 18,
      zoomControl: false,
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle click on map for pin dropping
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (isPinDropMode) {
        const { lat, lng } = e.latlng;
        onRequestAddIncidentAt(lat, lng);
        setIsPinDropMode(false);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isPinDropMode, onRequestAddIncidentAt]);

  // Update markers when incidents, category, or search changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const filtered = incidents.filter(inc => {
      const matchCat = selectedCategory === 'all' || inc.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    filtered.forEach(inc => {
      const catConfig = CATEGORY_LABELS[inc.category] || { dot: '#E11D48', label: '기타' };
      const isSelected = selectedIncident?.id === inc.id;

      // Custom HTML Marker Pin
      const pinHtml = `
        <div class="relative group cursor-pointer transform transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-10'}">
          ${inc.urgent ? `
            <span class="absolute -inset-1.5 rounded-full animate-ping opacity-75" style="background-color: ${catConfig.dot};"></span>
          ` : ''}
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 ${isSelected ? 'border-amber-400 ring-4 ring-amber-400/30' : 'border-white'}" style="background-color: ${catConfig.dot};">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-800 rounded-full opacity-60"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-map-pin',
        iconSize: [32, 36],
        iconAnchor: [16, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([inc.lat, inc.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectIncident(inc);
        map.panTo([inc.lat, inc.lng], { animate: true, duration: 0.5 });
      });

      marker.addTo(markersGroup);
    });
  }, [incidents, selectedCategory, searchQuery, selectedIncident, onSelectIncident]);

  // Jump to selected incident if changed outside map
  useEffect(() => {
    if (selectedIncident && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedIncident.lat, selectedIncident.lng], 14, {
        animate: true,
      });
    }
  }, [selectedIncident]);

  const handleRegionChange = (region: typeof REGION_PRESETS[0]) => {
    setActiveRegion(region.name);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(region.center, region.zoom, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-[620px] lg:h-[720px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm flex flex-col">
      {/* Top Map Control Bar */}
      <div className="relative z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Search & Category selector */}
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="장소명, 사건명, 키워드 검색..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              전체 ({incidents.length})
            </button>
            {Object.entries(CATEGORY_LABELS).map(([catKey, cat]) => {
              const count = incidents.filter(i => i.category === catKey).length;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    selectedCategory === catKey
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.dot }} />
                  <span>{cat.label}</span>
                  <span className="text-[11px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Pin Dropping Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPinDropMode(!isPinDropMode)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all shadow-sm ${
              isPinDropMode
                ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            title="지도 상 원하는 지점을 직접 클릭하여 사건/이슈를 마킹합니다"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{isPinDropMode ? '지도에서 위치를 클릭하세요' : '지도에 핀 꽂아 제보하기'}</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>직접 제보글 작성</span>
          </button>
        </div>
      </div>

      {/* Region Presets Ribbon */}
      <div className="relative z-[399] bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-1.5 border-b border-slate-200 dark:border-slate-700/60 flex items-center gap-1.5 overflow-x-auto text-xs text-slate-600 dark:text-slate-300">
        <span className="text-slate-400 font-medium whitespace-nowrap text-[11px] mr-1 flex items-center gap-1">
          <Layers className="w-3 h-3" /> 주요 권역 바로가기:
        </span>
        {REGION_PRESETS.map((region) => (
          <button
            key={region.name}
            onClick={() => handleRegionChange(region)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
              activeRegion === region.name
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'hover:bg-white/60 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-400'
            }`}
          >
            {region.name}
          </button>
        ))}
      </div>

      {/* Pin Drop Mode Banner Notification */}
      {isPinDropMode && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[500] bg-rose-600 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 text-xs font-medium animate-bounce pointer-events-none">
          <Crosshair className="w-4 h-4" />
          <span>지도의 원하는 사건 발생 지점을 마우스로 클릭하면 제보창이 열립니다.</span>
        </div>
      )}

      {/* Main Leaflet Map Viewport */}
      <div 
        ref={mapContainerRef} 
        className={`flex-1 w-full h-full ${isPinDropMode ? 'cursor-crosshair' : 'cursor-grab'}`}
      />

      {/* Floating Incident Drawer / Card (when an incident is selected) */}
      {selectedIncident && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 z-[500] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 transition-all animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: CATEGORY_LABELS[selectedIncident.category]?.dot || '#DC2626' }}
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {CATEGORY_LABELS[selectedIncident.category]?.label}
              </span>
              {selectedIncident.urgent && (
                <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                  <Flame className="w-3 h-3" /> 속보
                </span>
              )}
            </div>
            <button
              onClick={() => onSelectIncident(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ✕ 닫기
            </button>
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-1 line-clamp-2">
            {selectedIncident.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {selectedIncident.locationName}
            </span>
            <span>·</span>
            <span>{selectedIncident.createdAt}</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3 line-clamp-3">
            {selectedIncident.description}
          </p>

          {selectedIncident.imageUrl && (
            <div className="mb-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 max-h-36 bg-slate-100">
              <img
                src={selectedIncident.imageUrl}
                alt={selectedIncident.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-mono tabular-nums">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                현장 확인 {selectedIncident.verifiedCount}
              </span>
              <span className="flex items-center gap-1 font-mono tabular-nums">
                <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                댓글 {selectedIncident.comments.length}
              </span>
            </div>

            <button
              onClick={() => {
                // Focus on discussion drawer or modal
                onSelectIncident(selectedIncident);
              }}
              className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/60 font-medium flex items-center gap-1 transition-colors"
            >
              <span>토론 광장 열기</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
