import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ShopInfo, IndustryType } from '@/types';

interface ShopContextType {
  shopInfo: ShopInfo | null;
  setShopInfo: (info: ShopInfo) => void;
  isSetup: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const defaultShopInfo: ShopInfo = {
  name: '我的小店',
  industry: 'restaurant',
  competitors: ['城南老火锅', '川味轩']
};

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(defaultShopInfo);
  const isSetup = !!shopInfo && !!shopInfo.name && shopInfo.competitors.length >= 2;

  return (
    <ShopContext.Provider value={{ shopInfo, setShopInfo, isSetup }}>
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
