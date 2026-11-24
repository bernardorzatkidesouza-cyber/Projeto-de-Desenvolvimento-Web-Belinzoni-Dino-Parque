-- Tabelas do Belinzoni Dino Parque (criadas automaticamente ao iniciar o servidor)

CREATE TABLE IF NOT EXISTS administradores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,                 -- guarda o HASH bcrypt, nunca a senha pura
    nivel_permissao VARCHAR(20) DEFAULT 'editor', -- 'master' (total) ou 'editor' (apenas notícias)
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS atracoes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    localizacao VARCHAR(255),
    horario_funcionamento VARCHAR(100),
    status VARCHAR(50) DEFAULT 'aberto',
    imagem_capa_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS estabelecimentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    descricao TEXT,
    localizacao VARCHAR(255),
    horario_funcionamento VARCHAR(100),
    imagem_capa_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS imagens_estabelecimento (
    id SERIAL PRIMARY KEY,
    estabelecimento_id INT REFERENCES estabelecimentos(id) ON DELETE CASCADE,
    imagem_url VARCHAR(255) NOT NULL,
    legenda VARCHAR(150)
);

CREATE TABLE IF NOT EXISTS noticias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    conteudo TEXT NOT NULL,
    imagem_url VARCHAR(255),
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'publicado',
    criado_por_admin_id INT REFERENCES administradores(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS perguntas_frequentes (
    id SERIAL PRIMARY KEY,
    pergunta TEXT NOT NULL,
    resposta TEXT NOT NULL,
    categoria VARCHAR(50) DEFAULT 'geral',
    ordem_exibicao INT DEFAULT 0,
    atualizado_por_admin_id INT REFERENCES administradores(id) ON DELETE SET NULL
);

-- Arquivos de imagem enviados pelo painel (as tabelas acima guardam só o link /api/imagens/ID)
CREATE TABLE IF NOT EXISTS imagens (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    dados BYTEA NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Agenda de eventos do parque
CREATE TABLE IF NOT EXISTS agenda (
    id SERIAL PRIMARY KEY,
    dia VARCHAR(2) NOT NULL,
    mes VARCHAR(20) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    local VARCHAR(200) NOT NULL,
    hora VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Galeria pública de fotos
CREATE TABLE IF NOT EXISTS galeria (
    id SERIAL PRIMARY KEY,
    imagem_url TEXT NOT NULL,
    legenda VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Informações de contato e funcionamento (registro único)
CREATE TABLE IF NOT EXISTS informacoes_parque (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    dados JSONB NOT NULL DEFAULT '{}'::jsonb,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Configurações globais do site: banner e cores
CREATE TABLE IF NOT EXISTS configuracoes_site (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    dados JSONB NOT NULL DEFAULT '{}'::jsonb,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);