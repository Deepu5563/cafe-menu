"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { applyTheme, normalizeTheme } from "@/lib/theme";
import {
  saveTheme as saveThemeAction,
  saveShowImages as saveShowImagesAction,
} from "@/app/actions/themeActions";

const ThemeContext = createContext();

export const ThemeProvider = ({ initialTheme, initialShowImages = true, children }) => {
  const [theme, setThemeState] = useState(() => normalizeTheme(initialTheme));
  const [showImages, setShowImagesState] = useState(initialShowImages);

  // Live preview only — updates the screen instantly, does not hit the DB.
  const previewTheme = useCallback((colors) => {
    const next = normalizeTheme(colors);
    setThemeState(next);
    applyTheme(next);
  }, []);

  // Preview + persist to the database (shared with the published menu).
  const commitTheme = useCallback(async (colors) => {
    const next = normalizeTheme(colors);
    setThemeState(next);
    applyTheme(next);
    return saveThemeAction(next);
  }, []);

  // Change a single color slot and persist.
  const setColor = useCallback(
    (key, value) => {
      const next = { ...theme, [key]: value };
      setThemeState(next);
      applyTheme(next);
      return saveThemeAction(next);
    },
    [theme]
  );

  // Show/hide section images across the whole menu, persisted to the DB.
  const setShowImages = useCallback((val) => {
    const next = !!val;
    setShowImagesState(next);
    return saveShowImagesAction(next);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, previewTheme, commitTheme, setColor, showImages, setShowImages }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
