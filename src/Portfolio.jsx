import { useState, useEffect, useRef, useCallback } from "react";
import { useContent } from "./contexts/ContentContext";
import { ThemeProvider, useTheme, DEFAULT_P } from "./contexts/ThemeContext";

/* ═══════════════════════════════════════════════════════
   ISABEL CRISTINA VIVAS — PORTFOLIO v3
   Case Study Structure · Senior Storytelling · Editorial
   ═══════════════════════════════════════════════════════ */

/* Module-level fallback palette — used only as last resort or in non-themed contexts */
const DEFAULT_P_INLINE = DEFAULT_P;

const F = {
  display: "'Sora', sans-serif",
  body: "'Plus Jakarta Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

const NAV = [
  { id: "home", label: "Inicio" },
  { id: "about", label: "Sobre mí" },
  { id: "portfolio", label: "Portafolio" },
  { id: "contact", label: "Contacto" },
];



/* ═══ HOOKS ═══ */
function useFadeIn(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* Checks for prefers-reduced-motion at render time */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return reduced;
}

/* Enhanced Fade — supports direction + clip-path reveal */
function Fade({ children, delay = 0, style = {}, dir = "up", clip = false }) {
  const [ref, vis] = useFadeIn();
  const reduced = usePrefersReducedMotion();
  const translateMap = { up: "translateY(28px)", down: "translateY(-28px)", left: "translateX(28px)", right: "translateX(-28px)" };
  const t = translateMap[dir] || translateMap.up;
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis || reduced ? "translateY(0) translateX(0)" : t,
        clipPath: clip ? (vis ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)") : undefined,
        transition: reduced
          ? "opacity 0.1ms"
          : `opacity 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms${clip ? `, clip-path 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms` : ""}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* Scroll progress bar at top of page */
function ScrollProgress() {
  const { P } = useTheme();
  const [pct, setPct] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const h = () => {
      const s = document.documentElement.scrollHeight - window.innerHeight;
      setPct(s > 0 ? (window.scrollY / s) * 100 : 0);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [reduced]);
  if (reduced) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 2000, background: "transparent" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${P.accent}, ${P.mint})`, transition: "width 0.1s linear", borderRadius: "0 2px 2px 0", boxShadow: `0 0 8px ${P.accent}80` }} />
    </div>
  );
}

/* Magnetic button — subtle cursor pull effect */
function MagneticBtn({ children, onClick, style = {}, onMouseEnter, onMouseLeave }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const handleMove = useCallback((e) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.28;
    const y = (e.clientY - r.top - r.height / 2) * 0.28;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  }, [reduced]);
  const handleLeave = useCallback((e) => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
    if (onMouseLeave) onMouseLeave(e);
  }, [onMouseLeave]);
  return (
    <button ref={ref} onClick={onClick} onMouseMove={handleMove} onMouseLeave={handleLeave} onMouseEnter={onMouseEnter} style={{ transition: "transform 0.4s cubic-bezier(.22,1,.36,1)", ...style }}>
      {children}
    </button>
  );
}

/* Staggered text — splits by word and fades each in */
function StaggerText({ text, delay = 0, style = {}, wordStyle = {} }) {
  const [ref, vis] = useFadeIn();
  const reduced = usePrefersReducedMotion();
  const words = (text || "").split(" ");
  return (
    <span ref={ref} style={{ display: "inline", ...style }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-block", opacity: vis || reduced ? 1 : 0, transform: vis || reduced ? "translateY(0)" : "translateY(18px)", transition: reduced ? "none" : `opacity 0.5s cubic-bezier(.22,1,.36,1) ${delay + i * 60}ms, transform 0.5s cubic-bezier(.22,1,.36,1) ${delay + i * 60}ms`, marginRight: "0.28em", ...wordStyle }}>
          {word}
        </span>
      ))}
    </span>
  );
}

/* Tilt card — 3D perspective tilt on hover */
function TiltCard({ children, style = {}, intensity = 8 }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const handleMove = (e) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    const y = -(e.clientX - r.left - r.width / 2) / (r.width / 2);
    ref.current.style.transform = `perspective(800px) rotateX(${x * intensity}deg) rotateY(${y * intensity}deg) translateY(-6px)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)";
  };
  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ transition: "transform 0.5s cubic-bezier(.22,1,.36,1)", transformStyle: "preserve-3d", ...style }}>
      {children}
    </div>
  );
}

/* Shimmer — sweeping light effect (CSS class-based) */
const ShimmerCard = ({ children, color, style = {}, isHov = false }) => (
  <div style={{ position: "relative", overflow: "hidden", ...style }}>
    {children}
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent 40%, ${color || "rgba(255,255,255,0.07)"} 50%, transparent 60%)`, backgroundSize: "200% 100%", animation: isHov ? "shimmer 0.7s ease-out" : "none", pointerEvents: "none" }} />
  </div>
);

function Tag({ children, color, bg, style = {} }) {
  const { P } = useTheme();
  const c = color || P.accent;
  return (
    <span style={{ display: "inline-block", padding: "4px 13px", borderRadius: 6, fontSize: 11, fontWeight: 600, color: c, letterSpacing: 0.5, background: bg || `${c}14`, border: `1px solid ${c}20`, fontFamily: F.mono, textTransform: "uppercase", ...style }}>
      {children}
    </span>
  );
}

function Sec({ num, text }) {
  const { P } = useTheme();
  return (
    <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 11, color: P.accent, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", fontFamily: F.mono }}>{num}</span>
      <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${P.accent}, transparent)` }} />
      <span style={{ fontSize: 11, color: P.textMut, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase", fontFamily: F.mono }}>{text}</span>
    </div>
  );
}

function Card({ children, style = {}, animate = false }) {
  const { P, template } = useTheme();
  const templateStyle = template === "C"
    ? { backgroundImage: `linear-gradient(${P.card}, ${P.card}), linear-gradient(90deg, ${P.accent}, ${P.mint})`, backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box", border: "2px solid transparent" }
    : {};
  return (
    <div className="card-shimmer" style={{ background: P.card, borderRadius: 16, border: `1px solid ${P.border}`, ...templateStyle, ...(animate ? { animation: "scaleIn 0.55s cubic-bezier(.22,1,.36,1) both" } : {}), ...style }}>
      {children}
    </div>
  );
}

function SkillBar({ name, pct, delay, active, showPct = true }) {
  const { P } = useTheme();
  return (
    <div style={{ marginBottom: 15 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: P.text, fontWeight: 500 }}>{name}</span>
        {showPct && <span style={{ fontSize: 11, color: P.textMut, fontFamily: F.mono, fontWeight: 600 }}>{pct}%</span>}
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 4, width: active ? `${pct}%` : "0%", background: `linear-gradient(90deg, ${P.accent}, ${P.mint})`, transition: `width 1.2s cubic-bezier(.22,1,.36,1) ${delay}ms` }} />
      </div>
    </div>
  );
}

function AnimStat({ value, label, suffix = "" }) {
  const { P } = useTheme();
  const [count, setCount] = useState(0);
  const [ref, vis] = useFadeIn();
  const reduced = usePrefersReducedMotion();
  const num = parseFloat(value);
  useEffect(() => {
    if (!vis) return;
    if (reduced) { setCount(num); return; }
    let c = 0;
    const inc = num / 40;
    const t = setInterval(() => {
      c += inc;
      if (c >= num) { setCount(num); clearInterval(t); }
      else setCount(Math.floor(c * 10) / 10);
    }, 40);
    return () => clearInterval(t);
  }, [vis, num, reduced]);
  const d = Number.isInteger(num) ? Math.floor(count) : count.toFixed(1);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontSize: "clamp(28px,4vw,36px)", fontWeight: 700, color: P.text, fontFamily: F.mono, lineHeight: 1 }}>{d}{suffix}</div>
      <div style={{ fontSize: 11, color: P.textMut, marginTop: 8, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: F.mono }}>{label}</div>
    </div>
  );
}

/* ═══ PLACEHOLDER — replaces emoji-icon boxes in case studies ═══ */
function ImagePlaceholder({ type = "process" }) {
  const { P } = useTheme();
  const isProcess = type === "process";
  return (
    <div style={{ padding: isProcess ? "36px 24px" : "48px 24px", borderRadius: 16, border: `1.5px dashed ${P.border}`, textAlign: "center", background: "rgba(255,255,255,0.01)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 30% 50%, ${P.accentSoft}, transparent 60%), radial-gradient(circle at 70% 50%, ${P.mintSoft}, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: isProcess ? P.accentSoft : P.mintSoft, border: `1px solid ${isProcess ? P.accent : P.mint}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isProcess ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={P.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={P.mint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            )}
          </div>
          <span style={{ fontSize: 12, color: isProcess ? P.accent : P.mint, fontFamily: F.mono, fontWeight: 600, letterSpacing: 0.5 }}>
            {isProcess ? "IMÁGENES DE PROCESO" : "PANTALLAS FINALES"}
          </span>
        </div>
        <p style={{ fontSize: 12, color: P.textMut, margin: 0, lineHeight: 1.6 }}>
          {isProcess ? "Wireframes · Journey maps · Sketches · Screenshots de Figma" : "Mockups · Prototipos · Flujos conectados"}
        </p>
      </div>
    </div>
  );
}

