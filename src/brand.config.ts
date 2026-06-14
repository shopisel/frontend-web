// ── Helpers ─────────────────────────────────────────────────────
/** Convert a hex colour (#RRGGBB) to an {r,g,b} object. */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

/** Lighten a hex colour toward white. `amount` is 0–1 (0 = unchanged, 1 = white). */
function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `#${[lr, lg, lb].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** Darken a hex colour toward black. `amount` is 0–1 (0 = unchanged, 1 = black). */
function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const dr = Math.round(r * (1 - amount));
  const dg = Math.round(g * (1 - amount));
  const db = Math.round(b * (1 - amount));
  return `#${[dr, dg, db].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** Return `rgba(r,g,b,a)` from a hex colour. */
function rgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── Read env (with fallbacks for current defaults) ──────────────
const primary = import.meta.env.VITE_BRAND_COLOR_PRIMARY || "#6366F1";
const secondary = import.meta.env.VITE_BRAND_COLOR_SECONDARY || "#8B5CF6";

export const brand = {
  name: import.meta.env.VITE_BRAND_NAME || "Shopisel",
  tagline: import.meta.env.VITE_BRAND_TAGLINE || "Compra melhor, poupa mais",
  logoUrl: import.meta.env.VITE_BRAND_LOGO_URL || "/shopisel.png",
  sidebarTagline: import.meta.env.VITE_BRAND_SIDEBAR_TAGLINE || "Compras inteligentes",
  colors: {
    primary,
    secondary,
    // Derived — auto-generated from primary / secondary
    primaryLight: lighten(primary, 0.9),
    primaryMuted: lighten(primary, 0.85),
    splashGradientCSS: `linear-gradient(135deg, ${primary} 0%, ${lighten(primary, 0.06)} 50%, ${secondary} 100%)`,
    activeBg: `linear-gradient(135deg, ${rgba(primary, 0.25)} 0%, ${rgba(secondary, 0.15)} 100%)`,
    activeBorder: rgba(primary, 0.3),
    activeBar: `linear-gradient(to bottom, ${primary}, ${secondary})`,
    activeIcon: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
    sidebarBg: darken(primary, 0.85),
  },
};
