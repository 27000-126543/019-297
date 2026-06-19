import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

type AdviceType = 'comment' | 'influencer' | 'campaign';

interface AdviceCardProps {
  type: AdviceType;
  title: string;
  content: string;
  priority?: 'high' | 'medium' | 'low';
  actionText?: string;
  onAction?: () => void;
}

const AdviceCard: React.FC<AdviceCardProps> = ({
  type,
  title,
  content,
  priority = 'medium',
  actionText,
  onAction
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'comment':
        return '💬';
      case 'influencer':
        return '📣';
      case 'campaign':
        return '🎯';
      default:
        return '💡';
    }
  };

  const getPriorityText = () => {
    switch (priority) {
      case 'high':
        return '重点关注';
      case 'medium':
        return '建议处理';
      case 'low':
        return '可先观察';
      default:
        return '';
    }
  };

  return (
    <View className={classnames(styles.card, styles[type], styles[priority])}>
      <View className={styles.header}>
        <View className={styles.iconWrap}>
          <Text className={styles.icon}>{getTypeIcon()}</Text>
        </View>
        <View className={styles.titleWrap}>
          <Text className={styles.title}>{title}</Text>
          <View className={classnames(styles.priorityTag, styles[`priority${priority.charAt(0).toUpperCase() + priority.slice(1)}`])}>
            <Text className={styles.priorityText}>{getPriorityText()}</Text>
          </View>
        </View>
      </View>
      <View className={styles.content}>
        <Text className={styles.contentText}>{content}</Text>
      </View>
      {actionText && onAction && (
        <View className={styles.action} onClick={onAction}>
          <Text className={styles.actionText}>{actionText}</Text>
        </View>
      )}
    </View>
  );
};

export default AdviceCard;
