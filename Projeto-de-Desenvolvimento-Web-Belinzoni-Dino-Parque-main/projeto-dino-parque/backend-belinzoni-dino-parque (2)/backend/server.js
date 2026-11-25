import "dotenv/config";
import crypto from "crypto";
import express from "express";
import cors from "cors";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { pool, iniciarBanco } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORTA = process.env.PORT || 3001;

let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  JWT_SECRET = crypto.randomBytes(32).toString("hex");
  console.warn("AVISO: JWT_SECRET não definido; os logins serão invalidados a cada reinício.");
}

// ============ Descrição das tabelas (usada para validar e para montar o painel) ============
// escrita: quem pode criar/editar/excluir ("editor" = qualquer admin, "master" = só master)
const RECURSOS = {
  noticias: {
    tabela: "noticias", rotulo: "Notícias", escrita: "editor",
    ordem: "data_publicacao DESC, id DESC", publicoWhere: "status = 'publicado'",
    autorCol: "criado_por_admin_id", autorEm: "criar",
    resumo: ["status", "data_publicacao"],
    campos: [
      { n: "titulo", rotulo: "Título", tipo: "texto", req: true, max: 200 },
      { n: "conteudo", rotulo: "Conteúdo", tipo: "longo", req: true },
      { n: "imagem_url", rotulo: "Imagem de destaque", tipo: "imagem" },
      { n: "data_publicacao", rotulo: "Data de publicação", tipo: "texto", req: true },
      { n: "status", rotulo: "Status", tipo: "enum", valores: ["publicado", "rascunho"], padrao: "publicado" },
    ],
  },
  atracoes: {
    tabela: "atracoes", rotulo: "Atrações", escrita: "master", ordem: "nome",
    resumo: ["status", "localizacao"],
    campos: [
      { n: "nome", rotulo: "Nome", tipo: "texto", req: true, max: 100 },
      { n: "descricao", rotulo: "Descrição", tipo: "longo", req: true },
      { n: "localizacao", rotulo: "Localização", tipo: "texto", max: 255 },
      { n: "horario_funcionamento", rotulo: "Horário de funcionamento", tipo: "texto", max: 100 },
      { n: "status", rotulo: "Status", tipo: "enum", valores: ["aberto", "fechado", "em reforma"], padrao: "aberto" },
      { n: "imagem_capa_url", rotulo: "Imagem de capa", tipo: "imagem" },
    ],
  },
  estabelecimentos: {
    tabela: "estabelecimentos", rotulo: "Estabelecimentos", escrita: "master", ordem: "nome",
    resumo: ["categoria", "localizacao"],
    campos: [
      { n: "nome", rotulo: "Nome", tipo: "texto", req: true, max: 100 },
      { n: "categoria", rotulo: "Categoria (ex: restaurante)", tipo: "texto", req: true, max: 50 },
      { n: "descricao", rotulo: "Descrição", tipo: "longo" },
      { n: "localizacao", rotulo: "Localização", tipo: "texto", max: 255 },
      { n: "horario_funcionamento", rotulo: "Horário de funcionamento", tipo: "texto", max: 100 },
      { n: "imagem_capa_url", rotulo: "Imagem de capa", tipo: "imagem" },
    ],
  },
  imagens_estabelecimento: {
    tabela: "imagens_estabelecimento", rotulo: "Fotos dos estabelecimentos", escrita: "master",
    ordem: "id DESC", filtroPublico: "estabelecimento_id",
    resumo: ["estabelecimento_id", "legenda"],
    campos: [
      { n: "estabelecimento_id", rotulo: "ID do estabelecimento", tipo: "numero", req: true },
      { n: "imagem_url", rotulo: "Imagem", tipo: "imagem", req: true },
      { n: "legenda", rotulo: "Legenda", tipo: "texto", max: 150 },
    ],
  },
  perguntas_frequentes: {
    tabela: "perguntas_frequentes", rotulo: "Perguntas frequentes", escrita: "master",
    ordem: "ordem_exibicao, id", autorCol: "atualizado_por_admin_id", autorEm: "sempre",
    resumo: ["categoria", "ordem_exibicao"],
    campos: [
      { n: "pergunta", rotulo: "Pergunta", tipo: "longo", req: true },
      { n: "resposta", rotulo: "Resposta", tipo: "longo", req: true },
      { n: "categoria", rotulo: "Categoria", tipo: "texto", max: 50, padrao: "geral" },
      { n: "ordem_exibicao", rotulo: "Ordem de exibição", tipo: "numero", padrao: 0 },
    ],
  },
  agenda: {
    tabela: "agenda", rotulo: "Agenda", escrita: "master",
    ordem: "id DESC", resumo: ["dia", "mes", "titulo"],
    campos: [
      { n: "dia", rotulo: "Dia", tipo: "texto", req: true, max: 2 },
      { n: "mes", rotulo: "Mês", tipo: "texto", req: true, max: 20 },
      { n: "titulo", rotulo: "Título", tipo: "texto", req: true, max: 200 },
      { n: "local", rotulo: "Local", tipo: "texto", req: true, max: 200 },
      { n: "hora", rotulo: "Horário", tipo: "texto", req: true, max: 100 },
    ],
  },
  galeria: {
    tabela: "galeria", rotulo: "Galeria", escrita: "master",
    ordem: "id DESC", resumo: ["legenda"],
    campos: [
      { n: "imagem_url", rotulo: "Imagem", tipo: "imagem", req: true },
      { n: "legenda", rotulo: "Legenda", tipo: "texto", max: 255 },
    ],
  },
};

