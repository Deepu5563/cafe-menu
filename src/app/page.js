"use client";

import React from 'react';
import { MenuProvider, useMenu } from '@/context/MenuContext';
import MenuPage from '@/components/MenuPage';
import MenuSection from '@/components/MenuSection';
import BrandingSection from '@/components/BrandingSection';
import PageSwitcher from '@/components/PageSwitcher';
import AdminBar from '@/components/AdminBar';
import { motion, AnimatePresence } from 'framer-motion';

function MenuApp() {
  const { menuData, activePage } = useMenu();

  return (
    <div className="min-h-screen bg-sage/10 flex flex-col items-center py-12 md:py-20 gap-8">
      {/* Header Dashboard Area */}
      <div className="flex flex-col items-center gap-6 no-print">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-serif font-black text-deep-green uppercase tracking-[0.3em]">
            Menu Studio
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
        </div>
        <PageSwitcher />
      </div>

      {/* Printable Menu Sheets */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activePage === 'page1' ? (
            <motion.div
              key="page1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <MenuPage pageKey="page1">
                <div className="flex flex-col h-full gap-12">
                  {/* Full Width Branding */}
                  <div className="border-b-2 border-gold/10 pb-12">
                    <BrandingSection />
                  </div>
                  
                  {/* Two-Column Zigzag Flow for Page 1 */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 py-4">
                    {menuData.page1.map((section, index) => (
                      <MenuSection key={section.id} page="page1" section={section} index={index} />
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
            >
              <MenuPage pageKey="page2">
                <div className="h-full flex flex-col pt-12">
                  {/* Grid for Page 2 */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                    {menuData.page2.map((section, index) => (
                      <MenuSection key={section.id} page="page2" section={section} index={index + 1} />
                    ))}
                  </div>
                </div>
              </MenuPage>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AdminBar />

      {/* Simplified Print Hidden Container */}
      <div className="absolute top-[-9999px] left-[-9999px] print:static print:flex print:flex-col print:gap-12">
        <MenuPage pageKey="page1">
           <div className="flex flex-col h-full gap-12">
              <div className="border-b-2 border-gold/10 pb-12">
                <BrandingSection />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-x-16 gap-y-12 py-4">
                {menuData.page1.map((section, index) => (
                  <MenuSection key={section.id} page="page1" section={section} index={index} />
                ))}
              </div>
           </div>
        </MenuPage>
        <div className="h-4" />
        <MenuPage pageKey="page2">
           <div className="h-full flex flex-col pt-12">
              <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-12">
                {menuData.page2.map((section, index) => (
                  <MenuSection key={section.id} page="page2" section={section} index={index + 1} />
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
