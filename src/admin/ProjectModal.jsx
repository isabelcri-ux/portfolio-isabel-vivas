import { useState } from "react";

/* Detecta si una URL es un video por extensión o tipo MIME */
function isVideo(url = "") {
  return /\.(mp4|webm|mov|mkv|avi|ogv|m4v)(\?.*)?$/i.test(url);
}

const P = {
  bg: "#060609", bgAlt: "#0B0B12", card: "#10101A", surface: "#161622",
  accent: "#7C6AF3", accentLight: "#9B8DF7", accentSoft: "rgba(124,106,243,0.10)",
  mint: "#34D9A8", rose: "#F06878", roseSoft: "rgba(240,104,120,0.08)", gold: "#E8A838",
  text: "#EDECF8", textSec: "#9594AE", textMut: "#5C5B72",
  border: "rgba(255,255,255,0.07)",
};
const F = { display: "'Sora', sans-serif", body: "'Plus Jakarta Sans', sans-serif", mono: "'JetBrains Mono', monospace" };

const COLORS = ["#7C6AF3", "#34D9A8", "#E8A838", "#F06878", "#60A5FA", "#A78BFA", "#34D399", "#FB923C"];
const CATEGORIES = [
  { value: "ux", label: "UX Design" },
  { value: "fintech", label: "Fintech" },
  { value: "web", label: "Web" },
  { value: "research", label: "Research" },
  { value: "branding", label: "Branding" },
];

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function Field({ label, value, onChange, multiline, type = "text", placeholder = "" }) {
  const [focused, setFocused] = useState(false);
  const base = {
    width: "100%", padding: "9px 12px", background: P.bgAlt,
    border: `1px solid ${focused ? P.accent : P.border}`, borderRadius: 7,
    color: P.text, fontFamily: F.body, fontSize: 13, outline: "none",
    transition: "border-color 0.2s", boxSizing: "border-box",
  };
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 10, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
        {label}
      </label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ ...base, minHeight: 72, resize: "vertical" }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={base} />
      }
    </div>
  );
}

function TagInput({ label, tags, onChange, placeholder = "Escribe y presiona Enter" }) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);

  const add = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput("");
  };

  const remove = (tag) => onChange(tags.filter(t => t !== tag));

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 10, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
        {label}
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "8px 10px", background: P.bgAlt, border: `1px solid ${focused ? P.accent : P.border}`, borderRadius: 7, minHeight: 40 }}>
        {tags.map(t => (
          <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", background: P.accentSoft, color: P.accentLight, borderRadius: 5, fontSize: 12, fontFamily: F.mono }}>
            {t}
            <button onClick={() => remove(t)} style={{ background: "none", border: "none", color: P.textMut, cursor: "pointer", padding: 0, fontSize: 13, lineHeight: 1 }}>×</button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); if (input.trim()) add(); }}
          placeholder={tags.length === 0 ? placeholder : ""}
          style={{ flex: 1, minWidth: 120, background: "none", border: "none", outline: "none", color: P.text, fontFamily: F.body, fontSize: 13 }}
        />
      </div>
    </div>
  );
}

async function uploadFile(file) {
  const token = localStorage.getItem("admin_token");
  const form = new FormData();
  form.append("image", file);
  const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
  if (!res.ok) throw new Error("Error al subir imagen");
  const data = await res.json();
  return data.url;
}

