"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useMenu } from '@/context/MenuContext';

export default function EditableText({ 
  value, 
  onSave, 
  className = "", 
  useTextarea = false,
  placeholder = "..."
}) {
  const { isAdmin } = useMenu();
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (currentValue !== value) {
      onSave(currentValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !useTextarea) {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (!isAdmin) {
    return <span className={className}>{value || ""}</span>;
  }

  if (isEditing) {
    return useTextarea ? (
      <textarea
        ref={inputRef}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`bg-white/80 border border-gold/50 rounded p-1 outline-none w-full resize-none shadow-inner ${className}`}
        rows={3}
      />
    ) : (
      <input
        ref={inputRef}
        type="text"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`bg-white/80 border border-gold/50 rounded px-1 outline-none shadow-inner ${className}`}
      />
    );
  }

  return (
    <span 
      onClick={() => setIsEditing(true)}
      className={`cursor-text hover:text-gold transition-colors duration-200 ${className}`}
      title="Click to edit"
    >
      {value || <span className="opacity-20 italic">{placeholder}</span>}
    </span>
  );
}
