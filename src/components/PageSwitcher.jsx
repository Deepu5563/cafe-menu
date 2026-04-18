"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';
import { FileText, Printer } from 'lucide-react';

export default function PageSwitcher() {
  const { activePage, setActivePage, isAdmin } = useMenu();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-0 bg-white shadow-2xl border-2 border-soft-gold no-print rounded-none">
      <button
        onClick={() => setActivePage('page1')}
        className={`flex items-center justify-center gap-3 px-10 py-6 transition-all font-serif rounded-none ${
          activePage === 'page1' 
          ? 'bg-deep-green text-cream shadow-inner' 
          : 'text-deep-green/60 hover:bg-deep-green/5'
        }`}
      >
        <span className="text-[14px] font-black uppercase tracking-widest leading-none">Sheet One</span>
      </button>
      <button
        onClick={() => setActivePage('page2')}
        className={`flex items-center justify-center gap-3 px-10 py-6 transition-all font-serif rounded-none ${
          activePage === 'page2' 
          ? 'bg-deep-green text-cream shadow-inner' 
          : 'text-deep-green/60 hover:bg-deep-green/5'
        }`}
      >
        <span className="text-[14px] font-black uppercase tracking-widest leading-none">Sheet Two</span>
      </button>
    </div>
  );
}
