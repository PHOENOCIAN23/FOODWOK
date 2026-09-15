'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { MenuItem, AddOnOption, CategoryOption } from '@/types/foodwok';
import { menuItems as defaultMenuItems, standardAddOns as defaultAddOns } from '@/data/menuData';

export const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: 'rice', label: 'Rice Dishes' },
  { id: 'swallow', label: 'Swallow & Soups' },
  { id: 'grills', label: 'Grills & Barbecue' },
  { id: 'sides', label: 'Sides & Small Bites' },
  { id: 'drinks', label: 'Drinks & Beverages' },
];

interface MenuContextType {
  items: MenuItem[];
  addOns: AddOnOption[];
  categories: CategoryOption[];
  updateMenuItem: (item: MenuItem) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => MenuItem;
  deleteMenuItem: (itemId: string) => void;
  toggleMenuItemAvailability: (itemId: string) => void;
  updateAddOn: (addOn: AddOnOption) => void;
  addAddOn: (addOn: Omit<AddOnOption, 'id'>) => AddOnOption;
  deleteAddOn: (addOnId: string) => void;
  toggleAddOnAvailability: (addOnId: string) => void;
  addCategory: (label: string) => CategoryOption;
  resetToDefaults: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<MenuItem[]>(defaultMenuItems);
  const [addOns, setAddOns] = useState<AddOnOption[]>(defaultAddOns);
  const [categories, setCategories] = useState<CategoryOption[]>(DEFAULT_CATEGORIES);
  const [isMounted, setIsMounted] = useState(false);
  
  const lastServerSyncTimestampRef = useRef<number>(0);

