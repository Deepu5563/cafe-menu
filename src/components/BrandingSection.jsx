"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';
import EditableText from './EditableText';

export default function BrandingSection() {
  const { menuData, updateMenuData } = useMenu();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center py-12 space-y-8 bg-sage/10 rounded-xl">
      <div className="text-center space-y-4">
        {/* Simplified Aesthetic Motif */}
        <div className="flex items-center justify-center gap-4 opacity-30">
          <div className="w-8 h-px bg-deep-green" />
          <div className="w-2 h-2 rounded-full border border-deep-green" />
          <div className="w-8 h-px bg-deep-green" />
        </div>

        <h1 className="text-5xl md:text-6xl font-serif font-extrabold tracking-[0.2em] text-deep-green leading-tight uppercase">
          <EditableText 
            value={menuData.restaurantName} 
            onSave={(val) => updateMenuData({ restaurantName: val })}
          />
        </h1>
      </div>
    </div>
  );
}

