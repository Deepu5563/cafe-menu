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
    <div className="flex items-center gap-1 bg-deep-green/5 p-1 rounded-xl no-print">
      <button
        onClick={() => setActivePage('page1')}
        className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all font-serif ${
          activePage === 'page1' 
          ? 'bg-deep-green text-cream shadow-lg' 
          : 'text-deep-green/60 hover:bg-deep-green/10'
        }`}
      >
        <FileText size={18} />
        Sheet One
      </button>
      <button
        onClick={() => setActivePage('page2')}
        className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all font-serif ${
          activePage === 'page2' 
          ? 'bg-deep-green text-cream shadow-lg' 
          : 'text-deep-green/60 hover:bg-deep-green/10'
        }`}
      >
        <FileText size={18} />
        Sheet Two
      </button>

      <div className="w-px h-6 bg-deep-green/10 mx-2" />

      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gold text-deep-green font-bold shadow-md hover:bg-gold/80 transition-all font-serif"
      >
        <Printer size={18} />
        Print Menu
      </button>
    </div>
  );
}
