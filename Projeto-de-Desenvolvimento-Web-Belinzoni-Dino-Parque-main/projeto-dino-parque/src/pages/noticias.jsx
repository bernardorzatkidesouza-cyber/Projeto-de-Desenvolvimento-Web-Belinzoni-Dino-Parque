

import { useState } from "react";

import "../assets/mobile.css";
import "../assets/styles.css";

import Brasao_ararangua from "../assets/Brasao_ararangua.png";

import { Link } from "react-router-dom";
import useNoticias from "../hooks/useNoticias";

function Noticias() {
  const {
    noticias,
    carregando,
    erro
  } = useNoticias();

  // Controla a imagem selecionada
  const [imagemSelecionada, setImagemSelecionada] = useState(null);

  // Exibe somente notícias publicadas e ordena por data
  const noticiasPublicadas = noticias
    .filter((noticia) => noticia.status === "publicado")
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  return (
    <>
      <header className="menu">
        <div className="menu__body">
          <img
            src={Brasao_ararangua}
            alt="Brasão da Prefeitura de Araranguá"
            width="80"
            height="80"
          />

          <h1 className="menu__title">
            Prefeitura de Araranguá
            <span>Dino Parque Belinzoni</span>
          </h1>

          <nav className="menu__links">
            <Link to="/">Início</Link>
            <Link to="/galeria">Galeria</Link>
          </nav>
        </div>
      </header>

      <div className="pagina_noticias">

        <h1>Notícias do Dino Parque</h1>

        {carregando && (
          <p>Carregando notícias...</p>
        )}

        {erro && (
          <p>Erro ao carregar notícias: {erro}</p>
        )}

        {!carregando && !erro && noticiasPublicadas.length === 0 && (
          <p>Nenhuma notícia publicada no momento.</p>
        )}

        <div className="noticia_lista_principal">

          {noticiasPublicadas.map((noticia) => (
            <article
              className="noticia_card"
              key={noticia.id}
            >

              {noticia.imagem && (
                <img
                  src={noticia.imagem}
                  alt={noticia.titulo}
                  className="noticia_imagem"
                  onClick={() =>
                    setImagemSelecionada(noticia.imagem)
                  }
                  style={{ cursor: "pointer" }}
                />
              )}

              <time>
                {noticia.data
                  ? new Date(noticia.data).toLocaleDateString("pt-BR")
                  : ""}
              </time>

              <h2>{noticia.titulo}</h2>

              <p>{noticia.descricao}</p>

            </article>
          ))}

        </div>
      </div>

      {/* Modal para ampliar a imagem da notícia */}
      {imagemSelecionada && (
        <div
          className="modal_imagem"
          onClick={() => setImagemSelecionada(null)}
        >

          <button
            type="button"
            className="fechar_modal_imagem"
            onClick={() => setImagemSelecionada(null)}
            aria-label="Fechar imagem ampliada"
          >
            &times;
          </button>

          <img
            src={imagemSelecionada}
            alt="Imagem ampliada da notícia"
            onClick={(e) => e.stopPropagation()}
          />

        </div>
      )}

    </>
  );
}

export default Noticias;
