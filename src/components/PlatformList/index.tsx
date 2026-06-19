import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import type { PlatformData } from '@/types';

interface PlatformListProps {
  data: PlatformData[];
}

const PlatformList: React.FC<PlatformListProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <View className={styles.container}>
      {data.map((item, index) => {
        const percent = total > 0 ? ((item.count / total) * 100).toFixed(0) : '0';
        return (
          <View key={index} className={styles.item}>
            <View className={styles.itemLeft}>
              <View className={styles.platformDot} style={{ backgroundColor: item.color }} />
              <Text className={styles.platformName}>{item.name}</Text>
            </View>
            <View className={styles.itemRight}>
              <View className={styles.barBg}>
                <View
                  className={styles.barFill}
                  style={{ width: `${percent}%`, backgroundColor: item.color }}
                />
              </View>
              <Text className={styles.countText}>{item.count}次</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default PlatformList;
