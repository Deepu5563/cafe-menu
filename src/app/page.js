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

  // Pool and de-duplicate all sections to prevent identity collisions during migration
  const allSections = Array.from(
    new Map([...menuData.page1, ...menuData.page2].map(s => [s.id, s])).values()
  );

  // Helper to distribute sections into columns based on title keywords
  // Helper to distribute sections into 5 columns (5x2 Balanced Studio)
  const getPage1Columns = (sections) => {
    // Col 1: Pizza -> Cold Coffee
    const col1 = [
      ...sections.filter(s => s.title.toLowerCase().includes('pizza') && !s.title.toLowerCase().includes('customized')),
      ...sections.filter(s => s.title.toLowerCase().includes('coffee'))
    ];
    // Col 2: Grilled Burger -> Quick Bites
    const col2 = [
      ...sections.filter(s => s.title.toLowerCase().includes('grilled burger')),
      ...sections.filter(s => s.title.toLowerCase().includes('quick bites'))
    ];
    // Col 3: Sandwich -> Shawarma -> Wrap
    const col3 = [
      ...sections.filter(s => s.title.toLowerCase().includes('sandwich')),
      ...sections.filter(s => s.title.toLowerCase().includes('shawarma')),
      ...sections.filter(s => s.title.toLowerCase().includes('wrap'))
    ];
    // Col 4: Pasta -> Mojito
    const col4 = [
      ...sections.filter(s => s.title.toLowerCase().includes('pasta')),
      ...sections.filter(s => s.title.toLowerCase().includes('mojito'))
    ];
    // Col 5: Juice -> Momos -> Extras
    const col5 = [
      ...sections.filter(s => s.title.toLowerCase().includes('juice')),
      ...sections.filter(s => s.title.toLowerCase().includes('momo')),
      ...sections.filter(s => s.title.toLowerCase().includes('extra'))
    ];
    return [col1, col2, col3, col4, col5];
  };

  const getPage2Columns = (sections) => {
    const col1 = [...sections.filter(s => s.title.toLowerCase().includes('coffee'))];
    const col2 = [...sections.filter(s => s.title.toLowerCase().includes('juice'))];
    const col3 = [...sections.filter(s => s.title.toLowerCase().includes('customized pizza'))];
    const col4 = [...sections.filter(s => s.title.toLowerCase().includes('extra'))];
    return [col1, col2, col3, col4];
  };

  const page1Cols = getPage1Columns(allSections);
  const page2Cols = getPage2Columns(allSections);

  // Helper to find the "real" owner page for a section (for state updates)
  const getOwnerPage = (sectionId) => {
    return menuData.page1.find(s => s.id === sectionId) ? 'page1' : 'page2';
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sage">
        <div className="w-12 h-12 border-4 border-soft-gold border-t-deep-green rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-row bg-sage">
      {/* Permanent Admin Sidebar */}
      <AdminDrawer />

      {/* Main Menu Area - High-Density Digital Experience */}
      <div className="flex-1 h-screen overflow-hidden flex flex-col pt-0 pb-1 px-5 bg-[#f1f5f9] print:h-auto print:overflow-visible print:bg-transparent print:p-0">
        {/* Full-Width Menu Canvas - 100vh Locked */}
        <div className="w-full h-full flex flex-col print:h-auto print:overflow-visible">
          <AnimatePresence mode="wait">
            {activePage === 'page1' ? (
              <motion.div
                key="page1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full print:block"
              >
                <MenuPage pageKey="page1">
                  <div className="flex flex-col h-full">
                    {/* Branding Area - Absolute Tight Alignment */}
                    <div className="mb-0.5">
                      <BrandingSection />
                    </div>

                    {/* High-Impact 5-Column Grid - 5x2 Balanced Studio */}
                    <div className="grid grid-cols-1 md:grid-cols-5 print:grid-cols-4 gap-x-4 gap-y-2 content-start flex-1 min-h-0">
                      {page1Cols.map((column, colIdx) => (
                        <div key={`col-${colIdx}`} className="flex flex-col gap-2">
                          {column.map((section, index) => (
                            <MenuSection key={section.id} page={getOwnerPage(section.id)} section={section} index={index} />
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
                transition={{ duration: 0.3 }}
                className="print:block"
              >
                <MenuPage pageKey="page2">
                  <div className="h-full flex flex-col pt-0">
                    {/* Page 2 Grid - Natural Heights */}
                    <div className="grid grid-cols-1 md:grid-cols-4 print:grid-cols-4 gap-x-6 gap-y-4">
                      {page2Cols.map((column, colIdx) => (
                        <div key={`page2-col-${colIdx}`} className="flex flex-col gap-4">
                          {column.map((section, index) => (
                            <MenuSection key={section.id} page={getOwnerPage(section.id)} section={section} index={index + 1} />
                          ))}
                        </div>
                      ))}
                    </div>
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
