"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';

export default function MenuPage({ pageKey, children }) {
  const { menuData } = useMenu();

  return (
    <div className="a4-page bg-cream text-deep-green p-4 flex flex-col">
      {/* Overall Outer Border */}
      <div className="flex-1 border-[6px] border-double border-gold/40 flex flex-col relative">
        {/* Subtle Inner Frame Decoration */}
        <div className="absolute top-4 left-4 right-4 bottom-4 border border-gold/10 pointer-events-none" />

        {/* Page Content padding */}
        <div className="flex-1 flex flex-col p-8 md:p-12 relative z-10">
          {children}
        </div>

        {/* Footer (Inside the border) */}
        <div className="p-6 bg-sage/10 border-t border-gold/20 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-deep-green/60">
          <div className="flex items-center gap-4">
            <span className="text-deep-green">{menuData.contact.phone}</span>
            <div className="w-1 h-1 bg-gold rounded-full" />
            <span className="italic font-medium">Extra ₹10 Per Parcel</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[#cb202d] opacity-80 decoration-gold/30 underline-offset-4 underline">Zomato</span>
            <span className="text-[#fc8019] opacity-80 decoration-gold/30 underline-offset-4 underline">Swiggy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
