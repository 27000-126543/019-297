import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'none';
  trendValue?: string;
  highlight?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  highlight = false,
  onClick
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '';
  };

  return (
    <View
      className={classnames(styles.card, highlight && styles.highlight, onClick && styles.clickable)}
      onClick={onClick}
    >
      <Text className={styles.title}>{title}</Text>
      <View className={styles.valueRow}>
        <Text className={classnames(styles.value, highlight && styles.valueHighlight)}>
          {value}
        </Text>
        {trend && trendValue && (
          <Text className={classnames(styles.trend, styles[`trend${trend.charAt(0).toUpperCase() + trend.slice(1)}`])}>
            {getTrendIcon()}{trendValue}
          </Text>
        )}
      </View>
      {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

export default StatCard;
