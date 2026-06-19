import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { StatusType } from '@/types';

interface StatusLightProps {
  status: StatusType;
  label: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const StatusLight: React.FC<StatusLightProps> = ({
  status,
  label,
  size = 'medium',
  showLabel = true
}) => {
  return (
    <View className={styles.container}>
      <View className={classnames(styles.light, styles[status], styles[size])} />
      {showLabel && (
        <Text className={classnames(styles.label, styles[`label${size.charAt(0).toUpperCase() + size.slice(1)}`])}>
          {label}
        </Text>
      )}
    </View>
  );
};

export default StatusLight;
