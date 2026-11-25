# Backend – Belinzoni Dino Parque

API feita com Node.js, Express e PostgreSQL. O frontend foi mantido sem alteracoes.

## Como iniciar

1. Instale o [Node.js 18 ou superior](https://nodejs.org/).
2. Abra o terminal nesta pasta (`backend`).
3. Instale as dependencias:
   ```bash
   npm install
   ```
4. Crie seu arquivo de configuracao copiando `.env.example` para `.env`.
5. Abra `.env` e informe os dados reais do PostgreSQL, uma chave JWT e os dados do primeiro administrador.
6. Inicie a API:
   ```bash
   npm start
   ```

A API sera iniciada em `http://localhost:3001` (ou na porta definida em `PORT`). O proprio backend cria/atualiza as tabelas a partir de `schema.sql` ao iniciar. O primeiro administrador master e criado automaticamente quando ainda nao existe nenhum administrador.

## Variaveis do `.env`

- `DATABASE_URL`: endereco de conexao do PostgreSQL.
- `PORT`: porta da API (opcional; padrao `3001`).
- `JWT_SECRET`: chave secreta dos tokens de autenticacao. Mantenha a mesma chave entre reinicios.
- `ADMIN_NOME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`: dados usados para criar o primeiro administrador master. A senha deve ter pelo menos 6 caracteres.

**Importante:** nao compartilhe o arquivo `.env` e nao envie senhas ou chaves para o GitHub.

## Organizacao

- `server.js`: rotas da API, login, permissoes e validacoes. Os CRUDs das tabelas de conteudo usam uma configuracao centralizada para evitar repetir a mesma logica.
- `db.js`: conexao com PostgreSQL e inicializacao do banco.
- `schema.sql`: estrutura das tabelas.

## Endpoints principais usados pelo frontend

`/api/login`, `/api/noticias`, `/api/agenda`, `/api/galeria`, `/api/informacoes`, `/api/configuracoes-site` e `/api/upload`. As rotas administrativas exigem token de autenticacao.
