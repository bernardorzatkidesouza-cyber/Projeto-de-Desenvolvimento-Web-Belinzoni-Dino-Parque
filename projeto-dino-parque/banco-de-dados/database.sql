CREATE TABLE administradores (
    id_administradores SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. NOTÍCIAS
CREATE TABLE noticias (
    id_noticias SERIAL PRIMARY KEY,
    titulo_noticias VARCHAR(200) NOT NULL,
    descricao_noticias TEXT NOT NULL,
    imagem_url_noticias VARCHAR(500),
    data_publicacao_noticias DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'rascunho'
        CHECK (status IN ('rascunho', 'publicado')),
    administrador_id INTEGER REFERENCES administradores(id_administradores)
        ON DELETE SET NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. FOTOS DA GALERIA
CREATE TABLE fotos_galeria (
    id_foto SERIAL PRIMARY KEY,
    imagem_url VARCHAR(500) NOT NULL,
    legenda VARCHAR(255),
    ordem_exibicao INTEGER NOT NULL DEFAULT 0,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    administrador_id INTEGER REFERENCES administradores(id_administradores)
        ON DELETE SET NULL
);

-- 5. AGENDA DE EVENTOS
CREATE TABLE eventos (
    id_evento SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    data_evento DATE NOT NULL,
    horario TIME NOT NULL,
    local VARCHAR(200),
    status VARCHAR(20) NOT NULL DEFAULT 'publicado'
        CHECK (status IN ('rascunho', 'publicado', 'cancelado')),
    administrador_id INTEGER REFERENCES administradores(id_administradores)
        ON DELETE SET NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. PERGUNTAS FREQUENTES
CREATE TABLE perguntas_frequentes (
    id_perguntas_frequentes SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    pergunta TEXT NOT NULL,
    resposta TEXT NOT NULL,
    categoria VARCHAR(80) DEFAULT 'geral' NOT NULL,
    ordem_exibicao INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'publicado'
        CHECK (status IN ('publicado', 'oculto')),
    administrador_id INTEGER REFERENCES administradores(id_administradores)
        ON DELETE SET NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. INFORMAÇÕES GERAIS E CONTATO DO PARQUE

CREATE TABLE informacoes_parque (
    id_informacao SERIAL PRIMARY KEY,
    nome_parque VARCHAR(150) NOT NULL DEFAULT 'Dino Parque Belinzoni',
    endereco VARCHAR(255),
    telefone VARCHAR(30),
    email VARCHAR(150),
    mapa_url VARCHAR(500),
    horario_seg_sex VARCHAR(100),
    horario_sabado VARCHAR(100),
    horario_dom_feriados VARCHAR(100),
    entrada_gratuita BOOLEAN NOT NULL DEFAULT TRUE,
    administrador_id INTEGER REFERENCES administradores(id_administradores)
        ON DELETE SET NULL,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. CONFIGURAÇÕES VISUAIS DO SITE (BANNER E CORES)
CREATE TABLE configuracoes_site (
    id_configuracao SERIAL PRIMARY KEY,
    titulo_banner VARCHAR(200),
    subtitulo_banner VARCHAR(255),
    texto_banner VARCHAR(255),
    imagem_banner_url VARCHAR(500),
    cor_primaria VARCHAR(20),
    cor_secundaria VARCHAR(20),
    cor_fundo VARCHAR(20),
    administrador_id INTEGER REFERENCES administradores(id_administradores)
        ON DELETE SET NULL,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. ÍNDICES PARA CONSULTAS FREQUENTES
CREATE INDEX idx_noticias_data ON noticias (data_publicacao_noticias DESC);
CREATE INDEX idx_noticias_status ON noticias (status);
CREATE INDEX idx_fotos_galeria_ordem ON fotos_galeria (ordem_exibicao);
CREATE INDEX idx_eventos_data_status ON eventos (data_evento, status);
CREATE INDEX idx_perguntas_status_ordem ON perguntas_frequentes (status, ordem_exibicao);