# Correções realizadas no projeto Belinzoni Dino Parque

## Front-end
- Corrigida a URL do proxy do Vite para `http://localhost:3001`.
- Criado `src/services/api.js` para centralizar requisições, incluir o token JWT e tratar respostas/erros.
- Ajustado `App.jsx` para renderizar as rotas filhas com `Outlet`.
- Corrigida a leitura da autenticação: `ProtectedRoute` agora consulta o mesmo `localStorage` usado pelo login.
- Refeito `useDuvidas.jsx`, removendo o trecho solto que causava erro de sintaxe e implementando cadastro, edição e exclusão.
- Ajustado `useNoticias.jsx` para traduzir os nomes de campos do banco (`conteudo`, `imagem_url`, `data_publicacao`) para os nomes usados nas páginas.
- Ajustados os hooks de agenda e galeria para usar a camada comum da API e enviar o token nas operações protegidas.
- Ajustada a página de informações para usar a camada comum da API.
- Removido o elemento de imagem do banner sem `src` (o CSS já fornece um fundo em gradiente).
- Corrigida a largura do mapa de `308%` para `100%`.
- Ajustada a exibição de data das notícias para interpretar corretamente o timestamp retornado pelo PostgreSQL.

## Backend e banco
- Criadas as tabelas `agenda`, `galeria` e `informacoes_parque` no `schema.sql`.
- Adicionados os recursos CRUD de agenda e galeria ao backend.
- Adicionadas as rotas GET/PUT de informações gerais do parque.
- Mantida a autenticação JWT nas operações administrativas de escrita.

## Segurança
- Removido o `.env` real do pacote corrigido para não redistribuir credenciais.
- Criado `.env.example` com os nomes das variáveis necessárias.
- Incluídas regras para ignorar arquivos `.env` no Git.

## Como executar
1. Copie `backend/.env.example` para `backend/.env` e preencha as credenciais reais do PostgreSQL.
2. No diretório `backend`, execute `npm install` e depois `npm run dev`.
3. Na raiz do projeto React, execute `npm install` e depois `npm run dev`.
4. O front-end usa o proxy do Vite para encaminhar `/api` à porta `3001`.

O banco é inicializado pelo backend usando `backend/schema.sql`; as novas tabelas são criadas automaticamente com `CREATE TABLE IF NOT EXISTS`.

## Validação feita
- `node --check` no `backend/server.js`: aprovado.
- Verificação de imports relativos no `src`: nenhum import local ausente.
- Não foi possível executar `npm run build` neste ambiente, pois o projeto não possui as dependências do front-end instaladas e não houve instalação de pacotes.