/* ═══ BACKGROUND PARTICLES — shared across all templates ═══ */
function BgParticles({ opacity = 1 }) {
  const { P } = useTheme();
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;
  return (
    <>
      {/* Orb 1 — accent glow, top-right */}
      <div className="anim-orb-pulse" style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, ${P.accentGlow} 0%, transparent 68%)`, top: "-8%", right: "-5%", pointerEvents: "none", opacity: 0.7 * opacity }} />
      {/* Orb 2 — mint glow, bottom-left */}
      <div className="anim-float-y" style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, ${P.mintSoft} 0%, transparent 68%)`, bottom: "-5%", left: "-4%", pointerEvents: "none", animationDelay: "1.8s", opacity: 0.6 * opacity }} />
      {/* Orb 3 — accent, mid */}
      <div className="anim-float-y" style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${P.accentGlow} 0%, transparent 68%)`, top: "40%", left: "30%", pointerEvents: "none", animationDelay: "3s", animationDuration: "8s", opacity: 0.25 * opacity }} />
      {/* Particles */}
      {[0,1,2,3,4,5].map(k => (
        <div key={k} style={{ position: "absolute", width: k < 4 ? 4 : 3, height: k < 4 ? 4 : 3, borderRadius: "50%", background: k % 2 === 0 ? P.accent : P.mint, opacity: 0.55 * opacity, animation: `particleFloat ${4 + k * 0.7}s ease-in-out infinite`, animationDelay: `${k * 0.8}s`, left: `${10 + k * 14}%`, top: `${15 + (k % 3) * 25}%`, pointerEvents: "none" }} />
      ))}
    </>
  );
}

/* ═══ HOME ═══ */
function HomePage({ goTo, hero, stats }) {
  const { P, template } = useTheme();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const h = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, [reduced]);

  /* ── Template A: Split-screen — text left, floating stats card right ── */
  if (template === "A") {
    return (
      <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", padding: "100px 0 60px", position: "relative", overflow: "hidden" }}>
        {/* Subtle grid bg */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(${P.accent}04 1px, transparent 1px), linear-gradient(90deg, ${P.accent}04 1px, transparent 1px)`, backgroundSize: "72px 72px" }} />
        {/* Mouse glow */}
        {!reduced && <div style={{ position: "fixed", width: 500, height: 500, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: `radial-gradient(circle, ${P.accentGlow} 0%, transparent 65%)`, left: mouse.x - 250, top: mouse.y - 250, transition: "left 0.6s ease-out, top 0.6s ease-out", opacity: 0.25 }} />}

        {/* LEFT — content */}
        <div style={{ padding: "0 48px 0 max(48px, calc((100vw - 1180px) / 2 + 48px))", position: "relative", zIndex: 1 }}>
          <Fade>
            {hero?.available && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: `${P.mint}08`, padding: "7px 18px", borderRadius: 100, border: `1px solid ${P.mint}18`, marginBottom: 36 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: P.mint, boxShadow: `0 0 8px ${P.mint}`, animation: reduced ? "none" : "pulse 2s ease infinite" }} />
                <span style={{ fontSize: 10, color: P.mint, fontWeight: 600, letterSpacing: 2.5, fontFamily: F.mono, textTransform: "uppercase" }}>{hero.availableText || "Disponible para proyectos"}</span>
              </div>
            )}
          </Fade>
          <Fade delay={100}>
            <h1 style={{ fontSize: "clamp(40px,4.5vw,66px)", fontWeight: 800, lineHeight: 1.05, margin: "0 0 22px", letterSpacing: "-0.04em", fontFamily: F.display }}>
              <span style={{ color: P.text, display: "block" }}>{hero?.name || "Isabel Cristina"}</span>
              <span style={{ background: `linear-gradient(135deg, ${P.accent}, ${P.mint})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block" }}>{hero?.lastName || "Vivas Henao"}</span>
            </h1>
          </Fade>
          <Fade delay={180}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: P.accent }} />
              <span style={{ fontSize: 15, color: P.textSec, fontWeight: 400 }}>{hero?.role || "Senior UX Designer"}</span>
            </div>
            <p style={{ fontSize: 14, color: P.textMut, maxWidth: 420, lineHeight: 1.9, margin: "0 0 44px" }}>
              {hero?.bio || "+10 años creando productos digitales en fintech y entornos de alto impacto."}
            </p>
          </Fade>
          <Fade delay={260}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => goTo("portfolio")} style={{ padding: "14px 34px", background: P.accent, color: "#fff", borderRadius: 10, border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer", boxShadow: `0 4px 24px ${P.accentGlow}`, fontFamily: F.body, transition: "opacity 0.2s, transform 0.2s" }} onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
                Ver portafolio
              </button>
              <button onClick={() => goTo("contact")} style={{ padding: "14px 34px", background: "transparent", color: P.text, borderRadius: 10, border: `1px solid ${P.border}`, fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: F.body, transition: "border-color 0.2s, background 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = P.borderHov; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = P.border; e.currentTarget.style.background = "transparent"; }}>
                Contacto
              </button>
            </div>
          </Fade>
        </div>

        {/* RIGHT — floating stats card + animated orbs */}
        <div style={{ position: "relative", height: "100%", minHeight: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="anim-orb-pulse" style={{ position: "absolute", width: 440, height: 440, borderRadius: "50%", background: `radial-gradient(circle, ${P.accentGlow} 0%, transparent 68%)`, top: "5%", left: "5%", pointerEvents: "none" }} />
          <div className="anim-float-y" style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${P.mintSoft} 0%, transparent 68%)`, bottom: "8%", right: "8%", pointerEvents: "none", animationDelay: "1.5s" }} />
          {!reduced && [0,1,2,3].map(k => (
            <div key={k} style={{ position: "absolute", width: 4, height: 4, borderRadius: "50%", background: k % 2 === 0 ? P.accent : P.mint, opacity: 0.5, animation: `particleFloat ${4 + k * 0.8}s ease-in-out infinite`, animationDelay: `${k * 0.9}s`, left: `${25 + k * 15}%`, top: `${20 + k * 12}%`, pointerEvents: "none" }} />
          ))}
          {stats && stats.length > 0 && (
            <Fade delay={200}>
              <div className="card-shimmer" style={{ position: "relative", zIndex: 1, background: `${P.card}D0`, backdropFilter: "blur(24px)", borderRadius: 24, border: `1px solid ${P.border}`, padding: "36px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 36px", boxShadow: `0 32px 80px rgba(0,0,0,0.4)`, animation: `floatY 6s ease-in-out infinite`, animationDelay: "0.5s" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${P.accent}, ${P.mint})`, borderRadius: "24px 24px 0 0", animation: "glowPulse 3s ease-in-out infinite" }} />
                {stats.map(st => (
                  <div key={st.id} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "clamp(30px,3.5vw,44px)", fontWeight: 800, color: P.text, fontFamily: F.mono, lineHeight: 1 }}>{st.value}{st.suffix}</div>
                    <div style={{ fontSize: 10, color: P.textMut, marginTop: 8, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: F.mono }}>{st.label}</div>
                  </div>
                ))}
              </div>
            </Fade>
          )}
        </div>
      </div>
    );
  }

  /* ── Template B: Bold typographic — huge name, inline stats, horizontal rule ── */
  if (template === "B") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
        <BgParticles />
        {/* Large "UX" watermark — slow drift */}
        <div className="anim-float-y" style={{ position: "absolute", right: -60, top: "50%", transform: "translateY(-50%)", fontSize: "clamp(200px,30vw,340px)", fontWeight: 900, color: `${P.accent}05`, fontFamily: F.mono, lineHeight: 1, pointerEvents: "none", userSelect: "none", letterSpacing: -16, animationDuration: "9s" }} aria-hidden="true">UX</div>

        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          <Fade>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
              {hero?.available && (
                <>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: P.mint, animation: reduced ? "none" : "pulse 2s ease infinite" }} />
                  <span style={{ fontSize: 10, color: P.mint, fontWeight: 600, letterSpacing: 2.5, fontFamily: F.mono, textTransform: "uppercase" }}>{hero.availableText || "Disponible para proyectos"}</span>
                  <span style={{ width: 1, height: 14, background: P.border }} />
                </>
              )}
              <span style={{ fontSize: 10, color: P.textMut, fontFamily: F.mono, letterSpacing: 2 }}>Portfolio · {new Date().getFullYear()}</span>
            </div>
          </Fade>
          <Fade delay={80}>
            <h1 style={{ fontSize: "clamp(56px,9vw,110px)", fontWeight: 900, lineHeight: 0.92, margin: "0 0 28px", letterSpacing: "-0.055em", fontFamily: F.display }}>
              <span style={{ color: P.text, display: "block" }}>{hero?.name || "Isabel Cristina"}</span>
              <span style={{ color: P.accent, display: "block" }}>{hero?.lastName || "Vivas Henao"}</span>
            </h1>
          </Fade>
          <div style={{ height: 1, background: `linear-gradient(90deg, ${P.accent}80, ${P.mint}40, transparent)`, marginBottom: 28, maxWidth: 640, animation: "drawLine 1.2s cubic-bezier(.22,1,.36,1) 0.4s both", overflow: "hidden" }} />
          <Fade delay={160}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 36, marginBottom: 40, flexWrap: "wrap" }}>
              <span style={{ fontSize: "clamp(16px,2vw,20px)", color: P.textSec, fontWeight: 300, fontFamily: F.display, letterSpacing: 0.3 }}>{hero?.role || "Senior UX Designer"}</span>
              {(stats || []).slice(0, 3).map(st => (
                <span key={st.id} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                  <strong style={{ color: P.text, fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 800, fontFamily: F.mono, lineHeight: 1 }}>{st.value}{st.suffix}</strong>
                  <span style={{ fontSize: 11, color: P.textMut, fontFamily: F.mono }}>{st.label}</span>
                </span>
              ))}
            </div>
          </Fade>
          <Fade delay={220}>
            <p style={{ fontSize: 15, color: P.textMut, maxWidth: 500, lineHeight: 1.9, marginBottom: 48 }}>
              {hero?.bio || "+10 años creando productos digitales en fintech y entornos de alto impacto."}
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => goTo("portfolio")} style={{ padding: "14px 38px", background: P.accent, color: "#fff", borderRadius: 6, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: F.body, letterSpacing: 0.8, textTransform: "uppercase", transition: "opacity 0.2s, transform 0.2s" }} onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
                Ver portafolio
              </button>
              <button onClick={() => goTo("contact")} style={{ padding: "14px 38px", background: "transparent", color: P.textSec, borderRadius: 6, border: `1px solid ${P.border}`, fontWeight: 500, fontSize: 13, cursor: "pointer", fontFamily: F.body, letterSpacing: 0.5, transition: "border-color 0.2s, color 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = P.borderHov; e.currentTarget.style.color = P.text; }} onMouseLeave={e => { e.currentTarget.style.borderColor = P.border; e.currentTarget.style.color = P.textSec; }}>
                Contacto
              </button>
            </div>
          </Fade>
        </div>
      </div>
    );
  }

  /* ── Template C: Dramatic centered — large bg number, pill CTA, gradient name ── */
  if (template === "C") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
      <BgParticles />
      {/* Giant background 01 */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", fontSize: "clamp(260px,50vw,580px)", fontWeight: 900, color: `${P.accent}04`, fontFamily: F.mono, lineHeight: 1, pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }} aria-hidden="true">01</div>
      {/* Mouse glow */}
      {!reduced && <div style={{ position: "fixed", width: 600, height: 600, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: `radial-gradient(circle, ${P.accentGlow} 0%, transparent 65%)`, left: mouse.x - 300, top: mouse.y - 300, transition: "left 0.5s ease-out, top 0.5s ease-out", opacity: 0.35 }} />}

      <div style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 820 }}>
        <Fade>
          {hero?.available && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 52 }}>
              <div style={{ height: 1, width: 36, background: `linear-gradient(90deg, transparent, ${P.accent})` }} />
              <span style={{ fontSize: 10, color: P.accent, fontWeight: 700, letterSpacing: 3, fontFamily: F.mono, textTransform: "uppercase" }}>{hero.availableText || "Disponible para proyectos"}</span>
              <div style={{ height: 1, width: 36, background: `linear-gradient(90deg, ${P.accent}, transparent)` }} />
            </div>
          )}
        </Fade>
        <Fade delay={100}>
          <h1 style={{ fontSize: "clamp(52px,8.5vw,96px)", fontWeight: 900, lineHeight: 0.95, margin: "0 0 28px", letterSpacing: "-0.05em", fontFamily: F.display }}>
            <span style={{ color: P.text, display: "block" }}>{hero?.name || "Isabel Cristina"}</span>
            <span style={{ background: `linear-gradient(135deg, ${P.accent} 0%, ${P.mint} 50%, ${P.accentLight} 100%)`, backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: reduced ? "none" : "gShift 5s ease infinite", display: "block" }}>{hero?.lastName || "Vivas Henao"}</span>
          </h1>
        </Fade>
        <Fade delay={180}>
          <p style={{ fontSize: "clamp(14px,1.8vw,17px)", color: P.textSec, margin: "0 auto 14px", fontFamily: F.display, fontWeight: 300, letterSpacing: 0.5 }}>{hero?.role || "Senior UX Designer"}</p>
          <p style={{ fontSize: 14, color: P.textMut, maxWidth: 460, margin: "0 auto 48px", lineHeight: 1.9 }}>
            {hero?.bio || "+10 años creando productos digitales en fintech y entornos de alto impacto."}
          </p>
        </Fade>
        {stats && stats.length > 0 && (
          <Fade delay={230}>
            <div style={{ display: "flex", justifyContent: "center", gap: 40, marginBottom: 52, flexWrap: "wrap" }}>
              {stats.map(st => <AnimStat key={st.id} value={st.value} suffix={st.suffix} label={st.label} />)}
            </div>
          </Fade>
        )}
        <Fade delay={290}>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => goTo("portfolio")} style={{ padding: "16px 44px", background: `linear-gradient(135deg, ${P.accent}, ${P.mint})`, color: "#fff", borderRadius: 100, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: F.body, letterSpacing: 0.5, transition: "opacity 0.2s, transform 0.2s", boxShadow: `0 8px 32px ${P.accentGlow}` }} onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
              Ver portafolio
            </button>
            <button onClick={() => goTo("contact")} style={{ padding: "16px 44px", background: "transparent", color: P.text, borderRadius: 100, border: `1px solid ${P.border}`, fontWeight: 400, fontSize: 14, cursor: "pointer", fontFamily: F.body, transition: "border-color 0.2s, background 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = P.borderHov; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = P.border; e.currentTarget.style.background = "transparent"; }}>
              Contacto
            </button>
          </div>
        </Fade>
      </div>
    </div>
  );

  /* ── Template D: Editorial Centrado (clásico) ── */
  if (template === "D") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
      <BgParticles />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(${P.accent}03 1px, transparent 1px), linear-gradient(90deg, ${P.accent}03 1px, transparent 1px)`, backgroundSize: "80px 80px", maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)" }} />
      {!reduced && <div style={{ position: "fixed", width: 600, height: 600, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: `radial-gradient(circle, ${P.accentGlow} 0%, transparent 65%)`, left: mouse.x - 300, top: mouse.y - 300, transition: "left 0.5s ease-out, top 0.5s ease-out", opacity: 0.3 }} />}
      <div style={{ maxWidth: 820, textAlign: "center", position: "relative", zIndex: 1 }}>
        <Fade>
          {hero?.available && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: `${P.mint}08`, padding: "8px 22px", borderRadius: 100, border: `1px solid ${P.mint}12`, marginBottom: 40 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: P.mint, boxShadow: `0 0 10px ${P.mint}`, animation: reduced ? "none" : "pulse 2s ease infinite" }} />
              <span style={{ fontSize: 11, color: P.mint, fontWeight: 600, letterSpacing: 2, fontFamily: F.mono, textTransform: "uppercase" }}>{hero.availableText || "Disponible para proyectos"}</span>
            </div>
          )}
        </Fade>
        <Fade delay={120}>
          <h1 style={{ fontSize: "clamp(44px,8vw,80px)", fontWeight: 800, lineHeight: 1.0, margin: "0 0 20px", letterSpacing: "-0.04em", fontFamily: F.display }}>
            <span style={{ color: P.text }}>{hero?.name || "Isabel Cristina"}</span><br />
            <span style={{ background: `linear-gradient(135deg, ${P.accent}, ${P.mint}, ${P.accentLight})`, backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: reduced ? "none" : "gShift 5s ease infinite" }}>{hero?.lastName || "Vivas Henao"}</span>
          </h1>
        </Fade>
        <Fade delay={220}>
          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: P.textSec, fontWeight: 400, margin: "0 0 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ width: 20, height: 1, background: P.accent }} /> {hero?.role || "Senior UX Designer"} <span style={{ width: 20, height: 1, background: P.mint }} />
          </p>
        </Fade>
        <Fade delay={300}>
          <p style={{ fontSize: 15, color: P.textMut, maxWidth: 520, margin: "0 auto 56px", lineHeight: 1.85 }}>{hero?.bio || "+10 años creando productos digitales en fintech y entornos de alto impacto."}</p>
        </Fade>
        {stats && stats.length > 0 && (
          <Fade delay={380}>
            <div style={{ display: "grid", gridTemplateColumns: stats.map(() => "1fr").join(" auto "), gap: 0, maxWidth: 480, margin: "0 auto 60px", padding: "28px 24px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: `1px solid ${P.border}` }}>
              {stats.flatMap((st, i) => { const items = [<AnimStat key={st.id} value={st.value} suffix={st.suffix} label={st.label} />]; if (i < stats.length - 1) items.push(<div key={`sep-${i}`} style={{ width: 1, background: P.border, margin: "4px 12px" }} />); return items; })}
            </div>
          </Fade>
        )}
        <Fade delay={460}>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => goTo("portfolio")} style={{ padding: "16px 40px", background: P.accent, color: "#fff", borderRadius: 12, border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer", boxShadow: `0 4px 32px ${P.accentGlow}`, fontFamily: F.body, transition: "opacity 0.2s, transform 0.2s" }} onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>Ver portafolio</button>
            <button onClick={() => goTo("contact")} style={{ padding: "16px 40px", background: "transparent", color: P.text, borderRadius: 12, border: `1px solid ${P.border}`, fontWeight: 500, fontSize: 15, cursor: "pointer", fontFamily: F.body, transition: "border-color 0.2s, background 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = P.borderHov; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = P.border; e.currentTarget.style.background = "transparent"; }}>Contacto</button>
          </div>
        </Fade>
      </div>
    </div>
  );

  /* ── Template E: Profesional Barra Lateral ── */
  if (template === "E") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
      <BgParticles />
      <div style={{ position: "absolute", left: "calc(50% - 410px)", top: "20%", bottom: "20%", width: 3, background: P.accent, borderRadius: 2, zIndex: 1, opacity: 0.7 }} />
      <div style={{ maxWidth: 820, textAlign: "left", position: "relative", zIndex: 1, paddingLeft: 28 }}>
        <Fade>
          {hero?.available && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: `${P.mint}08`, padding: "8px 22px", borderRadius: 100, border: `1px solid ${P.mint}12`, marginBottom: 40 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: P.mint, boxShadow: `0 0 10px ${P.mint}`, animation: reduced ? "none" : "pulse 2s ease infinite" }} />
              <span style={{ fontSize: 11, color: P.mint, fontWeight: 600, letterSpacing: 2, fontFamily: F.mono, textTransform: "uppercase" }}>{hero.availableText || "Disponible para proyectos"}</span>
            </div>
          )}
        </Fade>
        <Fade delay={120}>
          <h1 style={{ fontSize: "clamp(44px,8vw,80px)", fontWeight: 800, lineHeight: 1.0, margin: "0 0 20px", letterSpacing: "-0.04em", fontFamily: F.display }}>
            <span style={{ color: P.text }}>{hero?.name || "Isabel Cristina"}</span><br />
            <span style={{ color: P.text }}>{hero?.lastName || "Vivas Henao"}</span>
          </h1>
        </Fade>
        <Fade delay={220}>
          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: P.textSec, fontWeight: 400, margin: "0 0 12px", display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 12 }}>
            <span style={{ width: 20, height: 1, background: P.accent }} /> {hero?.role || "Senior UX Designer"} <span style={{ width: 20, height: 1, background: P.mint }} />
          </p>
        </Fade>
        <Fade delay={300}>
          <p style={{ fontSize: 15, color: P.textMut, maxWidth: 520, margin: "0 0 56px", lineHeight: 1.85 }}>{hero?.bio || "+10 años creando productos digitales en fintech y entornos de alto impacto."}</p>
        </Fade>
        {stats && stats.length > 0 && (
          <Fade delay={380}>
            <div style={{ display: "grid", gridTemplateColumns: stats.map(() => "1fr").join(" auto "), gap: 0, maxWidth: 480, margin: "0 0 60px", padding: "28px 24px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: `1px solid ${P.border}` }}>
              {stats.flatMap((st, i) => { const items = [<AnimStat key={st.id} value={st.value} suffix={st.suffix} label={st.label} />]; if (i < stats.length - 1) items.push(<div key={`sep-${i}`} style={{ width: 1, background: P.border, margin: "4px 12px" }} />); return items; })}
            </div>
          </Fade>
        )}
        <Fade delay={460}>
          <div style={{ display: "flex", gap: 14, justifyContent: "flex-start", flexWrap: "wrap" }}>
            <button onClick={() => goTo("portfolio")} style={{ padding: "16px 40px", background: P.accent, color: "#fff", borderRadius: 12, border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer", boxShadow: `0 4px 32px ${P.accentGlow}`, fontFamily: F.body, transition: "opacity 0.2s, transform 0.2s" }} onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>Ver portafolio</button>
            <button onClick={() => goTo("contact")} style={{ padding: "16px 40px", background: "transparent", color: P.text, borderRadius: 12, border: `1px solid ${P.border}`, fontWeight: 500, fontSize: 15, cursor: "pointer", fontFamily: F.body, transition: "border-color 0.2s, background 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = P.borderHov; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = P.border; e.currentTarget.style.background = "transparent"; }}>Contacto</button>
          </div>
        </Fade>
      </div>
    </div>
  );

  /* ── Template F: Creativo con Reglas Horizontales ── */
  if (template === "F") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
      <BgParticles />
      {!reduced && <div style={{ position: "fixed", width: 600, height: 600, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: `radial-gradient(circle, ${P.accentGlow} 0%, transparent 65%)`, left: mouse.x - 300, top: mouse.y - 300, transition: "left 0.5s ease-out, top 0.5s ease-out", opacity: 0.3 }} />}
      <div style={{ maxWidth: 820, textAlign: "center", position: "relative", zIndex: 1 }}>
        <Fade>
          {hero?.available && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: `${P.mint}08`, padding: "8px 22px", borderRadius: 100, border: `1px solid ${P.mint}12`, marginBottom: 40 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: P.mint, boxShadow: `0 0 10px ${P.mint}`, animation: reduced ? "none" : "pulse 2s ease infinite" }} />
              <span style={{ fontSize: 11, color: P.mint, fontWeight: 600, letterSpacing: 2, fontFamily: F.mono, textTransform: "uppercase" }}>{hero.availableText || "Disponible para proyectos"}</span>
            </div>
          )}
        </Fade>
        <Fade delay={120}>
          <h1 style={{ fontSize: "clamp(44px,8vw,80px)", fontWeight: 800, lineHeight: 1.0, margin: "0 0 20px", letterSpacing: "-0.04em", fontFamily: F.display }}>
            <span style={{ color: P.text }}>{hero?.name || "Isabel Cristina"}</span><br />
            <span style={{ background: `linear-gradient(135deg, ${P.accent}, ${P.mint}, ${P.accentLight})`, backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: reduced ? "none" : "gShift 5s ease infinite" }}>{hero?.lastName || "Vivas Henao"}</span>
          </h1>
        </Fade>
        <Fade delay={220}>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${P.accent}, transparent)`, marginBottom: 14 }} />
          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: P.textSec, fontWeight: 400, margin: "0 0 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ width: 20, height: 1, background: P.accent }} /> {hero?.role || "Senior UX Designer"} <span style={{ width: 20, height: 1, background: P.mint }} />
          </p>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${P.accent}, transparent)`, marginTop: 14 }} />
        </Fade>
        <Fade delay={300}>
          <p style={{ fontSize: 15, color: P.textMut, maxWidth: 520, margin: "0 auto 56px", lineHeight: 1.85 }}>{hero?.bio || "+10 años creando productos digitales en fintech y entornos de alto impacto."}</p>
        </Fade>
        {stats && stats.length > 0 && (
          <Fade delay={380}>
            <div style={{ display: "grid", gridTemplateColumns: stats.map(() => "1fr").join(" auto "), gap: 0, maxWidth: 480, margin: "0 auto 60px", padding: "28px 24px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: `1px solid ${P.border}` }}>
              {stats.flatMap((st, i) => { const items = [<AnimStat key={st.id} value={st.value} suffix={st.suffix} label={st.label} />]; if (i < stats.length - 1) items.push(<div key={`sep-${i}`} style={{ width: 1, background: P.border, margin: "4px 12px" }} />); return items; })}
            </div>
          </Fade>
        )}
        <Fade delay={460}>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => goTo("portfolio")} style={{ padding: "16px 40px", background: P.accent, color: "#fff", borderRadius: 12, border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer", boxShadow: `0 4px 32px ${P.accentGlow}`, fontFamily: F.body, transition: "opacity 0.2s, transform 0.2s" }} onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>Ver portafolio</button>
            <button onClick={() => goTo("contact")} style={{ padding: "16px 40px", background: "transparent", color: P.text, borderRadius: 12, border: `1px solid ${P.border}`, fontWeight: 500, fontSize: 15, cursor: "pointer", fontFamily: F.body, transition: "border-color 0.2s, background 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = P.borderHov; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = P.border; e.currentTarget.style.background = "transparent"; }}>Contacto</button>
          </div>
        </Fade>
      </div>
    </div>
  );

  /* ── Template G: Fotográfico — imagen de fondo full-bleed con overlay ── */
  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
      <BgParticles opacity={0.4} />
      {/* Full-bleed background image */}
      {hero?.heroImage ? (
        <img src={hero.heroImage} alt="Hero" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${P.bg} 0%, ${P.bgAlt} 40%, ${P.card} 100%)` }}>
          {/* Decorative shapes when no image */}
          <div style={{ position: "absolute", top: "10%", right: "5%", width: "clamp(280px,40vw,520px)", height: "clamp(280px,40vw,520px)", borderRadius: "50%", background: `radial-gradient(circle, ${P.accentGlow} 0%, transparent 65%)`, opacity: 0.7 }} />
          <div style={{ position: "absolute", bottom: "15%", left: "8%", width: "clamp(180px,25vw,340px)", height: "clamp(180px,25vw,340px)", borderRadius: "50%", background: `radial-gradient(circle, ${P.mintSoft} 0%, transparent 65%)`, opacity: 0.8 }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${P.accent}04 1px, transparent 1px), linear-gradient(90deg, ${P.accent}04 1px, transparent 1px)`, backgroundSize: "64px 64px" }} />
        </div>
      )}
      {/* Dark gradient overlay bottom-to-top */}
      <div style={{ position: "absolute", inset: 0, background: hero?.heroImage ? `linear-gradient(to top, ${P.bg} 0%, ${P.bg}CC 30%, ${P.bg}66 60%, transparent 100%)` : `linear-gradient(to top, ${P.bg} 0%, ${P.bg}88 50%, transparent 100%)` }} />
      {/* Accent line top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${P.accent}, ${P.mint})` }} />

      {/* Content — bottom aligned */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", padding: "0 max(32px, calc((100vw - 1100px)/2 + 32px)) 72px" }}>
        <Fade>
          {hero?.available && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)", padding: "7px 18px", borderRadius: 100, border: `1px solid ${P.mint}30`, marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: P.mint, animation: reduced ? "none" : "pulse 2s ease infinite" }} />
              <span style={{ fontSize: 10, color: P.mint, fontWeight: 600, letterSpacing: 2.5, fontFamily: F.mono, textTransform: "uppercase" }}>{hero.availableText || "Disponible para proyectos"}</span>
            </div>
          )}
        </Fade>
        <Fade delay={80}>
          <h1 style={{ fontSize: "clamp(48px,7vw,88px)", fontWeight: 900, lineHeight: 0.95, margin: "0 0 20px", letterSpacing: "-0.05em", fontFamily: F.display }}>
            <span style={{ color: "#fff", display: "block", textShadow: "0 2px 24px rgba(0,0,0,0.5)" }}>{hero?.name || "Isabel Cristina"}</span>
            <span style={{ background: `linear-gradient(135deg, ${P.accent}, ${P.mint})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block" }}>{hero?.lastName || "Vivas Henao"}</span>
          </h1>
        </Fade>
        <Fade delay={150}>
          <p style={{ fontSize: "clamp(15px,1.8vw,19px)", color: "rgba(255,255,255,0.7)", fontWeight: 300, margin: "0 0 14px", letterSpacing: 0.3 }}>{hero?.role || "Senior UX Designer"}</p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", maxWidth: 480, lineHeight: 1.85, margin: "0 0 44px" }}>{hero?.bio || "+10 años creando productos digitales en fintech y entornos de alto impacto."}</p>
        </Fade>
        {stats && stats.length > 0 && (
          <Fade delay={200}>
            <div style={{ display: "flex", gap: 32, marginBottom: 44, flexWrap: "wrap" }}>
              {stats.map(st => (
                <div key={st.id}>
                  <div style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: "#fff", fontFamily: F.mono, lineHeight: 1 }}>{st.value}{st.suffix}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 6, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: F.mono }}>{st.label}</div>
                </div>
              ))}
            </div>
          </Fade>
        )}
        <Fade delay={260}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => goTo("portfolio")} style={{ padding: "15px 38px", background: "#fff", color: P.bg, borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: F.body, transition: "opacity 0.2s, transform 0.2s" }} onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
              Ver portafolio
            </button>
            <button onClick={() => goTo("contact")} style={{ padding: "15px 38px", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", color: "#fff", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)", fontWeight: 400, fontSize: 14, cursor: "pointer", fontFamily: F.body, transition: "background 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}>
              Contacto
            </button>
          </div>
        </Fade>
      </div>
    </div>
  );
}

/* ═══ ABOUT ═══ */
function AboutPage({ about, skills, aiTools, methods, experiences, education, showSkillPct = true }) {
  const { P } = useTheme();
  const [barsActive, setBarsActive] = useState(false);
  const barsRef = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setBarsActive(true); }, { threshold: 0.2 });
    if (barsRef.current) obs.observe(barsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ minHeight: "100vh", padding: "120px 24px 80px" }}>
      <div style={{ maxWidth: 940, margin: "0 auto" }}>
        <Fade>
          <Sec num="01" text="Sobre mí" />
          <h2 style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 28px", fontFamily: F.display, lineHeight: 1.1 }}>
            Diseñadora de producto<br /><span style={{ color: P.textSec, fontWeight: 400 }}>con mentalidad estratégica</span>
          </h2>
        </Fade>
        <Fade delay={80}>
          <div style={{ maxWidth: 660, marginBottom: 64 }}>
            <p style={{ fontSize: 15, color: P.textSec, lineHeight: 1.85, margin: "0 0 16px" }}>{about?.bio1}</p>
            <p style={{ fontSize: 15, color: P.textSec, lineHeight: 1.85, margin: 0 }}>{about?.bio2}</p>
          </div>
        </Fade>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, marginBottom: 80 }}>
          <Fade delay={100}>
            <Card style={{ padding: "28px 24px" }}>
              <div ref={barsRef}>
                <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 24, color: P.accent, display: "flex", alignItems: "center", gap: 10, fontFamily: F.mono, letterSpacing: 1, textTransform: "uppercase" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: P.accent, transform: "rotate(45deg)" }} /> Herramientas
                </h3>
                {(skills || []).map((s, i) => <SkillBar key={s.id || s.name} {...s} delay={i * 100} active={barsActive} showPct={showSkillPct} />)}
              </div>
            </Card>
          </Fade>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Fade delay={150}>
              <Card style={{ padding: "28px 24px" }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 20, color: P.mint, display: "flex", alignItems: "center", gap: 10, fontFamily: F.mono, letterSpacing: 1, textTransform: "uppercase" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: P.mint, transform: "rotate(45deg)" }} /> Inteligencia Artificial
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
                  {(aiTools || []).map(t => (
                    <div key={t.name} style={{ background: P.mintSoft, borderRadius: 10, padding: "14px 12px", display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(52,217,168,0.10)" }}>
                      <span style={{ fontSize: 16, opacity: 0.7 }} aria-hidden="true">{t.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: P.mint }}>{t.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Fade>
            <Fade delay={200}>
              <Card style={{ padding: "28px 24px", flex: 1 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 18, color: P.rose, display: "flex", alignItems: "center", gap: 10, fontFamily: F.mono, letterSpacing: 1, textTransform: "uppercase" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: P.rose, transform: "rotate(45deg)" }} /> Metodologías
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(methods || []).map(m => (
                    <span key={m} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500, background: P.roseSoft, color: P.rose, border: "1px solid rgba(240,104,120,0.10)" }}>{m}</span>
                  ))}
                </div>
              </Card>
            </Fade>
          </div>
        </div>

        <Fade>
          <Sec num="02" text="Experiencia" />
          <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 44px", fontFamily: F.display }}>Trayectoria profesional</h2>
        </Fade>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 15, top: 12, bottom: 12, width: 1, background: `linear-gradient(to bottom, ${P.accent}40, ${P.mint}40, ${P.rose}40, ${P.gold}40, ${P.accent}40)` }} />
          {(experiences || []).map((ex, i) => (
            <Fade key={i} delay={i * 70}>
              <div style={{ display: "flex", gap: 24, marginBottom: 20, position: "relative" }}>
                <div style={{ width: 32, minWidth: 32, display: "flex", justifyContent: "center", paddingTop: 24, zIndex: 2 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: ex.color, boxShadow: `0 0 12px ${ex.color}40`, border: `2px solid ${P.bg}` }} />
                </div>
                <Card style={{ flex: 1, padding: "22px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: F.display }}>{ex.role}</h3>
                        {ex.tag && <Tag color={P.mint} style={{ fontSize: 9, padding: "2px 8px" }}>{ex.tag}</Tag>}
                      </div>
                      <p style={{ fontSize: 14, color: ex.color, margin: "4px 0 0", fontWeight: 600 }}>{ex.co}</p>
                    </div>
                    <span style={{ fontSize: 11, color: P.textMut, fontFamily: F.mono, background: "rgba(255,255,255,0.03)", padding: "4px 12px", borderRadius: 6 }}>{ex.period}</span>
                  </div>
                  <Tag color={P.textMut} bg="rgba(255,255,255,0.03)" style={{ marginBottom: 10 }}>{ex.type}</Tag>
                  <p style={{ fontSize: 14, color: P.textSec, lineHeight: 1.75, margin: "8px 0 0" }}>{ex.desc}</p>
                </Card>
              </div>
            </Fade>
          ))}
        </div>

        <div style={{ marginTop: 80 }}>
          <Fade>
            <Sec num="03" text="Educación" />
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 36px", fontFamily: F.display }}>Formación académica</h2>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 16, alignItems: "stretch" }}>
            {(education || []).map((ed, i) => (
              <Fade key={i} delay={i * 100} style={{ height: "100%" }}>
                <Card style={{ padding: "28px 24px", position: "relative", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${P.accent}, ${P.mint})` }} />
                  <span style={{ fontSize: 32, fontWeight: 800, color: `${P.accent}`, opacity: 0.22, fontFamily: F.mono, flexShrink: 0 }}>{ed.yr}</span>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: "12px 0 8px", lineHeight: 1.4, fontFamily: F.display, flex: 1 }}>{ed.t}</h3>
                  <p style={{ fontSize: 13, color: P.textMut, margin: 0, flexShrink: 0 }}>{ed.place}</p>
                </Card>
              </Fade>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ CASE STUDY DETAIL ═══ */
