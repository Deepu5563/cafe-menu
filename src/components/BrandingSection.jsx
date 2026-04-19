"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';
import EditableText from './EditableText';

export default function BrandingSection() {
  const { menuData, updateMenuData } = useMenu();

  return (
    <div className="w-full flex flex-col justify-center items-center py-0">
      <div className="text-center">

        <h1 className="text-[22px] md:text-[24px] font-serif font-extrabold tracking-[0.2em] text-deep-green leading-tight uppercase">
          <EditableText
            value={menuData.restaurantName}
            onSave={(val) => updateMenuData({ restaurantName: val })}
          />
        </h1>

        {/* Spaced Tagline - Premium Feel */}
        <div className="pt-0.5">
          <EditableText
            value={menuData.tagline}
            onSave={(val) => updateMenuData({ tagline: val })}
            className="text-[9px] font-sans font-medium text-muted-green uppercase tracking-[0.3em] opacity-80"
          />
        </div>
      </div>
    </div>
  );
}

