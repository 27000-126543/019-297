import type {
  IndustryOption,
  MentionData,
  RankItemData,
  AdviceData,
  StatusType,
  KeywordDetail,
  PlatformData,
  KeywordPlatformData,
  IndustryType,
  ShopInfo
} from '@/types';

export const industryOptions: IndustryOption[] = [
  { value: 'restaurant', label: '餐饮美食' },
  { value: 'cafe', label: '咖啡饮品' },
  { value: 'retail', label: '零售商店' },
  { value: 'beauty', label: '美业护肤' },
  { value: 'fitness', label: '健身运动' },
  { value: 'other', label: '其他行业' }
];

const platforms = [
  { name: '抖音', color: '#000000' },
  { name: '小红书', color: '#FF2442' },
  { name: '大众点评', color: '#FF6600' },
  { name: '美团', color: '#FFC300' },
  { name: '微信', color: '#07C160' }
];

const industryKeywords: Record<IndustryType, {
  positive: string[];
  negative: string[];
  neutral: string[];
  actions: string[];
}> = {
  restaurant: {
    positive: ['味道好', '分量足', '环境棒', '服务热情', '性价比高', '菜品新鲜', '回头客多'],
    negative: ['排队久', '上菜慢', '味道咸', '价格贵', '环境脏乱', '服务差', '份量少'],
    neutral: ['位置好找', '装修有特色', '适合聚餐', '工作日人少', '周末人多', '需提前预约'],
    actions: ['新品优惠', '满减活动', '第二份半价', '新客立减', '套餐特惠', '限时打折', '会员日福利']
  },
  cafe: {
    positive: ['咖啡好喝', '环境安静', '甜点精致', '服务好', '性价比高', '适合拍照', '咖啡豆香'],
    negative: ['座位少', '价格贵', '咖啡太苦', '等待久', '空调冷', '网速慢', '插座少'],
    neutral: ['位置好找', '适合办公', '音乐好听', '工作日安静', '周末人多', '需等位'],
    actions: ['新品咖啡', '买一送一', '下午茶套餐', '充值优惠', '限定甜点', '早鸟折扣', '会员积分']
  },
  retail: {
    positive: ['货品种类多', '价格实惠', '质量好', '服务热情', '上新快', '装修好看', '会员福利多'],
    negative: ['价格贵', '尺码不全', '导购烦人', '排队结账', '退换麻烦', '质量一般', '款式旧'],
    neutral: ['位置好找', '店面大', '停车方便', '会员折扣', '支持线上购', '可自提'],
    actions: ['季末清仓', '新品上市', '满减活动', '会员日8折', '限时秒杀', '赠品活动', '储值优惠']
  },
  beauty: {
    positive: ['效果好', '服务专业', '环境舒适', '不推销', '性价比高', '技师手法好', '产品温和'],
    negative: ['价格贵', '推销烦人', '等待久', '效果一般', '环境脏乱', '技师不专业', '预约难'],
    neutral: ['位置好找', '停车方便', '环境温馨', '需提前预约', '会员优惠', '有团购'],
    actions: ['新店开业优惠', '套餐特惠', '会员充值送', '闺蜜同行5折', '节日限定套餐', '新人体验价', '积分兑换']
  },
  fitness: {
    positive: ['器材新', '教练专业', '环境干净', '人不多', '价格实惠', '操课丰富', '24小时营业'],
    negative: ['人太多', '器材旧', '价格贵', '教练推销', '洗澡水小', '空调冷', '停车难'],
    neutral: ['位置好找', '场地大', '有泳池', '有私教', '可月付', '有团课'],
    actions: ['新店特惠', '买年卡送季卡', '私教套餐优惠', '双人同行折扣', '学生特惠', '体验周卡', '老带新福利']
  },
  other: {
    positive: ['服务好', '性价比高', '质量好', '环境棒', '专业', '值得推荐', '回头客多'],
    negative: ['价格贵', '等待久', '服务差', '质量一般', '环境脏乱', '不专业', '体验不好'],
    neutral: ['位置好找', '适合新手', '预约方便', '可线上咨询', '有优惠活动', '口碑不错'],
    actions: ['新客优惠', '套餐特惠', '会员折扣', '限时活动', '赠品活动', '节日特惠', '周年庆']
  }
};