function ThumbField({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { onChange(await uploadFile(file)); } catch { alert("Error al subir archivo"); }
    setUploading(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setUploading(true);
    try { onChange(await uploadFile(file)); } catch { alert("Error al subir archivo"); }
    setUploading(false);
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 10, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
        Portada del proyecto (imagen o video)
      </label>

      {/* Preview */}
      {value && (
        <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", marginBottom: 10, border: `1px solid ${P.border}`, aspectRatio: "16/9", background: P.bgAlt }}>
          {isVideo(value)
            ? <video src={value} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            : <img src={value} alt="portada" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          }
          <button
            onClick={() => onChange("")}
            style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontSize: 13, padding: "4px 10px", fontFamily: F.body }}
          >✕ Quitar</button>
          {isVideo(value) && (
            <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(124,106,243,0.85)", color: "#fff", fontSize: 10, fontFamily: F.mono, fontWeight: 700, borderRadius: 5, padding: "3px 8px", letterSpacing: 1 }}>VIDEO</span>
          )}
        </div>
      )}

      {/* Drop zone */}
      {!value && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          style={{ border: `2px dashed ${P.accent}40`, borderRadius: 10, padding: "24px 16px", textAlign: "center", background: P.bgAlt, marginBottom: 10, cursor: "pointer" }}
          onClick={() => document.getElementById("thumb-file-input").click()}
        >
          {uploading
            ? <span style={{ fontSize: 13, color: P.accentLight, fontFamily: F.body }}>Subiendo...</span>
            : <>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🎬</div>
                <p style={{ fontSize: 13, color: P.textSec, margin: "0 0 4px", fontFamily: F.body }}>Arrastra aquí o haz clic para subir</p>
                <p style={{ fontSize: 11, color: P.textMut, margin: 0, fontFamily: F.mono }}>JPG · PNG · WebP · MP4 · WebM · MOV</p>
              </>
          }
        </div>
      )}
      <input id="thumb-file-input" type="file" accept="image/*,video/mp4,video/webm,video/quicktime,video/x-matroska" style={{ display: "none" }} onChange={handleFile} />

      {/* Specs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: P.accentSoft, border: `1px solid ${P.accent}25`, borderRadius: 6, padding: "4px 10px" }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={P.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span style={{ fontSize: 10, color: P.accentLight, fontFamily: F.mono, fontWeight: 600 }}>Imagen: 1920 × 1080 px · Proporción 16:9 · JPG/WebP</span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(52,217,168,0.08)", border: "1px solid rgba(52,217,168,0.2)", borderRadius: 6, padding: "4px 10px" }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={P.mint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          <span style={{ fontSize: 10, color: P.mint, fontFamily: F.mono, fontWeight: 600 }}>Video: 1920 × 1080 px · Proporción 16:9 · MP4/WebM · máx. 500 MB</span>
        </div>
      </div>

      {/* URL manual */}
      <div style={{ display: "flex", gap: 6 }}>
        <input
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && urlInput.trim()) { onChange(urlInput.trim()); setUrlInput(""); } }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="O pega una URL directamente..."
          style={{ flex: 1, padding: "8px 12px", background: P.bgAlt, border: `1px solid ${focused ? P.accent : P.border}`, borderRadius: 7, color: P.text, fontFamily: F.body, fontSize: 12, outline: "none" }}
        />
        <button
          onClick={() => { if (urlInput.trim()) { onChange(urlInput.trim()); setUrlInput(""); } }}
          disabled={!urlInput.trim()}
          style={{ padding: "8px 14px", background: urlInput.trim() ? P.accentSoft : "transparent", color: urlInput.trim() ? P.accentLight : P.textMut, border: `1px solid ${P.accent}30`, borderRadius: 7, cursor: urlInput.trim() ? "pointer" : "default", fontFamily: F.body, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}
        >Usar URL</button>
      </div>
    </div>
  );
}