// Administradores têm regras próprias (senha criptografada), mas aparecem no painel igual aos outros
const ADMINS = {
  rotulo: "Administradores", escrita: "master", resumo: ["email", "nivel_permissao"],
  campos: [
    { n: "nome", rotulo: "Nome", tipo: "texto", req: true, max: 100 },
    { n: "email", rotulo: "E-mail (usado no login)", tipo: "texto", req: true, max: 100 },
    { n: "senha", rotulo: "Senha (mín. 6 caracteres)", tipo: "senha" },
    { n: "nivel_permissao", rotulo: "Nível", tipo: "enum", valores: ["editor", "master"], padrao: "editor" },
  ],
};

// ============ Auxiliares ============
const rota = (fn) => (req, res, next) =>
  fn(req, res, next).catch((e) => {
    if (e.code === "23503") return res.status(400).json({ erro: "O registro relacionado não existe (confira o ID)." });
    if (e.code === "23505") return res.status(409).json({ erro: "Já existe um registro com esse valor (e-mail repetido?)." });
    console.error(e);
    res.status(500).json({ erro: "Erro interno do servidor" });
  });
const idValido = (id) => /^\d+$/.test(id) && id.length < 10;
const emailValido = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

function lerToken(req) {
  const h = req.headers.authorization || "";
  if (!h.startsWith("Bearer ")) return null;
  try { return jwt.verify(h.slice(7), JWT_SECRET); } catch { return null; }
}
function exigirAdmin(req, res, next) {
  const d = lerToken(req);
  if (!d) return res.status(401).json({ erro: "Não autorizado. Faça login novamente." });
  req.usuario = d;
  next();
}
const exigirMaster = (req, res, next) =>
  req.usuario.nivel !== "master" ? res.status(403).json({ erro: "Apenas administradores master podem fazer isso." }) : next();
const podeEscrever = (cfg) => (req, res, next) =>
  cfg.escrita === "master" && req.usuario.nivel !== "master"
    ? res.status(403).json({ erro: "Seu nível (editor) só permite gerenciar notícias." })
    : next();

// Valida os campos de uma tabela e devolve só os valores permitidos
function validar(campos, dados) {
  const out = {};
  for (const c of campos) {
    let v = dados[c.n];
    if (v === undefined || v === null || v === "") v = null;
    if (v === null) {
      if (c.req) return { erro: `${c.rotulo} é obrigatório` };
      out[c.n] = c.padrao ?? null;
      continue;
    }
    if (c.tipo === "numero") {
      if (!/^-?\d+$/.test(String(v))) return { erro: `${c.rotulo} deve ser um número inteiro` };
      v = Number(v);
    } else {
      v = String(v).trim();
      if (c.req && !v) return { erro: `${c.rotulo} é obrigatório` };
      if (c.max && v.length > c.max) return { erro: `${c.rotulo} muito longo (máx. ${c.max})` };
    }
    if (c.tipo === "enum" && !c.valores.includes(v)) return { erro: `${c.rotulo} inválido` };
    out[c.n] = v;
  }
  return { valores: out };
}

