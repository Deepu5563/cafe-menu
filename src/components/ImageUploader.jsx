"use client";

import React, { useRef } from 'react';
import { useMenu } from '@/context/MenuContext';
import { Camera, RefreshCw } from 'lucide-react';

export default function ImageUploader({ 
  src, 
  onUpload, 
  className = "",
  aspectRatio = "aspect-square"
}) {
  const { isAdmin } = useMenu();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAdmin) {
    if (!src) return null;
    return (
      <div className={`overflow-hidden rounded-2xl ${aspectRatio} ${className}`}>
        <img src={src} alt="Uploaded" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`relative group overflow-hidden rounded-2xl bg-sage/30 border-2 border-dashed border-sage hover:border-gold transition-all ${aspectRatio} ${className}`}>
      {src ? (
        <>
          <img src={src} alt="Uploaded" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 cursor-pointer transition-opacity"
          >
            <RefreshCw className="text-white w-8 h-8" />
          </div>
        </>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gold/10"
        >
          <Camera className="text-deep-green/40 w-10 h-10 mb-2" />
          <span className="text-xs font-medium text-deep-green/60">Upload Image</span>
        </div>
      )}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}
