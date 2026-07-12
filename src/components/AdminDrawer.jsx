"use client";

import React from 'react';
import { useMenu } from '@/context/MenuContext';
import { useTheme } from '@/context/ThemeContext';
import { THEME_SLOTS, THEME_PRESETS, DEFAULT_THEME } from '@/lib/theme';
import {
  PlusSquare,
  Printer,
  Edit3,
  Eye,
  RotateCcw,
  Palette,
  Layout,
  MousePointerClick,
  Image as ImageIcon,
  ImageOff
} from 'lucide-react';

export default function AdminDrawer() {
  const {
    isAdmin,
    setIsAdmin,
    addSection,
    activePage,
    setActivePage,
    reseedData
  } = useMenu();

  const { theme, previewTheme, commitTheme, showImages, setShowImages } = useTheme();

  const handlePreview = (key, value) => previewTheme({ ...theme, [key]: value });
  const handleCommit = () => commitTheme(theme);

  return (
    <div
      className="hidden lg:flex w-72 flex-shrink-0 h-screen sticky top-0 bg-[#f8f9fb] flex-col no-print border-r border-[#e5e7eb] z-50 overflow-y-auto pr-4 pt-8 pb-6"
      style={{ paddingLeft: '32px' }}
    >

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8 w-full">
        <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mb-4 shadow-lg border-2 border-white shrink-0">
          <div className="text-gold font-serif font-black text-2xl tracking-tighter">UB</div>
        </div>
        <h2 className="text-[16px] font-serif font-black text-[#111827] uppercase tracking-[0.28em] leading-tight mb-2">
          The Urban Bites
        </h2>
        <div className="w-8 h-[2px] bg-gold opacity-60 rounded-full" />
      </div>

      {/* 1. EDIT MODE — the primary action, made obvious */}
      <button
        onClick={() => setIsAdmin(!isAdmin)}
        className={`w-full rounded-xl p-4 mb-3 text-left transition-all border-2 ${
          isAdmin
            ? 'bg-[#111827] border-[#111827] text-white shadow-xl'
            : 'bg-white border-[#e5e7eb] text-[#111827] hover:border-gold'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            isAdmin ? 'bg-gold text-[#111827]' : 'bg-[#f1f5f9] text-[#4b5563]'
          }`}>
            {isAdmin ? <Edit3 size={20} /> : <Eye size={20} />}
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-serif font-black uppercase tracking-[0.12em]">
              {isAdmin ? 'Editing: ON' : 'Editing: OFF'}
            </div>
            <div className={`text-[10px] font-medium mt-0.5 ${isAdmin ? 'text-white/70' : 'text-[#6b7280]'}`}>
              {isAdmin ? 'Tap to finish & preview' : 'Tap to start editing'}
            </div>
          </div>
        </div>
      </button>

      {/* Contextual help while editing */}
      {isAdmin && (
        <div className="mb-6 rounded-lg bg-[#eef2ff] border border-[#dbe1ff] p-3 flex gap-2.5">
          <MousePointerClick size={16} className="text-[#4f46e5] shrink-0 mt-0.5" />
          <p className="text-[10.5px] leading-relaxed text-[#3730a3]">
            Click any <strong>name</strong>, <strong>price</strong>, or <strong>title</strong> on the menu to change it.
            Hover a section image to replace it. Changes save automatically.
          </p>
        </div>
      )}

      {/* 2. Select Sheet */}
      <div className="mb-6">
        <p className="text-[11px] font-serif font-black uppercase tracking-[0.1em] text-[#6b7280] mb-3">
          Select Sheet
        </p>
        <div className="grid grid-cols-2 gap-2">
          {['page1', 'page2'].map((pg, i) => (
            <button
              key={pg}
              onClick={() => setActivePage(pg)}
              className={`h-10 flex items-center justify-center rounded-lg transition-all text-[11px] font-serif font-black uppercase tracking-[0.15em] ${
                activePage === pg
                  ? 'bg-[#111827] text-white shadow-lg'
                  : 'bg-white text-[#4b5563] border border-[#e5e7eb] hover:bg-[#f1f5f9]'
              }`}
            >
              {i === 0 ? 'Sheet 1' : 'Sheet 2'}
            </button>
          ))}
        </div>
      </div>

      {/* Section images on/off */}
      <button
        onClick={() => setShowImages(!showImages)}
        className={`w-full mb-6 flex items-center gap-3 rounded-xl p-3 text-left transition-all border-2 ${
          showImages
            ? 'bg-white border-[#e5e7eb] text-[#111827] hover:border-gold'
            : 'bg-[#111827] border-[#111827] text-white'
        }`}
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
          showImages ? 'bg-[#f1f5f9] text-[#4b5563]' : 'bg-gold text-[#111827]'
        }`}>
          {showImages ? <ImageIcon size={18} /> : <ImageOff size={18} />}
        </div>
        <div className="flex-1">
          <div className="text-[12px] font-serif font-black uppercase tracking-[0.12em]">
            Section Images: {showImages ? 'On' : 'Off'}
          </div>
          <div className={`text-[9.5px] font-medium mt-0.5 ${showImages ? 'text-[#6b7280]' : 'text-white/70'}`}>
            {showImages ? 'Tap to hide all images' : 'Tap to show images again'}
          </div>
        </div>
      </button>

      {/* 3. THEME & COLORS */}
      <div className="mb-6">
        <p className="text-[11px] font-serif font-black uppercase tracking-[0.1em] text-[#6b7280] mb-3 flex items-center gap-1.5">
          <Palette size={13} /> Theme &amp; Colors
        </p>

        {/* Presets */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => commitTheme(preset.colors)}
              className="group flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-2.5 py-2 hover:border-gold transition-all"
              title={`Apply ${preset.name}`}
            >
              <span className="flex -space-x-1 shrink-0">
                {[preset.colors.background, preset.colors.card, preset.colors.heading, preset.colors.accent].map((c, idx) => (
                  <span key={idx} className="w-3.5 h-3.5 rounded-full border border-white/80" style={{ backgroundColor: c }} />
                ))}
              </span>
              <span className="text-[9.5px] font-bold uppercase tracking-wide text-[#4b5563] group-hover:text-[#111827] truncate">
                {preset.name}
              </span>
            </button>
          ))}
        </div>

        {/* Individual color slots */}
        <div className="flex flex-col gap-1.5">
          {THEME_SLOTS.map((slot) => (
            <label
              key={slot.key}
              className="flex items-center gap-2.5 rounded-lg border border-[#e5e7eb] bg-white px-2.5 py-1.5 cursor-pointer hover:border-[#d1d5db]"
            >
              <input
                type="color"
                value={theme[slot.key]}
                onChange={(e) => handlePreview(slot.key, e.target.value)}
                onBlur={handleCommit}
                className="w-7 h-7 rounded-md border border-[#e5e7eb] bg-transparent cursor-pointer shrink-0 p-0"
              />
              <span className="flex-1 min-w-0">
                <span className="block text-[10.5px] font-bold text-[#111827] leading-tight truncate">{slot.label}</span>
                <span className="block text-[8.5px] text-[#9ca3af] leading-tight truncate">{slot.hint}</span>
              </span>
              <span className="text-[8.5px] font-mono uppercase text-[#9ca3af] shrink-0">{theme[slot.key]}</span>
            </label>
          ))}
        </div>

        <button
          onClick={() => commitTheme(DEFAULT_THEME)}
          className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-[9.5px] font-bold uppercase tracking-widest text-[#6b7280] hover:text-[#111827] py-1.5 rounded-md hover:bg-[#f1f5f9] transition-all"
        >
          <RotateCcw size={12} /> Reset palette
        </button>
      </div>

      {/* 4. Tools */}
      <div className="mb-6">
        <p className="text-[11px] font-serif font-black uppercase tracking-[0.1em] text-[#6b7280] mb-3">
          Tools
        </p>
        <div className="flex flex-col gap-1">
          <ToolButton icon={PlusSquare} label="Add New Section" onClick={() => addSection(activePage)} />
          <ToolButton icon={Printer} label="Print Menu" onClick={() => window.print()} />
          <ToolButton icon={RotateCcw} label="Reset All Menu Data" danger onClick={() => reseedData()} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-5 border-t border-[#e5e7eb] flex flex-col gap-1.5 font-serif">
        {[
          { label: 'Active', value: activePage === 'page1' ? 'Sheet 1' : 'Sheet 2' },
          { label: 'Mode', value: isAdmin ? 'Editing' : 'Preview' },
          { label: 'Canvas', value: 'A4 Landscape' }
        ].map((stat, i) => (
          <div key={i} className="flex items-center justify-between text-[9.5px] uppercase font-bold tracking-widest text-[#6b7280]">
            <span>{stat.label}</span>
            <span className="text-[#111827]">{stat.value}</span>
          </div>
        ))}
        <div className="mt-2 flex items-center gap-2 opacity-40">
          <Layout size={13} className="text-[#111827]" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#111827]">
            Urban Bites Studio
          </span>
        </div>
      </div>
    </div>
  );
}

function ToolButton({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`h-10 w-full flex items-center gap-3 px-3 rounded-lg transition-all group ${
        danger ? 'text-[#b91c1c] hover:bg-red-50' : 'text-[#4b5563] hover:bg-[#f1f5f9]'
      }`}
    >
      <Icon size={18} className={danger ? 'text-[#dc2626]' : 'text-[#9ca3af] group-hover:text-[#4b5563]'} />
      <span className="text-[11px] font-serif font-black uppercase tracking-[0.12em]">{label}</span>
    </button>
  );
}
