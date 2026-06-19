import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

type KeywordType = 'positive' | 'neutral' | 'negative';

interface KeywordTagProps {
  text: string;
  type?: KeywordType;
  size?: 'small' | 'medium';
  onClick?: () => void;
}

const KeywordTag: React.FC<KeywordTagProps> = ({
  text,
  type = 'neutral',
  size = 'medium',
  onClick
}) => {
  return (
    <View
      className={classnames(
        styles.tag,
        styles[type],
        styles[size],
        onClick && styles.clickable
      )}
      onClick={onClick}
    >
      <Text className={styles.tagText}>{text}</Text>
    </View>
  );
};

export default KeywordTag;
