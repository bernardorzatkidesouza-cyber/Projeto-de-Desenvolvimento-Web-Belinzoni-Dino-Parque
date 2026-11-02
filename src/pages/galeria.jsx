
import useGaleria from "../hooks/useGaleria";
import { Link } from "react-router-dom";
import "../assets/mobile.css";
import "../assets/styles.css";
import Brasao_ararangua from "../assets/Brasao_ararangua.jpg";

function Galeria() {
  const { fotos, carregando, erro } = useGaleria();

  return (
    <div className="tela-principal">
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
            <Link to="/noticias">Notícias</Link>
          </nav>
        </div>
      </header>

      <div className="galeria">
        <div className="banner_galeria">
          <p>Fotos</p>
          <h1>Galeria do Parque</h1>
          <p>Confira as fotos do Dino Parque Belinzoni</p>
        </div>

        {carregando ? (
          <p className="galeria_vazia">
            Carregando fotos da galeria...
          </p>
        ) : erro ? (
          <p className="galeria_vazia" role="alert">
            Não foi possível carregar as fotos: {erro}
          </p>
        ) : fotos.length === 0 ? (
          <p className="galeria_vazia">
            Nenhuma foto cadastrada no momento.
          </p>
        ) : (
          <div className="galeria_lista">
            {fotos.map((foto, index) => (
              <div
                className="galeria_imagens"
                key={foto.id ?? index}
              >
                <img
                  className="galeria_imagem"
                  src={foto.imagem}
                  alt={
                    foto.legenda ||
                    "Foto do Dino Parque Belinzoni"
                  }
                />

                {foto.legenda && (
                  <p className="galeria_legenda">
                    {foto.legenda}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Galeria;
