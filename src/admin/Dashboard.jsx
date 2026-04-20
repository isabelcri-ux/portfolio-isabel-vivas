import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "./useAdmin";
import { useContent } from "../contexts/ContentContext";
import ProjectModal from "./ProjectModal";
import ThemeSection from "./ThemeSection";

/* ── Design tokens (same palette as portfolio) ── */
const P = {
  bg: "#060609", bgAlt: "#0B0B12", card: "#10101A", surface: "#161622",
  accent: "#7C6AF3", accentLight: "#9B8DF7", accentSoft: "rgba(124,106,243,0.10)",
  mint: "#34D9A8",   mintSoft: "rgba(52,217,168,0.08)",
  rose: "#F06878",   roseSoft: "rgba(240,104,120,0.08)",
  gold: "#E8A838",   goldSoft: "rgba(232,168,56,0.08)",
  text: "#EDECF8",   textSec: "#9594AE", textMut: "#5C5B72",
  border: "rgba(255,255,255,0.07)", borderHov: "rgba(255,255,255,0.12)",
};
const F = { display: "'Sora', sans-serif", body: "'Plus Jakarta Sans', sans-serif", mono: "'JetBrains Mono', monospace" };

/* ═══════════════════════════════════════
   SHARED UI COMPONENTS
════════════════════════════════════════ */
function Field({ label, value, onChange, multiline, type = "text", placeholder = "" }) {
  const [focused, setFocused] = useState(false);
  const base = { width: "100%", padding: "10px 13px", background: P.bgAlt, border: `1px solid ${focused ? P.accent : P.border}`, borderRadius: 8, color: P.text, fontFamily: F.body, fontSize: 13, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 10, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ ...base, minHeight: 80, resize: "vertical" }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={base} />
      }
    </div>
  );
}

function SaveBtn({ onClick, saving, label = "Guardar cambios" }) {
  return (
    <button onClick={onClick} disabled={saving} style={{ padding: "10px 28px", background: saving ? P.textMut : P.accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: saving ? "wait" : "pointer", fontFamily: F.body, transition: "background 0.2s" }}>
      {saving ? "Guardando..." : label}
    </button>
  );
}

function DeleteBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ padding: "7px 14px", background: P.roseSoft, color: P.rose, border: `1px solid ${P.rose}25`, borderRadius: 7, fontSize: 12, cursor: "pointer", fontFamily: F.body, fontWeight: 600 }}>
      Eliminar
    </button>
  );
}

function EditBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ padding: "7px 14px", background: P.accentSoft, color: P.accentLight, border: `1px solid ${P.accent}25`, borderRadius: 7, fontSize: 12, cursor: "pointer", fontFamily: F.body, fontWeight: 600 }}>
      Editar
    </button>
  );
}

function AddBtn({ onClick, label = "+ Agregar" }) {
  return (
    <button onClick={onClick} style={{ padding: "9px 18px", background: P.accentSoft, color: P.accentLight, border: `1px solid ${P.accent}30`, borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: F.body, fontWeight: 600 }}>
      {label}
    </button>
  );
}

