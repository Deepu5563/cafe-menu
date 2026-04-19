"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';

export default function MenuPage({ pageKey, children }) {
  const { menuData } = useMenu();

  return (
    <div className="a4-page flex flex-col min-h-full">
      {/* Page Content area */}
      <div className="flex-1 flex flex-col relative z-20 overflow-visible print-content-wrapper min-h-0">
        {children}
      </div>

      {/* Strict Single-Line Baseline Footer */}
      <div className="mt-auto pt-3 pb-2 border-t border-soft-gold/30 flex items-center justify-between w-full px-4 relative z-10 text-[12px] font-black uppercase tracking-[0.1em] text-[#111827] print-footer-neat whitespace-nowrap overflow-hidden">
        <div className="flex items-center gap-2 justify-between w-full">
          <span className="shrink-0">Parcel Charges 10/-</span>
          <div className="w-1.5 h-1.5 bg-soft-gold/50 rounded-full shrink-0" />
          <span className="truncate">{menuData.contact.address}</span>
          <div className="w-1.5 h-1.5 bg-soft-gold/50 rounded-full shrink-0" />
          <span className="shrink-0">Phone: {menuData.contact.phone}</span>
          <div className="w-1.5 h-1.5 bg-soft-gold/50 rounded-full shrink-0" />
          <span className="flex items-center gap-1.5 shrink-0">
            ORDER US WITH
            <span className="text-[#fc8019]">SWIGGY</span>
            AND
            <span className="text-[#cb202d]">ZOMATO</span>
          </span>
        </div>
      </div>
    </div>
  );
}
