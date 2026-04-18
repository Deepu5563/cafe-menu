"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_MENU_DATA } from '@/lib/initialData';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuData, setMenuData] = useState(INITIAL_MENU_DATA);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activePage, setActivePage] = useState('page1');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('urban_bites_menu_v3');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        // Data Sync Logic: Merge missing sections from INITIAL_MENU_DATA (the code) 
        // into the user's localized state (the browser)
        const savedP1 = parsed.page1 || [];
        const savedP2 = parsed.page2 || [];
        const allSavedIds = new Set([...savedP1, ...savedP2].map(s => s.id));
        
        const syncFromInitial = (savedArr, initialArr) => {
          const initialMap = new Map(initialArr.map(s => [s.id, s]));
          
          const updatedSaved = savedArr.map(s => {
            const initialMatch = initialMap.get(s.id);
            // Smart Merge: Use code state for defaults (fit, etc) but keep user overrides
            if (!initialMatch) return s;
            return {
              ...initialMatch,
              ...s, // Keep user's image if they uploaded one
              items: s.items, // Keep user's items
            };
          });

          const savedIds = new Set(savedArr.map(s => s.id));
          const brandNew = initialArr.filter(s => !savedIds.has(s.id));
          
          return [...updatedSaved, ...brandNew];
        };

        const currentVersion = parsed.version || 0;
        const TARGET_VERSION = 31;

        // Use a slight timeout or functional update to satisfy strict linting 
        // that discourages setting state immediately in useEffect
        setTimeout(() => {
          setMenuData({
            ...parsed,
            restaurantName: INITIAL_MENU_DATA.restaurantName,
            tagline: INITIAL_MENU_DATA.tagline,
            contact: INITIAL_MENU_DATA.contact,
            page1: syncFromInitial(savedP1, INITIAL_MENU_DATA.page1),
            page2: syncFromInitial(savedP2, INITIAL_MENU_DATA.page2),
            version: TARGET_VERSION
          });
        }, 0);
      } catch (e) {
        console.error("Failed to parse saved menu data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('urban_bites_menu_v3', JSON.stringify(menuData));
    }
  }, [menuData, isLoaded]);


  const updateMenuData = (updates) => {
    setMenuData(prev => ({ ...prev, ...updates }));
  };

  const addSection = (page) => {
    const newSection = {
      id: `sec_${Date.now()}`,
      title: "New Section",
      image: null,
      items: []
    };
    setMenuData(prev => ({
      ...prev,
      [page]: [...prev[page], newSection]
    }));
  };

  const deleteSection = (page, sectionId) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      setMenuData(prev => ({
        ...prev,
        [page]: prev[page].filter(s => s.id !== sectionId)
      }));
    }
  };

  const updateSection = (page, sectionId, updates) => {
    setMenuData(prev => ({
      ...prev,
      [page]: prev[page].map(s => s.id === sectionId ? { ...s, ...updates } : s)
    }));
  };

  const addItem = (page, sectionId) => {
    const newItem = {
      id: `item_${Date.now()}`,
      name: "New Item",
      description: "Item description",
      price: "0"
    };
    setMenuData(prev => ({
      ...prev,
      [page]: prev[page].map(s => 
        s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
      )
    }));
  };

  const deleteItem = (page, sectionId, itemId) => {
    setMenuData(prev => ({
      ...prev,
      [page]: prev[page].map(s => 
        s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s
      )
    }));
  };

  const updateItem = (page, sectionId, itemId, updates) => {
    setMenuData(prev => ({
      ...prev,
      [page]: prev[page].map(s => 
        s.id === sectionId ? {
          ...s,
          items: s.items.map(i => i.id === itemId ? { ...i, ...updates } : i)
        } : s
      )
    }));
  };

  return (
    <MenuContext.Provider value={{
      menuData,
      isAdmin,
      setIsAdmin,
      activePage,
      setActivePage,
      isDrawerOpen,
      setIsDrawerOpen,
      updateMenuData,
      addSection,
      deleteSection,
      updateSection,
      addItem,
      deleteItem,
      updateItem
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
