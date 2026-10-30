import { MapIncident, CitizenPost } from '../types';

export const INITIAL_INCIDENTS: MapIncident[] = [
  {
    id: 'inc-1',
    title: '광화문 광장 시민 언론자유 수호 집회 및 촛불 행진',
    category: 'rally',
    locationName: '서울 종로구 광화문광장',
    lat: 37.5759,
    lng: 126.9768,
    description: '공영방송 및 독립 언론사 취재진에 대한 징계 및 보도 압박에 반대하여 수천 명의 시민과 언론인들이 광화문에 모여 촛불을 켜고 평화 행진을 진행 중입니다. 현장 통신이 간헐적으로 지연되고 있습니다.',
    createdAt: '2026-10-29 17:40',
    author: '광화문시민기록단',
    imageUrl: '/src/assets/images/gwanghwamun_rally_1793322499206.jpg',
    verifiedCount: 142,
    urgent: true,
    comments: [
      {
        id: 'c-1',
        author: '종로주민',
        content: '현재 세종대로 방면 교통은 통제되고 있으나 행진은 평화롭고 질서정연하게 이어지고 있습니다.',
        createdAt: '2026-10-29 17:52',
        likes: 38
      },
      {
        id: 'c-2',
        author: '독립미디어팀',
        content: '기성 방송사 중계차는 보이지 않고 시민 유튜버들과 독립 기자들만 라이브 송출 중입니다.',
        createdAt: '2026-10-29 18:01',
        likes: 64
      }
    ]
  },
  {
    id: 'inc-2',
    title: '여의도 국회의사당 정문 앞 언론자유 수호 촉구 비상 기자회견',
    category: 'press',
    locationName: '서울 영등포구 여의도동 국회의사당',
    lat: 37.5326,
    lng: 126.9142,
    description: '현업 언론인 단체 및 시민사회 대표들이 국회 정문 앞에서 정부의 보도 지침 의혹 및 방송통신 심의 규제 강화에 항의하는 공동 기자회견을 열었습니다.',
    createdAt: '2026-10-29 16:15',
    author: '바른언론실천연대',
    imageUrl: '/src/assets/images/press_briefing_1793322501074.jpg',
    verifiedCount: 89,
    urgent: false,
    comments: [
      {
        id: 'c-3',
        author: '여의도직장인',
        content: '국회 정문 쪽 취재진들 열기가 뜨겁습니다. 성명서 전문 공유 부탁드립니다.',
        createdAt: '2026-10-29 16:30',
        likes: 21
      }
    ]
  },
  {
    id: 'inc-3',
    title: '용산 삼각지역 및 대통령실 진입로 차벽 및 펜스 배치',
    category: 'police',
    locationName: '서울 용산구 삼각지역 11번 출구 앞',
    lat: 37.5345,
    lng: 126.9734,
    description: '삼각지역 일대와 이태원로 주변에 경찰 펜스와 기동대 버스가 길게 배치되었습니다. 시민 보행로가 좁아져 이동에 유의 바랍니다.',
    createdAt: '2026-10-29 15:30',
    author: '용산현장제보',
    imageUrl: '/src/assets/images/police_cordon_1793322501010.jpg',
    verifiedCount: 63,
    urgent: true,
    comments: [
      {
        id: 'c-4',
        author: '퇴근길시민',
        content: '지하철 삼각지역 출구 일부가 통제되고 있으니 6호선 이용자분들은 다른 출구 확인하세요.',
        createdAt: '2026-10-29 16:05',
        likes: 19
      }
    ]
  },
  {
    id: 'inc-4',
    title: '여의도 잔디마당 시민 참여 자유 발언대 진행 현황',
    category: 'witness',
    locationName: '서울 영등포구 여의도공원 및 잔디마당',
    lat: 37.5284,
    lng: 126.9248,
    description: '일반 직장인, 대학생, 은퇴 교사 등 다양한 시민들이 마이크를 잡고 최근 민생 물가와 언론 상황에 대해 자유롭게 5분 발언을 이어가고 있습니다.',
    createdAt: '2026-10-29 17:10',
    author: '자유시민기록자',
    imageUrl: '/src/assets/images/assembly_plaza_1793322500989.jpg',
    verifiedCount: 75,
    urgent: false,
    comments: [
      {
        id: 'c-5',
        author: '청년발언자',
        content: '현장 분위기가 매우 따뜻하고 발언 신청도 현장에서 즉석으로 받습니다.',
        createdAt: '2026-10-29 17:28',
        likes: 29
      }
    ]
  },
  {
    id: 'inc-5',
    title: '부산 서면 쥬디스태화 앞 시민 자유발언 및 릴레이 서명',
    category: 'rally',
    locationName: '부산 부산진구 서면 쥬디스태화 광장',
    lat: 35.1553,
    lng: 129.0596,
    description: '부산 지역 시민단체 및 청년들이 서면 번화가에서 언론 공정성 회복과 지역 의료 문제 해결을 촉구하며 서명운동과 피켓팅을 진행하고 있습니다.',
    createdAt: '2026-10-29 16:40',
    author: '부산시민행동',
    verifiedCount: 52,
    urgent: false,
    comments: [
      {
        id: 'c-6',
        author: '부산시민',
        content: '서면 젊음의거리 쪽에 서명 부스가 설치되어 있습니다. 청년분들 참여가 많네요.',
        createdAt: '2026-10-29 17:15',
        likes: 14
      }
    ]
  },
  {
    id: 'inc-6',
    title: '광주 금남로 5·18 민주광장 언론자유 기원 시민 한마당',
    category: 'rally',
    locationName: '광주 동구 금남로 5·18민주광장',
    lat: 35.1466,
    lng: 126.9223,
    description: '5·18 민주광장 분수대 앞에서 진실 보도와 민주주의 가치를 지키기 위한 시민 시국토론 및 문화 공연이 평화롭게 펼쳐지고 있습니다.',
    createdAt: '2026-10-29 15:50',
    author: '빛고을시민기자',
    verifiedCount: 68,
    urgent: false,
    comments: [
      {
        id: 'c-7',
        author: '무등산호랑이',
        content: '역사의 현장에서 시민들이 모여 노래하고 발언하고 있습니다. 생중계 공유합니다.',
        createdAt: '2026-10-29 16:20',
        likes: 31
      }
    ]
  },
  {
    id: 'inc-7',
    title: '대구 동성로 한일극장 앞 청년 시민 릴레이 피켓팅',
    category: 'citizen',
    locationName: '대구 중구 동성로2가 한일극장 앞',
    lat: 35.8714,
    lng: 128.5947,
    description: '대구 지역 대학생들이 언론 통제 우려와 지역 청년 일자리 위기에 대한 유인물을 배포하며 평화로운 침묵 피켓 시위를 전개하고 있습니다.',
    createdAt: '2026-10-29 14:30',
    author: '대구청년포럼',
    verifiedCount: 44,
    urgent: false,
    comments: [
      {
        id: 'c-8',
        author: '달구벌시민',
        content: '지나가는 시민들이 따뜻한 음료를 건네며 응원하고 있습니다.',
        createdAt: '2026-10-29 15:10',
        likes: 18
      }
    ]
  },
  {
    id: 'inc-8',
    title: '대전 으능정이거리 시민 인터뷰 및 소통 부스',
    category: 'witness',
    locationName: '대전 중구 은행동 으능정이 문화의거리',
    lat: 36.3274,
    lng: 127.4278,
    description: '기성 언론에서 다루지 않는 서민들의 실질 체감 물가와 자영업 고충을 직접 듣는 인터뷰 부스가 운영되고 있습니다.',
    createdAt: '2026-10-29 15:00',
    author: '대전민생기록단',
    verifiedCount: 39,
    urgent: false,
    comments: []
  }
];