function ProjectRow({ project: p, onEdit, onDelete, onRename, onMoveUp, onMoveDown }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(p.title);

  const commit = () => {
    setEditing(false);
    if (draft !== p.title) onRename(draft);
  };

  return (
    <div style={{ background: P.surface, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, border: `1px solid ${P.border}` }}>
      {/* Miniatura */}
      <div style={{ width: 56, height: 40, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: P.bgAlt }}>
        {p.thumb && <img src={p.thumb} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />}
      </div>

      {/* Título editable */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(p.title); setEditing(false); } }}
              style={{ flex: 1, fontSize: 14, fontWeight: 600, color: P.text, fontFamily: F.display, background: P.bgAlt, border: `1px solid ${P.accent}`, borderRadius: 6, padding: "3px 8px", outline: "none" }}
            />
          ) : (
            <span
              onClick={() => { setDraft(p.title); setEditing(true); }}
              title="Haz clic para editar el título"
              style={{ fontSize: 14, fontWeight: 600, color: P.text, fontFamily: F.display, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "text", borderBottom: `1px dashed ${P.border}`, paddingBottom: 1 }}
            >
              {p.title || <span style={{ color: P.textMut, fontStyle: "italic" }}>Sin título</span>}
            </span>
          )}
        </div>
        <span style={{ fontSize: 11, color: P.textMut, fontFamily: F.mono }}>{p.tag} · {p.company?.split("→").pop().trim()}</span>
      </div>

      {/* Acciones */}
      <div style={{ display: "flex", gap: 4, flexShrink: 0, alignItems: "center" }}>
        {/* Reordenar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginRight: 4 }}>
          <button onClick={onMoveUp} disabled={!onMoveUp} title="Subir" style={{ padding: "2px 6px", background: onMoveUp ? P.surface : "transparent", border: `1px solid ${onMoveUp ? P.border : "transparent"}`, borderRadius: 4, cursor: onMoveUp ? "pointer" : "default", color: onMoveUp ? P.textSec : P.border, fontSize: 10, lineHeight: 1 }}>▲</button>
          <button onClick={onMoveDown} disabled={!onMoveDown} title="Bajar" style={{ padding: "2px 6px", background: onMoveDown ? P.surface : "transparent", border: `1px solid ${onMoveDown ? P.border : "transparent"}`, borderRadius: 4, cursor: onMoveDown ? "pointer" : "default", color: onMoveDown ? P.textSec : P.border, fontSize: 10, lineHeight: 1 }}>▼</button>
        </div>
        <EditBtn onClick={onEdit} />
        <DeleteBtn onClick={onDelete} />
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${P.border}` }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: P.text, fontFamily: F.display, margin: "0 0 6px" }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: P.textMut, margin: 0 }}>{subtitle}</p>}
    </div>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const isOk = type === "success";
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, padding: "12px 20px", borderRadius: 10, fontFamily: F.body, fontSize: 13, fontWeight: 600, background: isOk ? "#0E2A1E" : "#2A0E15", border: `1px solid ${isOk ? P.mint : P.rose}40`, color: isOk ? P.mint : P.rose, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "fadeUp 0.3s ease" }}>
      {isOk ? "✓" : "✕"} {message}
    </div>
  );
}

function Confirm({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: P.card, borderRadius: 14, padding: "28px 32px", border: `1px solid ${P.border}`, maxWidth: 380, width: "90%" }}>
        <p style={{ fontSize: 15, color: P.text, fontFamily: F.body, marginBottom: 24 }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "9px 20px", background: "transparent", color: P.textSec, border: `1px solid ${P.border}`, borderRadius: 8, cursor: "pointer", fontFamily: F.body, fontSize: 13 }}>Cancelar</button>
          <button onClick={onConfirm} style={{ padding: "9px 20px", background: P.rose, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: F.body, fontSize: 13, fontWeight: 600 }}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

/* ═══════════════════════════════════════
   SECTION: GENERAL (Hero + Stats)
════════════════════════════════════════ */
function GeneralSection({ content, onSave }) {
  const [hero, setHero]       = useState(content.hero);
  const [stats, setStats]     = useState(content.stats);
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  const save = async () => {
    setSaving(true);
    await onSave({ ...content, hero, stats });
    setSaving(false);
  };

  const updateStat = (id, field, val) => setStats(s => s.map(st => st.id === id ? { ...st, [field]: val } : st));
  const removeStat = (id) => setStats(s => s.filter(st => st.id !== id));
  const addStat    = () => setStats(s => [...s, { id: uid(), value: "0", suffix: "", label: "Nueva métrica" }]);

  return (
    <div>
      <SectionHeader title="General" subtitle="Hero, disponibilidad y métricas de la portada." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Nombre" value={hero.name} onChange={v => setHero(h => ({ ...h, name: v }))} />
        <Field label="Apellido" value={hero.lastName} onChange={v => setHero(h => ({ ...h, lastName: v }))} />
      </div>
      <Field label="Rol / Título" value={hero.role} onChange={v => setHero(h => ({ ...h, role: v }))} />

      {/* Nav branding */}
      <div style={{ marginBottom: 20, padding: "16px 18px", background: P.surface, borderRadius: 10, border: `1px solid ${P.border}` }}>
        <div style={{ fontSize: 11, color: P.accent, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Logo y nombre del menú</div>
        <div style={{ fontSize: 11, color: P.textMut, marginBottom: 14 }}>Lo que aparece en la barra de navegación superior.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <Field label="Nombre en nav" value={hero.navName || ""} onChange={v => setHero(h => ({ ...h, navName: v }))} placeholder="Isabel Vivas" />
            <div style={{ fontSize: 11, color: P.textMut }}>Si se deja vacío usa Nombre + Apellido.</div>
          </div>
          <div>
            <Field label="Iniciales del logo" value={hero.navInitials || ""} onChange={v => setHero(h => ({ ...h, navInitials: v.slice(0, 3) }))} placeholder="IV" />
            <div style={{ fontSize: 11, color: P.textMut }}>Máx. 3 caracteres. Si se deja vacío las genera automáticamente.</div>
          </div>
        </div>
        {/* Preview */}
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: P.bg, borderRadius: 8, border: `1px solid ${P.border}` }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #7C6AF3, #34D9A8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
            {(hero.navInitials || ((hero.name?.[0] || "") + (hero.lastName?.[0] || ""))).slice(0,3) || "IV"}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: P.text }}>
            {hero.navName || `${hero.name || "Isabel"} ${(hero.lastName || "Vivas").split(" ")[0]}`}
          </span>
        </div>
      </div>
      <Field label="Bio (portada)" value={hero.bio} onChange={v => setHero(h => ({ ...h, bio: v }))} multiline />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={hero.available} onChange={e => setHero(h => ({ ...h, available: e.target.checked }))} style={{ accentColor: P.mint, width: 16, height: 16 }} />
          <span style={{ fontSize: 13, color: P.text, fontFamily: F.body }}>Mostrar badge "Disponible"</span>
        </label>
        {hero.available && <Field label="Texto del badge" value={hero.availableText} onChange={v => setHero(h => ({ ...h, availableText: v }))} />}
      </div>

      {/* Imagen de fondo para Template G */}
      <div style={{ marginBottom: 20, padding: "16px 18px", background: P.surface, borderRadius: 10, border: `1px solid ${P.border}` }}>
        <div style={{ fontSize: 11, color: P.accent, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Imagen de portada (Template G)</div>
        <div style={{ fontSize: 11, color: P.textMut, marginBottom: 6 }}>Solo se usa en el template "Fotográfico". Sube una foto o pega la URL.</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${P.accent}10`, border: `1px solid ${P.accent}25`, borderRadius: 6, padding: "4px 10px", marginBottom: 12 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={P.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span style={{ fontSize: 10, color: P.accent, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>Recomendado: 1920 × 1080 px · Proporción 16:9 · JPG/WebP</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <Field label="URL de imagen" value={hero.heroImage || ""} onChange={v => { setHero(h => ({ ...h, heroImage: v })); setUploadErr(""); }} placeholder="https://... o /uploads/foto.jpg" />
          </div>
          <label style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", background: uploading ? P.surface : P.accentSoft, border: `1px solid ${P.accent}30`, borderRadius: 8, cursor: uploading ? "not-allowed" : "pointer", fontSize: 12, color: uploading ? P.textMut : P.accent, fontWeight: 600, fontFamily: F.body, whiteSpace: "nowrap", opacity: uploading ? 0.6 : 1 }}>
            {uploading ? "Subiendo..." : "Subir foto"}
            <input type="file" accept="image/*" style={{ display: "none" }} disabled={uploading} onChange={async e => {
              const file = e.target.files?.[0]; if (!file) return;
              setUploading(true); setUploadErr("");
              try {
                const token = localStorage.getItem("admin_token");
                const form = new FormData(); form.append("image", file);
                const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
                if (res.ok) {
                  const d = await res.json();
                  setHero(h => ({ ...h, heroImage: d.url }));
                } else {
                  const err = await res.json().catch(() => ({}));
                  setUploadErr(err.error || `Error ${res.status}`);
                }
              } catch (err) {
                setUploadErr("No se pudo conectar al servidor");
              } finally {
                setUploading(false);
                e.target.value = "";
              }
            }} />
          </label>
        </div>
        {uploadErr && (
          <div style={{ marginBottom: 10, padding: "8px 12px", background: "rgba(240,104,120,0.10)", border: "1px solid rgba(240,104,120,0.25)", borderRadius: 8, fontSize: 12, color: P.rose }}>{uploadErr}</div>
        )}
        {hero.heroImage && (
          <div style={{ marginTop: 4, borderRadius: 8, overflow: "hidden", border: `1px solid ${P.border}`, height: 140 }}>
            <img
              src={hero.heroImage}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={e => { e.currentTarget.style.display = "none"; setUploadErr("No se puede cargar la imagen. Verifica la URL."); }}
              onLoad={e => { e.currentTarget.style.display = "block"; setUploadErr(""); }}
            />
          </div>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Métricas</span>
          <AddBtn onClick={addStat} label="+ Métrica" />
        </div>
        {stats.map(st => (
          <div key={st.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr auto", gap: 8, alignItems: "flex-end", marginBottom: 8 }}>
            <Field label="Valor" value={st.value} onChange={v => updateStat(st.id, "value", v)} />
            <Field label="Sufijo" value={st.suffix} onChange={v => updateStat(st.id, "suffix", v)} placeholder="%" />
            <Field label="Etiqueta" value={st.label} onChange={v => updateStat(st.id, "label", v)} />
            <button onClick={() => removeStat(st.id)} style={{ marginBottom: 14, padding: "10px 12px", background: P.roseSoft, color: P.rose, border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
        ))}
      </div>
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

/* ═══════════════════════════════════════
   SECTION: SOBRE MÍ
════════════════════════════════════════ */
function AboutSection({ content, onSave }) {
  const [about, setAbout] = useState(content.about);
  const [saving, setSaving] = useState(false);
  const save = async () => { setSaving(true); await onSave({ ...content, about }); setSaving(false); };

  return (
    <div>
      <SectionHeader title="Sobre mí" subtitle="Textos de la sección de presentación." />
      <Field label="Párrafo 1" value={about.bio1} onChange={v => setAbout(a => ({ ...a, bio1: v }))} multiline />
      <Field label="Párrafo 2" value={about.bio2} onChange={v => setAbout(a => ({ ...a, bio2: v }))} multiline />
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

/* ═══════════════════════════════════════
   SECTION: PROYECTOS
════════════════════════════════════════ */
function ProjectsSection({ content, onSave }) {
  const [projects, setProjects] = useState(content.projects);
  const [saving, setSaving]     = useState(false);
  const [modal, setModal]       = useState(null); // null | {} | project
  const [confirm, setConfirm]   = useState(null);

  const save = async (updated) => {
    setSaving(true);
    await onSave({ ...content, projects: updated });
    setSaving(false);
  };

  const handleSaveProject = async (projectData) => {
    const isNew = !projects.find(p => p.id === projectData.id);
    const updated = isNew ? [...projects, projectData] : projects.map(p => p.id === projectData.id ? projectData : p);
    setProjects(updated);
    await save(updated);
    setModal(null);
  };

  const handleDelete = async (id) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    await save(updated);
    setConfirm(null);
  };

  const CATEGORIES = { ux: "#7C6AF3", fintech: "#E8A838", web: "#34D9A8" };

  return (
    <div>
      <SectionHeader title="Proyectos" subtitle={`${projects.length} proyectos · Haz clic en Editar para modificar todos los campos del caso de estudio.`} />
      <div style={{ marginBottom: 16 }}>
        <AddBtn onClick={() => setModal({ id: uid(), title: "", tag: "", category: "ux", color: "#7C6AF3", thumb: "", url: "", hook: "", impact: "", role: "", company: "", tools: [], context: "", audience: "", roleDetail: "", process: [], solution: "", results: "", learning: "", images: [] })} label="+ Nuevo proyecto" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {projects.map((p, i) => (
          <ProjectRow
            key={p.id}
            project={p}
            onEdit={() => setModal(p)}
            onDelete={() => setConfirm(p.id)}
            onRename={(newTitle) => handleSaveProject({ ...p, title: newTitle })}
            onMoveUp={i > 0 ? () => {
              const updated = [...projects];
              [updated[i - 1], updated[i]] = [updated[i], updated[i - 1]];
              setProjects(updated);
              save(updated);
            } : null}
            onMoveDown={i < projects.length - 1 ? () => {
              const updated = [...projects];
              [updated[i], updated[i + 1]] = [updated[i + 1], updated[i]];
              setProjects(updated);
              save(updated);
            } : null}
          />
        ))}
      </div>

      {modal && (
        <ProjectModal
          project={modal}
          onSave={handleSaveProject}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}
      {confirm && (
        <Confirm
          message={`¿Eliminar "${projects.find(p => p.id === confirm)?.title}"? Esta acción no se puede deshacer.`}
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SECTION: EXPERIENCIA
════════════════════════════════════════ */
function ExperienceSection({ content, onSave }) {
  const [exps, setExps]   = useState(content.experiences);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const COLORS = ["#7C6AF3","#34D9A8","#F06878","#E8A838"];

  const save = async (updated) => { setSaving(true); await onSave({ ...content, experiences: updated }); setSaving(false); };

  const handleSave = async () => {
    const updated = editing.isNew ? [...exps, editing] : exps.map(e => e.id === editing.id ? editing : e);
    setExps(updated); await save(updated); setEditing(null);
  };

  const handleDelete = async (id) => {
    const updated = exps.filter(e => e.id !== id); setExps(updated); await save(updated); setConfirm(null);
  };

  return (
    <div>
      <SectionHeader title="Experiencia" subtitle="Historial profesional en orden cronológico." />
      <AddBtn onClick={() => setEditing({ id: uid(), isNew: true, role: "", co: "", type: "", period: "", desc: "", color: "#7C6AF3", tag: "" })} label="+ Nueva experiencia" />

      {editing && (
        <div style={{ background: P.surface, borderRadius: 12, padding: 20, margin: "16px 0", border: `1px solid ${P.accent}30` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Rol" value={editing.role} onChange={v => setEditing(e => ({ ...e, role: v }))} />
            <Field label="Empresa" value={editing.co} onChange={v => setEditing(e => ({ ...e, co: v }))} />
            <Field label="Tipo" value={editing.type} onChange={v => setEditing(e => ({ ...e, type: v }))} />
            <Field label="Período" value={editing.period} onChange={v => setEditing(e => ({ ...e, period: v }))} placeholder="2022 — Presente" />
          </div>
          <Field label="Tag (ej. Actual)" value={editing.tag || ""} onChange={v => setEditing(e => ({ ...e, tag: v }))} />
          <Field label="Descripción" value={editing.desc} onChange={v => setEditing(e => ({ ...e, desc: v }))} multiline />
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Color</label>
            <div style={{ display: "flex", gap: 8 }}>
              {COLORS.map(c => <div key={c} onClick={() => setEditing(e => ({ ...e, color: c }))} style={{ width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer", border: editing.color === c ? `3px solid white` : "3px solid transparent" }} />)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <SaveBtn onClick={handleSave} saving={saving} label="Guardar" />
            <button onClick={() => setEditing(null)} style={{ padding: "10px 20px", background: "transparent", color: P.textSec, border: `1px solid ${P.border}`, borderRadius: 8, cursor: "pointer", fontFamily: F.body, fontSize: 13 }}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
        {exps.map(ex => (
          <div key={ex.id} style={{ background: P.surface, borderRadius: 10, padding: "14px 16px", border: `1px solid ${P.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: ex.color }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: P.text, fontFamily: F.display }}>{ex.role}</span>
                {ex.tag && <span style={{ fontSize: 10, color: P.mint, fontFamily: F.mono, background: `${P.mint}15`, padding: "2px 7px", borderRadius: 4 }}>{ex.tag}</span>}
              </div>
              <span style={{ fontSize: 12, color: P.textSec }}>{ex.co} · {ex.period}</span>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <EditBtn onClick={() => setEditing({ ...ex, isNew: false })} />
              <DeleteBtn onClick={() => setConfirm(ex.id)} />
            </div>
          </div>
        ))}
      </div>
      {confirm && <Confirm message={`¿Eliminar esta experiencia?`} onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

/* ═══════════════════════════════════════
   SECTION: EDUCACIÓN
════════════════════════════════════════ */
function EducationSection({ content, onSave }) {
  const [items, setItems]   = useState(content.education);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const save = async (updated) => { setSaving(true); await onSave({ ...content, education: updated }); setSaving(false); };

  const handleSave = async () => {
    const updated = editing.isNew ? [...items, editing] : items.map(e => e.id === editing.id ? editing : e);
    setItems(updated); await save(updated); setEditing(null);
  };

  return (
    <div>
      <SectionHeader title="Educación" subtitle="Títulos, especializaciones y cursos." />
      <AddBtn onClick={() => setEditing({ id: uid(), isNew: true, t: "", place: "", yr: "" })} label="+ Nueva formación" />

      {editing && (
        <div style={{ background: P.surface, borderRadius: 12, padding: 20, margin: "16px 0", border: `1px solid ${P.accent}30` }}>
          <Field label="Título / Programa" value={editing.t} onChange={v => setEditing(e => ({ ...e, t: v }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 10 }}>
            <Field label="Institución" value={editing.place} onChange={v => setEditing(e => ({ ...e, place: v }))} />
            <Field label="Año" value={editing.yr} onChange={v => setEditing(e => ({ ...e, yr: v }))} placeholder="2026" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <SaveBtn onClick={handleSave} saving={saving} label="Guardar" />
            <button onClick={() => setEditing(null)} style={{ padding: "10px 20px", background: "transparent", color: P.textSec, border: `1px solid ${P.border}`, borderRadius: 8, cursor: "pointer", fontFamily: F.body, fontSize: 13 }}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
        {items.map(ed => (
          <div key={ed.id} style={{ background: P.surface, borderRadius: 10, padding: "14px 16px", border: `1px solid ${P.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: P.text, fontFamily: F.display }}>{ed.t}</div>
              <div style={{ fontSize: 12, color: P.textMut }}>{ed.place} · {ed.yr}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <EditBtn onClick={() => setEditing({ ...ed, isNew: false })} />
              <DeleteBtn onClick={() => setConfirm(ed.id)} />
            </div>
          </div>
        ))}
      </div>
      {confirm && <Confirm message="¿Eliminar esta formación?" onConfirm={async () => { const u = items.filter(e => e.id !== confirm); setItems(u); await save(u); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

/* ═══════════════════════════════════════
   SECTION: HABILIDADES
════════════════════════════════════════ */
/* ── Icon picker for AI tools ── */
const AI_ICONS = [
  "⚡","◈","▲","◎","✦","🤖","🧠","🔮","✨","🎯","💡","🌟",
  "🎨","📊","🔬","◉","◆","⊕","∞","⬡","🔑","📱","🖥️","⚙️",
  "🚀","🌐","📝","🔧","⬢","▣","◐","◑","◒","◓","⟁","❖",
];

function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          title="Seleccionar ícono"
          style={{ width: 42, height: 42, borderRadius: 8, border: `1px solid ${P.border}`, background: P.bgAlt, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >{value || "◎"}</button>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="o escribe emoji"
          style={{ width: 90, padding: "9px 10px", background: P.bgAlt, border: `1px solid ${P.border}`, borderRadius: 8, color: P.text, fontFamily: F.body, fontSize: 14, outline: "none" }}
        />
      </div>
      {open && (
        <div style={{ position: "absolute", top: 48, left: 0, zIndex: 100, background: P.surface, border: `1px solid ${P.border}`, borderRadius: 12, padding: 10, display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", width: 220 }}>
          {AI_ICONS.map(ic => (
            <button key={ic} type="button" onClick={() => { onChange(ic); setOpen(false); }}
              style={{ width: 32, height: 32, borderRadius: 6, border: value === ic ? `1px solid ${P.accent}` : "1px solid transparent", background: value === ic ? P.accentSoft : "transparent", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >{ic}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function SkillsSection({ content, onSave }) {
  const [skills, setSkills]       = useState(content.skills);
  const [aiTools, setAiTools]     = useState(content.aiTools);
  const [methods, setMethods]     = useState(content.methods);
  const [showSkillPct, setShowSkillPct] = useState(content.showSkillPct ?? true);
  const [saving, setSaving]       = useState(false);
  const [newMethod, setNewMethod] = useState("");

  const save = async () => {
    setSaving(true);
    await onSave({ ...content, skills, aiTools, methods, showSkillPct });
    setSaving(false);
  };

  return (
    <div>
      <SectionHeader title="Habilidades" subtitle="Herramientas, IA y metodologías." />

      {/* Skills */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: P.accent, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Herramientas</span>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Toggle mostrar/ocultar % */}
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
              <span style={{ fontSize: 11, color: P.textSec, fontFamily: F.mono }}>Mostrar %</span>
              <div
                onClick={() => setShowSkillPct(v => !v)}
                style={{ width: 36, height: 20, borderRadius: 10, background: showSkillPct ? P.accent : P.border, position: "relative", transition: "background 0.25s", cursor: "pointer", flexShrink: 0 }}
              >
                <div style={{ position: "absolute", top: 3, left: showSkillPct ? 18 : 3, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.25s" }} />
              </div>
            </label>
            <AddBtn onClick={() => setSkills(s => [...s, { id: uid(), name: "Nueva herramienta", pct: 75 }])} label="+ Herramienta" />
          </div>
        </div>
        {skills.map(sk => (
          <div key={sk.id} style={{ display: "grid", gridTemplateColumns: "1fr 100px auto", gap: 8, alignItems: "flex-end", marginBottom: 6 }}>
            <Field label="Nombre" value={sk.name} onChange={v => setSkills(s => s.map(x => x.id === sk.id ? { ...x, name: v } : x))} />
            <Field label="%" value={String(sk.pct)} type="number" onChange={v => setSkills(s => s.map(x => x.id === sk.id ? { ...x, pct: Number(v) } : x))} />
            <button onClick={() => setSkills(s => s.filter(x => x.id !== sk.id))} style={{ marginBottom: 14, padding: "10px 12px", background: P.roseSoft, color: P.rose, border: "none", borderRadius: 8, cursor: "pointer" }}>✕</button>
          </div>
        ))}
      </div>

      {/* AI Tools */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: P.mint, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Herramientas IA</span>
          <AddBtn onClick={() => setAiTools(a => [...a, { id: uid(), name: "Nueva IA", icon: "◎" }])} label="+ IA Tool" />
        </div>
        {aiTools.map(t => (
          <div key={t.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, alignItems: "flex-end", marginBottom: 10 }}>
            <Field label="Nombre" value={t.name} onChange={v => setAiTools(a => a.map(x => x.id === t.id ? { ...x, name: v } : x))} />
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: P.textMut, fontFamily: F.mono, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Ícono</div>
              <IconPicker value={t.icon} onChange={v => setAiTools(a => a.map(x => x.id === t.id ? { ...x, icon: v } : x))} />
            </div>
            <button onClick={() => setAiTools(a => a.filter(x => x.id !== t.id))} style={{ marginBottom: 14, padding: "10px 12px", background: P.roseSoft, color: P.rose, border: "none", borderRadius: 8, cursor: "pointer" }}>✕</button>
          </div>
        ))}
      </div>

      {/* Methods */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: P.rose, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Metodologías</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {methods.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, background: `${P.rose}12`, border: `1px solid ${P.rose}20`, borderRadius: 6, padding: "4px 10px" }}>
              <span style={{ fontSize: 12, color: P.rose }}>{m}</span>
              <button onClick={() => setMethods(ms => ms.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: P.rose, cursor: "pointer", padding: "0 2px", fontSize: 14, lineHeight: 1 }}>✕</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={newMethod} onChange={e => setNewMethod(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && newMethod.trim()) { setMethods(m => [...m, newMethod.trim()]); setNewMethod(""); }}} placeholder="Nueva metodología (Enter para agregar)" style={{ flex: 1, padding: "9px 13px", background: P.bgAlt, border: `1px solid ${P.border}`, borderRadius: 8, color: P.text, fontFamily: F.body, fontSize: 13, outline: "none" }} />
          <AddBtn onClick={() => { if (newMethod.trim()) { setMethods(m => [...m, newMethod.trim()]); setNewMethod(""); }}} label="Agregar" />
        </div>
      </div>

      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

/* ═══════════════════════════════════════
   SECTION: CONTACTO
════════════════════════════════════════ */
function ContactSection({ content, onSave }) {
  const [contact, setContact] = useState(content.contact);
  const [saving, setSaving]   = useState(false);
  const [editing, setEditing] = useState(null);
  const COLORS = ["#7C6AF3","#34D9A8","#F06878","#E8A838","#9594AE"];

  const save = async (c) => { setSaving(true); await onSave({ ...content, contact: c }); setSaving(false); };

  const handleSaveItem = async () => {
    const items = editing.isNew ? [...contact.items, editing] : contact.items.map(x => x.id === editing.id ? editing : x);
    const updated = { ...contact, items };
    setContact(updated); await save(updated); setEditing(null);
  };

  return (
    <div>
      <SectionHeader title="Contacto" subtitle="Título, descripción e información de contacto." />
      <Field label="Título de sección" value={contact.title} onChange={v => setContact(c => ({ ...c, title: v }))} />
      <Field label="Descripción" value={contact.subtitle} onChange={v => setContact(c => ({ ...c, subtitle: v }))} multiline />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0 12px" }}>
        <span style={{ fontSize: 11, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Items de contacto</span>
        <AddBtn onClick={() => setEditing({ id: uid(), isNew: true, label: "", value: "", href: "", color: "#7C6AF3" })} label="+ Agregar" />
      </div>

      {editing && (
        <div style={{ background: P.surface, borderRadius: 12, padding: 20, marginBottom: 16, border: `1px solid ${P.accent}30` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Etiqueta" value={editing.label} onChange={v => setEditing(e => ({ ...e, label: v }))} placeholder="Email" />
            <Field label="Valor" value={editing.value} onChange={v => setEditing(e => ({ ...e, value: v }))} placeholder="tu@email.com" />
          </div>
          <Field label="URL/href (dejar vacío si no aplica)" value={editing.href || ""} onChange={v => setEditing(e => ({ ...e, href: v || null }))} placeholder="mailto:..., https://..., tel:..." />
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Color del ícono</label>
            <div style={{ display: "flex", gap: 8 }}>
              {COLORS.map(c => <div key={c} onClick={() => setEditing(e => ({ ...e, color: c }))} style={{ width: 26, height: 26, borderRadius: "50%", background: c, cursor: "pointer", border: editing.color === c ? `3px solid white` : "3px solid transparent" }} />)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <SaveBtn onClick={handleSaveItem} saving={saving} label="Guardar" />
            <button onClick={() => setEditing(null)} style={{ padding: "10px 20px", background: "transparent", color: P.textSec, border: `1px solid ${P.border}`, borderRadius: 8, cursor: "pointer", fontFamily: F.body, fontSize: 13 }}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
        {contact.items.map(item => (
          <div key={item.id} style={{ background: P.surface, borderRadius: 8, padding: "12px 14px", border: `1px solid ${P.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color }} />
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: P.text, fontFamily: F.body }}>{item.label}</span>
                <span style={{ fontSize: 12, color: P.textMut, marginLeft: 8 }}>{item.value}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <EditBtn onClick={() => setEditing({ ...item, isNew: false })} />
              <DeleteBtn onClick={async () => { const items = contact.items.filter(x => x.id !== item.id); const updated = { ...contact, items }; setContact(updated); await save(updated); }} />
            </div>
          </div>
        ))}
      </div>
      <SaveBtn onClick={() => save(contact)} saving={saving} />
    </div>
  );
}

/* ═══════════════════════════════════════
   SECTION: MÓDULOS
════════════════════════════════════════ */
function ModulesSection({ content, onSave }) {
  const [modules, setModules] = useState(content.modules);
  const [processSteps, setProcessSteps] = useState(content.processSteps);
  const [saving, setSaving]   = useState(false);

  const save = async () => { setSaving(true); await onSave({ ...content, modules, processSteps }); setSaving(false); };
  const toggle = (key) => setModules(m => ({ ...m, [key]: { ...m[key], enabled: !m[key].enabled } }));
  const renameModule = (key, label) => setModules(m => ({ ...m, [key]: { ...m[key], label } }));

  return (
    <div>
      <SectionHeader title="Módulos" subtitle="Activa o desactiva secciones del portafolio. 'Inicio' siempre está activo." />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {Object.entries(modules).map(([key, mod]) => (
          <div key={key} style={{ background: P.surface, borderRadius: 10, padding: "14px 16px", border: `1px solid ${mod.enabled ? P.accent + "30" : P.border}`, display: "flex", alignItems: "center", gap: 14 }}>
            <label style={{ position: "relative", display: "inline-block", width: 40, height: 22, flexShrink: 0, cursor: key === "home" ? "not-allowed" : "pointer" }}>
              <input type="checkbox" checked={mod.enabled} onChange={() => key !== "home" && toggle(key)} disabled={key === "home"} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: "absolute", inset: 0, borderRadius: 22, background: mod.enabled ? P.accent : P.textMut, transition: "background 0.3s" }}>
                <span style={{ position: "absolute", width: 16, height: 16, borderRadius: "50%", background: "#fff", top: 3, left: mod.enabled ? "calc(100% - 19px)" : 3, transition: "left 0.3s" }} />
              </span>
            </label>
            <div style={{ flex: 1 }}>
              <input value={mod.label} onChange={e => renameModule(key, e.target.value)} style={{ background: "transparent", border: "none", color: mod.enabled ? P.text : P.textMut, fontSize: 14, fontWeight: 600, fontFamily: F.display, outline: "none", width: "100%" }} />
              <div style={{ fontSize: 11, color: P.textMut, fontFamily: F.mono, marginTop: 2 }}>{key}</div>
            </div>
            <span style={{ fontSize: 11, fontFamily: F.mono, color: mod.enabled ? P.mint : P.textMut }}>{mod.enabled ? "VISIBLE" : "OCULTO"}</span>
          </div>
        ))}
      </div>

      {/* Process Steps */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Pasos del proceso (portafolio)</span>
          <AddBtn onClick={() => setProcessSteps(s => [...s, { id: uid(), s: String(s.length + 1).padStart(2, "0"), t: "Nuevo paso", d: "Descripción", c: "#7C6AF3" }])} label="+ Paso" />
        </div>
        {processSteps.map((step, i) => (
          <div key={step.id} style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr auto", gap: 8, alignItems: "flex-end", marginBottom: 6 }}>
            <Field label="Nº" value={step.s} onChange={v => setProcessSteps(ps => ps.map(x => x.id === step.id ? { ...x, s: v } : x))} />
            <Field label="Título" value={step.t} onChange={v => setProcessSteps(ps => ps.map(x => x.id === step.id ? { ...x, t: v } : x))} />
            <Field label="Descripción" value={step.d} onChange={v => setProcessSteps(ps => ps.map(x => x.id === step.id ? { ...x, d: v } : x))} />
            <button onClick={() => setProcessSteps(ps => ps.filter(x => x.id !== step.id))} style={{ marginBottom: 14, padding: "10px 12px", background: P.roseSoft, color: P.rose, border: "none", borderRadius: 8, cursor: "pointer" }}>✕</button>
          </div>
        ))}
      </div>

      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

/* ═══════════════════════════════════════
   SECTION: SEGURIDAD
════════════════════════════════════════ */
function SettingsSection() {
  const { changePassword } = useAdmin();
  const [form, setForm]     = useState({ current: "", next: "", confirm: "" });
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (form.next !== form.confirm) { setStatus({ type: "error", msg: "Las contraseñas nuevas no coinciden" }); return; }
    if (form.next.length < 6) { setStatus({ type: "error", msg: "Mínimo 6 caracteres" }); return; }
    setSaving(true);
    try {
      await changePassword(form.current, form.next);
      setStatus({ type: "success", msg: "Contraseña actualizada" });
      setForm({ current: "", next: "", confirm: "" });
    } catch (e) {
      setStatus({ type: "error", msg: e.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Seguridad" subtitle="Cambia tu contraseña de acceso al panel admin." />
      <div style={{ maxWidth: 420 }}>
        <Field label="Contraseña actual" type="password" value={form.current} onChange={v => setForm(f => ({ ...f, current: v }))} />
        <Field label="Nueva contraseña" type="password" value={form.next} onChange={v => setForm(f => ({ ...f, next: v }))} />
        <Field label="Confirmar nueva contraseña" type="password" value={form.confirm} onChange={v => setForm(f => ({ ...f, confirm: v }))} />
        {status && (
          <div style={{ background: status.type === "success" ? `${P.mint}12` : `${P.rose}12`, border: `1px solid ${status.type === "success" ? P.mint : P.rose}25`, borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: status.type === "success" ? P.mint : P.rose }}>
            {status.msg}
          </div>
        )}
        <SaveBtn onClick={save} saving={saving} label="Cambiar contraseña" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   FOOTER SECTION
════════════════════════════════════════ */
function FooterSection({ content, onSave }) {
  const [footer, setFooter] = useState(content.footer);
  const [saving, setSaving] = useState(false);
  const save = async () => { setSaving(true); await onSave({ ...content, footer }); setSaving(false); };
  return (
    <div>
      <SectionHeader title="Footer" subtitle="Información que aparece al pie de página." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Nombre completo" value={footer.name} onChange={v => setFooter(f => ({ ...f, name: v }))} />
        <Field label="Rol" value={footer.role} onChange={v => setFooter(f => ({ ...f, role: v }))} />
        <Field label="Ubicación" value={footer.location} onChange={v => setFooter(f => ({ ...f, location: v }))} />
        <Field label="Año" value={footer.year} onChange={v => setFooter(f => ({ ...f, year: v }))} />
      </div>
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

/* ═══════════════════════════════════════
   SIDEBAR
════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: "general",    label: "General",     icon: "◉", color: P.accent },
  { id: "about",      label: "Sobre mí",    icon: "◈", color: P.mint   },
  { id: "projects",   label: "Proyectos",   icon: "▤", color: P.rose   },
  { id: "experience", label: "Experiencia", icon: "◎", color: P.gold   },
  { id: "education",  label: "Educación",   icon: "◇", color: P.accent },
  { id: "skills",     label: "Habilidades", icon: "◆", color: P.mint   },
  { id: "contact",    label: "Contacto",    icon: "◯", color: P.rose   },
  { id: "modules",    label: "Módulos",     icon: "▦", color: P.gold   },
  { id: "tema",       label: "Tema",        icon: "◐", color: P.accent },
  { id: "footer",     label: "Footer",      icon: "▬", color: P.accent },
  { id: "settings",   label: "Seguridad",   icon: "⚙", color: P.rose   },
];

function Sidebar({ active, setActive, onLogout }) {
  const [hov, setHov] = useState(null);
  return (
    <aside style={{ width: 220, minWidth: 220, background: P.bgAlt, borderRight: `1px solid ${P.border}`, display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
      {/* Header */}
      <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${P.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${P.accent}, ${P.mint})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: F.mono }}>IV</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: P.text, fontFamily: F.display }}>Admin Panel</div>
            <div style={{ fontSize: 10, color: P.textMut, fontFamily: F.mono }}>Isabel Vivas</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)} onMouseEnter={() => setHov(item.id)} onMouseLeave={() => setHov(null)}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "none", background: isActive ? `${item.color}15` : hov === item.id ? "rgba(255,255,255,0.03)" : "transparent", color: isActive ? item.color : P.textSec, cursor: "pointer", fontFamily: F.body, fontSize: 13, fontWeight: isActive ? 600 : 400, display: "flex", alignItems: "center", gap: 10, textAlign: "left", transition: "all 0.2s", marginBottom: 2 }}>
              <span style={{ fontSize: 14, opacity: 0.8 }} aria-hidden="true">{item.icon}</span>
              {item.label}
              {isActive && <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: item.color }} />}
            </button>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div style={{ padding: "12px 8px", borderTop: `1px solid ${P.border}` }}>
        <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, color: P.textMut, fontSize: 12, textDecoration: "none", marginBottom: 4, fontFamily: F.body, background: "transparent" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          ↗ Ver portafolio
        </a>
        <button onClick={onLogout} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: "transparent", color: P.rose, border: "none", cursor: "pointer", fontSize: 12, fontFamily: F.body, textAlign: "left", display: "flex", alignItems: "center", gap: 8 }}
          onMouseEnter={e => e.currentTarget.style.background = P.roseSoft}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          ✕ Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════
   MAIN DASHBOARD