const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
};

const pickFromArray = <T>(arr: T[], seed: string, index: number = 0): T => {
  const r = seededRandom(`${seed}-${index}`);
  return arr[Math.floor(r * arr.length)];
};

const pickMany = <T>(arr: T[], seed: string, count: number): T[] => {
  const result: T[] = [];
  const used = new Set<number>();
  let attempts = 0;
  while (result.length < count && attempts < 100) {
    const r = seededRandom(`${seed}-pick-${attempts}`);
    const idx = Math.floor(r * arr.length);
    if (!used.has(idx)) {
      used.add(idx);
      result.push(arr[idx]);
    }
    attempts++;
  }
  return result;
};

const getStatusFromScore = (score: number): StatusType => {
  if (score >= 80) return 'green';
  if (score >= 60) return 'yellow';
  return 'red';
};

export const generatePlatformData = (seed: string, total: number): PlatformData[] => {
  return platforms.map((p, i) => {
    const r = seededRandom(`${seed}-platform-${i}`);
    return {
      ...p,
      count: Math.floor(total * (0.08 + r * 0.32))
    };
  }).sort((a, b) => b.count - a.count);
};

export const generateKeywordDetail = (
  keyword: string,
  type: 'positive' | 'neutral' | 'negative',
  seed: string,
  totalCount: number
): KeywordDetail => {
  const platformData: KeywordPlatformData[] = platforms.map((p, i) => {
    const r = seededRandom(`${seed}-kw-${keyword}-${i}`);
    const trends: ('up' | 'down' | 'stable')[] = ['up', 'stable', 'down'];
    return {
      platform: p.name,
      count: Math.floor(totalCount * (0.05 + r * 0.45)),
      trend: trends[Math.floor(r * 3)]
    };
  }).sort((a, b) => b.count - a.count);

  const sampleComments = type === 'positive'
    ? [`${keyword}，真的太棒了！下次还来`, `这家${keyword}，强烈推荐！`, `${keyword}，超出预期`]
    : type === 'negative'
    ? [`${keyword}，体验太差了`, `别的都好，就是${keyword}`, `因为${keyword}，不会再来了`]
    : [`${keyword}，看个人喜好`, `${keyword}，中规中矩`, `${keyword}，还可以`];

  return {
    keyword,
    type,
    totalCount,
    platforms: platformData,
    sampleComments
  };
};

