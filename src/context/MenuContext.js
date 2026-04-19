"use client";

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from 'react';
import { INITIAL_MENU_DATA } from '@/lib/initialData';
import { 
  fetchFullMenu, 
  syncLocalStorageToDB, 
  updateItemInDB, 
  updateSectionInDB,
  deleteItemFromDB,
  addItemAction,
  addSectionAction,
  deleteSectionAction,
  resetDatabaseToInitial 
} from '@/app/actions/menuActions';

const MenuContext = createContext();

/**
 * ARCHITECTURAL: useSyncExternalStore
 * React 19 recommended way to detect hydration/client-side state.
 * Avoids "Cascading Render" errors by reconcilling server/client snapshots.
 */
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export const MenuProvider = ({ children }) => {
  const [menuData, setMenuData] = useState(INITIAL_MENU_DATA);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activePage, setActivePage] = useState('page1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  
  const isMounted = useIsMounted();

  // Unified Hydration & Database Migration
  useEffect(() => {
    if (!isMounted) return;

    const initData = async () => {
      try {
        const dbData = await fetchFullMenu();
        
        if (dbData) {
          setMenuData(dbData);
          setIsDbLoaded(true);
          return;
        }

        // DB Migration Fallback
        const localRaw = localStorage.getItem('urban_bites_menu_v3');
        if (localRaw) {
          const localData = JSON.parse(localRaw);
          const result = await syncLocalStorageToDB(localData);
          if (result.success) setMenuData(localData);
        } else {
          await syncLocalStorageToDB(INITIAL_MENU_DATA);
          setMenuData(INITIAL_MENU_DATA);
        }
        
        setIsDbLoaded(true);
      } catch (e) {
        console.error("[Context] Hydration Error:", e);
        setMenuData(INITIAL_MENU_DATA);
        setIsDbLoaded(true);
      }
    };

    initData();
  }, [isMounted]);

  const addSection = async (page) => {
    const order = menuData[page].length;
    const result = await addSectionAction(page, order);
    if (result.success && result.section) {
      setMenuData(prev => ({
        ...prev,
        [page]: [...prev[page], { ...result.section, items: [] }]
      }));
    }
  };

  const deleteSection = async (page, sectionId) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;
    setMenuData(prev => ({
      ...prev,
      [page]: prev[page].filter(s => s.id !== sectionId)
    }));
    await deleteSectionAction(sectionId);
  };

  const addItem = async (page, sectionId) => {
    const section = menuData[page].find(s => s.id === sectionId);
    if (!section) return;
    const order = (section.items || []).length;

    const result = await addItemAction(sectionId, order);
    if (result.success && result.item) {
      setMenuData(prev => ({
        ...prev,
        [page]: prev[page].map(s => 
          s.id === sectionId ? { ...s, items: [...(s.items || []), result.item] } : s
        )
      }));
    }
  };

  const updateSection = async (page, sectionId, updates) => {
    // Optimistic Update
    setMenuData(prev => ({
      ...prev,
      [page]: prev[page].map(section => 
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
    // DB Update
    await updateSectionInDB(sectionId, updates);
  };

  const updateMenuItem = async (page, sectionId, itemId, updates) => {
    // Optimistic Update
    setMenuData(prev => ({
      ...prev,
      [page]: prev[page].map(section => 
        section.id === sectionId ? {
          ...section,
          items: (section.items || []).map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          )
        } : section
      )
    }));

    // DB Update
    try {
      const result = await updateItemInDB(itemId, updates);
      if (result && !result.success) {
        alert("CRITICAL ERROR: " + (result.error || "Failed to save changes."));
      }
    } catch (e) {
      alert("NETWORK ERROR: Could not reach the server.");
    }
  };

  const deleteMenuItem = async (page, sectionId, itemId) => {
    setMenuData(prev => ({
      ...prev,
      [page]: prev[page].map(section => 
        section.id === sectionId ? {
          ...section,
          items: (section.items || []).filter(item => item.id !== itemId)
        } : section
      )
    }));
    await deleteItemFromDB(itemId);
  };

  const reseedData = async () => {
    if(window.confirm('Restore default menu? This PERMANENTLY wipes the database.')) {
      const result = await resetDatabaseToInitial();
      if (result.success) {
        setMenuData(INITIAL_MENU_DATA);
        localStorage.removeItem('urban_bites_menu_v3');
        window.location.reload();
      }
    }
  };

  const updateContact = (updates) => {
    setMenuData(prev => ({
      ...prev,
      contact: { ...prev.contact, ...updates }
    }));
    // Future: Add updateContactInDB if needed
  };

  return (
    <MenuContext.Provider value={{ 
      menuData, setMenuData, addSection, deleteSection, addItem,
      updateSection, updateMenuItem, deleteMenuItem, updateContact, reseedData,
      isAdmin, setIsAdmin, activePage, setActivePage, isDrawerOpen, setIsDrawerOpen,
      isLoaded: isMounted && isDbLoaded,
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
