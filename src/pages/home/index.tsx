import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useShop } from '@/store/shopStore';
import { industryOptions, generateMentionData } from '@/data/mockData';
import StatCard from '@/components/StatCard';
import SentimentBar from '@/components/SentimentBar';
import PlatformList from '@/components/PlatformList';
import type { IndustryType, MentionData } from '@/types';

const HomePage: React.FC = () => {
  const { shopInfo, setShopInfo } = useShop();

  const [industry, setIndustry] = useState<IndustryType>('restaurant');
  const [shopName, setShopName] = useState('');
  const [competitor1, setCompetitor1] = useState('');
  const [competitor2, setCompetitor2] = useState('');
  const [activeShopIndex, setActiveShopIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const mentionData: MentionData[] = useMemo(() => {
    if (!showResults || !shopInfo) return [];
    return generateMentionData(shopInfo.name, true, shopInfo.competitors);
  }, [showResults, shopInfo]);

  const currentShopData = mentionData[activeShopIndex];

  const handleSubmit = () => {
    if (!shopName.trim()) {
      Taro.showToast({ title: '请输入店名', icon: 'none' });
      return;
    }
    if (!competitor1.trim() || !competitor2.trim()) {
      Taro.showToast({ title: '请输入2家竞店名', icon: 'none' });
      return;
    }

    setShopInfo({
      name: shopName.trim(),
      industry,
      competitors: [competitor1.trim(), competitor2.trim()]
    });
    setShowResults(true);
    console.log('[HomePage] 店铺信息已设置', { shopName, industry, competitors: [competitor1, competitor2] });
  };

  const handleEdit = () => {
    setShowResults(false);
    if (shopInfo) {
      setIndustry(shopInfo.industry);
      setShopName(shopInfo.name);
      setCompetitor1(shopInfo.competitors[0] || '');
      setCompetitor2(shopInfo.competitors[1] || '');
    }
  };

  const formatDate = () => {
    const now = new Date();
    return `${now.getMonth() + 1}月${now.getDate()}日`;
  };

  if (!showResults) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View className={styles.setupSection}>
          <Text className={styles.greeting}>今天有没有被提到？</Text>
          <Text className={styles.subtitle}>输入店铺信息，一键查看全网口碑</Text>

          <View className={styles.setupCard}>
            <Text className={styles.setupTitle}>设置你的店铺</Text>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>选择行业</Text>
              <View className={styles.industryList}>
                {industryOptions.map(option => (
                  <View
                    key={option.value}
                    className={classnames(styles.industryItem, industry === option.value && styles.active)}
                    onClick={() => setIndustry(option.value)}
                  >
                    <Text className={styles.industryText}>{option.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>你的店名</Text>
              <Input
                className={styles.input}
                placeholder="请输入你的店铺名称"
                value={shopName}
                onInput={e => setShopName(e.detail.value)}
                maxlength={20}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>附近2家竞店名</Text>
              <View className={styles.competitorInput}>
                <Input
                  className={styles.input}
                  placeholder="竞品1名称"
                  value={competitor1}
                  onInput={e => setCompetitor1(e.detail.value)}
                  maxlength={20}
                />
              </View>
              <View className={styles.competitorInput}>
                <Input
                  className={styles.input}
                  placeholder="竞品2名称"
                  value={competitor2}
                  onInput={e => setCompetitor2(e.detail.value)}
                  maxlength={20}
                />
              </View>
            </View>

            <View className={styles.submitBtn} onClick={handleSubmit}>
              <Text className={styles.submitBtnText}>查看今日提及</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.resultSection}>
        <View className={styles.resultHeader}>
          <Text className={styles.resultTitle}>今日提及</Text>
          <View className={styles.editBtn} onClick={handleEdit}>
            <Text>修改设置</Text>
          </View>
        </View>

        {currentShopData && (
          <View className={styles.overviewCard}>
            <Text className={styles.overviewShopName}>
              {currentShopData.shopName} {currentShopData.isOwn ? '（本店）' : ''}
            </Text>
            <View className={styles.overviewMain}>
              <Text className={styles.overviewNumber}>{currentShopData.todayCount}</Text>
              <Text className={styles.overviewUnit}>次提及</Text>
            </View>
            <View className={styles.overviewChange}>
              <Text
                className={classnames(
                  styles.overviewChangeText,
                  currentShopData.changeRate < 0 && styles.down
                )}
              >
                {currentShopData.changeRate >= 0 ? '↑' : '↓'}
                较昨日 {Math.abs(currentShopData.changeRate)}%
              </Text>
            </View>
            <Text className={styles.overviewLabel}>{formatDate()} 全网数据</Text>
          </View>
        )}

        <Text className={styles.sectionTitle}>好评差评比例</Text>
        <View className={styles.sentimentCard}>
          <SentimentBar data={currentShopData?.sentiment || { positive: 0, neutral: 0, negative: 0 }} size="large" />
        </View>

        <Text className={styles.sectionTitle}>主要出现在哪些平台</Text>
        <View className={styles.platformCard}>
          <PlatformList data={currentShopData?.platforms || []} />
        </View>

        <View className={styles.competitorSection}>
          <Text className={styles.sectionTitle}>竞品对比</Text>
          <View className={styles.competitorTabs}>
            {mentionData.map((item, index) => (
              <View
                key={index}
                className={classnames(styles.competitorTab, activeShopIndex === index && styles.active)}
                onClick={() => setActiveShopIndex(index)}
              >
                <Text className={styles.competitorTabText}>{item.shopName}</Text>
              </View>
            ))}
          </View>

          {currentShopData && (
            <View className={styles.competitorCard}>
              <View className={styles.cardTitle}>{currentShopData.shopName} 今日数据</View>
              <SentimentBar data={currentShopData.sentiment} size="small" />
              <View className={styles.competitorStats}>
                <View className={styles.competitorStat}>
                  <Text className={styles.competitorStatNum}>{currentShopData.todayCount}</Text>
                  <Text className={styles.competitorStatLabel}>今日提及</Text>
                </View>
                <View className={styles.competitorStat}>
                  <Text className={styles.competitorStatNum}>{currentShopData.sentiment.positive}%</Text>
                  <Text className={styles.competitorStatLabel}>好评率</Text>
                </View>
                <View className={styles.competitorStat}>
                  <Text className={styles.competitorStatNum}>{currentShopData.totalCount}</Text>
                  <Text className={styles.competitorStatLabel}>累计提及</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;
