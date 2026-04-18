"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';
import EditableText from './EditableText';

export default function BrandingSection() {
  const { menuData, updateMenuData } = useMenu();

  return (
    <div className="w-full flex flex-col justify-center items-center py-2 bg-sage/5 rounded-xl">
      <div className="text-center">

        <h1 className="text-2xl md:text-3xl font-serif font-extrabold tracking-[0.25em] text-deep-green leading-tight uppercase">
          <EditableText 
            value={menuData.restaurantName} 
            onSave={(val) => updateMenuData({ restaurantName: val })}
          />
        </h1>
        
        {/* Spaced Tagline - Premium Feel */}
        <div className="pt-1">
          <EditableText
            value={menuData.tagline}
            onSave={(val) => updateMenuData({ tagline: val })}
            className="text-[10px] font-sans font-medium text-muted-green uppercase tracking-[0.4em] opacity-80"
          />
        </div>
      </div>
    </div>
  );
}

