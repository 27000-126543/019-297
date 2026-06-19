import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import Taro from '@tarojs/taro';
import type { ShopInfo, HistoryRecord, TodoItem, TodoType } from '@/types';

const HISTORY_STORAGE_KEY = 'shop_history_records';
const TODO_STORAGE_KEY = 'shop_todo_items';
const MAX_HISTORY = 5;

interface ShopContextType {
  shopInfo: ShopInfo | null;
  history: HistoryRecord[];
  todos: TodoItem[];
  setShopInfo: (info: ShopInfo) => void;
  selectHistory: (record: HistoryRecord) => void;
  clearHistory: () => void;
  addTodo: (type: TodoType, title: string, description: string, priority: 'high' | 'medium' | 'low', relatedShop: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompletedTodos: () => void;
  generateTodosFromAdvice: (shopName: string, negativeKeywords: string[], competitorAction: string, hotPlatform: string) => void;
  isSetup: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const defaultShopInfo: ShopInfo = {
  name: '我的小店',
  industry: 'restaurant',
  competitors: ['城南老火锅', '川味轩']
};

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shopInfo, setShopInfoState] = useState<ShopInfo | null>(defaultShopInfo);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    try {
      const savedHistory = Taro.getStorageSync(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      const savedTodos = Taro.getStorageSync(TODO_STORAGE_KEY);
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
      console.log('[ShopStore] 初始化本地存储数据完成');
    } catch (error) {
      console.error('[ShopStore] 读取本地存储失败', error);
    }
  }, []);

  useEffect(() => {
    try {
      Taro.setStorageSync(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('[ShopStore] 保存历史记录失败', error);
    }
  }, [history]);

  useEffect(() => {
    try {
      Taro.setStorageSync(TODO_STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('[ShopStore] 保存待办清单失败', error);
    }
  }, [todos]);

  const setShopInfo = useCallback((info: ShopInfo) => {
    setShopInfoState(info);

    setHistory(prev => {
      const existingIndex = prev.findIndex(
        item => item.shopInfo.name === info.name &&
          item.shopInfo.competitors[0] === info.competitors[0] &&
          item.shopInfo.competitors[1] === info.competitors[1]
      );

      let newHistory: HistoryRecord[];
      const now = Date.now();

      if (existingIndex >= 0) {
        newHistory = [...prev];
        newHistory[existingIndex] = {
          ...newHistory[existingIndex],
          shopInfo: info,
          lastUsedAt: now
        };
      } else {
        const newRecord: HistoryRecord = {
          id: generateId(),
          shopInfo: info,
          lastUsedAt: now,
          createdAt: now
        };
        newHistory = [newRecord, ...prev].slice(0, MAX_HISTORY);
      }

      newHistory.sort((a, b) => b.lastUsedAt - a.lastUsedAt);
      console.log('[ShopStore] 保存店铺信息到历史记录', info.name);
      return newHistory;
    });
  }, []);

  const selectHistory = useCallback((record: HistoryRecord) => {
    setShopInfoState(record.shopInfo);
    setHistory(prev =>
      prev.map(item =>
        item.id === record.id
          ? { ...item, lastUsedAt: Date.now() }
          : item
      ).sort((a, b) => b.lastUsedAt - a.lastUsedAt)
    );
    console.log('[ShopStore] 选择历史记录', record.shopInfo.name);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    console.log('[ShopStore] 清空历史记录');
  }, []);

  const addTodo = useCallback((
    type: TodoType,
    title: string,
    description: string,
    priority: 'high' | 'medium' | 'low',
    relatedShop: string
  ) => {
    const newTodo: TodoItem = {
      id: generateId(),
      type,
      title,
      description,
      priority,
      completed: false,
      createdAt: Date.now(),
      relatedShop
    };
    setTodos(prev => [newTodo, ...prev]);
    console.log('[ShopStore] 添加待办事项', title);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
              completedAt: !item.completed ? Date.now() : undefined
            }
          : item
      )
    );
    console.log('[ShopStore] 切换待办状态', id);
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(item => item.id !== id));
    console.log('[ShopStore] 删除待办事项', id);
  }, []);

  const clearCompletedTodos = useCallback(() => {
    setTodos(prev => prev.filter(item => !item.completed));
    console.log('[ShopStore] 清空已完成待办');
  }, []);

  const generateTodosFromAdvice = useCallback((
    shopName: string,
    negativeKeywords: string[],
    competitorAction: string,
    hotPlatform: string
  ) => {
    const existingCount = todos.filter(
      t => t.relatedShop === shopName && !t.completed
    ).length;

    if (existingCount > 0) {
      console.log('[ShopStore] 待办已存在，跳过生成', shopName);
      return;
    }

    if (negativeKeywords.length > 0) {
      addTodo(
        'comment',
        `回复关于"${negativeKeywords[0]}"的差评`,
        `重点回复${negativeKeywords.map(k => `"${k}"`).join('、')}相关的差评，建议给出下次到店优先安排的补偿方案。已帮你整理了最新的差评待回复。`,
        'high',
        shopName
      );
    } else {
      addTodo(
        'comment',
        '回复最新的顾客评论',
        '查看今日最新的顾客评论，重点回复差评和建设性建议，保持顾客满意度。',
        'medium',
        shopName
      );
    }

    addTodo(
      'influencer',
      `跟进${hotPlatform}达人内容`,
      `最近3位本地美食达人在${hotPlatform}发布了本店相关内容，互动量不错，建议主动联系合作推出专属套餐。`,
      'medium',
      shopName
    );

    addTodo(
      'campaign',
      `参考竞品调整活动：${competitorAction}`,
      `竞品正在做"${competitorAction}"，声量上涨明显，建议你也推出限时优惠活动，可参考"第二份半价"或"新客立减"等话术。`,
      'high',
      shopName
    );

    console.log('[ShopStore] 根据建议生成待办清单', shopName);
  }, [todos, addTodo]);

  const isSetup = !!shopInfo && !!shopInfo.name && shopInfo.competitors.length >= 2;

  return (
    <ShopContext.Provider
      value={{
        shopInfo,
        history,
        todos,
        setShopInfo,
        selectHistory,
        clearHistory,
        addTodo,
        toggleTodo,
        deleteTodo,
        clearCompletedTodos,
        generateTodosFromAdvice,
        isSetup
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
