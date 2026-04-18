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
  const { menuData, activePage } = useMenu();
  const [scaleFactor, setScaleFactor] = React.useState(1);

  // Smart Scaling for 13-inch Laptops and smaller screens
  React.useEffect(() => {
    const handleResize = () => {
      const sidebarWidth = 280;
      const minPadding = 48; // Space between sheet and screen edges
      
      const targetMenuWidth = 1122; // A4 Landscape width
      const targetMenuHeight = 794; // A4 Landscape height (210mm approx)
      
      const availableWidth = window.innerWidth - sidebarWidth - minPadding;
      const availableHeight = window.innerHeight - minPadding;
      
      // Calculate factors for both directions
      const widthFactor = availableWidth / targetMenuWidth;
      const heightFactor = availableHeight / targetMenuHeight;
      
      // Use the smaller factor to ensure fit in both directions
      const factor = Math.min(widthFactor, heightFactor);
      setScaleFactor(Math.max(0.6, factor)); 
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pool and de-duplicate all sections to prevent identity collisions during migration
  const allSections = Array.from(
    new Map([...menuData.page1, ...menuData.page2].map(s => [s.id, s])).values()
  );

  // Helper to distribute sections into columns based on title keywords
  const getPage1Columns = (sections) => {
    // Col 1: Pizza then Wraps then Shawarma
    const col1 = [
      ...sections.filter(s => s.title.toLowerCase().includes('pizza') && !s.title.toLowerCase().includes('customized')),
      ...sections.filter(s => s.title.toLowerCase().includes('wrap')),
      ...sections.filter(s => s.title.toLowerCase().includes('shawarma'))
    ];
    // Col 2: Burger -> Sandwich -> Momos
    const col2 = [
      ...sections.filter(s => s.title.toLowerCase().includes('burger')),
      ...sections.filter(s => s.title.toLowerCase().includes('sandwich')),
      ...sections.filter(s => s.title.toLowerCase().includes('momo'))
    ];
    // Col 3: Quick Bites, Pasta, Mojito
    const col3 = [
      ...sections.filter(s => s.title.toLowerCase().includes('quick bites')),
      ...sections.filter(s => s.title.toLowerCase().includes('pasta')),
      ...sections.filter(s => s.title.toLowerCase().includes('mojito'))
    ];
    return [col1, col2, col3];
  };

  const getPage2Columns = (sections) => {
    // Col 1: Cold Coffee
    const col1 = [
      ...sections.filter(s => s.title.toLowerCase().includes('coffee'))
    ];
    // Col 2: Fruit Juice
    const col2 = [
      ...sections.filter(s => s.title.toLowerCase().includes('juice'))
    ];
    // Col 3: Customized Pizza + Extras
    const col3 = [
      ...sections.filter(s => s.title.toLowerCase().includes('customized pizza')),
      ...sections.filter(s => s.title.toLowerCase().includes('extra')),
      ...sections.filter(s =>
      (!col1.includes(s) && !col2.includes(s) &&
        !s.title.toLowerCase().includes('customized pizza') &&
        !s.title.toLowerCase().includes('extra') &&
        !sections.find(p => p.id === s.id && getPage1Columns(sections).flat().includes(p))))
    ];
    return [col1, col2, col3];
  };

  const page1Cols = getPage1Columns(allSections);
  const page2Cols = getPage2Columns(allSections);

  // Helper to find the "real" owner page for a section (for state updates)
  const getOwnerPage = (sectionId) => {
    return menuData.page1.find(s => s.id === sectionId) ? 'page1' : 'page2';
  };

  return (
    <div className="min-h-screen flex flex-row bg-sage">
      {/* Permanent Admin Sidebar */}
      <AdminDrawer />

      {/* Main Menu Area */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col items-center py-10 md:py-16 gap-10">
      {/* Header Dashboard Area */}
      <div className="flex flex-col items-center gap-6 no-print">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-serif font-black text-deep-green uppercase tracking-[0.4em]">
            Food Menu
          </h2>
          <div className="w-20 h-1 bg-soft-gold mx-auto rounded-full opacity-60" />
        </div>
      </div>

      {/* Printable Menu Sheets */}
      <div 
        className="relative transition-transform duration-300 ease-out"
        style={{ 
          transform: `scale(${scaleFactor})`, 
          transformOrigin: 'top center',
          marginBottom: scaleFactor < 1 ? `-${(1 - scaleFactor) * 800}px` : '0'
        }}
      >
        <AnimatePresence mode="wait">
          {activePage === 'page1' ? (
            <motion.div
              key="page1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="no-print"
            >
              <MenuPage pageKey="page1">
                <div className="flex flex-col h-full">
                  {/* Branding Area - Optimized Spacing */}
                  <div className="mb-3 pb-3 border-b border-soft-gold/20">
                    <BrandingSection />
                  </div>

                  {/* Premium 3-Column Grid - Compact Gaps */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-x-7 gap-y-4 content-start">
                    {page1Cols.map((column, colIdx) => (
                      <div key={`col-${colIdx}`} className="flex flex-col gap-4">
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
              className="no-print"
            >
              <MenuPage pageKey="page2">
                <div className="h-full flex flex-col pt-0">
                  {/* Grid for Page 2 - Also balanced now */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-x-7 gap-y-4">
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

      {/* Print Hidden Container - Locked for A4 Landscape Output */}
      <div className="absolute top-[-9999px] left-[-9999px] print:static print:flex print:flex-col print:gap-4">
        <MenuPage pageKey="page1">
          <div className="flex flex-col h-full">
            <div className="mb-3 pb-3 border-b border-soft-gold/20">
              <BrandingSection />
            </div>
            <div className="flex-1 grid grid-cols-3 gap-x-7 gap-y-4 content-start">
              {page1Cols.map((column, colIdx) => (
                <div key={`print-col-${colIdx}`} className="flex flex-col gap-4">
                  {column.map((section, index) => (
                    <MenuSection key={section.id} page={getOwnerPage(section.id)} section={section} index={index} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </MenuPage>
        <div className="h-4" />
        <MenuPage pageKey="page2">
          <div className="h-full flex flex-col pt-0">
            <div className="flex-1 grid grid-cols-3 gap-x-7 gap-y-4">
              {page2Cols.map((column, colIdx) => (
                <div key={`print-page2-col-${colIdx}`} className="flex flex-col gap-4">
                  {column.map((section, index) => (
                    <MenuSection key={section.id} page={getOwnerPage(section.id)} section={section} index={index + 1} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </MenuPage>
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