// Limite de tentativas de login: 5 erros por IP a cada 15 min
const tentativas = new Map();
function limiteLogin(req, res, next) {
  const t = tentativas.get(req.ip);
  if (t && Date.now() - t.inicio >= 15 * 60 * 1000) tentativas.delete(req.ip);
  else if (t && t.erros >= 5) return res.status(429).json({ erro: "Muitas tentativas. Aguarde 15 minutos." });
  next();
}

const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json({ limit: "200kb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)),
});

app.get("/api", (req, res) => res.json({ mensagem: "API Belinzoni Dino Parque no ar 🦖" }));

// ============ LOGIN ============
app.post("/api/login", limiteLogin, rota(async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const senha = String(req.body?.senha || "");
  if (!email || !senha) return res.status(400).json({ erro: "Informe e-mail e senha" });

  const { rows } = await pool.query("SELECT * FROM administradores WHERE email = $1", [email]);
  const adm = rows[0];
  if (!adm || !(await bcrypt.compare(senha, adm.senha))) {
    const t = tentativas.get(req.ip) || { inicio: Date.now(), erros: 0 };
    t.erros += 1;
    tentativas.set(req.ip, t);
    return res.status(401).json({ erro: "E-mail ou senha incorretos" });
  }
  tentativas.delete(req.ip);
  const token = jwt.sign({ id: adm.id, nome: adm.nome, nivel: adm.nivel_permissao }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, nome: adm.nome, nivel: adm.nivel_permissao });
}));

// Trocar a própria senha
app.put("/api/senha", exigirAdmin, rota(async (req, res) => {
  const { senhaAtual, novaSenha } = req.body || {};
  if (!novaSenha || novaSenha.length < 6) return res.status(400).json({ erro: "A nova senha precisa ter ao menos 6 caracteres" });
  const { rows } = await pool.query("SELECT senha FROM administradores WHERE id = $1", [req.usuario.id]);
  if (!rows[0] || !(await bcrypt.compare(String(senhaAtual || ""), rows[0].senha))) {
    return res.status(401).json({ erro: "Senha atual incorreta" });
  }
  await pool.query("UPDATE administradores SET senha = $1 WHERE id = $2", [await bcrypt.hash(novaSenha, 10), req.usuario.id]);
  res.json({ mensagem: "Senha alterada com sucesso" });
}));

// Informações para o painel montar os menus e formulários
app.get("/api/admin/meta", exigirAdmin, (req, res) => {
  const master = req.usuario.nivel === "master";
  const recursos = {};
  for (const [k, c] of Object.entries(RECURSOS)) {
    if (c.escrita === "master" && !master) continue;
    recursos[k] = { rotulo: c.rotulo, resumo: c.resumo, campos: c.campos };
  }
  if (master) recursos.administradores = { rotulo: ADMINS.rotulo, resumo: ADMINS.resumo, campos: ADMINS.campos };
  res.json({ usuario: req.usuario, recursos });
});

// ============ ADMINISTRADORES (somente master) ============
const COLS_ADM = "id, nome, email, nivel_permissao, data_cadastro";

app.get("/api/admin/administradores", exigirAdmin, exigirMaster, rota(async (req, res) => {
  const { rows } = await pool.query(`SELECT ${COLS_ADM} FROM administradores ORDER BY nome`);
  res.json(rows);
}));

app.post("/api/administradores", exigirAdmin, exigirMaster, rota(async (req, res) => {
  const { erro, valores: v } = validar(ADMINS.campos.filter((c) => c.n !== "senha"), req.body || {});
  if (erro) return res.status(400).json({ erro });
  v.email = v.email.toLowerCase();
  if (!emailValido(v.email)) return res.status(400).json({ erro: "E-mail inválido" });
  const senha = String(req.body.senha || "");
  if (senha.length < 6) return res.status(400).json({ erro: "A senha precisa ter ao menos 6 caracteres" });
  const { rows } = await pool.query(
    `INSERT INTO administradores (nome, email, senha, nivel_permissao) VALUES ($1,$2,$3,$4) RETURNING ${COLS_ADM}`,
    [v.nome, v.email, await bcrypt.hash(senha, 10), v.nivel_permissao]
  );
  res.status(201).json(rows[0]);
}));

