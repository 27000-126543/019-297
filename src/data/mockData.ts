import type { IndustryOption, MentionData, RankItemData, AdviceData } from '@/types';

export const industryOptions: IndustryOption[] = [
  { value: 'restaurant', label: '餐饮美食' },
  { value: 'cafe', label: '咖啡饮品' },
  { value: 'retail', label: '零售商店' },
  { value: 'beauty', label: '美业护肤' },
  { value: 'fitness', label: '健身运动' },
  { value: 'other', label: '其他行业' }
];

export const generateMentionData = (shopName: string, isOwn: boolean, competitorNames: string[]): MentionData[] => {
  const platforms = [
    { name: '抖音', color: '#000000' },
    { name: '小红书', color: '#FF2442' },
    { name: '大众点评', color: '#FF6600' },
    { name: '美团', color: '#FFC300' },
    { name: '微信', color: '#07C160' }
  ];

  const allShops = [
    { name: shopName, isOwn: true, base: 120 },
    { name: competitorNames[0] || '竞品A', isOwn: false, base: 156 },
    { name: competitorNames[1] || '竞品B', isOwn: false, base: 98 }
  ];

  return allShops.map(shop => {
    const todayCount = Math.floor(shop.base * (0.8 + Math.random() * 0.6));
    const totalCount = todayCount + Math.floor(shop.base * 25 * (0.8 + Math.random() * 0.4));
    const changeRate = Math.floor((Math.random() - 0.3) * 60);

    const positive = Math.floor(40 + Math.random() * 45);
    const negative = Math.floor(5 + Math.random() * 25);
    const neutral = 100 - positive - negative;

    const platformCounts = platforms.map(p => ({
      ...p,
      count: Math.floor(todayCount * (0.1 + Math.random() * 0.35))
    }));

    return {
      shopName: shop.name,
      isOwn: shop.isOwn,
      totalCount,
      todayCount,
      changeRate,
      sentiment: { positive, neutral, negative },
      platforms: platformCounts
    };
  });
};

export const rankData: RankItemData[] = [
  {
    rank: 1,
    shopName: '城南老火锅',
    isOwn: false,
    score: 92,
    sentimentStatus: 'green',
    volumeStatus: 'green',
    keywordStatus: 'green',
    hotKeywords: ['新品优惠', '环境好', '服务棒'],
    changeDesc: '因新品优惠被大量转发，声量上涨35%'
  },
  {
    rank: 2,
    shopName: '我的小店',
    isOwn: true,
    score: 78,
    sentimentStatus: 'yellow',
    volumeStatus: 'yellow',
    keywordStatus: 'red',
    hotKeywords: ['排队久', '味道不错', '价格实惠'],
    changeDesc: '差评集中在排队久，需关注服务效率'
  },
  {
    rank: 3,
    shopName: '川味轩',
    isOwn: false,
    score: 71,
    sentimentStatus: 'yellow',
    volumeStatus: 'yellow',
    keywordStatus: 'yellow',
    hotKeywords: ['性价比高', '分量足', '环境一般'],
    changeDesc: '评价平稳，无明显波动'
  },
  {
    rank: 4,
    shopName: '辣妹子火锅',
    isOwn: false,
    score: 65,
    sentimentStatus: 'red',
    volumeStatus: 'yellow',
    keywordStatus: 'yellow',
    hotKeywords: ['价格贵', '服务差', '味道一般'],
    changeDesc: '近期差评增多，口碑下滑'
  },
  {
    rank: 5,
    shopName: '老北京涮肉',
    isOwn: false,
    score: 60,
    sentimentStatus: 'yellow',
    volumeStatus: 'red',
    keywordStatus: 'yellow',
    hotKeywords: ['正宗', '环境好', '位置偏'],
    changeDesc: '声量较低，曝光不足'
  }
];

export const adviceData: AdviceData = {
  commentAdvice: '重点回复"排队久"相关的差评，建议给出下次到店优先安排的补偿方案，已帮你整理了3条差评待回复。',
  influencerAdvice: '最近3位本地美食达人发布了本店相关内容，互动量不错，建议主动联系合作推出专属套餐。',
  campaignAdvice: '竞品"城南老火锅"因新品优惠活动声量暴涨35%，建议你也推出限时优惠活动，可参考"第二份半价"话术。'
};
