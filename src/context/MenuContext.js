"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_MENU_DATA } from '@/lib/initialData';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuData, setMenuData] = useState(INITIAL_MENU_DATA);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activePage, setActivePage] = useState('page1');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('urban_bites_menu_v3');
    if (savedData) {
      try {
        setMenuData(JSON.parse(savedData));
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
