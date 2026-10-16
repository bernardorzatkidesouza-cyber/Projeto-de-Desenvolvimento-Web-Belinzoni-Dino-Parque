CREATE TABLE administradores (
    id_administradores SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE atracoes (
    id_atracoes SERIAL PRIMARY KEY,
    nome_atracoes VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'aberto' NOT NULL
        CHECK (status IN ('aberto', 'fechado', 'em reforma')),
    imagem_capa_url VARCHAR(255),
    administrador_id INTEGER
        REFERENCES administradores(id_administradores)
);

CREATE TABLE estabelecimentos (
    id_estabelecimento SERIAL PRIMARY KEY,
    nome_estabelecimento VARCHAR(100) NOT NULL,
    descricao_estabelecimento TEXT NOT NULL,
    horario_funcionamento VARCHAR(100) NOT NULL,
    imagem_capa_url VARCHAR(255),
    administrador_id INTEGER
        REFERENCES administradores(id_administradores)
);

CREATE TABLE noticias (
    id_noticias SERIAL PRIMARY KEY,
    titulo_noticias VARCHAR(200) NOT NULL,
    descricao_noticias TEXT NOT NULL,
    imagem_url_noticias VARCHAR(255),
    data_publicacao_noticias DATE NOT NULL,
    administrador_id INTEGER
        REFERENCES administradores(id_administradores)
);

CREATE TABLE perguntas_frequentes (
    id_perguntas_frequentes SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    pergunta TEXT NOT NULL,
    resposta TEXT NOT NULL,
    administrador_id INTEGER
        REFERENCES administradores(id_administradores)
);