════════════════════════════════════════ */
export default function Dashboard() {
  const { content, loading, error, saveContent } = useContent();
  const { logout } = useAdmin();
  const [section, setSection] = useState("general");
  const [toast, setToast] = useState(null);

  const onSave = useCallback(async (updatedContent) => {
    try {
      await saveContent(updatedContent);
      setToast({ message: "Cambios guardados correctamente", type: "success" });
    } catch (e) {
      setToast({ message: e.message || "Error guardando", type: "error" });
      throw e;
    }
  }, [saveContent]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: P.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${P.border}`, borderTopColor: P.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: P.textMut, fontFamily: F.body, fontSize: 13 }}>Cargando contenido...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", background: P.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: 32 }}>
        <p style={{ color: P.rose, fontFamily: F.body, marginBottom: 8 }}>Error conectando con la API</p>
        <p style={{ color: P.textMut, fontSize: 13, fontFamily: F.mono }}>{error}</p>
        <p style={{ color: P.textMut, fontSize: 12, marginTop: 16 }}>¿Está corriendo el servidor? <code style={{ color: P.accent }}>npm run server</code></p>
      </div>
    </div>
  );

  const sectionProps = { content, onSave };

  return (
    <div style={{ display: "flex", height: "100vh", background: P.bg, fontFamily: F.body, overflow: "hidden" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${P.bg}; } ::-webkit-scrollbar-thumb { background: ${P.accent}30; border-radius: 3px; }
        * { box-sizing: border-box; margin: 0; }
      `}</style>

      <Sidebar active={section} setActive={setSection} onLogout={logout} />

      <main style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>
        <div style={{ maxWidth: 760 }}>
          {section === "general"    && <GeneralSection    {...sectionProps} />}
          {section === "about"      && <AboutSection      {...sectionProps} />}
          {section === "projects"   && <ProjectsSection   {...sectionProps} onSave={onSave} />}
          {section === "experience" && <ExperienceSection {...sectionProps} />}
          {section === "education"  && <EducationSection  {...sectionProps} />}
          {section === "skills"     && <SkillsSection     {...sectionProps} />}
          {section === "contact"    && <ContactSection    {...sectionProps} />}
          {section === "modules"    && <ModulesSection    {...sectionProps} />}
          {section === "tema"       && <ThemeSection      {...sectionProps} />}
          {section === "footer"     && <FooterSection     {...sectionProps} />}
          {section === "settings"   && <SettingsSection />}
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