function ImageGallery({ label, images, onChange }) {
  const [newUrl, setNewUrl] = useState("");
  const [focused, setFocused] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useState(null);

  const addUrl = () => {
    const url = newUrl.trim();
    if (url) { onChange([...(images || []), url]); setNewUrl(""); }
  };

  const handleFiles = async (files) => {
    if (!files || !files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).map(uploadFile));
      onChange([...(images || []), ...urls]);
    } catch { alert("Error subiendo imagen. Intenta de nuevo."); }
    finally { setUploading(false); }
  };

  const remove = (idx) => onChange(images.filter((_, i) => i !== idx));

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 10, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{label}</label>

      {/* Existing items */}
      {(images || []).length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, marginBottom: 10 }}>
          {images.map((url, i) => (
            <div key={i} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: `1px solid ${P.border}`, aspectRatio: "16/9", background: P.bgAlt }}>
              {isVideo(url) ? (
                <>
                  <video src={url} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} muted playsInline />
                  <div style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(0,0,0,0.65)", borderRadius: 4, padding: "2px 6px", fontSize: 9, color: "#fff", fontFamily: F.mono, fontWeight: 600 }}>VIDEO</div>
                </>
              ) : (
                <img src={url} alt={`img-${i}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
              )}
              <button onClick={() => remove(i)} style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", cursor: "pointer", fontSize: 13, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
          ))}
          {uploading && (
            <div style={{ borderRadius: 8, border: `1px dashed ${P.accent}40`, aspectRatio: "16/9", background: P.bgAlt, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, color: P.accentLight, fontFamily: F.mono }}>Subiendo...</span>
            </div>
          )}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        style={{ border: `2px dashed ${P.border}`, borderRadius: 10, padding: "20px 16px", textAlign: "center", marginBottom: 8, background: P.bgAlt, transition: "border-color 0.2s", cursor: "pointer" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = P.accent + "50"}
        onMouseLeave={e => e.currentTarget.style.borderColor = P.border}
        onClick={() => document.getElementById("gallery-file-input")?.click()}
      >
        <input
          id="gallery-file-input"
          type="file"
          accept="image/*,video/mp4,video/webm,video/quicktime,video/x-matroska"
          multiple
          style={{ display: "none" }}
          onChange={e => handleFiles(e.target.files)}
        />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={P.textMut} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 6px", display: "block" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <p style={{ fontSize: 12, color: P.textMut, margin: 0, fontFamily: F.body }}>
          {uploading ? "Subiendo archivos..." : "Arrastra imágenes o videos aquí, o haz clic"}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: P.accent, fontFamily: F.mono, background: `${P.accent}12`, border: `1px solid ${P.accent}25`, borderRadius: 5, padding: "3px 8px" }}>
            📷 Imagen · 1280×720px · JPG/PNG/WebP · Máx 10 MB
          </span>
          <span style={{ fontSize: 10, color: P.mint, fontFamily: F.mono, background: `${P.mint}10`, border: `1px solid ${P.mint}25`, borderRadius: 5, padding: "3px 8px" }}>
            🎬 Video · 1920×1080px · MP4/WebM/MOV · Máx 500 MB
          </span>
        </div>
      </div>

      {/* URL input */}
      <div style={{ display: "flex", gap: 6 }}>
        <input
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="O pega una URL de imagen o video..."
          style={{ flex: 1, padding: "8px 12px", background: P.bgAlt, border: `1px solid ${focused ? P.accent : P.border}`, borderRadius: 7, color: P.text, fontFamily: F.body, fontSize: 12, outline: "none" }}
        />
        <button onClick={addUrl} disabled={!newUrl.trim()} style={{ padding: "8px 14px", background: newUrl.trim() ? P.accentSoft : "transparent", color: newUrl.trim() ? P.accentLight : P.textMut, border: `1px solid ${P.accent}30`, borderRadius: 7, cursor: newUrl.trim() ? "pointer" : "default", fontFamily: F.body, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
          + URL
        </button>
      </div>
    </div>
  );
}

function StepImageField({ stepId, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const inputId = `step-img-${stepId}`;

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try { onChange(await uploadFile(file)); }
    catch { alert("Error al subir la imagen."); }
    finally { setUploading(false); }
  };

  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
        <label style={{ fontSize: 10, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Imagen / Video del paso (opcional)</label>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${P.accentSoft}`, border: `1px solid ${P.accent}25`, borderRadius: 5, padding: "3px 8px" }}>
          <span style={{ fontSize: 10, color: P.accentLight, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>📷 1200×675px · 16:9</span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${P.mint}10`, border: `1px solid ${P.mint}25`, borderRadius: 5, padding: "3px 8px" }}>
          <span style={{ fontSize: 10, color: P.mint, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>🎬 1920×1080px · MP4/WebM</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="URL o sube un archivo →"
          style={{ flex: 1, padding: "7px 10px", background: P.card, border: `1px solid ${P.border}`, borderRadius: 6, color: P.text, fontFamily: F.body, fontSize: 12, outline: "none" }}
        />
        <input id={inputId} type="file" accept="image/*,video/mp4,video/webm,video/quicktime" style={{ display: "none" }} onChange={e => handleFile(e.target.files?.[0])} />
        <label
          htmlFor={inputId}
          style={{ padding: "7px 12px", background: P.accentSoft, color: uploading ? P.textMut : P.accentLight, border: `1px solid ${P.accent}30`, borderRadius: 6, cursor: uploading ? "wait" : "pointer", fontFamily: F.body, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          {uploading ? "Subiendo..." : "Subir"}
        </label>
        {value && (
          <div style={{ width: 52, height: 36, borderRadius: 6, overflow: "hidden", border: `1px solid ${P.border}`, flexShrink: 0 }}>
            {isVideo(value)
              ? <video src={value} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted playsInline />
              : <img src={value} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
            }
          </div>
        )}
        {value && (
          <button onClick={() => onChange("")} style={{ padding: "6px 8px", background: "transparent", border: "none", color: P.textMut, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
        )}
      </div>
    </div>
  );
}

function ProcessSteps({ steps, onChange }) {
  const addStep = () => onChange([...steps, { id: uid(), step: `0${steps.length + 1}`, title: "", desc: "", image: "" }]);
  const removeStep = (id) => onChange(steps.filter(s => s.id !== id));
  const updateStep = (id, field, val) => onChange(steps.map(s => s.id === id ? { ...s, [field]: val } : s));

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <label style={{ fontSize: 10, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Proceso (pasos)</label>
        <button onClick={addStep} style={{ padding: "5px 12px", background: P.accentSoft, color: P.accentLight, border: `1px solid ${P.accent}30`, borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: F.body, fontWeight: 600 }}>+ Paso</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {steps.map((s, i) => (
          <div key={s.id} style={{ background: P.bgAlt, borderRadius: 8, padding: "12px 14px", border: `1px solid ${P.border}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "70px 1fr auto", gap: 8, alignItems: "flex-end", marginBottom: 6 }}>
              <Field label="Nº" value={s.step} onChange={v => updateStep(s.id, "step", v)} placeholder="01" />
              <Field label="Título" value={s.title} onChange={v => updateStep(s.id, "title", v)} placeholder="Descubrimiento" />
              <button onClick={() => removeStep(s.id)} style={{ marginBottom: 12, padding: "9px 10px", background: "rgba(240,104,120,0.1)", color: P.rose, border: "none", borderRadius: 7, cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
            <Field label="Descripción" value={s.desc} onChange={v => updateStep(s.id, "desc", v)} multiline placeholder="Descripción del paso..." />
            {/* Image for this step */}
            <StepImageField stepId={s.id} value={s.image || ""} onChange={v => updateStep(s.id, "image", v)} />
          </div>
        ))}
        {steps.length === 0 && (
          <p style={{ fontSize: 12, color: P.textMut, fontFamily: F.body, padding: "10px 0" }}>Sin pasos aún. Haz clic en "+ Paso" para agregar.</p>
        )}
      </div>
    </div>
  );
}

