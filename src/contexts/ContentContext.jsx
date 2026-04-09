import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("Error cargando contenido");
      const data = await res.json();
      setContent(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const saveContent = useCallback(async (updatedContent) => {
    const token = localStorage.getItem("admin_token");
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedContent),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Error guardando");
    }
    setContent(updatedContent);
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, error, saveContent, refreshContent: fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent debe usarse dentro de <ContentProvider>");
  return ctx;
}
