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

export interface RankItemData {
  rank: number;
  shopName: string;
  isOwn: boolean;
  score: number;
  sentimentStatus: StatusType;
  volumeStatus: StatusType;
  keywordStatus: StatusType;
  hotKeywords: string[];
  changeDesc: string;
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
}
