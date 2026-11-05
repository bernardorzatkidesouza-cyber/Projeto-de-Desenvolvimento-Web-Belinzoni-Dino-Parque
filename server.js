import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { lerBanco, salvarBanco } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORTA = process.env.PORT || 3001;
// Senha do painel admin (troque! ou defina a variável ADMIN_TOKEN)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "dino123";
const STATUS_VALIDOS = ["publicado", "rascunho"];

const app = express();
app.use(cors());              // permite o frontend (outra porta) acessar a API
app.use(express.json());      // lê JSON do corpo das requisições

// ---------- Upload de imagens ----------
const pastaUploads = path.join(__dirname, "uploads");
fs.mkdirSync(pastaUploads, { recursive: true });
app.use("/uploads", express.static(pastaUploads)); // http://localhost:3001/uploads/arquivo.jpg

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, pastaUploads),
    filename: (req, file, cb) =>
      cb(null, Date.now() + path.extname(file.originalname).toLowerCase()),
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) =>
    cb(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)),
});

// ---------- Proteção das rotas de admin ----------
function exigirAdmin(req, res, next) {
  if (req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ erro: "Não autorizado" });
  }
  next();
}

// ---------- Validação ----------
function validar({ titulo, descricao, data, status }) {
  if (!titulo || !titulo.trim()) return "O título é obrigatório";
  if (!descricao || !descricao.trim()) return "A descrição é obrigatória";
  if (data && !/^\d{4}-\d{2}-\d{2}$/.test(data)) return "Data deve ser AAAA-MM-DD";
  if (status && !STATUS_VALIDOS.includes(status)) return "Status deve ser publicado ou rascunho";
  return null;
}

// ================= ROTAS =================

app.get("/api", (req, res) => res.json({ mensagem: "API Belinzoni Dino Parque no ar 🦖" }));

// Login simples: confere a senha e devolve o token
app.post("/api/login", (req, res) => {
  if (req.body.senha !== ADMIN_TOKEN) return res.status(401).json({ erro: "Senha incorreta" });
  res.json({ token: ADMIN_TOKEN });
});

// PÚBLICO: lista só notícias publicadas (mais recentes primeiro)
app.get("/api/noticias", (req, res) => {
  const { noticias } = lerBanco();
  const lista = noticias
    .filter((n) => n.status === "publicado")
    .sort((a, b) => b.data.localeCompare(a.data));
  res.json(lista);
});

// ADMIN: lista todas, inclusive rascunhos
app.get("/api/admin/noticias", exigirAdmin, (req, res) => {
  const { noticias } = lerBanco();
  res.json(noticias.sort((a, b) => b.data.localeCompare(a.data)));
});

// PÚBLICO: uma notícia (rascunho só aparece para admin)
app.get("/api/noticias/:id", (req, res) => {
  const { noticias } = lerBanco();
  const n = noticias.find((x) => x.id === req.params.id);
  const ehAdmin = req.headers.authorization === `Bearer ${ADMIN_TOKEN}`;
  if (!n || (n.status !== "publicado" && !ehAdmin)) {
    return res.status(404).json({ erro: "Notícia não encontrada" });
  }
  res.json(n);
});

// ADMIN: criar
app.post("/api/noticias", exigirAdmin, (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });

  const banco = lerBanco();
  const proximoId = banco.noticias.reduce((max, n) => Math.max(max, Number(n.id)), 0) + 1;
  const nova = {
    id: String(proximoId),
    titulo: req.body.titulo.trim(),
    descricao: req.body.descricao.trim(),
    imagem: req.body.imagem || "",
    data: req.body.data || new Date().toISOString().slice(0, 10),
    status: req.body.status || "rascunho",
  };
  banco.noticias.push(nova);
  salvarBanco(banco);
  res.status(201).json(nova);
});

// ADMIN: editar
app.put("/api/noticias/:id", exigirAdmin, (req, res) => {
  const banco = lerBanco();
  const i = banco.noticias.findIndex((n) => n.id === req.params.id);
  if (i === -1) return res.status(404).json({ erro: "Notícia não encontrada" });

  const atualizada = { ...banco.noticias[i], ...req.body, id: req.params.id };
  const erro = validar(atualizada);
  if (erro) return res.status(400).json({ erro });

  banco.noticias[i] = atualizada;
  salvarBanco(banco);
  res.json(atualizada);
});

// ADMIN: excluir
app.delete("/api/noticias/:id", exigirAdmin, (req, res) => {
  const banco = lerBanco();
  const existe = banco.noticias.some((n) => n.id === req.params.id);
  if (!existe) return res.status(404).json({ erro: "Notícia não encontrada" });

  banco.noticias = banco.noticias.filter((n) => n.id !== req.params.id);
  salvarBanco(banco);
  res.status(204).end();
});

// ADMIN: upload de imagem (campo do formulário: "imagem")
app.post("/api/upload", exigirAdmin, upload.single("imagem"), (req, res) => {
  if (!req.file) return res.status(400).json({ erro: "Envie uma imagem (jpg, png, webp ou gif até 5MB)" });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

app.listen(PORTA, () => console.log(`Servidor rodando em http://localhost:${PORTA}`));
