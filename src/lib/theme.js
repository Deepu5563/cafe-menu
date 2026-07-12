// Shared theme definitions used by the server (SSR injection + DB actions)
// and the client (live preview in the theme picker).

export const DEFAULT_THEME = {
  background: "#E6EFE9",
  heading: "#1F3D2B",
  accent: "#C8A96A",
  softAccent: "#d8cbb5",
  card: "#F8F5EF",
  cardBorder: "#e6dcc9",
};

// The six colors the owner can control, with friendly labels.
export const THEME_SLOTS = [
  { key: "background", label: "Background", hint: "Page background" },
  { key: "heading", label: "Headings & Text", hint: "Titles and item names" },
  { key: "accent", label: "Accent", hint: "Highlights, dividers, ₹ symbol" },
  { key: "softAccent", label: "Soft Accent", hint: "Sheet frame & fine lines" },
  { key: "card", label: "Cards & Sheet", hint: "Menu card surface" },
  { key: "cardBorder", label: "Card Border", hint: "Card outline" },
];

export const THEME_PRESETS = [
  { name: "Sage & Gold", colors: { ...DEFAULT_THEME } },
  {
    name: "Coffee House",
    colors: {
      background: "#EFE6DA",
      heading: "#3B2A1E",
      accent: "#C08457",
      softAccent: "#d8c3a5",
      card: "#FBF4EA",
      cardBorder: "#e3d3bd",
    },
  },
  {
    name: "Midnight",
    colors: {
      background: "#14181F",
      heading: "#F5F5F5",
      accent: "#E9723D",
      softAccent: "#3a4150",
      card: "#1E242E",
      cardBorder: "#333c49",
    },
  },
  {
    name: "Rose Cream",
    colors: {
      background: "#F6E9EC",
      heading: "#5A2A3A",
      accent: "#C86B8A",
      softAccent: "#e0c3cd",
      card: "#FDF5F7",
      cardBorder: "#e6d2da",
    },
  },
  {
    name: "Noir",
    colors: {
      background: "#000000",
      heading: "#FFFFFF",
      accent: "#FFFFFF",
      softAccent: "#555555",
      card: "#0D0D0D",
      cardBorder: "#333333",
    },
  },
];

// Normalize a partial/DB theme into a full theme object.
export function normalizeTheme(theme) {
  return { ...DEFAULT_THEME, ...(theme || {}) };
}

// Map a theme to the CSS custom properties the stylesheet already consumes.
export function themeToCssVars(theme) {
  const t = normalizeTheme(theme);
  return {
    "--sage": t.background,
    "--cream": t.card,
    "--beige": t.card,
    "--deep-green": t.heading,
    "--gold": t.accent,
    "--soft-gold": t.softAccent,
    "--card-border": t.cardBorder,
    "--muted-green": `color-mix(in srgb, ${t.heading} 65%, ${t.background})`,
    "--foreground": t.heading,
    "--background": t.card,
  };
}

// Apply a theme to the live document (client-side, for instant preview).
export function applyTheme(theme, el) {
  const target =
    el || (typeof document !== "undefined" ? document.documentElement : null);
  if (!target) return;
  const vars = themeToCssVars(theme);
  for (const [name, value] of Object.entries(vars)) {
    target.style.setProperty(name, value);
  }
}
