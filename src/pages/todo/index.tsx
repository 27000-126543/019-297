import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useShop } from '@/store/shopStore';
import type { TodoItem } from '@/types';

const TodoPage: React.FC = () => {
  const { todos, toggleTodo, deleteTodo, clearCompletedTodos, isSetup } = useShop();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  const pendingTodos = useMemo(() => todos.filter(t => !t.completed), [todos]);
  const completedTodos = useMemo(() => todos.filter(t => t.completed), [todos]);
  const displayTodos = activeTab === 'pending' ? pendingTodos : completedTodos;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'comment': return '💬';
      case 'influencer': return '📣';
      case 'campaign': return '🎯';
      default: return '📝';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '高优先级';
      case 'medium': return '中优先级';
      case 'low': return '低优先级';
      default: return '';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleToggle = (id: string) => {
    toggleTodo(id);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条待办吗？',
      success: (res) => {
        if (res.confirm) {
          deleteTodo(id);
        }
      }
    });
  };

  const handleClearCompleted = () => {
    if (completedTodos.length === 0) return;
    Taro.showModal({
      title: '清空已完成',
      content: `确定要清空 ${completedTodos.length} 条已完成的待办吗？`,
      success: (res) => {
        if (res.confirm) {
          clearCompletedTodos();
        }
      }
    });
  };

  const handleGoAdvice = () => {
    Taro.switchTab({ url: '/pages/advice/index' });
  };

  const renderTodoItem = (todo: TodoItem) => (
    <View
      key={todo.id}
      className={classnames(styles.todoCard, styles[todo.type], todo.completed && styles.completed)}
    >
      <View className={styles.todoHeader}>
        <View
          className={classnames(styles.checkbox, todo.completed && styles.checked)}
          onClick={() => handleToggle(todo.id)}
        >
          {todo.completed && <Text className={styles.checkIcon}>✓</Text>}
        </View>
        <View className={styles.todoContent}>
          <Text className={styles.todoTitle}>{todo.title}</Text>
          <View className={styles.todoMeta}>
            <Text className={styles.typeIcon}>{getTypeIcon(todo.type)}</Text>
            <View className={classnames(styles.priorityTag, styles[todo.priority])}>
              <Text className={styles.priorityText}>{getPriorityLabel(todo.priority)}</Text>
            </View>
            <Text className={styles.shopTag}>{todo.relatedShop}</Text>
          </View>
        </View>
      </View>
      <Text className={styles.todoDesc}>{todo.description}</Text>
      <View className={styles.todoFooter}>
        <Text className={styles.timeText}>
          {todo.completed ? `完成于 ${formatTime(todo.completedAt!)}` : `创建于 ${formatTime(todo.createdAt)}`}
        </Text>
        <View className={styles.deleteBtn} onClick={(e) => handleDelete(todo.id, e)}>
          <Text>删除</Text>
        </View>
      </View>
    </View>
  );

  if (!isSetup) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>先去首页设置你的店铺信息吧</Text>
          <View className={styles.goAdviceBtn} style={{ marginTop: '32rpx' }} onClick={handleGoAdvice}>
            <Text className={styles.goAdviceBtnText}>去设置</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>待办清单</Text>
        <Text className={styles.subtitle}>今天要做的事，一件一件搞定</Text>
      </View>

      <View className={styles.tabs}>
        <View
          className={classnames(styles.tab, activeTab === 'pending' && styles.active)}
          onClick={() => setActiveTab('pending')}
        >
          <Text className={styles.tabText}>
            待处理
            <Text className={styles.tabCount}>({pendingTodos.length})</Text>
          </Text>
        </View>
        <View
          className={classnames(styles.tab, activeTab === 'completed' && styles.active)}
          onClick={() => setActiveTab('completed')}
        >
          <Text className={styles.tabText}>
            已完成
            <Text className={styles.tabCount}>({completedTodos.length})</Text>
          </Text>
        </View>
      </View>

      {displayTodos.length > 0 ? (
        <View className={styles.todoList}>
          {displayTodos.map(todo => renderTodoItem(todo))}
        </View>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>{activeTab === 'pending' ? '✅' : '📝'}</Text>
          <Text className={styles.emptyText}>
            {activeTab === 'pending' ? '太棒了！没有待处理的任务' : '还没有已完成的任务'}
          </Text>
          {activeTab === 'pending' && (
            <View className={styles.goAdviceBtn} style={{ marginTop: '32rpx' }} onClick={handleGoAdvice}>
              <Text className={styles.goAdviceBtnText}>去看看建议</Text>
            </View>
          )}
        </View>
      )}

      <View className={styles.actionBar}>
        <Text className={styles.actionBarText}>
          共 {todos.length} 条，已完成 {completedTodos.length} 条
        </Text>
        {completedTodos.length > 0 ? (
          <View className={styles.clearBtn} onClick={handleClearCompleted}>
            <Text className={styles.clearBtnText}>清空已完成</Text>
          </View>
        ) : (
          <View className={styles.goAdviceBtn} onClick={handleGoAdvice}>
            <Text className={styles.goAdviceBtnText}>生成新待办</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default TodoPage;
