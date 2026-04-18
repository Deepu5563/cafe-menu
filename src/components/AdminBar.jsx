"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';
import { Settings, Eye, PlusSquare, Printer, Layout, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminBar() {
  const { isDrawerOpen, setIsDrawerOpen, isAdmin } = useMenu();

  return (
    <div className="fixed bottom-10 right-10 z-[102] no-print flex flex-col items-end gap-5 transition-all">
      {/* Small Hint Label above button */}
      {!isDrawerOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-deep-green text-cream px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border-2 border-gold/30"
        >
          {isAdmin ? 'Edit Mode: Active' : 'Administrative Center'}
        </motion.div>
      )}

      {/* Main Trigger Button - EXTRA LARGE */}
      <button 
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className={`flex items-center gap-5 px-10 py-6 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-500 border-4 animate-in fade-in slide-in-from-bottom-4 ${
          isDrawerOpen 
          ? 'bg-gold text-deep-green border-deep-green scale-105' 
          : 'bg-white text-deep-green hover:bg-zinc-50 border-white hover:border-soft-gold hover:-translate-y-2'
        }`}
      >
        {isDrawerOpen ? <X size={28} /> : <Settings size={28} />}
        {!isDrawerOpen && (
          <span className="text-sm font-black uppercase tracking-[0.3em]">
            MANAGE
          </span>
        )}
      </button>
    </div>
  );
}