function CaseStudyPage({ project: p, onBack }) {
  const { P } = useTheme();
  return (
    <div style={{ minHeight: "100vh", padding: "100px 24px 80px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <Fade>
          <button
            onClick={onBack}
            style={{ background: "none", border: `1px solid ${P.border}`, borderRadius: 10, color: P.textSec, padding: "10px 22px", cursor: "pointer", fontSize: 13, fontFamily: F.body, display: "flex", alignItems: "center", gap: 8, marginBottom: 32, transition: "border-color 0.2s, color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = P.borderHov; e.currentTarget.style.color = P.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = P.border; e.currentTarget.style.color = P.textSec; }}
          >
            ← Volver al portafolio
          </button>
        </Fade>

        {/* 1. HERO */}
        <Fade delay={40}>
          <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 32, border: `1px solid ${P.border}`, position: "relative", aspectRatio: "16/7" }}>
            <img
              src={p.thumb}
              alt={`Thumbnail del proyecto ${p.title}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              loading="eager"
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: `linear-gradient(to top, ${P.bg}, transparent)` }} />
            <div style={{ position: "absolute", bottom: 28, left: 28, right: 28 }}>
              <Tag color={p.color}>{p.tag}</Tag>
              <h1 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 800, margin: "10px 0 0", letterSpacing: "-0.03em", fontFamily: F.display, lineHeight: 1.1 }}>{p.title}</h1>
            </div>
          </div>
        </Fade>

        <Fade delay={80}>
          <p style={{ fontSize: 18, color: P.text, fontWeight: 500, lineHeight: 1.6, margin: "0 0 20px", fontFamily: F.display }}>{p.hook}</p>
          <Tag color={P.textSec} bg="rgba(255,255,255,0.04)">{p.impact}</Tag>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, margin: "20px 0 48px" }}>
            <Card style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 10, color: P.textMut, textTransform: "uppercase", letterSpacing: 1, fontFamily: F.mono, marginBottom: 6 }}>Rol</div>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: F.display }}>{p.role}</div>
            </Card>
            <Card style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 10, color: P.textMut, textTransform: "uppercase", letterSpacing: 1, fontFamily: F.mono, marginBottom: 6 }}>Empresa</div>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: F.display }}>{p.company}</div>
            </Card>
            <Card style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 10, color: P.textMut, textTransform: "uppercase", letterSpacing: 1, fontFamily: F.mono, marginBottom: 6 }}>Tools</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {p.tools.map(t => <Tag key={t} color={P.accent} style={{ fontSize: 10 }}>{t}</Tag>)}
              </div>
            </Card>
          </div>
        </Fade>

        {/* 2. CONTEXTO */}
        <Fade>
          <div style={{ marginBottom: 48 }}>
            <Sec num="01" text="Contexto y problema" />
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 16px", fontFamily: F.display }}>¿Qué problema existía?</h2>
            <p style={{ fontSize: 15, color: P.textSec, lineHeight: 1.85, margin: "0 0 14px" }}>{p.context}</p>
            <Card style={{ padding: "18px 22px", borderLeft: `3px solid ${p.color}` }}>
              <div style={{ fontSize: 10, color: p.color, textTransform: "uppercase", letterSpacing: 1, fontFamily: F.mono, marginBottom: 6, fontWeight: 600 }}>Audiencia objetivo</div>
              <p style={{ fontSize: 14, color: P.textSec, lineHeight: 1.7, margin: 0 }}>{p.audience}</p>
            </Card>
          </div>
        </Fade>

        {/* 3. ROL */}
        <Fade>
          <div style={{ marginBottom: 48 }}>
            <Sec num="02" text="Mi rol y alcance" />
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 16px", fontFamily: F.display }}>¿Qué lideré?</h2>
            <p style={{ fontSize: 15, color: P.textSec, lineHeight: 1.85, margin: 0 }}>{p.roleDetail}</p>
          </div>
        </Fade>

        {/* 4. PROCESO */}
        <Fade>
          <div style={{ marginBottom: 48 }}>
            <Sec num="03" text="Proceso estratégico" />
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 28px", fontFamily: F.display }}>Decisiones clave</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {p.process.map((step, i) => (
                <Fade key={i} delay={i * 80}>
                  <Card style={{ padding: "24px 24px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: p.color, borderRadius: "0 2px 2px 0" }} />
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, marginTop: 2, background: `${p.color}12`, border: `1px solid ${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: p.color, fontFamily: F.mono }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 10px", fontFamily: F.display }}>{step.title}</h3>
                        <p style={{ fontSize: 14, color: P.textSec, lineHeight: 1.8, margin: 0 }}>{step.desc}</p>
                        {step.image && (
                          <div style={{ marginTop: 16, borderRadius: 10, overflow: "hidden", border: `1px solid ${P.border}` }}>
                            <img src={step.image} alt={`Imagen: ${step.title}`} loading="lazy" style={{ width: "100%", display: "block", objectFit: "cover" }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Fade>
              ))}
            </div>
            {/* Fallback placeholder only if no steps have images */}
            {!(p.process || []).some(s => s.image) && (
              <div style={{ marginTop: 24 }}>
                <ImagePlaceholder type="process" />
              </div>
            )}
          </div>
        </Fade>

        {/* 5. SOLUCIÓN */}
        <Fade>
          <div style={{ marginBottom: 48 }}>
            <Sec num="04" text="La solución" />
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 16px", fontFamily: F.display }}>Diseño final</h2>
            <p style={{ fontSize: 15, color: P.textSec, lineHeight: 1.85, margin: "0 0 20px" }}>{p.solution}</p>
            {p.images && p.images.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: p.images.length === 1 ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {p.images.map((src, i) => (
                  <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${P.border}` }}>
                    <img src={src} alt={`${p.title} — pantalla ${i + 1}`} loading="lazy" style={{ width: "100%", display: "block", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            ) : (
              <ImagePlaceholder type="screens" />
            )}
          </div>
        </Fade>

        {/* 6. RESULTADOS */}
        <Fade>
          <div style={{ marginBottom: 48 }}>
            <Sec num="05" text="Resultados e impacto" />
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 16px", fontFamily: F.display }}>¿Qué se logró?</h2>
            <Card style={{ padding: "24px 24px", borderLeft: `3px solid ${P.mint}`, marginBottom: 16 }}>
              <p style={{ fontSize: 15, color: P.textSec, lineHeight: 1.85, margin: 0 }}>{p.results}</p>
            </Card>
            <Card style={{ padding: "24px 24px", background: `${p.color}08`, borderColor: `${p.color}18` }}>
              <div style={{ fontSize: 10, color: p.color, textTransform: "uppercase", letterSpacing: 1, fontFamily: F.mono, marginBottom: 8, fontWeight: 600 }}>Aprendizaje</div>
              <p style={{ fontSize: 14, color: P.textSec, lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>{p.learning}</p>
            </Card>
          </div>
        </Fade>

        {/* CTA */}
        <Fade>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver proyecto ${p.title} en Behance (abre en nueva pestaña)`}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 36px", background: p.color, color: "#fff", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 15, fontFamily: F.body, boxShadow: `0 4px 28px ${p.color}30`, transition: "opacity 0.2s, transform 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Ver en Behance ↗
            </a>
            <button
              onClick={onBack}
              style={{ padding: "16px 36px", background: "transparent", color: P.text, borderRadius: 12, border: `1px solid ${P.border}`, fontWeight: 500, fontSize: 15, cursor: "pointer", fontFamily: F.body, transition: "border-color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = P.borderHov; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = P.border; }}
            >
              ← Volver
            </button>
          </div>
        </Fade>
      </div>
    </div>
  );
}

/* ═══ PORTFOLIO GRID ═══ */
function PortfolioPage({ onSelect, projects = [], processSteps }) {
  const { P, template } = useTheme();
  const [hov, setHov] = useState(null);
  const [filter, setFilter] = useState("all");
  const filters = [
    { id: "all", label: "Todos" },
    { id: "ux", label: "UX/UI" },
    { id: "web", label: "Web" },
    { id: "fintech", label: "Fintech" },
  ];
  const filtered = filter === "all" ? projects : projects.filter(p => p.category === filter);

  const goProject = (proj) => { onSelect(proj); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const keyProject = (e, proj) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goProject(proj); } };

  /* ── Shared header ── */
  const Header = () => (
    <div style={{ marginBottom: 40 }}>
      <Fade>
        <Sec num="01" text="Portafolio" />
        <h2 style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 14px", fontFamily: F.display }}>Proyectos destacados</h2>
        <p style={{ fontSize: 15, color: P.textSec, maxWidth: 560, lineHeight: 1.75, margin: "0 0 32px" }}>Cada proyecto cuenta una historia: el problema, las decisiones estratégicas y el impacto.</p>
      </Fade>
      <Fade delay={40}>
        <div role="group" aria-label="Filtrar proyectos" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {filters.map(f => {
            const count = f.id === "all" ? projects.length : projects.filter(pp => pp.category === f.id).length;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id} style={{ padding: "8px 20px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: F.mono, letterSpacing: 0.5, textTransform: "uppercase", background: filter === f.id ? P.accent : "transparent", color: filter === f.id ? "#fff" : P.textMut, border: filter === f.id ? `1px solid ${P.accent}` : `1px solid ${P.border}`, transition: "all 0.25s" }} onMouseEnter={e => { if (filter !== f.id) { e.currentTarget.style.borderColor = P.borderHov; e.currentTarget.style.color = P.textSec; }}} onMouseLeave={e => { if (filter !== f.id) { e.currentTarget.style.borderColor = P.border; e.currentTarget.style.color = P.textMut; }}}>
                {f.label} <span style={{ fontSize: 10, opacity: 0.6 }}>({count})</span>
              </button>
            );
          })}
        </div>
      </Fade>
    </div>
  );

  /* ── Template A: Elegant 2-col card grid, image-forward ── */
  const GridA = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
      {filtered.map((proj, i) => {
        const isH = hov === proj.id;
        return (
          <Fade key={proj.id} delay={i * 70} style={{ height: "100%" }}>
            <TiltCard intensity={5} style={{ borderRadius: 20, height: "100%" }}>
              <article onClick={() => goProject(proj)} onMouseEnter={() => setHov(proj.id)} onMouseLeave={() => setHov(null)} onKeyDown={e => keyProject(e, proj)} tabIndex={0} role="button" aria-label={`Ver caso de estudio: ${proj.title}`} className="card-shimmer" style={{ background: P.card, borderRadius: 20, cursor: "pointer", border: `1px solid ${isH ? proj.color + "40" : P.border}`, overflow: "hidden", transition: "border-color 0.4s, box-shadow 0.4s", boxShadow: isH ? `0 24px 64px ${proj.color}20` : "none", outline: "none", display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ aspectRatio: "16/10", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                  <img src={proj.thumb} alt={proj.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.7s cubic-bezier(.22,1,.36,1)", transform: isH ? "scale(1.08)" : "scale(1)" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${P.bg}E0 0%, transparent 55%)` }} />
                  <div style={{ position: "absolute", top: 14, left: 14 }}><Tag color={proj.color}>{proj.tag}</Tag></div>
                  <div style={{ position: "absolute", inset: 0, background: `${proj.color}12`, opacity: isH ? 1 : 0, transition: "opacity 0.4s" }} />
                </div>
                <div style={{ padding: "20px 22px 24px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.3, fontFamily: F.display }}>{proj.title}</h3>
                    <p style={{ fontSize: 13, color: P.textSec, lineHeight: 1.65, margin: "0 0 16px" }}>{proj.hook}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: P.textMut, fontFamily: F.mono }}>{proj.company.split("→").pop().trim()}</span>
                    <span style={{ fontSize: 12, color: proj.color, fontWeight: 600, fontFamily: F.mono, opacity: isH ? 1 : 0, transform: isH ? "translateX(0)" : "translateX(6px)", transition: "opacity 0.3s, transform 0.3s", display: "flex", alignItems: "center", gap: 4 }}>
                      Ver caso <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
                    </span>
                  </div>
                </div>
                <div style={{ height: 2, background: `linear-gradient(90deg, ${proj.color}, ${proj.color}00)`, transform: isH ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.5s cubic-bezier(.22,1,.36,1)", flexShrink: 0 }} />
              </article>
            </TiltCard>
          </Fade>
        );
      })}
    </div>
  );

  /* ── Template B: Numbered horizontal list ── */
  const GridB = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {filtered.map((proj, i) => {
        const isH = hov === proj.id;
        return (
          <Fade key={proj.id} delay={i * 80} dir="left">
            <article onClick={() => goProject(proj)} onMouseEnter={() => setHov(proj.id)} onMouseLeave={() => setHov(null)} onKeyDown={e => keyProject(e, proj)} tabIndex={0} role="button" aria-label={`Ver caso de estudio: ${proj.title}`} style={{ display: "grid", gridTemplateColumns: "56px 200px 1fr 44px", alignItems: "center", gap: 0, background: isH ? P.cardHover : "transparent", borderRadius: 12, cursor: "pointer", border: `1px solid ${isH ? proj.color + "30" : "transparent"}`, overflow: "hidden", transition: "all 0.35s cubic-bezier(.22,1,.36,1)", boxShadow: isH ? `0 4px 32px ${proj.color}10` : "none", outline: "none" }}>
              {/* Number */}
              <div style={{ padding: "24px 0 24px 20px", fontSize: 13, fontWeight: 700, color: isH ? proj.color : P.textMut, fontFamily: F.mono, transition: "color 0.25s" }}>{String(i + 1).padStart(2, "0")}</div>
              {/* Thumbnail */}
              <div style={{ padding: "12px 16px 12px 8px" }}>
                <div style={{ aspectRatio: "16/9", overflow: "hidden", borderRadius: 8 }}>
                  <img src={proj.thumb} alt={proj.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s", transform: isH ? "scale(1.06)" : "scale(1)" }} />
                </div>
              </div>
              {/* Text */}
              <div style={{ padding: "20px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <Tag color={proj.color}>{proj.tag}</Tag>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 6px", fontFamily: F.display, lineHeight: 1.3, color: isH ? P.text : P.text }}>{proj.title}</h3>
                <p style={{ fontSize: 13, color: P.textSec, lineHeight: 1.6, margin: "0 0 8px" }}>{proj.hook}</p>
                <span style={{ fontSize: 11, color: P.textMut, fontFamily: F.mono }}>{proj.role} · {proj.company.split("→").pop().trim()}</span>
              </div>
              {/* Arrow */}
              <div style={{ padding: "0 16px 0 0", color: proj.color, opacity: isH ? 1 : 0, transform: isH ? "translateX(0)" : "translateX(-8px)", transition: "all 0.3s" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10"/></svg>
              </div>
            </article>
            {/* Divider */}
            {i < filtered.length - 1 && <div style={{ height: 1, background: P.border, margin: "0 20px", opacity: isH ? 0 : 0.5 }} />}
          </Fade>
        );
      })}
    </div>
  );

  /* ── Template C: Magazine layout — big featured + 3-col rest ── */
  const GridC = () => {
    const [first, ...rest] = filtered;
    return (
      <div>
        {first && (
          <Fade>
            <article onClick={() => goProject(first)} onMouseEnter={() => setHov(first.id)} onMouseLeave={() => setHov(null)} onKeyDown={e => keyProject(e, first)} tabIndex={0} role="button" aria-label={`Ver caso de estudio: ${first.title}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: 24, cursor: "pointer", border: `2px solid ${hov === first.id ? first.color + "50" : first.color + "18"}`, overflow: "hidden", transition: "all 0.4s cubic-bezier(.22,1,.36,1)", boxShadow: hov === first.id ? `0 28px 80px ${first.color}20` : "none", marginBottom: 20, outline: "none", background: P.card }}>
              <div style={{ overflow: "hidden", position: "relative" }}>
                <img src={first.thumb} alt={first.title} loading="eager" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 300, transition: "transform 0.7s", transform: hov === first.id ? "scale(1.06)" : "scale(1)" }} />
                <div style={{ position: "absolute", inset: 0, background: hov === first.id ? `${first.color}12` : "transparent", transition: "background 0.4s" }} />
              </div>
              <div style={{ padding: "44px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <Tag color={first.color}>{first.tag}</Tag>
                  <span style={{ fontSize: 9, color: P.textMut, fontFamily: F.mono, letterSpacing: 1.5, textTransform: "uppercase" }}>Destacado</span>
                </div>
                <h3 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, margin: "0 0 16px", fontFamily: F.display, lineHeight: 1.15 }}>{first.title}</h3>
                <p style={{ fontSize: 14, color: P.textSec, lineHeight: 1.8, margin: "0 0 28px" }}>{first.hook}</p>
                <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: P.textMut, fontFamily: F.mono }}>{first.role}</span>
                  <span style={{ color: P.textMut }}>·</span>
                  <span style={{ fontSize: 11, color: P.textMut, fontFamily: F.mono }}>{first.company.split("→").pop().trim()}</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: first.color, fontSize: 13, fontWeight: 700, fontFamily: F.mono }}>
                  Ver caso de estudio
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
                </div>
              </div>
            </article>
          </Fade>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {rest.map((proj, i) => {
            const isH = hov === proj.id;
            return (
              <Fade key={proj.id} delay={i * 50} style={{ height: "100%" }}>
                <article onClick={() => goProject(proj)} onMouseEnter={() => setHov(proj.id)} onMouseLeave={() => setHov(null)} onKeyDown={e => keyProject(e, proj)} tabIndex={0} role="button" aria-label={`Ver caso de estudio: ${proj.title}`} style={{ background: P.card, borderRadius: 16, cursor: "pointer", border: `1px solid ${isH ? proj.color + "40" : P.border}`, overflow: "hidden", transition: "all 0.35s cubic-bezier(.22,1,.36,1)", transform: isH ? "translateY(-5px)" : "none", boxShadow: isH ? `0 14px 44px ${proj.color}14` : "none", outline: "none", display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ aspectRatio: "16/9", overflow: "hidden", flexShrink: 0 }}>
                    <img src={proj.thumb} alt={proj.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s", transform: isH ? "scale(1.07)" : "scale(1)" }} />
                  </div>
                  <div style={{ padding: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <Tag color={proj.color} style={{ marginBottom: 8 }}>{proj.tag}</Tag>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 5px", lineHeight: 1.3, fontFamily: F.display }}>{proj.title}</h3>
                    <p style={{ fontSize: 12, color: P.textMut, margin: 0, lineHeight: 1.55 }}>{proj.hook}</p>
                  </div>
                </article>
              </Fade>
            );
          })}
        </div>
      </div>
    );
  };

  /* ── Template D: Grid clásico 3 columnas uniformes ── */
  const GridD = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}>
      {filtered.map((proj, i) => {
        const isH = hov === proj.id;
        return (
          <Fade key={proj.id} delay={i * 55} style={{ height: "100%" }}>
            <article onClick={() => goProject(proj)} onMouseEnter={() => setHov(proj.id)} onMouseLeave={() => setHov(null)} onKeyDown={e => keyProject(e, proj)} tabIndex={0} role="button" aria-label={`Ver caso de estudio: ${proj.title}`} style={{ background: P.card, borderRadius: 16, cursor: "pointer", border: `1px solid ${isH ? proj.color + "30" : P.border}`, overflow: "hidden", transition: "all 0.4s cubic-bezier(.22,1,.36,1)", transform: isH ? "translateY(-5px)" : "none", boxShadow: isH ? `0 16px 48px ${proj.color}10` : "none", outline: "none", display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                <img src={proj.thumb} alt={proj.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s", transform: isH ? "scale(1.05)" : "scale(1)" }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${P.bg}CC 0%, transparent 60%)` }} />
                <div style={{ position: "absolute", bottom: 14, right: 14, padding: "6px 14px", borderRadius: 8, background: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)", fontSize: 12, color: "#fff", fontFamily: F.mono, fontWeight: 600, opacity: isH ? 1 : 0, transform: isH ? "translateY(0)" : "translateY(6px)", transition: "all 0.3s" }} aria-hidden="true">Ver caso →</div>
              </div>
              <div style={{ padding: "16px 20px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <Tag color={proj.color}>{proj.tag}</Tag>
                  <h3 style={{ fontSize: 17, fontWeight: 700, margin: "10px 0 8px", lineHeight: 1.3, fontFamily: F.display }}>{proj.title}</h3>
                  <p style={{ fontSize: 13, color: P.textSec, lineHeight: 1.6, margin: "0 0 10px" }}>{proj.hook}</p>
                </div>
                <p style={{ fontSize: 11, color: P.textMut, margin: 0, fontFamily: F.mono }}>{proj.role} · {proj.company.split("→").pop().trim()}</p>
              </div>
            </article>
          </Fade>
        );
      })}
    </div>
  );

  /* ── Template E: Grid 2 columnas grandes ── */
  const GridE = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 24 }}>
      {filtered.map((proj, i) => {
        const isH = hov === proj.id;
        return (
          <Fade key={proj.id} delay={i * 55} style={{ height: "100%" }}>
            <article onClick={() => goProject(proj)} onMouseEnter={() => setHov(proj.id)} onMouseLeave={() => setHov(null)} onKeyDown={e => keyProject(e, proj)} tabIndex={0} role="button" aria-label={`Ver caso de estudio: ${proj.title}`} style={{ background: P.card, borderRadius: 18, cursor: "pointer", border: `1px solid ${isH ? proj.color + "35" : P.border}`, overflow: "hidden", transition: "all 0.4s cubic-bezier(.22,1,.36,1)", transform: isH ? "translateY(-6px)" : "none", boxShadow: isH ? `0 20px 56px ${proj.color}12` : "none", outline: "none", display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ aspectRatio: "16/8", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                <img src={proj.thumb} alt={proj.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.7s", transform: isH ? "scale(1.06)" : "scale(1)" }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${P.bg}D0 0%, transparent 50%)` }} />
                <div style={{ position: "absolute", top: 16, left: 16 }}><Tag color={proj.color}>{proj.tag}</Tag></div>
              </div>
              <div style={{ padding: "22px 26px 26px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.25, fontFamily: F.display }}>{proj.title}</h3>
                  <p style={{ fontSize: 14, color: P.textSec, lineHeight: 1.7, margin: "0 0 18px" }}>{proj.hook}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: P.textMut, fontFamily: F.mono }}>{proj.role} · {proj.company.split("→").pop().trim()}</span>
                  <span style={{ fontSize: 12, color: proj.color, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, opacity: isH ? 1 : 0, transition: "opacity 0.25s" }}>
                    Ver caso <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
                  </span>
                </div>
              </div>
            </article>
          </Fade>
        );
      })}
    </div>
  );

  /* ── Shared process section ── */
  const ProcessSection = () => (
    <div style={{ marginTop: 88 }}>
      <Fade>
        <Sec num="02" text="Proceso" />
        <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 44px", fontFamily: F.display }}>Mi enfoque de diseño</h2>
      </Fade>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, alignItems: "stretch" }}>
        {(processSteps || []).map((step, i) => (
          <Fade key={step.s} delay={i * 80} style={{ height: "100%" }}>
            <Card style={{ padding: "28px 18px", textAlign: "center", position: "relative", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", boxSizing: "border-box" }}>
              <div style={{ position: "absolute", top: -20, right: -10, fontSize: 64, fontWeight: 800, color: `${step.c}06`, fontFamily: F.mono, lineHeight: 1, pointerEvents: "none", userSelect: "none" }} aria-hidden="true">{step.s}</div>
              <div style={{ width: 40, height: 40, borderRadius: 10, margin: "0 auto 14px", background: `${step.c}12`, border: `1px solid ${step.c}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: step.c, fontFamily: F.mono }}>{step.s}</span>
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px", fontFamily: F.display, flexShrink: 0 }}>{step.t}</h4>
              <p style={{ fontSize: 12, color: P.textMut, margin: 0, lineHeight: 1.55, flex: 1 }}>{step.d}</p>
            </Card>
          </Fade>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", padding: "120px 24px 80px" }}>
      <div style={{ maxWidth: template === "B" ? 860 : 980, margin: "0 auto" }}>
        {Header()}
        {template === "A" && GridA()}
        {template === "B" && GridB()}
        {template === "C" && GridC()}
        {template === "D" && GridD()}
        {template === "E" && GridE()}
        {template === "F" && GridC()}
        {template === "G" && GridA()}
        {ProcessSection()}
      </div>
    </div>
  );
}

/* ═══ CONTACT ═══ */
function ContactPage({ contact }) {
  const { P } = useTheme();
  const [hovId, setHovId] = useState(null);
  const contacts = contact?.items || [];

  /* Maps contact label to icon key */
  const labelToIconKey = { "Email": "email", "LinkedIn": "linkedin", "Behance": "behance", "Teléfono": "phone", "Ubicación": "location" };

  /* SVG icons — replaces emoji/unicode symbols */
  const icons = {
    email: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    linkedin: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    behance: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18V6h5a4 4 0 0 1 0 8H3"/><path d="M3 12h6"/><path d="M14 18V6h7"/><path d="M14 12h7"/></svg>,
    phone: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.94 5.94l.86-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16l.27.92z"/></svg>,
    location: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  };

  return (
    <div style={{ minHeight: "100vh", padding: "120px 24px 80px", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: 580, margin: "0 auto", width: "100%" }}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <Sec num="01" text="Contacto" />
            <h2 style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "12px 0 14px", fontFamily: F.display }}>
              {contact?.title || "¿Trabajamos juntos?"}
            </h2>
            <p style={{ fontSize: 15, color: P.textSec, maxWidth: 460, lineHeight: 1.75, margin: "0 auto" }}>{contact?.subtitle || "Disponible para proyectos remotos."}</p>
          </div>
        </Fade>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {contacts.map((c, i) => {
            const isHov = hovId === c.id;
            const Tag = c.href ? "a" : "div";
            const tagProps = c.href
              ? { href: c.href, target: c.href.startsWith("http") ? "_blank" : undefined, rel: c.href.startsWith("http") ? "noopener noreferrer" : undefined }
              : {};
            return (
              <Fade key={c.id} delay={i * 70}>
                <Tag
                  {...tagProps}
                  onMouseEnter={() => setHovId(c.id)}
                  onMouseLeave={() => setHovId(null)}
                  style={{ display: "flex", alignItems: "center", gap: 18, background: isHov && c.href ? P.cardHover : P.card, borderRadius: 14, padding: "18px 24px", border: `1px solid ${isHov && c.href ? `${c.color}25` : P.border}`, textDecoration: "none", color: P.text, transition: "all 0.25s cubic-bezier(.22,1,.36,1)", cursor: c.href ? "pointer" : "default", transform: isHov && c.href ? "translateX(4px)" : "none" }}
                >
                  <span style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: isHov && c.href ? `${c.color}18` : `${c.color}10`, border: `1px solid ${c.color}${isHov ? "30" : "15"}`, display: "flex", alignItems: "center", justifyContent: "center", color: c.color, transition: "all 0.25s" }}>
                    {icons[labelToIconKey[c.label]] || null}
                  </span>
                  <div>
                    <div style={{ fontSize: 10, color: P.textMut, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3, fontFamily: F.mono, fontWeight: 600 }}>{c.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: isHov && c.href ? c.color : P.text, transition: "color 0.25s" }}>{c.value}</div>
                  </div>
                  {c.href && (
                    <div style={{ marginLeft: "auto", opacity: isHov ? 1 : 0, transition: "opacity 0.2s", color: c.color }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10"/></svg>
                    </div>
                  )}
                </Tag>
              </Fade>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══ MAIN (inner — wrapped by ThemeProvider) ═══ */
function PortfolioInner({ content, loading }) {
  const { P } = useTheme();
  const [page, setPage] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [pageKey, setPageKey] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const goTo = useCallback((id) => {
    setPage(id);
    setSelectedProject(null);
    setPageKey(k => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const renderPage = () => {
    if (loading || !content) return null;
    if (selectedProject) return <CaseStudyPage project={selectedProject} onBack={() => { setSelectedProject(null); setPageKey(k => k + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} />;
    switch (page) {
      case "about": return <AboutPage about={content.about} skills={content.skills} aiTools={content.aiTools} methods={content.methods} experiences={content.experiences} education={content.education} showSkillPct={content.showSkillPct ?? true} />;
      case "portfolio": return <PortfolioPage projects={content.projects} processSteps={content.processSteps} onSelect={(p) => { setSelectedProject(p); setPageKey(k => k + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} />;
      case "contact": return <ContactPage contact={content.contact} />;
      default: return <HomePage goTo={goTo} hero={content.hero} stats={content.stats} />;
    }
  };

  const currentPageId = selectedProject ? "portfolio" : page;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: P.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${P.accentSoft}`, borderTop: `3px solid ${P.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: P.bg, color: P.text, fontFamily: F.body, WebkitFontSmoothing: "antialiased" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        /* ── Core animations ── */
        @keyframes gShift   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin     { to{transform:rotate(360deg)} }

        /* ── New professional animations ── */
        @keyframes shimmer  { from{background-position:200% 0} to{background-position:-200% 0} }
        @keyframes floatY   { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-18px)} }
        @keyframes floatX   { 0%,100%{transform:translateX(0px)} 50%{transform:translateX(12px)} }
        @keyframes rotateSlow{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes orbPulse { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.18);opacity:0.9} }
        @keyframes drawLine { from{width:0} to{width:100%} }
        @keyframes revealUp { from{clip-path:inset(0 0 100% 0);opacity:0} to{clip-path:inset(0 0 0% 0);opacity:1} }
        @keyframes blinkCaret{ 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slideInLeft { from{opacity:0;transform:translateX(-32px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInRight{ from{opacity:0;transform:translateX(32px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
        @keyframes glowPulse{ 0%,100%{box-shadow:0 0 0 0 ${P.accent}00} 50%{box-shadow:0 0 32px 8px ${P.accent}30} }
        @keyframes borderGlow{ 0%,100%{border-color:${P.accent}20} 50%{border-color:${P.accent}60} }
        @keyframes textFlicker{ 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.7} 94%{opacity:1} 96%{opacity:0.8} 97%{opacity:1} }
        @keyframes particleFloat{ 0%{transform:translateY(0) translateX(0) scale(1);opacity:0.8} 33%{transform:translateY(-24px) translateX(8px) scale(1.1);opacity:1} 66%{transform:translateY(-8px) translateX(-6px) scale(0.9);opacity:0.7} 100%{transform:translateY(0) translateX(0) scale(1);opacity:0.8} }
        @keyframes typewriter{ from{width:0} to{width:100%} }

        /* ── Utility classes ── */
        .anim-float-y   { animation: floatY 5s ease-in-out infinite; }
        .anim-float-x   { animation: floatX 6s ease-in-out infinite; }
        .anim-orb-pulse { animation: orbPulse 4s ease-in-out infinite; }
        .anim-shimmer   { animation: shimmer 2.2s ease-in-out infinite; background-size:300% 100%; }
        .anim-glow-pulse{ animation: glowPulse 3s ease-in-out infinite; }
        .anim-border-glow{ animation: borderGlow 3s ease-in-out infinite; }
        .anim-scale-in  { animation: scaleIn 0.55s cubic-bezier(.22,1,.36,1) both; }
        .anim-slide-left{ animation: slideInLeft 0.6s cubic-bezier(.22,1,.36,1) both; }
        .anim-slide-right{animation: slideInRight 0.6s cubic-bezier(.22,1,.36,1) both; }
        .anim-flicker   { animation: textFlicker 6s ease infinite; }

        /* ── Card hover shimmer ── */
        .card-shimmer { position:relative; overflow:hidden; }
        .card-shimmer::after { content:''; position:absolute; inset:0; background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.055) 50%,transparent 60%); background-size:200% 100%; opacity:0; transition:opacity 0.3s; pointer-events:none; }
        .card-shimmer:hover::after { opacity:1; animation:shimmer 0.7s ease-out; }

        *,*::before,*::after { box-sizing: border-box; margin: 0; }
        ::selection { background: ${P.accent}40; color: #fff; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${P.bg}; }
        ::-webkit-scrollbar-thumb { background: ${P.accent}30; border-radius: 3px; }
        body { overflow-x: hidden; }

        /* Visible focus rings for keyboard navigation */
        :focus-visible {
          outline: 2px solid ${P.accent};
          outline-offset: 3px;
          border-radius: 6px;
        }

        /* Skip link — visually hidden until focused */
        .skip-link {
          position: absolute;
          left: -9999px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
          z-index: 9999;
        }
        .skip-link:focus {
          left: 16px;
          top: 16px;
          width: auto;
          height: auto;
          padding: 10px 20px;
          background: ${P.accent};
          color: #fff;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
        }

        /* Respect user's motion preference */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* Scroll progress */}
      <ScrollProgress />

      {/* Skip to main content */}
      <a href="#main-content" className="skip-link">Ir al contenido principal</a>

      {/* ── NAV ── */}
      <nav
        aria-label="Navegación principal"
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? `${P.bg}F0` : "transparent", backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none", borderBottom: scrolled ? `1px solid ${P.border}` : "1px solid transparent", transition: "all 0.4s" }}
      >
        <button
          onClick={() => goTo("home")}
          aria-label="Isabel Vivas — Ir al inicio"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 12 }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${P.accent}, ${P.mint})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: F.mono }} aria-hidden="true">
            {(content?.hero?.navInitials || ((content?.hero?.name?.[0] || "I") + (content?.hero?.lastName?.[0] || "V"))).slice(0, 3)}
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: P.text, fontFamily: F.display }}>
            {content?.hero?.navName || `${content?.hero?.name || "Isabel"} ${(content?.hero?.lastName || "Vivas").split(" ")[0]}`}
          </span>
        </button>

        {/* Scrollable on narrow viewports */}
        <div
          role="list"
          style={{ display: "flex", alignItems: "center", gap: 2, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {NAV.filter(item => !content?.modules || content.modules[item.id]?.enabled !== false).map((item, idx) => (
            <button
              key={item.id}
              role="listitem"
              onClick={() => goTo(item.id)}
              aria-current={currentPageId === item.id ? "page" : undefined}
              style={{ background: currentPageId === item.id ? P.accentSoft : "transparent", border: currentPageId === item.id ? `1px solid ${P.accent}18` : "1px solid transparent", borderRadius: 8, padding: "8px 18px", color: currentPageId === item.id ? P.accentLight : P.textMut, fontSize: 13, fontWeight: currentPageId === item.id ? 600 : 500, cursor: "pointer", transition: "all 0.3s cubic-bezier(.22,1,.36,1)", fontFamily: F.body, whiteSpace: "nowrap", flexShrink: 0, animation: `slideInRight 0.5s cubic-bezier(.22,1,.36,1) ${idx * 70 + 100}ms both` }}
              onMouseEnter={e => { if (currentPageId !== item.id) { e.currentTarget.style.color = P.textSec; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}}
              onMouseLeave={e => { if (currentPageId !== item.id) { e.currentTarget.style.color = P.textMut; e.currentTarget.style.background = "transparent"; }}}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main id="main-content" key={pageKey} style={{ animation: "fadeUp 0.5s cubic-bezier(.22,1,.36,1)" }}>
        {renderPage()}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ textAlign: "center", padding: "36px 24px", borderTop: `1px solid ${P.border}` }}>
        <p style={{ fontSize: 12, color: P.textMut, fontFamily: F.mono }}>{content?.footer?.name || "Isabel Cristina Vivas Henao"} © {content?.footer?.year || new Date().getFullYear()}</p>
        <p style={{ fontSize: 11, color: `${P.textMut}80`, marginTop: 6 }}>{content?.footer?.role || "Senior UX Designer"} · {content?.footer?.location || "Colombia"}</p>
      </footer>
    </div>
  );
}

/* ═══ DEFAULT EXPORT — wraps everything in ThemeProvider ═══ */
export default function Portfolio() {
  const { content, loading } = useContent();
  return (
    <ThemeProvider theme={content?.theme}>
      <PortfolioInner content={content} loading={loading} />
    </ThemeProvider>
  );
}