app.put("/api/administradores/:id", exigirAdmin, exigirMaster, rota(async (req, res) => {
  if (!idValido(req.params.id)) return res.status(404).json({ erro: "Administrador não encontrado" });
  const atual = (await pool.query("SELECT * FROM administradores WHERE id = $1", [req.params.id])).rows[0];
  if (!atual) return res.status(404).json({ erro: "Administrador não encontrado" });

  const { erro, valores: v } = validar(ADMINS.campos.filter((c) => c.n !== "senha"), { ...atual, ...req.body });
  if (erro) return res.status(400).json({ erro });
  v.email = v.email.toLowerCase();
  if (!emailValido(v.email)) return res.status(400).json({ erro: "E-mail inválido" });

  if (atual.nivel_permissao === "master" && v.nivel_permissao !== "master") {
    const m = await pool.query("SELECT COUNT(*)::int AS n FROM administradores WHERE nivel_permissao = 'master'");
    if (m.rows[0].n <= 1) return res.status(400).json({ erro: "Precisa existir pelo menos um administrador master." });
  }
  let hash = atual.senha;
  if (req.body.senha) {
    if (String(req.body.senha).length < 6) return res.status(400).json({ erro: "A senha precisa ter ao menos 6 caracteres" });
    hash = await bcrypt.hash(String(req.body.senha), 10);
  }
  const { rows } = await pool.query(
    `UPDATE administradores SET nome=$1, email=$2, nivel_permissao=$3, senha=$4 WHERE id=$5 RETURNING ${COLS_ADM}`,
    [v.nome, v.email, v.nivel_permissao, hash, req.params.id]
  );
  res.json(rows[0]);
}));

app.delete("/api/administradores/:id", exigirAdmin, exigirMaster, rota(async (req, res) => {
  if (!idValido(req.params.id)) return res.status(404).json({ erro: "Administrador não encontrado" });
  if (Number(req.params.id) === req.usuario.id) return res.status(400).json({ erro: "Você não pode excluir a si mesmo." });
  const r = await pool.query("DELETE FROM administradores WHERE id = $1", [req.params.id]);
  if (r.rowCount === 0) return res.status(404).json({ erro: "Administrador não encontrado" });
  res.status(204).end();
}));

