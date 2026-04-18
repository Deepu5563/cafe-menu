"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';

export default function MenuPage({ pageKey, children }) {
  const { menuData } = useMenu();

  return (
    <div className="a4-page flex flex-col">
      {/* Page Content padding - Standardized 35px is now strictly handled by .a4-page in globals.css */}
      <div className="flex-1 flex flex-col relative z-20 overflow-hidden">
        {children}
      </div>

      {/* Combined Single-Line Premium Footer */}
      <div className="mt-4 pt-2 pb-1 border-t border-soft-gold/30 flex items-center justify-between w-full px-2 no-print-background relative z-10 text-[9.5px] font-bold uppercase tracking-[0.1em] text-deep-green/80">
        <div className="flex items-center gap-4">
          <span>{menuData.contact.address}</span>
          <div className="w-1 h-1 bg-soft-gold/40 rounded-full" />
          <span>PHONE: {menuData.contact.phone}</span>
        </div>
        
        <div className="flex items-center gap-6 text-muted-green/70">
          <span>Extra 10 for parcel</span>
          <div className="w-1 h-1 bg-soft-gold/40 rounded-full" />
          <span>Order us @ Zomato and Swiggy</span>
        </div>
      </div>
    </div>
  );
}
