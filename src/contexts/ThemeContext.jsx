import { createContext, useContext, useMemo } from "react";

/* ═══════════════════════════════════════════════════════
   THEME CONTEXT — Dynamic palette + template selection
   ═══════════════════════════════════════════════════════ */

/* ── Helpers ── */
function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function lighten(hex, amount) {
  const h = hex.replace("#", "");
  const r = Math.min(255, parseInt(h.substring(0, 2), 16) + Math.round(amount * 255));
  const g = Math.min(255, parseInt(h.substring(2, 4), 16) + Math.round(amount * 255));
  const b = Math.min(255, parseInt(h.substring(4, 6), 16) + Math.round(amount * 255));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/* ── Default theme (Template A — Violeta) ── */
const DEFAULT_THEME = {
  template: "A",
  colors: {
    bg: "#060609",
    bgAlt: "#0B0B12",
    card: "#10101A",
    accent: "#7C6AF3",
    accentAlt: "#34D9A8",
    rose: "#F06878",
    gold: "#E8A838",
    text: "#EDECF8",
    textSec: "#9594AE",
    textMut: "#5C5B72",
  },
};

/* ── buildPalette: converts theme.colors → full P object ── */
function buildPalette(theme) {
  const t = theme || DEFAULT_THEME;
  const c = t.colors || DEFAULT_THEME.colors;

  const bg       = c.bg       || DEFAULT_THEME.colors.bg;
  const bgAlt    = c.bgAlt    || (c.bg ? lighten(c.bg, 0.02) : DEFAULT_THEME.colors.bgAlt);
  const card     = c.card     || DEFAULT_THEME.colors.card;
  const accent   = c.accent   || DEFAULT_THEME.colors.accent;
  const accentAlt = c.accentAlt || DEFAULT_THEME.colors.accentAlt;
  const rose     = c.rose     || DEFAULT_THEME.colors.rose;
  const gold     = c.gold     || DEFAULT_THEME.colors.gold;
  const text     = c.text     || DEFAULT_THEME.colors.text;
  const textSec  = c.textSec  || DEFAULT_THEME.colors.textSec;
  const textMut  = c.textMut  || DEFAULT_THEME.colors.textMut;

  return {
    bg,
    bgAlt,
    card,
    cardHover: lighten(card, 0.03),
    surface:   lighten(card, 0.06),

    accent,
    accentLight: lighten(accent, 0.12),
    accentSoft:  hexToRgba(accent, 0.08),
    accentGlow:  hexToRgba(accent, 0.18),

    mint:     accentAlt,
    mintSoft: hexToRgba(accentAlt, 0.08),

    rose,
    roseSoft: hexToRgba(rose, 0.08),

    gold,
    goldSoft: hexToRgba(gold, 0.08),

    text,
    textSec,
    textMut,

    border:    "rgba(255,255,255,0.05)",
    borderHov: "rgba(255,255,255,0.10)",
  };
}

/* ── Default P (fallback when context not available) ── */
export const DEFAULT_P = buildPalette(DEFAULT_THEME);

/* ── Context ── */
const ThemeContext = createContext({
  P: DEFAULT_P,
  template: "A",
});

export function ThemeProvider({ theme, children }) {
  const value = useMemo(() => {
    const merged = theme
      ? { template: theme.template || "A", colors: { ...DEFAULT_THEME.colors, ...theme.colors } }
      : DEFAULT_THEME;
    return {
      P: buildPalette(merged),
      template: merged.template || "A",
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
