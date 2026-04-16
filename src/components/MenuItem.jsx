"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';
import EditableText from './EditableText';
import { Trash2 } from 'lucide-react';

export default function MenuItem({ page, sectionId, item }) {
  const { isAdmin, updateItem, deleteItem } = useMenu();

  return (
    <div className="group relative py-2 transition-all flex flex-col w-full text-left">
      <div className="flex items-baseline w-full gap-2">
        <EditableText 
          value={item.name} 
          onSave={(val) => updateItem(page, sectionId, item.id, { name: val })}
          className="text-sm font-serif font-bold text-deep-green uppercase tracking-wider text-left"
        />
        
        {/* Dotted Leader */}
        <div className="flex-1 border-b border-dotted border-gold/30 mb-1.5 opacity-50" />
        
        <div className="flex items-center gap-1 min-w-fit">
          <span className="text-[10px] text-gold font-bold">₹</span>
          <EditableText 
            value={item.price} 
            onSave={(val) => updateItem(page, sectionId, item.id, { price: val })}
            className="text-sm font-serif font-extrabold text-deep-green text-right"
          />
          {isAdmin && (
            <button 
              onClick={() => deleteItem(page, sectionId, item.id)}
              className="ml-2 p-1 text-red-300 hover:text-red-500 transition-opacity no-print"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
      
      <EditableText 
        value={item.description} 
        onSave={(val) => updateItem(page, sectionId, item.id, { description: val })}
        useTextarea={true}
        className="text-[11px] text-dark-gray/50 font-sans tracking-wide leading-relaxed block mt-0.5 max-w-[85%] text-left"
      />
    </div>
  );
}
