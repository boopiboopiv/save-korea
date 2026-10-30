export type IncidentCategory = 
  | 'press'       // 언론통제 / 보도검열
  | 'rally'       // 집회 / 평화시위
  | 'police'      // 공권력 / 경찰 대치
  | 'breaking'    // 긴급 속보 / 단독
  | 'witness'     // 현장 목격 / 상황 기록
  | 'citizen';    // 민생 / 시민 발언

export interface CommentItem {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  photoUrl?: string;
}

export interface MapIncident {
  id: string;
  title: string;
  category: IncidentCategory;
  locationName: string;
  lat: number;
  lng: number;
  description: string;
  createdAt: string;
  author: string;
  imageUrl?: string;
  verifiedCount: number;
  urgent: boolean;
  comments: CommentItem[];
}

export interface CitizenPost {
  id: string;
  author: string;
  title: string;
  content: string;
  category: IncidentCategory;
  locationName: string;
  lat?: number;
  lng?: number;
  imageUrl?: string;
  createdAt: string;
  empathyCount: number;
  verifiedCount: number;
  urgent: boolean;
  comments: CommentItem[];
}
