import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import type { SentimentData } from '@/types';

interface SentimentBarProps {
  data: SentimentData;
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const SentimentBar: React.FC<SentimentBarProps> = ({
  data,
  showLabels = true,
  size = 'medium'
}) => {
  const total = data.positive + data.neutral + data.negative;
  const positiveWidth = total > 0 ? (data.positive / total) * 100 : 0;
  const neutralWidth = total > 0 ? (data.neutral / total) * 100 : 0;
  const negativeWidth = total > 0 ? (data.negative / total) * 100 : 0;

  return (
    <View className={styles.container}>
      <View className={`${styles.bar} ${styles[size]}`}>
        <View
          className={`${styles.segment} ${styles.positive}`}
          style={{ width: `${positiveWidth}%` }}
        />
        <View
          className={`${styles.segment} ${styles.neutral}`}
          style={{ width: `${neutralWidth}%` }}
        />
        <View
          className={`${styles.segment} ${styles.negative}`}
          style={{ width: `${negativeWidth}%` }}
        />
      </View>
      {showLabels && (
        <View className={styles.labels}>
          <View className={styles.labelItem}>
            <View className={`${styles.dot} ${styles.dotPositive}`} />
            <Text className={styles.labelText}>好评 {data.positive}%</Text>
          </View>
          <View className={styles.labelItem}>
            <View className={`${styles.dot} ${styles.dotNeutral}`} />
            <Text className={styles.labelText}>中性 {data.neutral}%</Text>
          </View>
          <View className={styles.labelItem}>
            <View className={`${styles.dot} ${styles.dotNegative}`} />
            <Text className={styles.labelText}>差评 {data.negative}%</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default SentimentBar;
