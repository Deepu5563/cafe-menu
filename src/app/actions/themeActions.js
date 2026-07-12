"use server";

import prisma from "@/lib/db";
import { DEFAULT_THEME, normalizeTheme } from "@/lib/theme";
import { revalidatePath } from "next/cache";

/**
 * Reads the saved theme. Returns defaults if none is stored yet
 * or if the database is unreachable (so the app always renders).
 */
export async function fetchTheme() {
  try {
    const theme = await prisma.theme.findFirst();
    return { ...normalizeTheme(theme), showImages: theme?.showImages ?? true };
  } catch (error) {
    console.error("[Theme] Fetch Error:", error);
    return { ...DEFAULT_THEME, showImages: true };
  }
}

/**
 * Saves the theme (single row, id = 1).
 */
export async function saveTheme(colors) {
  const data = normalizeTheme(colors);
  try {
    await prisma.theme.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("[Theme] Save Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Restores the default palette.
 */
export async function resetTheme() {
  return saveTheme(DEFAULT_THEME);
}

/**
 * Toggles whether section images are shown on the menu.
 */
export async function saveShowImages(showImages) {
  try {
    await prisma.theme.upsert({
      where: { id: 1 },
      update: { showImages: !!showImages },
      create: { id: 1, ...DEFAULT_THEME, showImages: !!showImages },
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("[Theme] Image Setting Error:", error);
    return { success: false, error: error.message };
  }
}
