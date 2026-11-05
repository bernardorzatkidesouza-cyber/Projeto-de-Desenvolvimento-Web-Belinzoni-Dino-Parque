// Camada de "banco de dados": lê e grava o arquivo bd.json
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARQUIVO = path.join(__dirname, "bd.json");

export function lerBanco() {
  return JSON.parse(fs.readFileSync(ARQUIVO, "utf-8"));
}

export function salvarBanco(dados) {
  fs.writeFileSync(ARQUIVO, JSON.stringify(dados, null, 2), "utf-8");
}
