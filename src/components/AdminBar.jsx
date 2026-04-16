"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';
import { Settings, Eye, PlusSquare, Printer, Layout } from 'lucide-react';

export default function AdminBar() {
  const { isAdmin, setIsAdmin, addSection, activePage } = useMenu();

  return (
    <div className="fixed bottom-8 right-8 z-50 no-print group">
      <div className="flex flex-col-reverse items-end gap-3 transition-all">
        {/* Expanded Controls */}
        <div className={`overflow-hidden transition-all duration-300 flex flex-col gap-2 ${isAdmin ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90 pointer-events-none'}`}>
          <button 
            onClick={() => addSection(activePage)}
            className="flex items-center gap-3 px-5 py-2.5 bg-white text-deep-green rounded-2xl shadow-xl hover:bg-gold hover:text-deep-green transition-all whitespace-nowrap border border-black/5"
          >
            <PlusSquare size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Add Section</span>
          </button>
          
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-3 px-5 py-2.5 bg-gold text-deep-green rounded-2xl shadow-xl hover:bg-deep-green hover:text-white transition-all whitespace-nowrap border border-black/5"
          >
            <Printer size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Print Menu</span>
          </button>
        </div>

        {/* Main Toggle Button */}
        <button 
          onClick={() => setIsAdmin(!isAdmin)}
          className={`flex items-center gap-3 px-6 py-4 rounded-3xl shadow-2xl transition-all duration-500 border-2 ${
            isAdmin 
            ? 'bg-deep-green text-cream border-gold scale-110' 
            : 'bg-white text-deep-green hover:bg-zinc-50 border-transparent'
          }`}
        >
          {isAdmin ? <Layout size={20} className="animate-pulse" /> : <Settings size={20} />}
          <span className="text-xs font-black uppercase tracking-[0.2em]">{isAdmin ? 'EDIT MODE' : 'MANAGE'}</span>
        </button>
      </div>
    </div>
  );
}
