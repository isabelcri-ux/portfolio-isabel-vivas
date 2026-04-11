import { createContext, useContext, useState } from "react";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("portfolio_lang") || "es"; } catch { return "es"; }
  });

  const toggle = () => {
    const next = lang === "es" ? "en" : "es";
    setLang(next);
    try { localStorage.setItem("portfolio_lang", next); } catch {}
  };

  return (
    <LangContext.Provider value={{ lang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang debe usarse dentro de <LangProvider>");
  return ctx;
}
