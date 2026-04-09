import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ContentProvider } from "./contexts/ContentContext";
import { useAdmin } from "./admin/useAdmin";
import Portfolio from "./Portfolio";
import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";

function AdminRoute() {
  const { authenticated, checking } = useAdmin();
  if (checking) return (
    <div style={{ minHeight: "100vh", background: "#060609", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "3px solid rgba(124,106,243,0.2)", borderTop: "3px solid #7C6AF3", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  return authenticated ? <Dashboard /> : <Login />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ContentProvider>
            <Portfolio />
          </ContentProvider>
        } />
        <Route path="/admin" element={
          <ContentProvider>
            <AdminRoute />
          </ContentProvider>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
