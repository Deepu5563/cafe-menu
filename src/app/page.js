"use client";

import React from 'react';
import { MenuProvider, useMenu } from '@/context/MenuContext';
import MenuPage from '@/components/MenuPage';
import MenuSection from '@/components/MenuSection';
import BrandingSection from '@/components/BrandingSection';
import PageSwitcher from '@/components/PageSwitcher';
import AdminBar from '@/components/AdminBar';
import AdminDrawer from '@/components/AdminDrawer';
import { motion, AnimatePresence } from 'framer-motion';

function MenuApp() {
  const { menuData, activePage, isLoaded } = useMenu();

  // Pool all sections and remove Customized Pizza
  const allSections = Array.from(
    new Map([...menuData.page1, ...menuData.page2].map(s => [s.id, s])).values()
  ).filter(s => s.title.toLowerCase() !== 'customized pizza');

  // Unified 5-Column Distribution for Screen & Print
  const getColumns = (sections) => {
    // Column 1: Pizza, Wraps
    const col1 = [
      ...sections.filter(s => s.title.toLowerCase().includes('pizza')),
      ...sections.filter(s => s.title.toLowerCase().includes('wrap'))
    ];
    // Column 2: Burger, Fries
    const col2 = [
      ...sections.filter(s => s.title.toLowerCase().includes('grilled burger')),
      ...sections.filter(s => s.title.toLowerCase().includes('quick bites'))
    ];
    // Column 3: Sandwich, Shawarma, Cold Coffee
    const col3 = [
      ...sections.filter(s => s.title.toLowerCase().includes('sandwich')),
      ...sections.filter(s => s.title.toLowerCase().includes('shawarma')),
      ...sections.filter(s => s.title.toLowerCase().includes('coffee'))
    ];
    // Column 4: Pasta, Momos, Special
    const col4 = [
      ...sections.filter(s => s.title.toLowerCase().includes('pasta')),
      ...sections.filter(s => s.title.toLowerCase().includes('momo')),
      ...sections.filter(s => s.title.toLowerCase().includes('special'))
    ];
    // Column 5: Mojito, Juice, Extras
    const col5 = [
      ...sections.filter(s => s.title.toLowerCase().includes('mojito')),
      ...sections.filter(s => s.title.toLowerCase().includes('juice')),
      ...sections.filter(s => s.title.toLowerCase().includes('extra'))
    ];
    return [col1, col2, col3, col4, col5];
  };

  const columns = getColumns(allSections);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sage">
        <div className="w-12 h-12 border-4 border-soft-gold border-t-deep-green rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-row bg-sage">
      <AdminDrawer />
      <div className="flex-1 min-h-screen overflow-y-auto flex flex-col pt-0 pb-1 px-5 bg-[#f1f5f9] print:h-auto print:overflow-visible print:bg-transparent print:p-0">
        <div className="w-full min-h-full flex flex-col print:h-auto print:overflow-visible">
          <AnimatePresence mode="wait">
            {activePage === 'page1' ? (
              <motion.div
                key="page1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full min-h-full flex flex-col print:block"
              >
                <MenuPage pageKey="page1">
                  <div className="flex flex-col h-full overflow-hidden">
                    <div className="mb-0.5">
                      <BrandingSection />
                    </div>
                    
                    {/* Unified Grid - Standardizing Screen & Print Layout Order */}
                    <div className="grid grid-cols-1 md:grid-cols-5 print:grid-cols-5 gap-x-4 gap-y-2 flex-1 min-h-0 overflow-y-visible pr-1 print:overflow-visible items-stretch pb-3">
                      {columns.map((column, colIdx) => (
                        <div key={`col-${colIdx}`} className="flex flex-col gap-2 print:gap-3 justify-between h-full">
                          {column.map((section, index) => (
                            <MenuSection key={section.id} page="page1" section={section} index={index} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </MenuPage>
              </motion.div>
            ) : (
              <motion.div
                key="page2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full h-full flex flex-col print:block"
              >
                <MenuPage pageKey="page2">
                  <div className="flex flex-col items-center justify-center h-full text-deep-green/50 italic py-20">
                    <p className="text-xl font-serif">Sheet 2 is currently empty.</p>
                  </div>
                </MenuPage>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <MenuProvider>
      <MenuApp />
    </MenuProvider>
  );
}
