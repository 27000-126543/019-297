import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import StatusLight from '@/components/StatusLight';
import type { RankItemData } from '@/types';

interface RankItemProps {
  data: RankItemData;
  onClick?: () => void;
}

const RankItem: React.FC<RankItemProps> = ({ data, onClick }) => {
  const getRankBgClass = () => {
    if (data.rank === 1) return 'rankGold';
    if (data.rank === 2) return 'rankSilver';
    if (data.rank === 3) return 'rankBronze';
    return 'rankNormal';
  };

  return (
    <View
      className={classnames(styles.card, data.isOwn && styles.isOwn)}
      onClick={onClick}
    >
      <View className={styles.leftSection}>
        <View className={classnames(styles.rankBadge, styles[getRankBgClass()])}>
          <Text className={styles.rankText}>{data.rank}</Text>
        </View>
        <View className={styles.shopInfo}>
          <View className={styles.shopNameRow}>
            <Text className={styles.shopName}>{data.shopName}</Text>
            {data.isOwn && <View className={styles.ownTag}><Text className={styles.ownTagText}>本店</Text></View>}
          </View>
          <Text className={styles.changeDesc}>{data.changeDesc}</Text>
        </View>
      </View>
      <View className={styles.rightSection}>
        <Text className={styles.score}>{data.score}</Text>
        <View className={styles.statusRow}>
          <StatusLight status={data.volumeStatus} label="声量" size="small" />
          <StatusLight status={data.sentimentStatus} label="口碑" size="small" />
          <StatusLight status={data.keywordStatus} label="热词" size="small" />
        </View>
      </View>
    </View>
  );
};

export default RankItem;
