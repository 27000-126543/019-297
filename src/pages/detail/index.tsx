import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useShop } from '@/store/shopStore';
import { generateRankData, getIndustryLabel } from '@/data/mockData';
import type { KeywordDetail, PlatformData } from '@/types';

const DetailPage: React.FC = () => {
  const router = useRouter();
  const { shopInfo } = useShop();
  const shopName = router.params.shopName || '';

  const rankData = useMemo(() => {
    if (!shopInfo) return [];
    return generateRankData(shopInfo);
  }, [shopInfo]);

  const shopData = useMemo(() => {
    return rankData.find(r => r.shopName === decodeURIComponent(shopName));
  }, [rankData, shopName]);

  const handleGoBack = () => {
    Taro.navigateBack();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'positive': return '好评';
      case 'negative': return '差评';
      default: return '中性';
    }
  };

  const getMaxPlatformCount = (platforms: PlatformData[]) => {
    return Math.max(...platforms.map(p => p.count), 1);
  };

  const getMaxKwPlatformCount = (detail: KeywordDetail) => {
    return Math.max(...detail.platforms.map(p => p.count), 1);
  };

  if (!shopInfo) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🔍</Text>
          <Text className={styles.emptyText}>请先在首页设置店铺信息</Text>
          <View className={styles.goBackBtn} onClick={handleGoBack}>
            <Text className={styles.goBackBtnText}>返回首页</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (!shopData) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🔍</Text>
          <Text className={styles.emptyText}>未找到该店铺的数据</Text>
          <View className={styles.goBackBtn} onClick={handleGoBack}>
            <Text className={styles.goBackBtnText}>返回榜单</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  const maxPlatformCount = getMaxPlatformCount(shopData.platforms);

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.shopName}>{shopData.shopName}</Text>
        <View className={styles.shopMeta}>
          <View className={styles.rankBadge}>
            <Text className={styles.rankBadgeText}>
              同城第 {shopData.rank} 名
            </Text>
          </View>
          <Text className={styles.scoreText}>
            综合得分 {shopData.score} · {getIndustryLabel(shopInfo.industry)}
          </Text>
        </View>
      </View>

      <Text className={styles.sectionTitle}>平台分布</Text>
      <View className={styles.platformCard}>
        {shopData.platforms.map((platform, index) => (
          <View key={index} className={styles.platformItem}>
            <View className={styles.platformLeft}>
              <View
                className={styles.platformDot}
                style={{ backgroundColor: platform.color }}
              />
              <Text className={styles.platformName}>{platform.name}</Text>
            </View>
            <View className={styles.platformRight}>
              <View className={styles.platformBar}>
                <View
                  className={styles.platformBarFill}
                  style={{
                    width: `${(platform.count / maxPlatformCount) * 100}%`,
                    backgroundColor: platform.color
                  }}
                />
              </View>
              <Text className={styles.platformCount}>{platform.count}次</Text>
            </View>
          </View>
        ))}
      </View>

      <Text className={styles.sectionTitle}>热门关键词</Text>
      <View className={styles.keywordSection}>
        {shopData.keywordDetails.map((detail, index) => {
          const maxKwCount = getMaxKwPlatformCount(detail);
          return (
            <View
              key={index}
              className={classnames(styles.keywordCard, styles[detail.type])}
            >
              <View className={styles.keywordHeader}>
                <View className={styles.keywordTitle}>
                  <Text className={styles.keywordText}>{detail.keyword}</Text>
                  <View className={classnames(styles.keywordTypeTag, styles[detail.type])}>
                    <Text className={styles.keywordTypeText}>
                      {getTypeLabel(detail.type)}
                    </Text>
                  </View>
                </View>
                <Text className={styles.keywordCount}>
                  共 {detail.totalCount} 次提及
                </Text>
              </View>

              <View className={styles.keywordPlatformList}>
                {detail.platforms.map((plat, platIndex) => (
                  <View key={platIndex} className={styles.kwPlatformItem}>
                    <View className={styles.kwPlatformLeft}>
                      <Text className={classnames(styles.trendIcon, styles[plat.trend])}>
                        {getTrendIcon(plat.trend)}
                      </Text>
                      <Text className={styles.kwPlatformName}>{plat.platform}</Text>
                    </View>
                    <View
                      className={styles.kwPlatformBar}
                    >
                      <View
                        className={styles.kwPlatformBarFill}
                        style={{
                          width: `${(plat.count / maxKwCount) * 100}%`,
                          backgroundColor: detail.type === 'positive' ? '#00B42A'
                            : detail.type === 'negative' ? '#F53F3F'
                            : '#FF7D00'
                        }}
                      />
                    </View>
                    <Text className={styles.kwPlatformCount}>{plat.count}次</Text>
                  </View>
                ))}
              </View>

              <View className={styles.commentsSection}>
                <Text className={styles.commentsTitle}>用户评论示例</Text>
                {detail.sampleComments.map((comment, cIndex) => (
                  <Text key={cIndex} className={styles.commentItem}>
                    {comment}
                  </Text>
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default DetailPage;
