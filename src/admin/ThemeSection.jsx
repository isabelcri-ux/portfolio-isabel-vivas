import { useState } from "react";

/* ── Design tokens (same as Dashboard) ── */
const P = {
  bg: "#060609", bgAlt: "#0B0B12", card: "#10101A", surface: "#161622",
  accent: "#7C6AF3", accentLight: "#9B8DF7", accentSoft: "rgba(124,106,243,0.10)",
  mint: "#34D9A8",   mintSoft: "rgba(52,217,168,0.08)",
  rose: "#F06878",   roseSoft: "rgba(240,104,120,0.08)",
  gold: "#E8A838",   goldSoft: "rgba(232,168,56,0.08)",
  text: "#EDECF8",   textSec: "#9594AE", textMut: "#5C5B72",
  border: "rgba(255,255,255,0.07)", borderHov: "rgba(255,255,255,0.12)",
};
const F = {
  display: "'Sora', sans-serif",
  body: "'Plus Jakarta Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

/* ── Shared UI (mirrors Dashboard) ── */
function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${P.border}` }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: P.text, fontFamily: F.display, margin: "0 0 6px" }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: P.textMut, margin: 0 }}>{subtitle}</p>}
    </div>
  );
}

function SaveBtn({ onClick, saving, label = "Guardar cambios" }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      style={{ padding: "10px 28px", background: saving ? P.textMut : P.accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: saving ? "wait" : "pointer", fontFamily: F.body, transition: "background 0.2s" }}
    >
      {saving ? "Guardando..." : label}
    </button>
  );
}

/* ── Template definitions ── */
const TEMPLATES = [
  {
    id: "A",
    name: "Split Editorial",
    desc: "Hero dividido en 2 columnas: texto a la izquierda, tarjeta de stats flotante a la derecha. Grid elegante de 2 columnas.",
    preview: (
      <svg width="100%" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="80" fill="#060609" rx="6"/>
        {/* Nav */}
        <rect x="8" y="7" width="14" height="4" rx="2" fill="#7C6AF3" opacity="0.9"/>
        <rect x="140" y="8" width="16" height="2.5" rx="1" fill="#5C5B72" opacity="0.5"/>
        <rect x="161" y="8" width="16" height="2.5" rx="1" fill="#5C5B72" opacity="0.5"/>
        <rect x="182" y="8" width="14" height="2.5" rx="1" fill="#5C5B72" opacity="0.5"/>
        {/* Left col text */}
        <rect x="8" y="22" width="48" height="6" rx="2" fill="#EDECF8" opacity="0.9"/>
        <rect x="8" y="31" width="60" height="5" rx="2" fill="#7C6AF3" opacity="0.8"/>
        <rect x="8" y="40" width="36" height="2.5" rx="1" fill="#9594AE" opacity="0.5"/>
        <rect x="8" y="46" width="50" height="2.5" rx="1" fill="#5C5B72" opacity="0.4"/>
        <rect x="8" y="54" width="20" height="6" rx="3" fill="#7C6AF3" opacity="0.9"/>
        <rect x="32" y="54" width="20" height="6" rx="3" fill="none" stroke="#5C5B72" strokeWidth="0.8" opacity="0.5"/>
        {/* Right col — floating card */}
        <rect x="110" y="18" width="82" height="52" rx="8" fill="#10101A" stroke="#7C6AF320" strokeWidth="1"/>
        <rect x="110" y="18" width="82" height="2" rx="1" fill="url(#gA)"/>
        <rect x="122" y="28" width="22" height="5" rx="1" fill="#EDECF8" opacity="0.7"/>
        <rect x="156" y="28" width="22" height="5" rx="1" fill="#EDECF8" opacity="0.7"/>
        <rect x="122" y="37" width="14" height="2" rx="1" fill="#5C5B72" opacity="0.5"/>
        <rect x="156" y="37" width="14" height="2" rx="1" fill="#5C5B72" opacity="0.5"/>
        <rect x="122" y="48" width="22" height="5" rx="1" fill="#EDECF8" opacity="0.7"/>
        <rect x="156" y="48" width="22" height="5" rx="1" fill="#EDECF8" opacity="0.7"/>
        <rect x="122" y="57" width="14" height="2" rx="1" fill="#5C5B72" opacity="0.5"/>
        <rect x="156" y="57" width="14" height="2" rx="1" fill="#5C5B72" opacity="0.5"/>
        {/* Orbs */}
        <circle cx="150" cy="44" r="28" fill="url(#orbA)" opacity="0.25"/>
        <defs>
          <linearGradient id="gA" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7C6AF3"/>
            <stop offset="100%" stopColor="#34D9A8"/>
          </linearGradient>
          <radialGradient id="orbA" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7C6AF3"/>
            <stop offset="100%" stopColor="#7C6AF3" stopOpacity="0"/>
          </radialGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "B",
    name: "Tipográfico Bold",
    desc: "Nombre gigante con watermark UX, stats en línea, regla horizontal. Lista horizontal de proyectos numerados.",
    preview: (
      <svg width="100%" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="80" fill="#060609" rx="6"/>
        {/* UX watermark */}
        <text x="110" y="52" fontSize="60" fontWeight="900" fill="#7C6AF3" opacity="0.05" fontFamily="monospace" letterSpacing="-4">UX</text>
        {/* Nav */}
        <rect x="8" y="7" width="14" height="4" rx="2" fill="#7C6AF3" opacity="0.9"/>
        {/* Year/status bar */}
        <rect x="8" y="18" width="6" height="6" rx="3" fill="#34D9A8" opacity="0.8"/>
        <rect x="18" y="20" width="30" height="2" rx="1" fill="#34D9A8" opacity="0.5"/>
        <rect x="54" y="20" width="1" height="2" fill="#5C5B72" opacity="0.5"/>
        <rect x="58" y="20" width="24" height="2" rx="1" fill="#5C5B72" opacity="0.4"/>
        {/* Big name */}
        <rect x="8" y="27" width="70" height="8" rx="2" fill="#EDECF8" opacity="0.9"/>
        <rect x="8" y="38" width="62" height="8" rx="2" fill="#7C6AF3" opacity="0.85"/>
        {/* Horizontal rule */}
        <rect x="8" y="49" width="90" height="0.8" rx="0.4" fill="url(#gB)" opacity="0.7"/>
        {/* Inline stats */}
        <rect x="8" y="54" width="18" height="4" rx="1" fill="#EDECF8" opacity="0.7"/>
        <rect x="30" y="55" width="14" height="2" rx="1" fill="#5C5B72" opacity="0.4"/>
        <rect x="50" y="54" width="18" height="4" rx="1" fill="#EDECF8" opacity="0.7"/>
        <rect x="72" y="55" width="14" height="2" rx="1" fill="#5C5B72" opacity="0.4"/>
        {/* List rows */}
        <rect x="8" y="63" width="180" height="7" rx="3" fill="#10101A" stroke="#7C6AF315" strokeWidth="0.5"/>
        <rect x="12" y="65" width="6" height="3" rx="1" fill="#7C6AF3" opacity="0.5"/>
        <rect x="24" y="65" width="20" height="3" rx="1" fill="#5C5B72" opacity="0.5"/>
        <rect x="50" y="65" width="40" height="3" rx="1" fill="#EDECF8" opacity="0.6"/>
        <defs>
          <linearGradient id="gB" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7C6AF3"/>
            <stop offset="70%" stopColor="#34D9A8" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#34D9A8" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "C",
    name: "Magazine Dramático",
    desc: "Hero centrado con número 01 de fondo. Primer proyecto en card grande horizontal, resto en grid de 3 columnas.",
    preview: (
      <svg width="100%" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="80" fill="#0C0A09" rx="6"/>
        {/* 01 background number */}
        <text x="55" y="50" fontSize="48" fontWeight="900" fill="#D97706" opacity="0.05" fontFamily="monospace">01</text>
        {/* Nav */}
        <rect x="8" y="7" width="14" height="4" rx="2" fill="#D97706" opacity="0.9"/>
        {/* Center hero */}
        <rect x="50" y="15" width="100" height="7" rx="2" fill="#EDECF8" opacity="0.9"/>
        <rect x="62" y="25" width="76" height="5" rx="2" fill="#D97706" opacity="0.75"/>
        <rect x="70" y="33" width="60" height="3" rx="1" fill="#9594AE" opacity="0.45"/>
        {/* Pill CTAs */}
        <rect x="62" y="40" width="28" height="6" rx="3" fill="url(#gC)" opacity="0.9"/>
        <rect x="94" y="40" width="28" height="6" rx="3" fill="none" stroke="#5C5B72" strokeWidth="0.8" opacity="0.5"/>
        {/* Featured card */}
        <rect x="8" y="52" width="106" height="20" rx="4" fill="#161008" stroke="#D97706" strokeWidth="1" opacity="0.8"/>
        <rect x="12" y="56" width="36" height="12" rx="2" fill="#D97706" opacity="0.2"/>
        <rect x="54" y="57" width="28" height="3" rx="1" fill="#D97706" opacity="0.7"/>
        <rect x="54" y="63" width="50" height="2" rx="1" fill="#9594AE" opacity="0.45"/>
        {/* 3 small cards */}
        <rect x="118" y="52" width="24" height="9" rx="3" fill="#161008" stroke="#D9770620" strokeWidth="0.5"/>
        <rect x="145" y="52" width="24" height="9" rx="3" fill="#161008" stroke="#D9770620" strokeWidth="0.5"/>
        <rect x="172" y="52" width="20" height="9" rx="3" fill="#161008" stroke="#D9770620" strokeWidth="0.5"/>
        <rect x="118" y="64" width="24" height="8" rx="3" fill="#161008" stroke="#D9770620" strokeWidth="0.5"/>
        <rect x="145" y="64" width="24" height="8" rx="3" fill="#161008" stroke="#D9770620" strokeWidth="0.5"/>
        <rect x="172" y="64" width="20" height="8" rx="3" fill="#161008" stroke="#D9770620" strokeWidth="0.5"/>
        <defs>
          <linearGradient id="gC" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D97706"/>
            <stop offset="100%" stopColor="#DB2777"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "D",
    name: "Editorial Clásico",
    desc: "Hero centrado con nombre en degradado animado. Grid 3 columnas uniforme. El original refinado.",
    preview: (
      <svg width="100%" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="80" fill="#060609" rx="6"/>
        <rect x="8" y="7" width="14" height="4" rx="2" fill="#7C6AF3" opacity="0.9"/>
        <rect x="140" y="8" width="16" height="2.5" rx="1" fill="#5C5B72" opacity="0.5"/>
        <rect x="161" y="8" width="16" height="2.5" rx="1" fill="#5C5B72" opacity="0.5"/>
        <rect x="182" y="8" width="14" height="2.5" rx="1" fill="#5C5B72" opacity="0.5"/>
        {/* Center badge */}
        <rect x="70" y="16" width="60" height="5" rx="2.5" fill="none" stroke="#34D9A8" strokeWidth="0.8" opacity="0.6"/>
        <circle cx="77" cy="18.5" r="2" fill="#34D9A8" opacity="0.8"/>
        <rect x="82" y="17" width="40" height="3" rx="1" fill="#34D9A8" opacity="0.5"/>
        {/* Name */}
        <rect x="55" y="26" width="90" height="7" rx="2" fill="#EDECF8" opacity="0.9"/>
        <rect x="40" y="36" width="120" height="7" rx="2" fill="url(#gD1)" opacity="0.9"/>
        {/* Role */}
        <rect x="82" y="47" width="12" height="1.5" rx="0.75" fill="#7C6AF3" opacity="0.7"/>
        <rect x="97" y="46" width="30" height="3" rx="1" fill="#9594AE" opacity="0.6"/>
        <rect x="130" y="47" width="12" height="1.5" rx="0.75" fill="#34D9A8" opacity="0.7"/>
        {/* Bio */}
        <rect x="50" y="53" width="100" height="2" rx="1" fill="#5C5B72" opacity="0.4"/>
        {/* Stats row */}
        <rect x="35" y="58" width="130" height="8" rx="4" fill="#10101A" stroke="#7C6AF315" strokeWidth="0.7"/>
        <rect x="50" y="60.5" width="20" height="3" rx="1" fill="#EDECF8" opacity="0.6"/>
        <rect x="82" y="60.5" width="20" height="3" rx="1" fill="#EDECF8" opacity="0.6"/>
        <rect x="114" y="60.5" width="20" height="3" rx="1" fill="#EDECF8" opacity="0.6"/>
        {/* CTA */}
        <rect x="62" y="70" width="32" height="7" rx="3" fill="#7C6AF3" opacity="0.9"/>
        <rect x="98" y="70" width="32" height="7" rx="3" fill="none" stroke="#5C5B72" strokeWidth="0.8" opacity="0.5"/>
        <defs>
          <linearGradient id="gD1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7C6AF3"/>
            <stop offset="50%" stopColor="#34D9A8"/>
            <stop offset="100%" stopColor="#9B8DF7"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "E",
    name: "Profesional Barra",
    desc: "Barra vertical de acento a la izquierda, texto left-aligned, nombre en blanco puro. Grid de 2 columnas anchas.",
    preview: (
      <svg width="100%" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="80" fill="#060609" rx="6"/>
        <rect x="8" y="7" width="14" height="4" rx="2" fill="#7C6AF3" opacity="0.9"/>
        {/* Vertical bar */}
        <rect x="22" y="16" width="2.5" height="44" rx="1.25" fill="#7C6AF3" opacity="0.8"/>
        {/* Left-aligned text */}
        <rect x="30" y="16" width="28" height="5" rx="2" fill="#34D9A8" opacity="0.6" />
        <rect x="30" y="25" width="68" height="8" rx="2" fill="#EDECF8" opacity="0.95"/>
        <rect x="30" y="36" width="60" height="7" rx="2" fill="#EDECF8" opacity="0.95"/>
        {/* Role line */}
        <rect x="30" y="47" width="10" height="1.5" rx="0.75" fill="#7C6AF3" opacity="0.7"/>
        <rect x="43" y="46.5" width="28" height="2.5" rx="1" fill="#9594AE" opacity="0.6"/>
        <rect x="74" y="47" width="10" height="1.5" rx="0.75" fill="#34D9A8" opacity="0.7"/>
        {/* 2-col wide cards */}
        <rect x="22" y="57" width="80" height="18" rx="4" fill="#10101A" stroke="#7C6AF320" strokeWidth="0.8"/>
        <rect x="108" y="57" width="80" height="18" rx="4" fill="#10101A" stroke="#7C6AF320" strokeWidth="0.8"/>
        <rect x="26" y="61" width="28" height="3" rx="1" fill="#7C6AF3" opacity="0.6"/>
        <rect x="112" y="61" width="28" height="3" rx="1" fill="#34D9A8" opacity="0.6"/>
        <rect x="26" y="67" width="50" height="2" rx="1" fill="#5C5B72" opacity="0.4"/>
        <rect x="112" y="67" width="50" height="2" rx="1" fill="#5C5B72" opacity="0.4"/>
      </svg>
    ),
  },
  {
    id: "F",
    name: "Creativo Reglas",
    desc: "Nombre con gradiente animado. Reglas horizontales enmarcando el rol. Primer proyecto a ancho completo.",
    preview: (
      <svg width="100%" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="80" fill="#060609" rx="6"/>
        <rect x="8" y="7" width="14" height="4" rx="2" fill="#7C6AF3" opacity="0.9"/>
        {/* Badge */}
        <rect x="68" y="14" width="64" height="5" rx="2.5" fill="none" stroke="#34D9A8" strokeWidth="0.8" opacity="0.5"/>
        {/* Name */}
        <rect x="55" y="23" width="90" height="6" rx="2" fill="#EDECF8" opacity="0.9"/>
        <rect x="40" y="32" width="120" height="6" rx="2" fill="url(#gF1)" opacity="0.9"/>
        {/* Rule + role + rule */}
        <rect x="20" y="42" width="160" height="0.8" rx="0.4" fill="url(#gF2)" opacity="0.7"/>
        <rect x="72" y="44" width="56" height="3" rx="1" fill="#9594AE" opacity="0.6"/>
        <rect x="20" y="50" width="160" height="0.8" rx="0.4" fill="url(#gF2)" opacity="0.7"/>
        {/* Featured first full width */}
        <rect x="10" y="56" width="180" height="16" rx="4" fill="#10101A" stroke="url(#gF1)" strokeWidth="1"/>
        <rect x="14" y="60" width="50" height="3" rx="1" fill="#7C6AF3" opacity="0.7"/>
        <rect x="14" y="65" width="80" height="2" rx="1" fill="#5C5B72" opacity="0.4"/>
        <defs>
          <linearGradient id="gF1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7C6AF3"/>
            <stop offset="50%" stopColor="#34D9A8"/>
            <stop offset="100%" stopColor="#9B8DF7"/>
          </linearGradient>
          <linearGradient id="gF2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7C6AF3" stopOpacity="0"/>
            <stop offset="50%" stopColor="#7C6AF3"/>
            <stop offset="100%" stopColor="#7C6AF3" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "G",
    name: "Fotográfico",
    desc: "Imagen de fondo a pantalla completa con overlay degradado. Texto anclado en la parte inferior. Muy impactante.",
    preview: (
      <svg width="100%" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Image bg simulation */}
        <rect width="200" height="80" fill="#1A1520" rx="6"/>
        <rect width="200" height="80" fill="url(#gG1)" rx="6" opacity="0.5"/>
        {/* Orbs */}
        <circle cx="140" cy="28" r="40" fill="url(#gGOrb)" opacity="0.35"/>
        {/* Accent top bar */}
        <rect x="0" y="0" width="200" height="2" rx="0" fill="url(#gG2)"/>
        {/* Dark gradient overlay bottom */}
        <rect width="200" height="80" fill="url(#gG3)" rx="6"/>
        {/* Nav */}
        <rect x="8" y="7" width="14" height="4" rx="2" fill="#fff" opacity="0.9"/>
        <rect x="140" y="8" width="16" height="2.5" rx="1" fill="#fff" opacity="0.4"/>
        <rect x="161" y="8" width="16" height="2.5" rx="1" fill="#fff" opacity="0.4"/>
        {/* Bottom content */}
        <rect x="10" y="44" width="50" height="5" rx="2" fill="#fff" opacity="0.9"/>
        <rect x="10" y="52" width="80" height="7" rx="2" fill="url(#gG2)" opacity="0.9"/>
        <rect x="10" y="62" width="60" height="3" rx="1" fill="#fff" opacity="0.4"/>
        <rect x="10" y="68" width="24" height="8" rx="3" fill="#fff" opacity="0.9"/>
        <rect x="38" y="68" width="24" height="8" rx="3" fill="rgba(255,255,255,0.12)"/>
        <defs>
          <linearGradient id="gG1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C6AF3"/>
            <stop offset="100%" stopColor="#34D9A8"/>
          </linearGradient>
          <linearGradient id="gG2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7C6AF3"/>
            <stop offset="100%" stopColor="#34D9A8"/>
          </linearGradient>
          <linearGradient id="gG3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#060609" stopOpacity="0"/>
            <stop offset="55%" stopColor="#060609" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#060609" stopOpacity="0.95"/>
          </linearGradient>
          <radialGradient id="gGOrb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7C6AF3"/>
            <stop offset="100%" stopColor="#7C6AF3" stopOpacity="0"/>
          </radialGradient>
        </defs>
      </svg>
    ),
  },
];

/* ── Color palettes per template ── */
const PALETTES = {
  A: [
    { name: "Violeta",   accent: "#7C6AF3", accentAlt: "#34D9A8", bg: "#060609", card: "#10101A" },
    { name: "Índigo",    accent: "#6366F1", accentAlt: "#22D3EE", bg: "#060609", card: "#10101A" },
    { name: "Esmeralda", accent: "#10B981", accentAlt: "#6366F1", bg: "#040E0A", card: "#081410" },
    { name: "Rosa",      accent: "#EC4899", accentAlt: "#A78BFA", bg: "#060609", card: "#14080E" },
    { name: "Naranja",   accent: "#F97316", accentAlt: "#FBBF24", bg: "#060609", card: "#120A04" },
  ],
  B: [
    { name: "Océano",     accent: "#2563EB", accentAlt: "#06B6D4", bg: "#060B14", card: "#0A1220" },
    { name: "Plata",      accent: "#64748B", accentAlt: "#38BDF8", bg: "#080A0E", card: "#0F1218" },
    { name: "Verde",      accent: "#059669", accentAlt: "#0EA5E9", bg: "#040E0B", card: "#081410" },
    { name: "Violeta Pro",accent: "#7C3AED", accentAlt: "#EC4899", bg: "#06040E", card: "#0E0818" },
    { name: "Dorado Pro", accent: "#D97706", accentAlt: "#10B981", bg: "#0C0902", card: "#14100A" },
  ],
  C: [
    { name: "Ámbar",   accent: "#D97706", accentAlt: "#DB2777", bg: "#0C0A09", card: "#161008" },
    { name: "Coral",   accent: "#F43F5E", accentAlt: "#F59E0B", bg: "#0C0609", card: "#180A0C" },
    { name: "Cielo",   accent: "#0EA5E9", accentAlt: "#A855F7", bg: "#05090F", card: "#080E18" },
    { name: "Lima",    accent: "#84CC16", accentAlt: "#06B6D4", bg: "#070C05", card: "#0E1408" },
    { name: "Púrpura", accent: "#A855F7", accentAlt: "#F43F5E", bg: "#0A050F", card: "#140A18" },
  ],
  D: [
    { name: "Violeta",   accent: "#7C6AF3", accentAlt: "#34D9A8", bg: "#060609", card: "#10101A" },
    { name: "Índigo",    accent: "#6366F1", accentAlt: "#22D3EE", bg: "#060609", card: "#10101A" },
    { name: "Esmeralda", accent: "#10B981", accentAlt: "#6366F1", bg: "#040E0A", card: "#081410" },
    { name: "Rosa",      accent: "#EC4899", accentAlt: "#A78BFA", bg: "#060609", card: "#14080E" },
    { name: "Naranja",   accent: "#F97316", accentAlt: "#FBBF24", bg: "#060609", card: "#120A04" },
  ],
  E: [
    { name: "Océano",    accent: "#2563EB", accentAlt: "#06B6D4", bg: "#060B14", card: "#0A1220" },
    { name: "Plata",     accent: "#64748B", accentAlt: "#38BDF8", bg: "#080A0E", card: "#0F1218" },
    { name: "Verde",     accent: "#059669", accentAlt: "#0EA5E9", bg: "#040E0B", card: "#081410" },
    { name: "Violeta Pro",accent: "#7C3AED", accentAlt: "#EC4899", bg: "#06040E", card: "#0E0818" },
    { name: "Dorado Pro", accent: "#D97706", accentAlt: "#10B981", bg: "#0C0902", card: "#14100A" },
  ],
  F: [
    { name: "Violeta",   accent: "#7C6AF3", accentAlt: "#34D9A8", bg: "#060609", card: "#10101A" },
    { name: "Magenta",   accent: "#D946EF", accentAlt: "#F97316", bg: "#08040A", card: "#140A14" },
    { name: "Cian",      accent: "#06B6D4", accentAlt: "#8B5CF6", bg: "#040A0D", card: "#081214" },
    { name: "Jade",      accent: "#10B981", accentAlt: "#F59E0B", bg: "#040E0A", card: "#081210" },
    { name: "Rojo",      accent: "#EF4444", accentAlt: "#F97316", bg: "#0A0404", card: "#160808" },
  ],
  G: [
    { name: "Noche",     accent: "#7C6AF3", accentAlt: "#34D9A8", bg: "#030305", card: "#0A0A12" },
    { name: "Amanecer",  accent: "#F97316", accentAlt: "#FBBF24", bg: "#040202", card: "#100804" },
    { name: "Bruma",     accent: "#38BDF8", accentAlt: "#818CF8", bg: "#030508", card: "#080D14" },
    { name: "Selva",     accent: "#34D9A8", accentAlt: "#6366F1", bg: "#020806", card: "#071010" },
    { name: "Cereza",    accent: "#F43F5E", accentAlt: "#A855F7", bg: "#050203", card: "#100408" },
  ],
};

/* ── SubLabel ── */
function SubLabel({ children }) {
  return (
    <div style={{ fontSize: 11, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
      {children}
    </div>
  );
}

/* ── Main Component ── */
export default function ThemeSection({ content, onSave }) {
  const theme = content?.theme || { template: "A", colors: {} };

  const [template, setTemplate] = useState(theme.template || "A");
  const [colors, setColors]     = useState({
    bg:        theme.colors?.bg        || "#060609",
    bgAlt:     theme.colors?.bgAlt     || "#0B0B12",
    card:      theme.colors?.card      || "#10101A",
    accent:    theme.colors?.accent    || "#7C6AF3",
    accentAlt: theme.colors?.accentAlt || "#34D9A8",
    rose:      theme.colors?.rose      || "#F06878",
    gold:      theme.colors?.gold      || "#E8A838",
    text:      theme.colors?.text      || "#EDECF8",
    textSec:   theme.colors?.textSec   || "#9594AE",
    textMut:   theme.colors?.textMut   || "#5C5B72",
  });
  const [saving, setSaving] = useState(false);

  const applyPalette = (palette) => {
    setColors(prev => ({
      ...prev,
      accent:    palette.accent,
      accentAlt: palette.accentAlt,
      bg:        palette.bg,
      card:      palette.card,
      bgAlt:     palette.bgAlt || prev.bgAlt,
    }));
  };

  const save = async () => {
    setSaving(true);
    await onSave({ ...content, theme: { template, colors } });
    setSaving(false);
  };

  const colorPickers = [
    { key: "accent",    label: "Acento principal" },
    { key: "accentAlt", label: "Color secundario" },
    { key: "bg",        label: "Fondo" },
    { key: "card",      label: "Tarjetas" },
  ];

  const palettes = PALETTES[template] || PALETTES.A;

  return (
    <div>
      <SectionHeader
        title="Tema visual"
        subtitle="Selecciona una plantilla de layout y personaliza la paleta de colores del portafolio."
      />

      {/* ── Template selector ── */}
      <SubLabel>Plantilla de diseño</SubLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 32 }}>
        {TEMPLATES.map(tpl => {
          const isSelected = template === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => setTemplate(tpl.id)}
              style={{
                background: isSelected ? `${P.accent}10` : P.surface,
                border: `2px solid ${isSelected ? P.accent : P.border}`,
                borderRadius: 12,
                padding: "0 0 14px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.25s",
                boxShadow: isSelected ? `0 0 20px ${P.accent}20` : "none",
                outline: "none",
                overflow: "hidden",
              }}
            >
              {/* SVG thumbnail */}
              <div style={{ borderRadius: "10px 10px 0 0", overflow: "hidden", marginBottom: 10 }}>
                {tpl.preview}
              </div>
              <div style={{ padding: "0 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: isSelected ? P.accent : P.textMut, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? P.text : P.textSec, fontFamily: F.display }}>{tpl.name}</span>
                </div>
                <p style={{ fontSize: 11, color: P.textMut, margin: 0, lineHeight: 1.5, fontFamily: F.body }}>{tpl.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Preset palettes ── */}
      <SubLabel>Paletas predefinidas para la plantilla {template}</SubLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {palettes.map((pal) => {
          const isActive = colors.accent === pal.accent && colors.accentAlt === pal.accentAlt;
          return (
            <button
              key={pal.name}
              onClick={() => applyPalette(pal)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: isActive ? `${P.accent}0D` : P.surface,
                border: `1px solid ${isActive ? P.accent + "40" : P.border}`,
                borderRadius: 10,
                padding: "10px 14px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                outline: "none",
              }}
            >
              {/* Two color circles */}
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: pal.accent, border: "2px solid rgba(255,255,255,0.15)" }} />
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: pal.accentAlt, border: "2px solid rgba(255,255,255,0.15)" }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? P.text : P.textSec, fontFamily: F.body }}>{pal.name}</span>
              {isActive && (
                <span style={{ marginLeft: "auto", fontSize: 10, color: P.accent, fontFamily: F.mono, fontWeight: 600, letterSpacing: 0.5 }}>ACTIVA</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Custom color pickers ── */}
      <SubLabel>Personalización de colores</SubLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 14, marginBottom: 32 }}>
        {colorPickers.map(({ key, label }) => (
          <div
            key={key}
            style={{ background: P.surface, borderRadius: 10, padding: "14px 14px 12px", border: `1px solid ${P.border}` }}
          >
            <div style={{ fontSize: 10, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
              {label}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ position: "relative", cursor: "pointer", flexShrink: 0 }}>
                <div
                  style={{ width: 36, height: 36, borderRadius: 8, background: colors[key], border: "2px solid rgba(255,255,255,0.15)", cursor: "pointer", boxShadow: `0 2px 8px ${colors[key]}40` }}
                />
                <input
                  type="color"
                  value={colors[key]}
                  onChange={e => setColors(prev => ({ ...prev, [key]: e.target.value }))}
                  style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
                />
              </label>
              <span style={{ fontSize: 11, color: P.textMut, fontFamily: F.mono, letterSpacing: 0.5 }}>
                {colors[key]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Preview strip ── */}
      <div
        style={{ borderRadius: 12, overflow: "hidden", marginBottom: 28, border: `1px solid ${P.border}` }}
      >
        <div style={{ background: colors.bg, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentAlt})`, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.text || "#EDECF8", fontFamily: F.display, marginBottom: 4 }}>Vista previa de colores</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[colors.accent, colors.accentAlt, colors.card].map((col, i) => (
                <div key={i} style={{ width: 18, height: 18, borderRadius: 4, background: col, border: "1px solid rgba(255,255,255,0.10)" }} />
              ))}
            </div>
          </div>
          <div style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 8, background: colors.card, border: `1px solid rgba(255,255,255,0.07)`, fontSize: 12, color: colors.text || "#EDECF8", fontFamily: F.mono }}>
            Plantilla {template}
          </div>
        </div>
      </div>

      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}
