# Backend – Belinzoni Dino Parque

## Rodar
```
cd backend
npm install
npm run dev
```
API em http://localhost:3001/api  (senha admin padrão: `dino123`, troque com a variável ADMIN_TOKEN)

## Rotas
| Método | Rota | Acesso | O que faz |
|---|---|---|---|
| GET | /api/noticias | público | notícias publicadas |
| GET | /api/noticias/:id | público | uma notícia |
| POST | /api/login | público | `{senha}` → `{token}` |
| GET | /api/admin/noticias | admin | todas (com rascunhos) |
| POST | /api/noticias | admin | cria |
| PUT | /api/noticias/:id | admin | edita |
| DELETE | /api/noticias/:id | admin | exclui |
| POST | /api/upload | admin | envia imagem (campo `imagem`) |

Rotas admin exigem o cabeçalho `Authorization: Bearer SEU_TOKEN`.

## Usar no React (src/api.js)
```js
const API = "http://localhost:3001";
export const listarNoticias = () => fetch(`${API}/api/noticias`).then(r => r.json());
export const criarNoticia = (dados, token) =>
  fetch(`${API}/api/noticias`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(dados),
  }).then(r => r.json());
```
Imagens: `<img src={API + noticia.imagem} />`