// ============ CRUD das demais tabelas ============
for (const [nome, cfg] of Object.entries(RECURSOS)) {
  const nomes = cfg.campos.map((c) => c.n);

  // Público: lista (só publicados quando existir status de publicação)
  app.get(`/api/${nome}`, rota(async (req, res) => {
    const where = [], params = [];
    if (cfg.publicoWhere) where.push(cfg.publicoWhere);
    if (cfg.filtroPublico && req.query[cfg.filtroPublico]) {
      if (!idValido(String(req.query[cfg.filtroPublico]))) return res.json([]);
      params.push(req.query[cfg.filtroPublico]);
      where.push(`${cfg.filtroPublico} = $${params.length}`);
    }
    const sql = `SELECT * FROM ${cfg.tabela} ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY ${cfg.ordem}`;
    res.json((await pool.query(sql, params)).rows);
  }));

  // Público: um registro (rascunho só para quem está logado)
  app.get(`/api/${nome}/:id`, rota(async (req, res) => {
    if (!idValido(req.params.id)) return res.status(404).json({ erro: "Não encontrado" });
    const r = (await pool.query(`SELECT * FROM ${cfg.tabela} WHERE id = $1`, [req.params.id])).rows[0];
    if (!r || (cfg.publicoWhere && r.status !== "publicado" && !lerToken(req))) return res.status(404).json({ erro: "Não encontrado" });
    res.json(r);
  }));

  // Admin: lista completa (inclui rascunhos)
  app.get(`/api/admin/${nome}`, exigirAdmin, podeEscrever(cfg), rota(async (req, res) => {
    res.json((await pool.query(`SELECT * FROM ${cfg.tabela} ORDER BY ${cfg.ordem}`)).rows);
  }));

  app.post(`/api/${nome}`, exigirAdmin, podeEscrever(cfg), rota(async (req, res) => {
    const { erro, valores } = validar(cfg.campos, req.body || {});
    if (erro) return res.status(400).json({ erro });
    const cols = [...nomes], vals = nomes.map((n) => valores[n]);
    if (cfg.autorCol) { cols.push(cfg.autorCol); vals.push(req.usuario.id); }
    const ph = cols.map((_, i) => `$${i + 1}`).join(",");
    const r = await pool.query(`INSERT INTO ${cfg.tabela} (${cols.join(",")}) VALUES (${ph}) RETURNING *`, vals);
    res.status(201).json(r.rows[0]);
  }));

  app.put(`/api/${nome}/:id`, exigirAdmin, podeEscrever(cfg), rota(async (req, res) => {
    if (!idValido(req.params.id)) return res.status(404).json({ erro: "Não encontrado" });
    const atual = (await pool.query(`SELECT * FROM ${cfg.tabela} WHERE id = $1`, [req.params.id])).rows[0];
    if (!atual) return res.status(404).json({ erro: "Não encontrado" });
    const { erro, valores } = validar(cfg.campos, { ...atual, ...req.body });
    if (erro) return res.status(400).json({ erro });
    const cols = [...nomes], vals = nomes.map((n) => valores[n]);
    if (cfg.autorCol && cfg.autorEm === "sempre") { cols.push(cfg.autorCol); vals.push(req.usuario.id); }
    vals.push(req.params.id);
    const set = cols.map((c, i) => `${c} = $${i + 1}`).join(", ");
    const r = await pool.query(`UPDATE ${cfg.tabela} SET ${set} WHERE id = $${vals.length} RETURNING *`, vals);
    res.json(r.rows[0]);
  }));

  app.delete(`/api/${nome}/:id`, exigirAdmin, podeEscrever(cfg), rota(async (req, res) => {
    if (!idValido(req.params.id)) return res.status(404).json({ erro: "Não encontrado" });
    const r = await pool.query(`DELETE FROM ${cfg.tabela} WHERE id = $1`, [req.params.id]);
    if (r.rowCount === 0) return res.status(404).json({ erro: "Não encontrado" });
    res.status(204).end();
  }));
}

// ============ INFORMAÇÕES GERAIS DO PARQUE ============
app.get("/api/informacoes", rota(async (req, res) => {
  const r = await pool.query("SELECT dados FROM informacoes_parque WHERE id = 1");
  res.json(r.rows[0]?.dados || {
    endereco: "", telefone: "", email: "",

    horarios: { Seg: "", TerDom: "", Feriado: "" },

  });
}));

app.put("/api/informacoes", exigirAdmin, rota(async (req, res) => {
  const dados = req.body || {};
  const informacoes = {
    endereco: String(dados.endereco || "").trim(),
    telefone: String(dados.telefone || "").trim(),
    email: String(dados.email || "").trim(),
    horarios: {

      Seg: String(dados.horarios?.Seg || "").trim(),
      TerDom: String(dados.horarios?.TerDom || "").trim(),
      Feriado: String(dados.horarios?.Feriado || "").trim(),

    },
  };
  const r = await pool.query(
    `INSERT INTO informacoes_parque (id, dados) VALUES (1, $1::jsonb)
     ON CONFLICT (id) DO UPDATE SET dados = EXCLUDED.dados, atualizado_em = CURRENT_TIMESTAMP
     RETURNING dados`,
    [JSON.stringify(informacoes)]
  );
  res.json(r.rows[0].dados);
}));

// ============ CONFIGURAÇÕES DO SITE: BANNER E CORES ============

