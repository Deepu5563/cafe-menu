"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';
import EditableText from './EditableText';
import { Trash2 } from 'lucide-react';

export default function MenuItem({ page, sectionId, item, isLast, hidePrice }) {
  const { isAdmin, updateMenuItem, deleteMenuItem } = useMenu();

  return (
    <div className={`group relative flex flex-col w-full text-left py-0.5 print:py-[1px] ${!isLast ? 'border-b border-dotted border-[rgba(31,61,43,0.15)]' : 'pb-0'}`}>
      <div className="flex justify-between items-baseline w-full gap-1.5">
        <EditableText
          value={item.name}
          onSave={(val) => updateMenuItem(page, sectionId, item.id, { name: val })}
          className="text-[13px] font-sans font-medium text-deep-green uppercase tracking-wide text-left leading-snug flex-1"
        />

        {!hidePrice && (
          <div className="flex items-center min-w-[50px] justify-end pr-2">
            <span className="text-[9px] text-soft-gold font-bold mr-0.5 self-center">₹</span>
            <EditableText
              value={item.price}
              onSave={(val) => updateMenuItem(page, sectionId, item.id, { price: val })}
              className="text-[14px] font-serif font-bold text-deep-green text-right tabular-nums tracking-normal flex-none"
            />
            {isAdmin && (
              <button
                onClick={() => deleteMenuItem && deleteMenuItem(page, sectionId, item.id)}
                className="ml-2 p-1 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all no-print flex-none"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        )}
        {hidePrice && isAdmin && (
          <button
            onClick={() => deleteMenuItem && deleteMenuItem(page, sectionId, item.id)}
            className="ml-2 p-1 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all no-print flex-none"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {item.description && (
        <EditableText
          value={item.description}
          onSave={(val) => updateItem(page, sectionId, item.id, { description: val })}
          useTextarea={true}
          className="text-[9px] text-muted-green/60 font-sans tracking-wide leading-snug block mt-0 max-w-[90%] text-left"
        />
      )}
    </div>
  );
}
