"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';
import { 
  PlusSquare, 
  Printer, 
  Edit3, 
  ShieldCheck,
  Layout
} from 'lucide-react';

export default function AdminDrawer() {
  const { 
    isAdmin, 
    setIsAdmin, 
    addSection, 
    activePage,
    setActivePage
  } = useMenu();

  const menuActions = [
    {
      id: 'edit-mode',
      label: isAdmin ? 'Viewing Mode' : 'Editing Mode',
      icon: isAdmin ? ShieldCheck : Edit3,
      action: () => setIsAdmin(!isAdmin),
      active: isAdmin,
    },
    {
      id: 'add-section',
      label: 'Add New Section',
      icon: PlusSquare,
      action: () => addSection(activePage),
      active: false,
    },
    {
      id: 'print',
      label: 'Print Menu',
      icon: Printer,
      action: () => window.print(),
      active: false,
    }
  ];

  return (
    <div 
      className="min-w-[280px] w-[280px] h-screen sticky top-0 bg-[#f8f9fb] flex flex-col no-print border-r border-[#e5e7eb] z-50 pr-4 pt-8 pb-6"
      style={{ paddingLeft: '40px' }}
    >
      
      {/* 1. Header Section - CENTERED within the padded container */}
      <div className="flex flex-col items-center text-center mb-10 w-full">
        <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mb-4 shadow-lg border-2 border-white shrink-0">
          <div className="text-gold font-serif font-black text-2xl tracking-tighter">UB</div>
        </div>
        <h2 className="text-[17px] font-serif font-black text-[#111827] uppercase tracking-[0.3em] leading-tight mb-2">
          The Urban Bites
        </h2>
        <div className="w-8 h-[2px] bg-gold opacity-60 rounded-full" />
      </div>

      {/* 2. Navigation Section - ALL LEFT ALIGNED */}
      <div className="flex-1 flex flex-col w-full">
        
        {/* Group: Select Sheet */}
        <div className="mb-6">
          <p className="text-[11px] font-serif font-black uppercase tracking-[0.1em] text-[#6b7280] mb-3">
            Select Sheet
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setActivePage('page1')}
              className={`h-10 w-full flex items-center justify-start px-3 rounded-lg transition-all text-[11px] font-serif font-black uppercase tracking-[0.2em] ${
                activePage === 'page1' 
                ? 'bg-[#111827] text-white shadow-xl' 
                : 'bg-white text-[#4b5563] border border-[#e5e7eb] hover:bg-[#f1f5f9]'
              }`}
            >
              Sheet One
            </button>
            <button
              onClick={() => setActivePage('page2')}
              className={`h-10 w-full flex items-center justify-start px-3 rounded-lg transition-all text-[11px] font-serif font-black uppercase tracking-[0.2em] ${
                activePage === 'page2' 
                ? 'bg-[#111827] text-white shadow-xl' 
                : 'bg-white text-[#4b5563] border border-[#e5e7eb] hover:bg-[#f1f5f9]'
              }`}
            >
              Sheet Two
            </button>
          </div>
        </div>

        {/* Group: Management Tools */}
        <div className="mb-8">
          <p className="text-[11px] font-serif font-black uppercase tracking-[0.1em] text-[#6b7280] mb-3">
            Management Tools
          </p>
          <div className="flex flex-col gap-2">
            {menuActions.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`h-10 w-full flex items-center justify-start gap-3 px-3 rounded-lg transition-all duration-150 ease-in-out group ${
                  item.active 
                  ? 'bg-[#eef2ff] text-[#111827]' 
                  : 'text-[#4b5563] hover:bg-[#f1f5f9]'
                }`}
              >
                <item.icon 
                  size={18} 
                  className={`${item.active ? 'text-[#111827]' : 'text-[#9ca3af] group-hover:text-[#4b5563]'}`} 
                />
                <span className={`text-[11px] font-serif font-black uppercase tracking-[0.15em] ${item.active ? 'text-[#111827]' : 'text-inherit'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Footer Section - Pushed to bottom */}
        <div className="mt-auto pt-6 border-t border-[#e5e7eb] flex flex-col gap-2 font-serif">
          {[
            { label: 'Active Page', value: activePage === 'page1' ? 'Sheet 1' : 'Sheet 2' },
            { label: 'Edit State', value: isAdmin ? 'R/W' : 'Read-Only' },
            { label: 'Canvas', value: 'A4 Landscape' }
          ].map((stat, i) => (
            <div 
              key={i}
              className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-[#6b7280]"
            >
              <span>{stat.label}</span>
              <span className="text-[#111827]">{stat.value}</span>
            </div>
          ))}
          
          <div className="mt-3 flex items-center gap-2 opacity-40">
            <Layout size={14} className="text-[#111827]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#111827]">
              Urban Bites Studio
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
