"use client";

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from 'react';
import { INITIAL_MENU_DATA } from '@/lib/initialData';

const MenuContext = createContext();

// THE ARCHITECTURAL FIX: useSyncExternalStore
// This is the React 19 recommended way to detect hydration/client-side state.
// It avoids the "Cascading Render" error by providing a server value and a client value
// that React reconciles during the initial hydration pass.
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {}, // No-op subscription (mount state never changes after initial mount)
    () => true,     // Client snapshot: always true
    () => false     // Server snapshot: always false (during hydration)
  );
}

export const MenuProvider = ({ children }) => {
  // Use Lazy Initializer to satisfy React 19 / Next 15+ Strict Mode
  const [menuData, setMenuData] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_MENU_DATA;

    try {
      const savedData = localStorage.getItem('urban_bites_menu_v3');
      if (!savedData) return INITIAL_MENU_DATA;

      const parsed = JSON.parse(savedData);
      
      const syncFromInitial = (savedArr, initialArr) => {
        const initialMap = new Map(initialArr.map(s => [s.id, s]));
        const updatedSaved = savedArr.map(s => {
          const initialMatch = initialMap.get(s.id);
          if (!initialMatch) return s;
          return { ...initialMatch, ...s, items: s.items };
        });
        const savedIds = new Set(savedArr.map(s => s.id));
        const brandNew = initialArr.filter(s => !savedIds.has(s.id));
        return [...updatedSaved, ...brandNew];
      };

      const TARGET_VERSION = 35;
      if (parsed.version === TARGET_VERSION) return parsed;

      return {
        ...parsed,
        restaurantName: INITIAL_MENU_DATA.restaurantName,
        tagline: INITIAL_MENU_DATA.tagline,
        contact: INITIAL_MENU_DATA.contact,
        page1: syncFromInitial(parsed.page1 || [], INITIAL_MENU_DATA.page1),
        page2: syncFromInitial(parsed.page2 || [], INITIAL_MENU_DATA.page2),
        version: TARGET_VERSION
      };
    } catch (e) {
      console.error("Initialization Sync Failed:", e);
      return INITIAL_MENU_DATA;
    }
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [activePage, setActivePage] = useState('page1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Use the new Pro-grade hydration hook
  const isLoaded = useIsMounted();

  // Pure persistence effect - no state setting here, just side-effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('urban_bites_menu_v3', JSON.stringify(menuData));
    }
  }, [menuData]);

  const updateSection = (page, sectionId, updates) => {
    setMenuData(prev => ({
      ...prev,
      [page]: prev[page].map(section => 
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const updateMenuItem = (page, sectionId, itemId, updates) => {
    setMenuData(prev => ({
      ...prev,
      [page]: prev[page].map(section => 
        section.id === sectionId ? {
          ...section,
          items: section.items.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          )
        } : section
      )
    }));
  };

  const updateContact = (updates) => {
    setMenuData(prev => ({
      ...prev,
      contact: { ...prev.contact, ...updates }
    }));
  };

  return (
    <MenuContext.Provider value={{ 
      menuData, 
      setMenuData, 
      updateSection, 
      updateMenuItem,
      updateContact,
      isAdmin, 
      setIsAdmin,
      activePage,
      setActivePage,
      isLoaded,
      isDrawerOpen,
      setIsDrawerOpen
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within a MenuProvider");
  return context;
};
