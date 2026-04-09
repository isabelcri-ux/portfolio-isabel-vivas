import { useState, useCallback, useEffect } from "react";

export function useAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { setChecking(false); return; }
    fetch("/api/auth/verify", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { setAuthenticated(r.ok); })
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error de autenticación");
    localStorage.setItem("admin_token", data.token);
    setAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    setAuthenticated(false);
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const token = localStorage.getItem("admin_token");
    const res = await fetch("/api/auth/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error cambiando contraseña");
  }, []);

  return { authenticated, checking, login, logout, changePassword };
}
