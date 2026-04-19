"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';
import EditableText from './EditableText';
import MenuItem from './MenuItem';
import ImageUploader from './ImageUploader';
import { PlusCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MenuSection({ page, section, index }) {
  const { isAdmin, updateSection, deleteSection, addItem } = useMenu();

  return (
    <div className="mb-0 break-inside-avoid w-full h-fit flex flex-col">
      <div className="menu-card flex flex-col px-5 py-3 print:px-3 print:py-2 w-full h-fit">
        {/* Section Image - High End visual reference */}
        <ImageUploader
          currentImage={section.image}
          fit={section.fit || 'cover'}
          isAdmin={isAdmin}
          onSave={(url) => updateSection(page, section.id, { image: url })}
          onToggleFit={() => updateSection(page, section.id, { fit: section.fit === 'contain' ? 'cover' : 'contain' })}
        />

        {/* Section Header - High Precision Styling */}
        <div className="flex flex-col mb-1.5 print:mb-1 w-full">
          <div className="flex items-center justify-between w-full">
            <EditableText
              value={section.title}
              onSave={(val) => updateSection(page, section.id, { title: val })}
              className="text-[18px] font-serif text-deep-green tracking-[0.15em] font-semibold uppercase whitespace-nowrap"
            />
            {isAdmin && (
              <button
                onClick={() => deleteSection(page, section.id)}
                className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all no-print"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          {/* Subtle Precise Divider */}
          <div className="w-full h-px bg-card-border mt-0.5 mb-1" />
        </div>

        {/* Items List - Scalable and Balanced */}
        <div className="flex-1 flex flex-col gap-1.5 w-full">
          <AnimatePresence mode="popLayout">
            {section.items.map((item, idx) => (
              <MenuItem
                key={item.id}
                page={page}
                sectionId={section.id}
                item={item}
                isLast={idx === section.items.length - 1}
                hidePrice={section.title.toLowerCase().includes('customized pizza')}
              />
            ))}
          </AnimatePresence>
        </div>

        {isAdmin && (
          <div className="mt-2 w-full flex justify-center">
            <button
              onClick={() => addItem(page, section.id)}
              className="flex items-center gap-1.5 text-[8.5px] text-muted-green hover:text-deep-green transition-all font-bold uppercase tracking-widest border border-soft-gold/30 px-3 py-1 rounded-md hover:bg-soft-gold/10 no-print"
            >
              <PlusCircle size={12} />
              Add Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
