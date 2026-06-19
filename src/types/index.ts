export type IndustryType = 'restaurant' | 'cafe' | 'retail' | 'beauty' | 'fitness' | 'other';

export interface IndustryOption {
  value: IndustryType;
  label: string;
}

export interface ShopInfo {
  name: string;
  industry: IndustryType;
  competitors: string[];
}

export interface HistoryRecord {
  id: string;
  shopInfo: ShopInfo;
  lastUsedAt: number;
  createdAt: number;
}

export interface PlatformData {
  name: string;
  count: number;
  color: string;
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

export interface MentionData {
  shopName: string;
  isOwn: boolean;
  totalCount: number;
  todayCount: number;
  changeRate: number;
  sentiment: SentimentData;
  platforms: PlatformData[];
}

export type StatusType = 'green' | 'yellow' | 'red';

export interface KeywordPlatformData {
  platform: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

export interface KeywordDetail {
  keyword: string;
  type: 'positive' | 'neutral' | 'negative';
  totalCount: number;
  platforms: KeywordPlatformData[];
  sampleComments: string[];
}

export interface RankItemData {
  rank: number;
  shopName: string;
  isOwn: boolean;
  score: number;
  sentimentStatus: StatusType;
  volumeStatus: StatusType;
  keywordStatus: StatusType;
  hotKeywords: string[];
  keywordDetails: KeywordDetail[];
  changeDesc: string;
  platforms: PlatformData[];
}

export interface AdviceItem {
  type: 'comment' | 'influencer' | 'campaign';
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AdviceData {
  commentAdvice: string;
  influencerAdvice: string;
  campaignAdvice: string;
  summary: string;
  negativeKeywords: string[];
  competitorAction: string;
  hotPlatform: string;
}

export type TodoType = 'comment' | 'influencer' | 'campaign';

export interface TodoItem {
  id: string;
  type: TodoType;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  relatedShop: string;
}
