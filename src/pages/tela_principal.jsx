

import "../assets/mobile.css";
import "../assets/styles.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [fotos, setFotos] = useState([]);

  useEffect(() => {
    function carregarFotos() {
      try {
        const fotosSalvas = JSON.parse(
          localStorage.getItem("galeriaFotos") || "[]"
        );

        setFotos(Array.isArray(fotosSalvas) ? fotosSalvas : []);
      } catch {
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
            <Link to="/noticias">Notícias</Link>
            <Link to="/galeria">Galeria</Link>
            <a href="#agenda">Agenda</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>
        </div>
      </header>

      <div className="site">
        <section className="principal_banner">
          <img className="imagem_banner" alt="Dino Parque Belinzoni" />
          <h1>Araranguá · Santa Catarina</h1>
          <h2>Dino Parque Belinzoni</h2>
          <p>Entrada gratuita!</p>
        </section>

        <section className="noticia_tela_pricipal" id="noticias">
          <p>Novidades</p>
          <h2>Notícias do Parque</h2>
          <h3>
            Fique por dentro de tudo que acontece
            no Dino Parque Belinzoni
          </h3>

          <div className="noticia_card">
            <div className="noticia_body">
              <span className="noticia_badge">Destaque</span>

              <h3 className="noticia_title">Título da notícia</h3>

              <p className="noticia_description">
                Confira as novidades e informações
                do Dino Parque Belinzoni.
              </p>
            </div>

            <button className="noticia_card_button">
              Leia mais
            </button>
          </div>
        </section>

        <section className="galeria_tela_principal" id="galeria">
          <p>Fotos</p>
          <h1>Galeria do Parque</h1>

          <div className="galeria_lista">
            {fotos.slice(0, 5).map((foto) => (
              <div className="galeria_imagens" key={foto.id}>
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

          <Link className="galeria_card_button" to="/galeria">
            Veja mais
          </Link>
        </section>

        <section className="programacao_tela_principal" id="agenda">
          <p>Programação</p>
          <h1>Agenda de Eventos</h1>

          <details className="evento_card">
            <p className="data_evento">Data do evento</p>
            <summary className="evento_title">Título do evento</summary>
            <p className="lacal_evento">📍Local do evento</p>
            <p className="hora_evento">🕗Hora do evento</p>
          </details>

          <details className="funcionamento">
            <h2>FUNCIONAMENTO</h2>
            <p className="funcionamento_content_seg_sex">
              Seg-Sex <span>[00h-00h]</span>
            </p>
            <p className="funcionamento_content_sab">
              Sábados <span>[00h-00h]</span>
            </p>
            <p className="funcionamento_content_dom_feri">
              Dom e Feriados <span>[00h-00h]</span>
            </p>
          </details>
        </section>

        <section className="duvidas_tela_principal" id="duvidas">
          <p>DÚVIDAS</p>
          <h1>Perguntas Frequentes</h1>

          <details className="duvidas_card">
            <summary className="duvidas_title">
              O parque é gratuito?
            </summary>
            <p className="duvidas_conteudo">
              Sim! Consulte as informações oficiais
              do parque para confirmar as condições
              de visitação.
            </p>
          </details>
        </section>

        <section className="localizacao_tela_principal" id="localizacao">
          <p>ONDE ESTAMOS</p>
          <h1>Encontre o Parque</h1>

          <div>
            <article className="localizacao_card">
              <h3>📍</h3>
              <h4>ENDEREÇO</h4>
              <p className="localizacao_content">
                [Rua, número — Bairro, Araranguá/SC]
              </p>
            </article>

            <article className="telefone_card">
              <h3>☎</h3>
              <h4>TELEFONE</h4>
              <p className="telefone_content">[Número de contato]</p>
            </article>

            <article className="email_card">
              <h3>✉</h3>
              <h4>E-MAIL</h4>
              <p className="email_content">[E-mail do parque]</p>
            </article>
          </div>

          <div className="mapa_card">
            <h3>Mapa do Parque</h3>
            <p>Adicione aqui o mapa incorporado do Google Maps.</p>
          </div>
        </section>

        <footer className="rodape">
          <div className="rodape_localizacao">
            <img alt="Logo da prefeitura" />

            <h3>Dino Parque Belinzoni</h3>
            <p>ARARANGUÁ - SC</p>
            <p className="localizacao_content">
              📍 [Rua, número — Bairro, Araranguá/SC]
            </p>
            <p className="telefone_content">📞 [Número de contato]</p>
            <p className="email_content">✉ [E-mail do parque]</p>
          </div>

          <div className="rodape_navegacao">
            <h4>NAVEGAÇÃO</h4>

            <nav>
              <ul>
                <li><Link to="/">Início</Link></li>
                <li><a href="#noticias">Notícias</a></li>
                <li><a href="#galeria">Galeria</a></li>
                <li><a href="#agenda">Agenda</a></li>
                <li><a href="#duvidas">Dúvidas</a></li>
              </ul>
            </nav>
          </div>

          <div className="rodape_funcionamento">
            <h4>FUNCIONAMENTO</h4>
            <p className="funcionamento_content_seg_sex">
              Seg-Sex <span>[00h-00h]</span>
            </p>
            <p className="funcionamento_content_sab">
              Sábados <span>[00h-00h]</span>
            </p>
            <p className="funcionamento_content_dom_feri">
              Dom e Feriados <span>[00h-00h]</span>
            </p>
          </div>

          <hr />

          <p>
            © 2026 Dino Parque Belinzoni —
            Prefeitura Municipal de Araranguá
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Home;