export const generateMentionData = (
  shopName: string,
  isOwn: boolean,
  competitorNames: string[],
  industry: IndustryType = 'restaurant'
): MentionData[] => {
  const keywords = industryKeywords[industry];

  const allShops = [
    { name: shopName, isOwn: true, base: 120 },
    { name: competitorNames[0] || '竞品A', isOwn: false, base: 156 },
    { name: competitorNames[1] || '竞品B', isOwn: false, base: 98 }
  ];

  return allShops.map((shop, shopIdx) => {
    const seed = `${shop.name}-${shopIdx}`;
    const baseCount = shop.base + Math.floor(seededRandom(`${seed}-base`) * 40);
    const todayCount = Math.floor(baseCount * (0.8 + seededRandom(`${seed}-today`) * 0.6));
    const totalCount = todayCount + Math.floor(baseCount * 25 * (0.8 + seededRandom(`${seed}-total`) * 0.4));
    const changeRate = Math.floor((seededRandom(`${seed}-change`) - 0.3) * 60);

    const positiveBase = isOwn ? 55 : 45;
    const negativeBase = isOwn ? 15 : 20;
    const positive = Math.min(90, Math.max(30, positiveBase + Math.floor(seededRandom(`${seed}-pos`) * 25)));
    const negative = Math.min(40, Math.max(5, negativeBase + Math.floor(seededRandom(`${seed}-neg`) * 15)));
    const neutral = Math.max(5, 100 - positive - negative);

    const platformCounts = generatePlatformData(seed, todayCount);

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

export const generateRankData = (shopInfo: ShopInfo): RankItemData[] => {
  const { name: ownName, industry, competitors } = shopInfo;
  const keywords = industryKeywords[industry];

  const competitorAction = pickFromArray(keywords.actions, `${ownName}-action`);
  const topCompetitor = {
    name: competitors[0] || '竞品A',
    hasPromotion: seededRandom(`${ownName}-promo`) > 0.3
  };

  const negativeKeywordsForOwn = pickMany(keywords.negative, `${ownName}-neg`, 2);
  const positiveKeywordsForOwn = pickMany(keywords.positive, `${ownName}-pos`, 1);

  const allShops = [
    {
      name: topCompetitor.name,
      isOwn: false,
      baseScore: topCompetitor.hasPromotion ? 90 : 78,
      keywords: topCompetitor.hasPromotion
        ? [competitorAction, ...pickMany(keywords.positive, `${competitors[0]}-kw`, 2)]
        : pickMany(keywords.positive, `${competitors[0]}-kw`, 3),
      changeDesc: topCompetitor.hasPromotion
        ? `因"${competitorAction}"被大量转发，声量上涨${Math.floor(25 + seededRandom(`${ownName}-changerate`) * 20)}%`
        : '口碑稳定，评价以正面为主'
    },
    {
      name: ownName,
      isOwn: true,
      baseScore: 72,
      keywords: [...negativeKeywordsForOwn, ...positiveKeywordsForOwn],
      changeDesc: `差评集中在${negativeKeywordsForOwn[0]}，建议优化服务效率`
    },
    {
      name: competitors[1] || '竞品B',
      isOwn: false,
      baseScore: 68,
      keywords: pickMany([...keywords.positive, ...keywords.neutral], `${competitors[1]}-kw`, 3),
      changeDesc: '评价平稳，无明显波动'
    }
  ];

  const fillerNames = ['同城其他商家A', '同城其他商家B'];
  for (let i = 0; i < 2; i++) {
    allShops.push({
      name: fillerNames[i],
      isOwn: false,
      baseScore: 55 + Math.floor(seededRandom(`${ownName}-filler-${i}`) * 15),
      keywords: pickMany([...keywords.positive, ...keywords.neutral, ...keywords.negative], `${fillerNames[i]}-kw`, 3),
      changeDesc: seededRandom(`${ownName}-filler-desc-${i}`) > 0.5
        ? '近期声量较低，曝光不足'
        : '评价一般，有待提升'
    });
  }

  return allShops
    .map((shop, idx) => {
      const seed = `${shop.name}-rank`;
      const score = shop.baseScore + Math.floor(seededRandom(`${seed}-score`) * 8 - 4);
      const sentimentScore = shop.isOwn
        ? 55 + Math.floor(seededRandom(`${seed}-sent`) * 20)
        : 60 + Math.floor(seededRandom(`${seed}-sent`) * 30);
      const volumeScore = shop.baseScore;
      const keywordScore = shop.isOwn ? 45 : 65;

      const keywordDetails: KeywordDetail[] = shop.keywords.map((kw, kwIdx) => {
        const type = keywords.negative.includes(kw) ? 'negative'
          : keywords.positive.includes(kw) ? 'positive'
          : 'neutral';
        const count = 15 + Math.floor(seededRandom(`${seed}-kwcount-${kwIdx}`) * 40);
        return generateKeywordDetail(kw, type, `${seed}-kw-${kwIdx}`, count);
      });

      const platformData = generatePlatformData(seed, 80 + Math.floor(seededRandom(`${seed}-plat`) * 60));

      return {
        rank: 0,
        shopName: shop.name,
        isOwn: shop.isOwn,
        score,
        sentimentStatus: getStatusFromScore(sentimentScore),
        volumeStatus: getStatusFromScore(volumeScore),
        keywordStatus: getStatusFromScore(keywordScore),
        hotKeywords: shop.keywords,
        keywordDetails,
        changeDesc: shop.changeDesc,
        platforms: platformData
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));
};

export const generateAdviceData = (shopInfo: ShopInfo, rankData: RankItemData[]): AdviceData => {
  const { name: ownName, industry, competitors } = shopInfo;
  const keywords = industryKeywords[industry];

  const ownRank = rankData.find(r => r.isOwn);
  const topRank = rankData.find(r => r.rank === 1);

  const negativeKeywords = ownRank?.keywordDetails
    ?.filter(k => k.type === 'negative')
    .map(k => k.keyword) || [];

  const positiveKeywords = ownRank?.keywordDetails
    ?.filter(k => k.type === 'positive')
    .map(k => k.keyword) || [];

  const topPlatform = ownRank?.platforms[0]?.name || '抖音';

  const competitorAction = topRank && !topRank.isOwn && topRank.changeDesc.includes('"')
    ? topRank.changeDesc.match(/"([^"]+)"/)?.[1] || pickFromArray(keywords.actions, `${ownName}-cmpaction`)
    : pickFromArray(keywords.actions, `${ownName}-cmpaction`);

  const topCompetitorName = competitors[0] || topRank?.shopName || '竞品';

  const negativeKeywordStr = negativeKeywords.length > 0
    ? `"${negativeKeywords[0]}"${negativeKeywords.length > 1 ? `、"${negativeKeywords[1]}"` : ''}`
    : '顾客不满意';

  const commentAdvice = negativeKeywords.length > 0
    ? `重点回复${negativeKeywordStr}相关的差评，建议给出下次到店优先安排的补偿方案。已帮你整理了${3 + Math.floor(seededRandom(`${ownName}-commentcnt`) * 3)}条差评待回复。`
    : `今日${positiveKeywords.length > 0 ? `"${positiveKeywords[0]}"好评较多` : '正面评价不错'}，建议及时回复好评，提升顾客粘性。`;

  const influencerAdvice = `最近${2 + Math.floor(seededRandom(`${ownName}-influencer`) * 3)}位本地${industry === 'restaurant' ? '美食' : industry === 'cafe' ? '生活' : '同城'}达人在${topPlatform}发布了本店相关内容，互动量不错，建议主动联系合作推出专属套餐。`;

  const campaignAdvice = topRank && !topRank.isOwn
    ? `竞品"${topCompetitorName}"因"${competitorAction}"活动声量暴涨，建议你也推出限时优惠活动，可参考"第二份半价"或"新客立减"话术。`
    : `当前${topPlatform}平台热度最高，建议加大在${topPlatform}的活动投放，可推出"${competitorAction}"吸引更多顾客。`;

  const summary = negativeKeywords.length > 0
    ? `整体表现中等，差评主要集中在${negativeKeywordStr}问题，建议优先优化服务，同时可参考竞品的${competitorAction}活动提升声量。`
    : `整体表现不错，${positiveKeywords.length > 0 ? `"${positiveKeywords[0]}"广受好评` : '口碑良好'}，建议保持优势，参考竞品推出活动进一步提升声量。`;

  return {
    commentAdvice,
    influencerAdvice,
    campaignAdvice,
    summary,
    negativeKeywords,
    competitorAction,
    hotPlatform: topPlatform
  };
};

export const getIndustryLabel = (value: IndustryType): string => {
  return industryOptions.find(opt => opt.value === value)?.label || '其他行业';
};
