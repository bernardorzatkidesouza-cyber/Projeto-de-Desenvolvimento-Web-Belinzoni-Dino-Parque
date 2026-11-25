import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  console.error("ERRO: defina DATABASE_URL no arquivo .env (veja o README).");
  process.exit(1);
}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const local = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: local ? false : { rejectUnauthorized: false },
});

export async function iniciarBanco() {
  await pool.query(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8"));

  const { rows } = await pool.query("SELECT COUNT(*)::int AS total FROM administradores");
  if (rows[0].total === 0) {
    const nome = process.env.ADMIN_NOME || "Administrador";
    const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const senha = process.env.ADMIN_PASSWORD;
    if (!email || !senha || senha.length < 6) {
      console.error("ERRO: defina ADMIN_EMAIL e ADMIN_PASSWORD (mín. 6 caracteres) no .env para criar o primeiro admin.");
      process.exit(1);
    }
    await pool.query(
      "INSERT INTO administradores (nome, email, senha, nivel_permissao) VALUES ($1,$2,$3,'master')",
      [nome, email, await bcrypt.hash(senha, 10)]
    );
    console.log(`Administrador master criado: ${email}`);
  }
}
