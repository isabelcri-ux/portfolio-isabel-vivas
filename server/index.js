import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "isabel-portfolio-secret-2026-change-in-prod";
const CONFIG_PATH = path.join(__dirname, "config.json");
const CONTENT_PATH = path.join(__dirname, "data", "content.json");
const UPLOADS_DIR = path.join(__dirname, "..", "public", "uploads");

/* ── Multer — save uploads to public/uploads/ ── */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ext;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Solo se permiten imágenes"));
  },
});

app.use(express.json({ limit: "10mb" }));
app.use(cors({
  origin: process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:4173"]
    : ["http://localhost:5173", "http://localhost:4173"],
  credentials: true,
}));
/* Serve uploaded files statically from Express too */
app.use("/uploads", express.static(UPLOADS_DIR));

/* ── Auto-init credentials if config.json doesn't exist ── */
if (!fs.existsSync(CONFIG_PATH)) {
  const defaultPass = "isabel2026";
  const hash = bcrypt.hashSync(defaultPass, 10);
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ username: "isabel", passwordHash: hash }, null, 2));
  console.log("\n✅  Credenciales creadas automáticamente:");
  console.log("    Usuario  : isabel");
  console.log("    Contraseña: isabel2026");
  console.log("    ⚠️  Cámbiala desde el panel admin → Seguridad\n");
}

/* ── Helpers ── */
const readContent = () => JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));
const readConfig  = () => JSON.parse(fs.readFileSync(CONFIG_PATH,  "utf8"));

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token requerido" });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}

/* ── Auth routes ── */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Campos requeridos" });
    const cfg = readConfig();
    if (username !== cfg.username) return res.status(401).json({ error: "Credenciales incorrectas" });
    const valid = await bcrypt.compare(password, cfg.passwordHash);
    if (!valid) return res.status(401).json({ error: "Credenciales incorrectas" });
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, username });
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.get("/api/auth/verify", authMiddleware, (req, res) => {
  res.json({ valid: true });
});

app.put("/api/auth/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: "Campos requeridos" });
    if (newPassword.length < 6) return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    const cfg = readConfig();
    const valid = await bcrypt.compare(currentPassword, cfg.passwordHash);
    if (!valid) return res.status(401).json({ error: "Contraseña actual incorrecta" });
    cfg.passwordHash = await bcrypt.hash(newPassword, 10);
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Error del servidor" });
  }
});

/* ── Content routes ── */
app.get("/api/content", (_req, res) => {
  try {
    res.json(readContent());
  } catch {
    res.status(500).json({ error: "Error leyendo contenido" });
  }
});

app.put("/api/content", authMiddleware, (req, res) => {
  try {
    const updated = req.body;
    if (!updated || typeof updated !== "object") return res.status(400).json({ error: "Contenido inválido" });
    fs.writeFileSync(CONTENT_PATH, JSON.stringify(updated, null, 2));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Error guardando contenido" });
  }
});

/* ── Upload route ── */
app.post("/api/upload", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se recibió ningún archivo" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
  console.log(`\n🚀  Admin API → http://localhost:${PORT}`);
  console.log(`    Panel admin → http://localhost:5173/admin\n`);
});