export default function ProjectModal({ project, onSave, onClose, saving }) {
  const [data, setData] = useState({ ...project });
  const set = (field) => (val) => setData(d => ({ ...d, [field]: val }));

  const isNew = !project.title;

  const handleSave = () => onSave(data);

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      onClick={handleBackdrop}
      style={{ position: "fixed", inset: 0, zIndex: 10001, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px" }}
    >
      <div style={{ background: P.card, borderRadius: 16, width: "100%", maxWidth: 680, maxHeight: "90vh", display: "flex", flexDirection: "column", border: `1px solid ${P.border}`, boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>

        {/* Header */}
        <div style={{ padding: "22px 28px 18px", borderBottom: `1px solid ${P.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: P.text, fontFamily: F.display }}>{isNew ? "Nuevo proyecto" : "Editar proyecto"}</h3>
            {!isNew && <p style={{ margin: "3px 0 0", fontSize: 12, color: P.textMut, fontFamily: F.mono }}>{project.title}</p>}
          </div>
          <button onClick={onClose} style={{ padding: "6px 10px", background: "transparent", border: `1px solid ${P.border}`, borderRadius: 7, color: P.textMut, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", padding: "24px 28px", flex: 1 }}>

          {/* === BLOQUE 1: Información básica === */}
          <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${P.border}` }}>
            <p style={{ fontSize: 10, color: P.accent, fontFamily: F.mono, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Información básica</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Título" value={data.title} onChange={set("title")} placeholder="Nombre del proyecto" />
              <Field label="Tag (badge corto)" value={data.tag} onChange={set("tag")} placeholder="UX · Fintech" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 10, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Categoría</label>
                <select
                  value={data.category}
                  onChange={e => set("category")(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", background: P.bgAlt, border: `1px solid ${P.border}`, borderRadius: 7, color: P.text, fontFamily: F.body, fontSize: 13, outline: "none" }}
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 10, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Color del proyecto</label>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => set("color")(c)}
                      style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: data.color === c ? "2px solid #fff" : "2px solid transparent", cursor: "pointer", outline: "none", transition: "transform 0.15s", transform: data.color === c ? "scale(1.2)" : "scale(1)" }}
                      title={c}
                    />
                  ))}
                  <input
                    type="color"
                    value={data.color}
                    onChange={e => set("color")(e.target.value)}
                    style={{ width: 24, height: 24, borderRadius: "50%", border: "none", background: "none", cursor: "pointer", padding: 0 }}
                    title="Color personalizado"
                  />
                </div>
              </div>
            </div>

            {/* Portada: upload imagen o video */}
            <ThumbField value={data.thumb} onChange={set("thumb")} />

            <Field label="URL Behance / caso de estudio" value={data.url} onChange={set("url")} placeholder="https://behance.net/..." />
          </div>

          {/* === BLOQUE 2: Resumen del caso === */}
          <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${P.border}` }}>
            <p style={{ fontSize: 10, color: P.accent, fontFamily: F.mono, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Resumen del caso</p>

            <Field label="Hook (descripción breve visible en la tarjeta)" value={data.hook} onChange={set("hook")} multiline placeholder="Una frase que capture la esencia del proyecto..." />
            <Field label="Impacto (resultado clave medible)" value={data.impact} onChange={set("impact")} placeholder="+40% conversión · NPS 62" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Rol" value={data.role} onChange={set("role")} placeholder="Lead UX Designer" />
              <Field label="Empresa / Cliente" value={data.company} onChange={set("company")} placeholder="dale! — Grupo Aval" />
            </div>

            <TagInput label="Herramientas (Enter para agregar)" tags={data.tools || []} onChange={set("tools")} />
          </div>

          {/* === BLOQUE 3: Detalle del caso === */}
          <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${P.border}` }}>
            <p style={{ fontSize: 10, color: P.accent, fontFamily: F.mono, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Detalle del caso de estudio</p>

            <Field label="Contexto del proyecto" value={data.context} onChange={set("context")} multiline placeholder="¿Cuál era el problema o desafío?" />
            <Field label="Audiencia / Usuarios objetivo" value={data.audience} onChange={set("audience")} multiline placeholder="¿Quiénes son los usuarios?" />
            <Field label="Mi rol en detalle" value={data.roleDetail} onChange={set("roleDetail")} multiline placeholder="¿Qué hice exactamente?" />
          </div>

          {/* === BLOQUE 4: Proceso === */}
          <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${P.border}` }}>
            <p style={{ fontSize: 10, color: P.accent, fontFamily: F.mono, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Proceso de diseño</p>
            <ProcessSteps steps={data.process || []} onChange={set("process")} />
          </div>

          {/* === BLOQUE 5: Resultados === */}
          <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${P.border}` }}>
            <p style={{ fontSize: 10, color: P.accent, fontFamily: F.mono, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Solución y resultados</p>
            <Field label="Solución propuesta" value={data.solution} onChange={set("solution")} multiline placeholder="¿Cómo resolviste el problema?" />
            <Field label="Resultados obtenidos" value={data.results} onChange={set("results")} multiline placeholder="Métricas, impacto, feedback..." />
            <Field label="Aprendizajes" value={data.learning} onChange={set("learning")} multiline placeholder="¿Qué aprendiste o cambiarías?" />
          </div>

          {/* === BLOQUE 6: Imágenes finales === */}
          <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${P.border}` }}>
            <p style={{ fontSize: 10, color: P.accent, fontFamily: F.mono, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Pantallas finales / galería</p>
            <p style={{ fontSize: 12, color: P.textMut, fontFamily: F.body, marginBottom: 8 }}>Imágenes que aparecen en la sección "Diseño final" del caso de estudio.</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${P.accentSoft}`, border: `1px solid ${P.accent}25`, borderRadius: 6, padding: "4px 10px", marginBottom: 12 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={P.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span style={{ fontSize: 10, color: P.accentLight, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>Recomendado: 1280 × 720 px · Proporción 16:9 · PNG/JPG/WebP</span>
            </div>
            <ImageGallery label="Imágenes del proyecto" images={data.images || []} onChange={set("images")} />
          </div>

          {/* === BLOQUE 7: Prototipo Figma === */}
          <div>
            <p style={{ fontSize: 10, color: P.accent, fontFamily: F.mono, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Prototipo interactivo</p>
            <p style={{ fontSize: 12, color: P.textMut, fontFamily: F.body, marginBottom: 12 }}>Si tienes un prototipo en Figma, pega el link de "Share prototype" aquí. Se mostrará como botón en el detalle del proyecto.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 28.5C19 26.0147 19.9955 23.6306 21.7771 21.8787C23.5587 20.1268 25.9799 19.1429 28.5 19.1429C31.0201 19.1429 33.4413 20.1268 35.2229 21.8787C37.0045 23.6306 38 26.0147 38 28.5C38 30.9853 37.0045 33.3694 35.2229 35.1213C33.4413 36.8732 31.0201 37.8571 28.5 37.8571C25.9799 37.8571 23.5587 36.8732 21.7771 35.1213C19.9955 33.3694 19 30.9853 19 28.5Z" fill="#1ABCFE"/>
                <path d="M0 47.2143C0 44.729 0.995537 42.3449 2.77709 40.593C4.55864 38.8411 6.97981 37.8571 9.5 37.8571H19V47.2143C19 49.6996 18.0045 52.0837 16.2229 53.8356C14.4413 55.5875 12.0201 56.5714 9.5 56.5714C6.97981 56.5714 4.55864 55.5875 2.77709 53.8356C0.995537 52.0837 0 49.6996 0 47.2143Z" fill="#0ACF83"/>
                <path d="M19 0V19.1429H28.5C31.0201 19.1429 33.4413 18.1589 35.2229 16.407C37.0045 14.6551 38 12.271 38 9.78571C38 7.30044 37.0045 4.91633 35.2229 3.16443C33.4413 1.41254 31.0201 0.428571 28.5 0.428571L19 0Z" fill="#FF7262"/>
                <path d="M0 9.78571C0 12.271 0.995537 14.6551 2.77709 16.407C4.55864 18.1589 6.97981 19.1429 9.5 19.1429H19V0.428571H9.5C6.97981 0.428571 4.55864 1.41254 2.77709 3.16443C0.995537 4.91633 0 7.30044 0 9.78571Z" fill="#F24E1E"/>
                <path d="M0 28.5C0 30.9853 0.995537 33.3694 2.77709 35.1213C4.55864 36.8732 6.97981 37.8571 9.5 37.8571H19V19.1429H9.5C6.97981 19.1429 4.55864 20.1268 2.77709 21.8787C0.995537 23.6306 0 26.0147 0 28.5Z" fill="#A259FF"/>
              </svg>
              <span style={{ fontSize: 11, color: P.textMut, fontFamily: F.mono }}>Figma → Share → Copy link to prototype</span>
            </div>
            <Field
              label="Link del prototipo Figma"
              value={data.figmaUrl || ""}
              onChange={set("figmaUrl")}
              placeholder="https://www.figma.com/proto/..."
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "18px 28px", borderTop: `1px solid ${P.border}`, display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: "10px 22px", background: "transparent", color: P.textSec, border: `1px solid ${P.border}`, borderRadius: 8, cursor: "pointer", fontFamily: F.body, fontSize: 13 }}>
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: "10px 28px", background: saving ? P.textMut : P.accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: saving ? "wait" : "pointer", fontFamily: F.body, transition: "background 0.2s" }}
          >
            {saving ? "Guardando..." : isNew ? "Crear proyecto" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