  // Helper to push state to server /api/menu-sync so Edge/Chrome/Safari/Firefox all stay 100% in sync
  const pushToServerSync = useCallback(async (currentItems: MenuItem[], currentAddOns: AddOnOption[], currentCats: CategoryOption[]) => {
    const now = Date.now();
    lastServerSyncTimestampRef.current = now;

    try {
      const res = await fetch('/api/menu-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: currentItems,
          addOns: currentAddOns,
          categories: currentCats,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.lastUpdated) {
          lastServerSyncTimestampRef.current = data.lastUpdated;
        }
      }
    } catch {}
  }, []);

  // Helper to pull state from server /api/menu-sync
  const pullFromServerSync = useCallback(async () => {
    try {
      const res = await fetch('/api/menu-sync');
      if (res.ok) {
        const data = await res.json();
        if (data && data.lastUpdated && data.lastUpdated > lastServerSyncTimestampRef.current) {
          if (Array.isArray(data.items) && data.items.length > 0) {
            setItems(data.items);
            try {
              localStorage.setItem('foodwok_admin_v5_menu_items', JSON.stringify(data.items));
            } catch {}
          }
          if (Array.isArray(data.addOns) && data.addOns.length > 0) {
            setAddOns(data.addOns);
            try {
              localStorage.setItem('foodwok_admin_v5_addons', JSON.stringify(data.addOns));
            } catch {}
          }
          if (Array.isArray(data.categories) && data.categories.length > 0) {
            setCategories(data.categories);
            try {
              localStorage.setItem('foodwok_admin_v5_categories', JSON.stringify(data.categories));
            } catch {}
          }
          lastServerSyncTimestampRef.current = data.lastUpdated;
        }
      }
    } catch {}
  }, []);

  const loadSavedData = useCallback(() => {
    let savedItemsRaw: string | null = null;
    let savedAddOnsRaw: string | null = null;
    let savedCategoriesRaw: string | null = null;

    try {
      savedItemsRaw = localStorage.getItem('foodwok_admin_v5_menu_items');
      savedAddOnsRaw = localStorage.getItem('foodwok_admin_v5_addons');
      savedCategoriesRaw = localStorage.getItem('foodwok_admin_v5_categories');
    } catch {}

    let loadedCats = DEFAULT_CATEGORIES;
    let loadedItems = defaultMenuItems;
    let loadedAddOns = defaultAddOns;

    // 1. Categories Merge
    if (savedCategoriesRaw) {
      try {
        const parsedCats: CategoryOption[] = JSON.parse(savedCategoriesRaw);
        const mergedCategories = [...parsedCats];
        for (const defCat of DEFAULT_CATEGORIES) {
          if (!mergedCategories.some((c) => c.id === defCat.id)) {
            mergedCategories.push(defCat);
          }
        }
        loadedCats = mergedCategories;
      } catch {}
    }

    // 2. Menu Items Merge
    if (savedItemsRaw) {
      try {
        const parsedItems: MenuItem[] = JSON.parse(savedItemsRaw);
        const mergedItems = [...parsedItems];
        for (const defItem of defaultMenuItems) {
          if (!mergedItems.some((i) => i.id === defItem.id)) {
            mergedItems.push(defItem);
          }
        }
        loadedItems = mergedItems;
      } catch {}
    }

    // 3. AddOns Merge
    if (savedAddOnsRaw) {
      try {
        const parsedAddOns: AddOnOption[] = JSON.parse(savedAddOnsRaw);
        const mergedAddOns = [...parsedAddOns];
        for (const defAddOn of defaultAddOns) {
          if (!mergedAddOns.some((a) => a.id === defAddOn.id)) {
            mergedAddOns.push(defAddOn);
          }
        }
        loadedAddOns = mergedAddOns;
      } catch {}
    }

    setCategories(loadedCats);
    setItems(loadedItems);
    setAddOns(loadedAddOns);

    // Initial server push so server state is seeded
    pushToServerSync(loadedItems, loadedAddOns, loadedCats);
  }, [pushToServerSync]);

  useEffect(() => {
    setIsMounted(true);
    loadSavedData();

    // Listen for cross-tab storage sync events (same browser)
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === 'foodwok_admin_v5_menu_items' ||
        e.key === 'foodwok_admin_v5_addons' ||
        e.key === 'foodwok_admin_v5_categories'
      ) {
        loadSavedData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadSavedData]);

  // Real-time Multi-browser polling & focus sync (Edge <-> Chrome <-> Safari)
  useEffect(() => {
    if (!isMounted) return;

    pullFromServerSync();
    const interval = setInterval(pullFromServerSync, 1500);

    const handleFocus = () => pullFromServerSync();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [isMounted, pullFromServerSync]);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('foodwok_admin_v5_menu_items', JSON.stringify(items));
      } catch {}
    }
  }, [items, isMounted]);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('foodwok_admin_v5_addons', JSON.stringify(addOns));
      } catch {}
    }
  }, [addOns, isMounted]);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('foodwok_admin_v5_categories', JSON.stringify(categories));
      } catch {}
    }
  }, [categories, isMounted]);

  const addCategory = (label: string): CategoryOption => {
    const trimmed = label.trim();
    const existing = categories.find((c) => c.label.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing;

    const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: CategoryOption = { id, label: trimmed };
    const nextCats = [...categories, newCategory];
    setCategories(nextCats);
    pushToServerSync(items, addOns, nextCats);
    return newCategory;
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    const nextItems = items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    setItems(nextItems);
    pushToServerSync(nextItems, addOns, categories);
  };

  const addMenuItem = (newItem: Omit<MenuItem, 'id'>): MenuItem => {
    const created: MenuItem = {
      ...newItem,
      id: `menu-item-${Date.now()}`,
      isAvailable: newItem.isAvailable !== undefined ? newItem.isAvailable : true,
    };
    const nextItems = [created, ...items];
    setItems(nextItems);
    pushToServerSync(nextItems, addOns, categories);
    return created;
  };

  const deleteMenuItem = (itemId: string) => {
    const nextItems = items.filter((item) => item.id !== itemId);
    setItems(nextItems);
    pushToServerSync(nextItems, addOns, categories);
  };

  const toggleMenuItemAvailability = (itemId: string) => {
    lastServerSyncTimestampRef.current = Date.now();
    const nextItems = items.map((item) =>
      item.id === itemId
        ? { ...item, isAvailable: item.isAvailable === false ? true : false }
        : item
    );
    setItems(nextItems);
    try {
      localStorage.setItem('foodwok_admin_v5_menu_items', JSON.stringify(nextItems));
    } catch {}
    pushToServerSync(nextItems, addOns, categories);
  };

  // Sync add-on edits across global addOns state AND embedded dish addOns arrays AND multi-browser server sync
  const updateAddOn = (updatedAddOn: AddOnOption) => {
    const nextAddOns = addOns.map((a) => (a.id === updatedAddOn.id ? updatedAddOn : a));
    const nextItems = items.map((item) => ({
      ...item,
      addOns: item.addOns.map((a) => (a.id === updatedAddOn.id ? updatedAddOn : a)),
    }));
    setAddOns(nextAddOns);
    setItems(nextItems);
    pushToServerSync(nextItems, nextAddOns, categories);
  };

  const addAddOn = (newAddOn: Omit<AddOnOption, 'id'>): AddOnOption => {
    const created: AddOnOption = {
      ...newAddOn,
      id: `addon-${Date.now()}`,
      isAvailable: newAddOn.isAvailable !== undefined ? newAddOn.isAvailable : true,
      scope: newAddOn.scope || 'UNIVERSAL',
      applicableCategories: newAddOn.applicableCategories || [],
    };
    const nextAddOns = [...addOns, created];
    const nextItems = items.map((item) => ({
      ...item,
      addOns: [...item.addOns, created],
    }));
    setAddOns(nextAddOns);
    setItems(nextItems);
    pushToServerSync(nextItems, nextAddOns, categories);
    return created;
  };

  const deleteAddOn = (addOnId: string) => {
    const nextAddOns = addOns.filter((a) => a.id !== addOnId);
    const nextItems = items.map((item) => ({
      ...item,
      addOns: item.addOns.filter((a) => a.id !== addOnId),
    }));
    setAddOns(nextAddOns);
    setItems(nextItems);
    pushToServerSync(nextItems, nextAddOns, categories);
  };

  const toggleAddOnAvailability = (addOnId: string) => {
    lastServerSyncTimestampRef.current = Date.now();

    const nextAddOns = addOns.map((a) => {
      if (a.id === addOnId) {
        return { ...a, isAvailable: a.isAvailable === false ? true : false };
      }
      return a;
    });

    const nextItems = items.map((item) => ({
      ...item,
      addOns: item.addOns.map((a) => {
        if (a.id === addOnId) {
          return { ...a, isAvailable: a.isAvailable === false ? true : false };
        }
        return a;
      }),
    }));

    setAddOns(nextAddOns);
    setItems(nextItems);
    try {
      localStorage.setItem('foodwok_admin_v5_addons', JSON.stringify(nextAddOns));
      localStorage.setItem('foodwok_admin_v5_menu_items', JSON.stringify(nextItems));
    } catch {}
    pushToServerSync(nextItems, nextAddOns, categories);
  };

  const resetToDefaults = () => {
    setItems(defaultMenuItems);
    setAddOns(defaultAddOns);
    setCategories(DEFAULT_CATEGORIES);
    try {
      localStorage.removeItem('foodwok_admin_v5_menu_items');
      localStorage.removeItem('foodwok_admin_v5_addons');
      localStorage.removeItem('foodwok_admin_v5_categories');
    } catch {}
  };

  return (
    <MenuContext.Provider
      value={{
        items,
        addOns,
        categories,
        updateMenuItem,
        addMenuItem,
        deleteMenuItem,
        toggleMenuItemAvailability,
        updateAddOn,
        addAddOn,
        deleteAddOn,
        toggleAddOnAvailability,
        addCategory,
        resetToDefaults,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
