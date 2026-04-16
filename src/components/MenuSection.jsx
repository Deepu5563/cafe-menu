"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';
import EditableText from './EditableText';
import MenuItem from './MenuItem';
import { PlusCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MenuSection({ page, section, index }) {
  const { isAdmin, updateSection, deleteSection, addItem } = useMenu();
  const isAlt = index % 2 !== 0;

  return (
    <div className={`mb-8 last:mb-0 break-inside-avoid w-full`}>
      <div className={`
        relative p-6 border-2 border-gold/10 rounded-xl bg-white/40 
        transition-all hover:bg-white/60 hover:border-gold/30
        flex flex-col
      `}>
        {/* Section Header (Maintains Zigzag for Heading) */}
        <div className={`flex items-center gap-4 mb-6 w-full ${isAlt ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="flex-1 h-px bg-gold/10" />
          <EditableText 
            value={section.title} 
            onSave={(val) => updateSection(page, section.id, { title: val })}
            className={`text-xl font-serif text-deep-green tracking-[0.2em] font-black uppercase whitespace-nowrap px-4 ${isAlt ? 'text-right' : 'text-left'}`}
          />
          <div className="w-12 h-px bg-gold/30" />
          
          {isAdmin && (
            <button 
              onClick={() => deleteSection(page, section.id)}
              className="p-1 text-red-300 hover:text-red-500 transition-opacity no-print"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Items List (Uniform Left/Right Alignment) */}
        <div className="space-y-4 w-full">
          <AnimatePresence mode="popLayout">
            {section.items.map((item) => (
              <MenuItem key={item.id} page={page} sectionId={section.id} item={item} />
            ))}
          </AnimatePresence>
        </div>

        {isAdmin && (
          <div className="mt-6 w-full flex justify-center">
            <button 
              onClick={() => addItem(page, section.id)}
              className="flex items-center gap-2 text-[10px] text-gold hover:text-deep-green transition-colors font-bold uppercase tracking-[0.2em] border border-gold/20 px-3 py-1.5 rounded-full hover:bg-gold/10 no-print"
            >
              <PlusCircle size={14} />
              Add Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
