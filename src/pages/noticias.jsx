
import "../assets/mobile.css";
import "../assets/styles.css";

import { Link } from "react-router-dom";
import useNoticias from "../hooks/useNoticias";

function Noticias() {
  const {
    noticias,
    carregando,
    erro
  } = useNoticias();

  const noticiasPublicadas = noticias
    .filter((noticia) => noticia.status === "publicado")
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  return (
    <>
      <header className="menu">
        <div className="menu__body">
          <img alt="Logo da prefeitura" />

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

        {carregando && <p>Carregando notícias...</p>}

        {erro && <p>Erro ao carregar notícias: {erro}</p>}

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
                />
              )}

              <time>{noticia.data}</time>

              <h2>{noticia.titulo}</h2>

              <p>{noticia.descricao}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

export default Noticias;