export const INITIAL_POSTS: CitizenPost[] = [
  {
    id: 'post-1',
    author: '촛불의진실',
    title: '광화문 현장 지금 상황입니다 (사진 공유) - 경찰 유도선 유지 중',
    content: '현재 시각 광화문 북측 광장입니다. 수많은 시민들이 촛불과 손피켓을 들고 차분하게 목소리를 내고 있습니다. 주요 방송사 뉴스에서는 집회 소식이 축소 보도되거나 거의 보이지 않아서 직접 현장 사진 찍어 공유합니다. 주최 측 자원봉사자분들이 쓰레기 수거 봉투도 나눠주고 있어서 현장은 매우 깨끗합니다.',
    category: 'rally',
    locationName: '서울 종로구 광화문광장',
    lat: 37.5759,
    lng: 126.9768,
    imageUrl: '/src/assets/images/gwanghwamun_rally_1793322499206.jpg',
    createdAt: '2026-10-29 17:48',
    empathyCount: 284,
    verifiedCount: 96,
    urgent: true,
    comments: [
      {
        id: 'cp-1',
        author: '눈뜬시민',
        content: '실시간 현장 공유 감사합니다. 포털 메인에는 전혀 안 뜨는데 역시 여기서 봐야 현장을 알 수 있네요.',
        createdAt: '2026-10-29 17:55',
        likes: 42
      },
      {
        id: 'cp-2',
        author: '따뜻한차한잔',
        content: '바람이 쌀쌀합니다. 참가하시는 분들 옷 따뜻하게 챙겨 입으세요.',
        createdAt: '2026-10-29 18:02',
        likes: 27
      }
    ]
  },
  {
    id: 'post-2',
    author: '독립언론기자K',
    title: '기자실 보도통제 의혹과 브리핑 현장 기록',
    content: '오늘 오후 언론사 합동 브리핑 현장 사진입니다. 최근 정부 비판 기사를 작성한 기자들에 대한 출입 제한 조치에 대해 기자협회와 독립 저널리스트들이 즉각 철회를 요구했습니다. 언론의 자유가 침해되면 피해를 입는 것은 결국 국민입니다. 끝까지 기록하겠습니다.',
    category: 'press',
    locationName: '서울 영등포구 여의도동',
    lat: 37.5326,
    lng: 126.9142,
    imageUrl: '/src/assets/images/press_briefing_1793322501074.jpg',
    createdAt: '2026-10-29 16:50',
    empathyCount: 198,
    verifiedCount: 71,
    urgent: false,
    comments: [
      {
        id: 'cp-3',
        author: '상식과정의',
        content: '진실을 가리려는 시도는 오래가지 못합니다. 현업 기자님들 힘내십시오.',
        createdAt: '2026-10-29 17:05',
        likes: 35
      }
    ]
  },
  {
    id: 'post-3',
    author: '용산지킴이',
    title: '용산 대통령실 앞 차벽 설치 상황 실시간 제보',
    content: '퇴근길에 삼각지역을 지나는데 차벽과 펜스가 촘촘히 쳐져 있습니다. 통행하시는 분들 우회로 참고하세요. 경찰 기동대 버스들이 늘어서 있어 횡단보도 이용 시 시야 확보에 주의하셔야 합니다.',
    category: 'police',
    locationName: '서울 용산구 이태원로 삼각지',
    lat: 37.5345,
    lng: 126.9734,
    imageUrl: '/src/assets/images/police_cordon_1793322501010.jpg',
    createdAt: '2026-10-29 16:10',
    empathyCount: 142,
    verifiedCount: 58,
    urgent: true,
    comments: [
      {
        id: 'cp-4',
        author: '마포시민',
        content: '차벽 위치 지도 핀으로 확인했습니다. 버스 노선도 일부 우회 중이니 확인하세요.',
        createdAt: '2026-10-29 16:22',
        likes: 18
      }
    ]
  },
  {
    id: 'post-4',
    author: '국회앞시민',
    title: '여의도 국회 앞 시민 발언대 — 평범한 사람들의 진짜 목소리',
    content: '국회 앞 잔디마당에서 시민들이 돌아가며 발언을 이어가고 있습니다. 자영업자, 학부모, 취업준비생들이 나와서 지금 한국의 언론이 서민들의 삶과 진짜 이슈를 외면하고 있다는 점을 성토하고 있습니다. 평화롭고 성숙한 광장 문화가 감동적입니다.',
    category: 'witness',
    locationName: '서울 영등포구 국회대로',
    lat: 37.5284,
    lng: 126.9248,
    imageUrl: '/src/assets/images/assembly_plaza_1793322500989.jpg',
    createdAt: '2026-10-29 15:35',
    empathyCount: 167,
    verifiedCount: 62,
    urgent: false,
    comments: [
      {
        id: 'cp-5',
        author: '진실의힘',
        content: '국민들의 목소리를 이렇게 직접 보고 들을 수 있어 가슴이 뭉클합니다.',
        createdAt: '2026-10-29 15:58',
        likes: 24
      }
    ]
  }
];

export const CATEGORY_LABELS: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  press: {
    label: '언론통제/보도검열',
    color: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
    dot: '#E11D48'
  },
  rally: {
    label: '집회/평화시위',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
    dot: '#D97706'
  },
  police: {
    label: '공권력/경찰배치',
    color: 'text-purple-700 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900',
    dot: '#9333EA'
  },
  breaking: {
    label: '긴급 속보/단독',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900',
    dot: '#DC2626'
  },
  witness: {
    label: '현장 목격/기록',
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
    dot: '#2563EB'
  },
  citizen: {
    label: '민생/시민발언',
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
    dot: '#059669'
  }
};
