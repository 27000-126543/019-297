import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useShop } from '@/store/shopStore';
import { generateRankData, getIndustryLabel } from '@/data/mockData';
import RankItem from '@/components/RankItem';
import StatusLight from '@/components/StatusLight';
import KeywordTag from '@/components/KeywordTag';
import type { RankItemData } from '@/types';

const RankPage: React.FC = () => {
  const { shopInfo, isSetup } = useShop();
  const [selectedRank, setSelectedRank] = useState<number | null>(null);

  const rankData: RankItemData[] = useMemo(() => {
    if (!shopInfo) return [];
    return generateRankData(shopInfo);
  }, [shopInfo]);

  const selectedShop = rankData.find(item => item.rank === selectedRank);

  const handleRankClick = (rank: number, shopName: string) => {
    setSelectedRank(rank);
    console.log('[RankPage] 选中排名', rank, shopName);
  };

  const handleViewDetail = (shopName: string) => {
    console.log('[RankPage] 跳转到详情页', shopName);
    Taro.navigateTo({
      url: `/pages/detail/index?shopName=${encodeURIComponent(shopName)}`
    });
  };

  const getKeywordType = (status: string, index: number): 'positive' | 'neutral' | 'negative' => {
    if (status === 'green') return index === 0 ? 'positive' : 'neutral';
    if (status === 'red') return index === 0 ? 'negative' : 'neutral';
    return 'neutral';
  };

  const handleGoSetup = () => {
    Taro.switchTab({ url: '/pages/home/index' });
  };

  if (!isSetup || !shopInfo) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📊</Text>
          <Text className={styles.emptyText}>先去首页设置你的店铺信息吧</Text>
          <View className={styles.goSetupBtn} onClick={handleGoSetup}>
            <Text className={styles.goSetupBtnText}>去设置</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>同城榜单</Text>
        <Text className={styles.subtitle}>
          {getIndustryLabel(shopInfo.industry)} · 共 {rankData.length} 家同行
        </Text>
      </View>

      <View className={styles.legendSection}>
        <View className={styles.legendCard}>
          <View className={styles.legendItem}>
            <View className={classnames(styles.legendDot, styles.green)} />
            <Text className={styles.legendText}>优秀</Text>
          </View>
          <View className={styles.legendItem}>
            <View className={classnames(styles.legendDot, styles.yellow)} />
            <Text className={styles.legendText}>一般</Text>
          </View>
          <View className={styles.legendItem}>
            <View className={classnames(styles.legendDot, styles.red)} />
            <Text className={styles.legendText}>待改进</Text>
          </View>
        </View>
      </View>

      <Text className={styles.sectionTitle}>品牌声量排名</Text>

      <View className={styles.rankList}>
        {rankData.map(item => (
          <RankItem
            key={item.rank}
            data={item}
            onClick={() => handleRankClick(item.rank, item.shopName)}
          />
        ))}
      </View>

      {selectedShop && (
        <>
          <Text className={styles.sectionTitle}>{selectedShop.shopName} 详情</Text>

          <View className={styles.detailCard}>
            <View className={styles.detailHeader}>
              <View>
                <Text className={styles.detailShopName}>{selectedShop.shopName}</Text>
                <Text className={styles.detailRank}>第 {selectedShop.rank} 名</Text>
              </View>
              <View className={styles.detailBtn} onClick={() => handleViewDetail(selectedShop.shopName)}>
                <Text className={styles.detailBtnText}>查看详细分析 →</Text>
              </View>
            </View>

            <View className={styles.detailStats}>
              <View className={styles.detailStat}>
                <Text className={styles.detailStatNum}>{selectedShop.score}</Text>
                <Text className={styles.detailStatLabel}>综合得分</Text>
              </View>
              <View className={styles.detailStat}>
                <Text className={styles.detailStatNum}>
                  {selectedShop.hotKeywords.length}
                </Text>
                <Text className={styles.detailStatLabel}>热门关键词</Text>
              </View>
              <View className={styles.detailStat}>
                <Text className={styles.detailStatNum}>
                  {selectedShop.platforms.reduce((sum, p) => sum + p.count, 0)}
                </Text>
                <Text className={styles.detailStatLabel}>平台讨论量</Text>
              </View>
            </View>

            <View className={styles.statusGrid}>
              <View className={styles.statusItem}>
                <StatusLight status={selectedShop.volumeStatus} label="" size="large" />
                <Text className={styles.statusLabel}>品牌声量</Text>
              </View>
              <View className={styles.statusItem}>
                <StatusLight status={selectedShop.sentimentStatus} label="" size="large" />
                <Text className={styles.statusLabel}>评价情绪</Text>
              </View>
              <View className={styles.statusItem}>
                <StatusLight status={selectedShop.keywordStatus} label="" size="large" />
                <Text className={styles.statusLabel}>热门关键词</Text>
              </View>
            </View>

            <View className={styles.keywordSection}>
              <Text className={styles.keywordTitle}>热门关键词</Text>
              <View className={styles.keywordList}>
                {selectedShop.hotKeywords.map((keyword, index) => (
                  <KeywordTag
                    key={index}
                    text={keyword}
                    type={getKeywordType(selectedShop.keywordStatus, index)}
                    size="medium"
                  />
                ))}
              </View>
            </View>

            <View className={styles.platformSection}>
              <Text className={styles.keywordTitle}>主要讨论平台</Text>
              <View className={styles.platformMiniList}>
                {selectedShop.platforms.slice(0, 3).map((p, i) => (
                  <View key={i} className={styles.platformMiniItem}>
                    <View
                      className={styles.platformMiniDot}
                      style={{ backgroundColor: p.color }}
                    />
                    <Text className={styles.platformMiniName}>{p.name}</Text>
                    <Text className={styles.platformMiniCount}>{p.count}次</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.changeDesc}>
              <Text className={styles.changeDescText}>
                💡 {selectedShop.changeDesc}
              </Text>
            </View>

            <View className={styles.viewDetailBtn} onClick={() => handleViewDetail(selectedShop.shopName)}>
              <Text className={styles.viewDetailBtnText}>
                查看热词来源和平台分布详情 →
              </Text>
            </View>
          </View>
        </>
      )}

      {!selectedShop && rankData.length > 0 && (
        <View className={styles.emptyState}>
          <Text className={styles.emptyText}>点击上方榜单查看详情</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default RankPage;
