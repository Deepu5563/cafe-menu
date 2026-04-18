"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';

export default function MenuPage({ pageKey, children }) {
  const { menuData } = useMenu();

  return (
    <div className="a4-page flex flex-col h-full">
      {/* Page Content padding */}
      <div className="flex-1 flex flex-col relative z-20 overflow-visible print-content-wrapper min-h-0">
        {children}
      </div>

      {/* Combined Single-Line Premium Footer */}
      <div className="mt-1 print:mt-auto pt-2 pb-1 border-t border-soft-gold/30 flex items-center justify-between w-full px-2 relative z-10 text-[9px] font-bold uppercase tracking-[0.1em] text-deep-green/80 print-footer-neat whitespace-nowrap">
        <div className="flex items-center gap-1 flex-wrap justify-between w-full">
          <span>{menuData.contact.address}</span>
          <div className="w-1 h-1 bg-soft-gold/40 rounded-full" />
          <span>PHONE: {menuData.contact.phone}</span>
          <div className="w-1 h-1 bg-soft-gold/40 rounded-full" />
          <span>Extra 10 for parcel</span>
          <div className="w-1 h-1 bg-soft-gold/40 rounded-full" />
          <span>Order us @ Zomato and Swiggy</span>
        </div>
      </div>
    </div>
  );
}
