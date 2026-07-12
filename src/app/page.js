"use client";

import React, { useState } from 'react';
import { MenuProvider, useMenu } from '@/context/MenuContext';
import MenuPage from '@/components/MenuPage';
import MenuSection from '@/components/MenuSection';
import BrandingSection from '@/components/BrandingSection';
import PageSwitcher from '@/components/PageSwitcher';
import AdminBar from '@/components/AdminBar';
import AdminDrawer from '@/components/AdminDrawer';
import { GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function MenuApp() {
  const { menuData, activePage, isLoaded, isAdmin, reorderSections } = useMenu();
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  // Pool all sections and remove Customized Pizza
  const allSections = Array.from(
    new Map([...menuData.page1, ...menuData.page2].map(s => [s.id, s])).values()
  ).filter(s => s.title.toLowerCase() !== 'customized pizza');

  // Manual 5-column layout driven by each section's col/order (set by drag & drop).
  const columns = [[], [], [], [], []];
  for (const s of allSections) {
    const c = Math.min(4, Math.max(0, s.col ?? 0));
    columns[c].push(s);
  }
  columns.forEach(col => col.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));

  // Move the dragged section into targetCol, before `beforeId`
  // (or to the end of the column when beforeId is null).
  const handleDrop = (targetCol, beforeId = null) => {
    setDragOverCol(null);
    const id = draggedId;
    setDraggedId(null);
    if (!id || beforeId === id) return;
    const dragged = allSections.find(s => s.id === id);
    if (!dragged) return;

    const next = columns.map(col => col.filter(s => s.id !== id));
    const target = next[targetCol];
    let insertAt = target.length;
    if (beforeId) {
      const bi = target.findIndex(s => s.id === beforeId);
      if (bi >= 0) insertAt = bi;
    }
    target.splice(insertAt, 0, dragged);
    reorderSections(next);
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

                    {isAdmin && (
                      <div className="mb-1 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gold no-print">
                        Drag the handle on a section to move it to any column
                      </div>
                    )}

                    {/* Manual 5-column grid — drag & drop in Edit Mode */}
                    <div className="grid grid-cols-1 md:grid-cols-5 print:grid-cols-5 gap-x-4 gap-y-2 flex-1 min-h-0 overflow-y-visible pr-1 print:overflow-visible items-stretch pb-3">
                      {columns.map((column, colIdx) => (
                        <div
                          key={`col-${colIdx}`}
                          onDragOver={isAdmin ? (e) => { e.preventDefault(); setDragOverCol(colIdx); } : undefined}
                          onDrop={isAdmin ? (e) => { e.preventDefault(); handleDrop(colIdx, null); } : undefined}
                          className={`flex flex-col gap-2 print:gap-3 justify-between h-full rounded-lg transition-colors ${
                            isAdmin && dragOverCol === colIdx ? 'bg-gold/10 outline outline-2 outline-dashed outline-gold/50' : ''
                          }`}
                        >
                          {column.map((section, index) => (
                            <div
                              key={section.id}
                              onDragOver={isAdmin ? (e) => { e.preventDefault(); e.stopPropagation(); setDragOverCol(colIdx); } : undefined}
                              onDrop={isAdmin ? (e) => { e.preventDefault(); e.stopPropagation(); handleDrop(colIdx, section.id); } : undefined}
                              className={`relative ${draggedId === section.id ? 'opacity-40' : ''}`}
                            >
                              {isAdmin && (
                                <div
                                  draggable
                                  onDragStart={(e) => { setDraggedId(section.id); e.dataTransfer.effectAllowed = 'move'; }}
                                  onDragEnd={() => { setDraggedId(null); setDragOverCol(null); }}
                                  title="Drag to move this section"
                                  className="absolute left-1 top-1 z-30 p-1 rounded-md bg-gold text-deep-green shadow-md cursor-grab active:cursor-grabbing no-print"
                                >
                                  <GripVertical size={14} />
                                </div>
                              )}
                              <MenuSection page="page1" section={section} index={index} />
                            </div>
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