// Consulta pública para todas as páginas
app.get("/api/configuracoes-site", rota(async (req, res) => {
  const resultado = await pool.query(
    "SELECT dados FROM configuracoes_site WHERE id = 1"
  );

  res.json(resultado.rows[0]?.dados || {
    titulo: "Araranguá · Santa Catarina",
    subtitulo: "Dino Parque Belinzoni",
    texto: "Entrada gratuita!",
    imagem: "",
    cores: {
      verde: "#245c35",
      verdeEscuro: "#173f27",
      verdeClaro: "#eaf3e9",
      dourado: "#d6a62c",
      texto: "#263329",
      textoSuave: "#68756b",
      fundo: "#f6f8f5",
      branco: "#ffffff",
      borda: "#dce5dc"
    }
  });
}));

// Atualização protegida pelo login administrativo
app.put("/api/configuracoes-site", exigirAdmin, rota(async (req, res) => {
  const dados = req.body || {};

  const titulo = String(dados.titulo || "").trim();
  const subtitulo = String(dados.subtitulo || "").trim();
  const texto = String(dados.texto || "").trim();
  const imagem = String(dados.imagem || "").trim();

  if (titulo.length > 200 ||
      subtitulo.length > 255 ||
      texto.length > 255) {
    return res.status(400).json({
      erro: "Um dos textos ultrapassou o limite permitido."
    });
  }

  if (imagem && !/^\/api\/imagens\/\d+$/.test(imagem)) {
    return res.status(400).json({
      erro: "Endereço da imagem inválido."
    });
  }

  const resultadoAtual = await pool.query(
    "SELECT dados FROM configuracoes_site WHERE id = 1"
  );

  const atual = resultadoAtual.rows[0]?.dados || {};

  const coresRecebidas = dados.cores || {};

  const cores = {
    ...(atual.cores || {}),
    ...coresRecebidas
  };

  const coresPermitidas = [
    "verde",
    "verdeEscuro",
    "verdeClaro",
    "dourado",
    "texto",
    "textoSuave",
    "fundo",
    "branco",
    "borda"
  ];

  for (const nome of coresPermitidas) {
    if (
      cores[nome] &&
      !/^#[0-9a-fA-F]{6}$/.test(cores[nome])
    ) {
      return res.status(400).json({
        erro: `Cor inválida: ${nome}`
      });
    }
  }

  const configuracoes = {
    titulo: dados.titulo !== undefined ? titulo : atual.titulo || "Araranguá · Santa Catarina",
    subtitulo: dados.subtitulo !== undefined ? subtitulo : atual.subtitulo || "Dino Parque Belinzoni",
    texto: dados.texto !== undefined ? texto : atual.texto || "Entrada gratuita!",
    imagem: dados.imagem !== undefined ? imagem : atual.imagem || "",
    cores
  };

  const resultado = await pool.query(
    `INSERT INTO configuracoes_site (id, dados)
     VALUES (1, $1::jsonb)
     ON CONFLICT (id)
     DO UPDATE SET
       dados = EXCLUDED.dados,
       atualizado_em = CURRENT_TIMESTAMP
     RETURNING dados`,
    [JSON.stringify(configuracoes)]
  );

  res.json({
    mensagem: "Configurações atualizadas com sucesso!",
    ...resultado.rows[0].dados
  });
}));

// ============ IMAGENS (arquivos guardados no banco) ============
app.post("/api/upload", exigirAdmin, upload.single("imagem"), rota(async (req, res) => {
  if (!req.file) return res.status(400).json({ erro: "Envie uma imagem (jpg, png, webp ou gif até 10MB)" });
  const r = await pool.query("INSERT INTO imagens (tipo, dados) VALUES ($1,$2) RETURNING id", [req.file.mimetype, req.file.buffer]);
  res.status(201).json({ url: `/api/imagens/${r.rows[0].id}` });
}));

app.get("/api/imagens/:id", rota(async (req, res) => {
  if (!idValido(req.params.id)) return res.status(404).end();
  const r = (await pool.query("SELECT tipo, dados FROM imagens WHERE id = $1", [req.params.id])).rows[0];
  if (!r) return res.status(404).end();
  res.set("Content-Type", r.tipo);
  res.set("Cache-Control", "public, max-age=31536000, immutable");
  res.send(r.dados);
}));

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) return res.status(400).json({ erro: "Imagem inválida ou maior que 10MB" });
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor" });
});

await iniciarBanco();
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
  console.log(`Painel ADM: http://localhost:${PORTA}/admin`);
});
