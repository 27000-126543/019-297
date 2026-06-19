import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useShop } from '@/store/shopStore';
import { adviceData } from '@/data/mockData';
import AdviceCard from '@/components/AdviceCard';

const AdvicePage: React.FC = () => {
  const { isSetup } = useShop();

  const handleGoSetup = () => {
    Taro.switchTab({ url: '/pages/home/index' });
  };

  const handleAction = (type: string) => {
    console.log('[AdvicePage] 点击行动', type);
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  if (!isSetup) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>💡</Text>
          <Text className={styles.emptyText}>先去设置你的店铺信息吧</Text>
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
          整体表现中等偏上，差评主要集中在排队问题，建议优先优化服务效率，同时可参考竞品的新品优惠活动提升声量。
        </Text>
        <View className={styles.summaryStats}>
          <View className={styles.summaryStat}>
            <Text className={styles.summaryStatNum}>2</Text>
            <Text className={styles.summaryStatLabel}>条高优先级建议</Text>
          </View>
          <View className={styles.summaryStat}>
            <Text className={styles.summaryStatNum}>3</Text>
            <Text className={styles.summaryStatLabel}>条建议待处理</Text>
          </View>
        </View>
      </View>

      <Text className={styles.sectionTitle}>今日行动建议</Text>

      <View className={styles.adviceList}>
        <AdviceCard
          type="comment"
          title="评论回复建议"
          content={adviceData.commentAdvice}
          priority="high"
          actionText="去回复差评"
          onAction={() => handleAction('comment')}
        />

        <AdviceCard
          type="influencer"
          title="达人内容跟进"
          content={adviceData.influencerAdvice}
          priority="medium"
          actionText="查看达人内容"
          onAction={() => handleAction('influencer')}
        />

        <AdviceCard
          type="campaign"
          title="活动话术调整"
          content={adviceData.campaignAdvice}
          priority="high"
          actionText="生成活动方案"
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
          把热门关键词融入店铺介绍和活动文案，能提高搜索曝光率，吸引更多潜在顾客。
        </Text>
      </View>
    </ScrollView>
  );
};

export default AdvicePage;
