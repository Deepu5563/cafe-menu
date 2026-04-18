"use client";

import React, { useState } from 'react';
import { Camera, X, Check, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageUploader({ currentImage, fit = 'cover', onSave, onToggleFit, isAdmin }) {
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState(currentImage || '');

  const handleSave = () => {
    onSave(url);
    setIsEditing(false);
  };

  if (!isAdmin) {
    if (!currentImage) return null;
    return (
      <div className="w-full max-h-[110px] aspect-video print:aspect-[21/9] print:max-h-[100px] mb-1 print:mb-2 overflow-hidden rounded-xl shadow-inner bg-[#f3f4f6]">
        <img
          src={currentImage}
          alt="Section visual"
          className={`w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} print:object-cover`}
        />
      </div>
    );
  }

  return (
    <div className="relative group w-full mb-1">
      {/* Existing Image or Placeholder */}
      <div className="w-full max-h-[110px] aspect-video print:aspect-[21/9] print:max-h-[100px] overflow-hidden rounded-xl bg-[#f3f4f6] relative border-2 border-dashed border-gray-200 group-hover:border-gold transition-colors">
        {currentImage ? (
          <img
            src={currentImage}
            alt="Section visual"
            className={`w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} print:object-cover transition-all duration-300`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Camera size={32} />
            <span className="text-[10px] uppercase font-bold tracking-widest mt-2">Add Image</span>
          </div>
        )}

        {/* Overlay Trigger */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity z-10 no-print">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/40 transition-all"
          >
            <Camera size={14} />
            Update Photo
          </button>

          {currentImage && (
            <button
              onClick={onToggleFit}
              className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/40 transition-all"
            >
              {fit === 'cover' ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              {fit === 'cover' ? 'Show Full Glass' : 'Fill Container'}
            </button>
          )}
        </div>
      </div>

      {/* Editing Modal/Popover */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-2 left-2 right-2 bg-white/95 backdrop-blur-lg p-3 rounded-lg shadow-2xl border border-gray-100 z-50 no-print"
          >
            <div className="flex flex-col gap-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-deep-green">Image URL</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-[11px] outline-none focus:border-gold"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="bg-deep-green text-white p-2 rounded hover:bg-black transition-colors"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-100 text-gray-500 p-2 rounded hover:bg-gray-200 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
