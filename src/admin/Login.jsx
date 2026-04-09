import { useState } from "react";
import { useAdmin } from "./useAdmin";

const P = { bg: "#060609", card: "#10101A", accent: "#7C6AF3", mint: "#34D9A8", text: "#EDECF8", textSec: "#9594AE", textMut: "#5C5B72", border: "rgba(255,255,255,0.07)", rose: "#F06878" };
const F = { display: "'Sora', sans-serif", body: "'Plus Jakarta Sans', sans-serif", mono: "'JetBrains Mono', monospace" };

export default function Login() {
  const { login } = useAdmin();
  const [form, setForm]     = useState({ username: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: P.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.body }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "0 24px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${P.accent}, ${P.mint})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: F.mono, margin: "0 auto 16px" }}>IV</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: P.text, fontFamily: F.display, margin: "0 0 6px" }}>Panel Administrador</h1>
          <p style={{ fontSize: 13, color: P.textMut, margin: 0 }}>Acceso exclusivo · Isabel Vivas</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ background: P.card, borderRadius: 16, padding: "32px 28px", border: `1px solid ${P.border}` }}>
          <Field
            label="Usuario"
            type="text"
            value={form.username}
            onChange={v => setForm(f => ({ ...f, username: v }))}
            placeholder="isabel"
            autoComplete="username"
          />
          <Field
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={v => setForm(f => ({ ...f, password: v }))}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          {error && (
            <div style={{ background: `${P.rose}12`, border: `1px solid ${P.rose}25`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: P.rose }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "13px", background: loading ? P.textMut : P.accent, color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: loading ? "wait" : "pointer", fontFamily: F.body, transition: "background 0.2s" }}
          >
            {loading ? "Verificando..." : "Entrar al panel"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 12, color: P.textMut, marginTop: 20 }}>
          ← <a href="/" style={{ color: P.accent, textDecoration: "none" }}>Volver al portafolio</a>
        </p>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, autoComplete }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, color: P.textMut, fontFamily: F.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ width: "100%", padding: "11px 14px", background: "#0B0B12", border: `1px solid ${focused ? P.accent : P.border}`, borderRadius: 8, color: P.text, fontFamily: F.body, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
      />
    </div>
  );
}
