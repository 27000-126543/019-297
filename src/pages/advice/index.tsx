import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useShop } from '@/store/shopStore';
import { generateRankData, generateAdviceData } from '@/data/mockData';
import AdviceCard from '@/components/AdviceCard';
import type { AdviceData as IAdviceData } from '@/types';

const AdvicePage: React.FC = () => {
  const { shopInfo, isSetup, todos, generateTodosFromAdvice } = useShop();

  const adviceData: IAdviceData | null = useMemo(() => {
    if (!shopInfo) return null;
    const rankData = generateRankData(shopInfo);
    return generateAdviceData(shopInfo, rankData);
  }, [shopInfo]);

  const pendingCount = useMemo(() => {
    if (!shopInfo) return 0;
    return todos.filter(t => t.relatedShop === shopInfo.name && !t.completed).length;
  }, [todos, shopInfo]);

  const highPriorityCount = useMemo(() => {
    if (!adviceData) return 0;
    let count = 0;
    if (adviceData.negativeKeywords.length > 0) count++;
    if (adviceData.campaignAdvice.includes('暴涨') || adviceData.campaignAdvice.includes('声量')) count++;
    return count;
  }, [adviceData]);

  const handleGoSetup = () => {
    Taro.switchTab({ url: '/pages/home/index' });
  };

  const handleAction = (type: 'comment' | 'influencer' | 'campaign') => {
    console.log('[AdvicePage] 点击行动', type);

    if (!shopInfo || !adviceData) return;

    generateTodosFromAdvice(
      shopInfo.name,
      shopInfo.industry,
      adviceData.negativeKeywords,
      adviceData.competitorAction,
      adviceData.hotPlatform
    );

    Taro.navigateTo({ url: '/pages/todo/index' });
  };

  const handleGoTodo = () => {
    Taro.navigateTo({ url: '/pages/todo/index' });
  };

  const handleGenerateTodos = () => {
    if (!shopInfo || !adviceData) return;

    generateTodosFromAdvice(
      shopInfo.name,
      shopInfo.industry,
      adviceData.negativeKeywords,
      adviceData.competitorAction,
      adviceData.hotPlatform
    );

    Taro.showToast({
      title: '已生成待办清单',
      icon: 'success'
    });

    setTimeout(() => {
      Taro.navigateTo({ url: '/pages/todo/index' });
    }, 500);
  };

  if (!isSetup || !shopInfo || !adviceData) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>💡</Text>
          <Text className={styles.emptyText}>先去首页设置你的店铺信息吧</Text>
          <View className={styles.emptyBtn} onClick={handleGoSetup}>
            <Text className={styles.emptyBtnText}>去设置</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>行动建议</Text>
        <Text className={styles.subtitle}>三句话，告诉你今天该做什么</Text>
      </View>

      <View className={styles.summaryCard}>
        <Text className={styles.summaryTitle}>今日总结</Text>
        <Text className={styles.summaryText}>
          {adviceData.summary}
        </Text>
        <View className={styles.summaryStats}>
          <View className={styles.summaryStat}>
            <Text className={styles.summaryStatNum}>{highPriorityCount}</Text>
            <Text className={styles.summaryStatLabel}>条高优先级建议</Text>
          </View>
          <View className={styles.summaryStat}>
            <Text className={styles.summaryStatNum}>{pendingCount > 0 ? pendingCount : 3}</Text>
            <Text className={styles.summaryStatLabel}>
              {pendingCount > 0 ? '条待处理任务' : '条建议待处理'}
            </Text>
          </View>
        </View>
        {pendingCount > 0 ? (
          <View className={styles.viewTodoBtn} onClick={handleGoTodo}>
            <Text className={styles.viewTodoBtnText}>查看待办清单 →</Text>
          </View>
        ) : (
          <View className={styles.generateTodoBtn} onClick={handleGenerateTodos}>
            <Text className={styles.generateTodoBtnText}>一键生成今日待办 →</Text>
          </View>
        )}
      </View>

      <Text className={styles.sectionTitle}>今日行动建议</Text>

      <View className={styles.adviceList}>
        <AdviceCard
          type="comment"
          title="评论回复建议"
          content={adviceData.commentAdvice}
          priority={adviceData.negativeKeywords.length > 0 ? 'high' : 'medium'}
          actionText={pendingCount > 0 ? '查看待办' : '去回复评论'}
          onAction={() => handleAction('comment')}
        />

        <AdviceCard
          type="influencer"
          title="达人内容跟进"
          content={adviceData.influencerAdvice}
          priority="medium"
          actionText={pendingCount > 0 ? '查看待办' : '联系达人'}
          onAction={() => handleAction('influencer')}
        />

        <AdviceCard
          type="campaign"
          title="活动话术调整"
          content={adviceData.campaignAdvice}
          priority="high"
          actionText={pendingCount > 0 ? '查看待办' : '调整活动'}
          onAction={() => handleAction('campaign')}
        />
      </View>

      <Text className={styles.sectionTitle}>小贴士</Text>

      <View className={styles.tipCard}>
        <Text className={styles.tipTitle}>
          <Text className={styles.tipIcon}>⏰</Text>
          最佳回复时间
        </Text>
        <Text className={styles.tipContent}>
          差评最好在2小时内回复，好评可在当天内回复，这样能提升顾客满意度和平台评分。
        </Text>
      </View>

      <View className={styles.tipCard}>
        <Text className={styles.tipTitle}>
          <Text className={styles.tipIcon}>🎯</Text>
          关键词优化
        </Text>
        <Text className={styles.tipContent}>
          把热门关键词融入店铺介绍和活动文案，能提高在{adviceData.hotPlatform}的搜索曝光率，吸引更多潜在顾客。
        </Text>
      </View>

      <View className={styles.tipCard}>
        <Text className={styles.tipTitle}>
          <Text className={styles.tipIcon}>📱</Text>
          重点平台
        </Text>
        <Text className={styles.tipContent}>
          当前{adviceData.hotPlatform}平台讨论热度最高，建议重点关注该平台的评价和互动。
        </Text>
      </View>
    </ScrollView>
  );
};

export default AdvicePage;
