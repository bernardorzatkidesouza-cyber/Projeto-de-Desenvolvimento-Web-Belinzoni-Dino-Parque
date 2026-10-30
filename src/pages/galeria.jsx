
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/mobile.css";
import "../assets/styles.css";

function Galeria() {
  const [fotos, setFotos] = useState([]);

  useEffect(() => {
    function carregarFotos() {
      try {
        const fotosSalvas = JSON.parse(
          localStorage.getItem("galeriaFotos") || "[]"
        );

        setFotos(Array.isArray(fotosSalvas) ? fotosSalvas : []);
      } catch (erro) {
        console.error("Erro ao carregar as fotos:", erro);
        setFotos([]);
      }
    }

    carregarFotos();

    window.addEventListener("storage", carregarFotos);
    window.addEventListener("focus", carregarFotos);

    return () => {
      window.removeEventListener("storage", carregarFotos);
      window.removeEventListener("focus", carregarFotos);
    };
  }, []);

  return (
    <div className="tela-principal">
      <header className="menu">
        <div className="menu__body">
          <img alt="Logo da prefeitura" />

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

        {fotos.length === 0 ? (
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
                  alt={foto.legenda || "Foto do Dino Parque Belinzoni"}
                />

                {foto.legenda && (
                  <p className="galeria_legenda">{foto.legenda}</p>
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
