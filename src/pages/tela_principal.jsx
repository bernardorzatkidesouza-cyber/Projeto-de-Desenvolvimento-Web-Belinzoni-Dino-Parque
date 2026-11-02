import "../assets/mobile.css";
import "../assets/styles.css";
import Brasao_ararangua from "../assets/Brasao_ararangua.jpg";

import { Link } from "react-router-dom";

import useNoticias from "../hooks/useNoticias";
import useGaleria from "../hooks/useGaleria";
import useAgenda from "../hooks/useAgenda";

import DuvidasFrequentes from "../components/DuvidasFrequentes";

function Home() {

  // RECEBER NOTÍCIAS ATRAVÉS DO CUSTOM HOOK
  const {
    noticias,
    carregando,
    erro
  } = useNoticias();

  // RECEBER FOTOS ATRAVÉS DA API
  const {
    fotos,
    carregando: carregandoFotos,
    erro: erroFotos
  } = useGaleria();

  // RECEBER EVENTOS ATRAVÉS DA API
  const {
    eventos,
    carregando: carregandoEventos,
    erro: erroEventos
  } = useAgenda();

  // FILTRAR AS 3 NOTÍCIAS PUBLICADAS MAIS RECENTES
  const ultimasNoticias = noticias
    .filter((noticia) => noticia.status === "publicado")
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 3);

  return (
    <div className="tela-principal">

      {/* MENU */}
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
            <Link to="/noticias">Notícias</Link>
            <Link to="/galeria">Galeria</Link>
            <a href="#agenda">Agenda</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>

        </div>
      </header>

      <div className="site">

        {/* BANNER PRINCIPAL */}
        <section className="principal_banner">

          <img
            className="imagem_banner"
            alt="Dino Parque Belinzoni"
          />

          <h1>Araranguá · Santa Catarina</h1>
          <h2>Dino Parque Belinzoni</h2>
          <p>Entrada gratuita!</p>

        </section>

        {/* NOTÍCIAS */}
        <section className="noticia_tela_pricipal" id="noticias">

          <p>Novidades</p>

          <h2>Notícias do Parque</h2>

          <h3>
            Fique por dentro de tudo que acontece
            no Dino Parque Belinzoni
          </h3>

          {carregando && (
            <p>Carregando notícias...</p>
          )}

          {erro && (
            <p>Não foi possível carregar as notícias.</p>
          )}

          {!carregando && !erro && (

            <div className="noticia_lista_principal">

              {ultimasNoticias.map((noticia) => (

                <div className="noticia_card" key={noticia.id}>

                  {noticia.imagem && (
                    <img
                      className="noticia_imagem"
                      src={noticia.imagem}
                      alt={noticia.titulo}
                    />
                  )}

                  <div className="noticia_body">

                    <span className="noticia_badge">
                      Destaque
                    </span>

                    <p className="noticia_data">
                      {noticia.data
                        ? new Date(
                            noticia.data + "T00:00:00"
                          ).toLocaleDateString("pt-BR")
                        : ""}
                    </p>

                    <h3 className="noticia_title">
                      {noticia.titulo}
                    </h3>

                    <p className="noticia_description">
                      {(noticia.descricao || "").length > 120
                        ? noticia.descricao.substring(0, 120) + "..."
                        : noticia.descricao}
                    </p>

                  </div>

                  <Link
                    className="noticia_card_button"
                    to="/noticias"
                  >
                    Leia mais
                  </Link>

                </div>

              ))}

              {ultimasNoticias.length === 0 && (
                <p>Nenhuma notícia publicada no momento.</p>
              )}

            </div>

          )}

          <Link
            className="galeria_card_button"
            to="/noticias"
          >
            Ver todas as notícias
          </Link>

        </section>

        {/* GALERIA */}
        <section className="galeria_tela_principal" id="galeria">

          <p>Fotos</p>
          <h1>Galeria do Parque</h1>

          {carregandoFotos ? (
            <p className="galeria_vazia">
              Carregando fotos da galeria...
            </p>
          ) : erroFotos ? (
            <p className="galeria_vazia" role="alert">
              Não foi possível carregar as fotos: {erroFotos}
            </p>
          ) : fotos.length === 0 ? (
            <p className="galeria_vazia">
              Nenhuma foto cadastrada no momento.
            </p>
          ) : (

            <div className="galeria_lista">

              {fotos.slice(0, 5).map((foto, index) => (

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

          <Link className="galeria_card_button" to="/galeria">
            Veja mais
          </Link>

        </section>

        {/* AGENDA */}
        <section className="programacao_tela_principal" id="agenda">

          <p>Programação</p>
          <h1>Agenda de Eventos</h1>

          {carregandoEventos ? (

            <p>Carregando eventos...</p>

          ) : erroEventos ? (

            <p role="alert">
              Não foi possível carregar os eventos.
            </p>

          ) : eventos.length === 0 ? (

            <p>
              Nenhum evento cadastrado no momento.
            </p>

          ) : (

            <div className="agenda_lista_publica">

              {eventos.map((evento, index) => (

                <details
                  className="evento_card"
                  key={evento.id ?? evento.id_evento ?? index}
                >

                  <p className="data_evento">
                    {evento.dia} {evento.mes}
                  </p>

                  <summary className="evento_title">
                    {evento.titulo}
                  </summary>

                  <p className="lacal_evento">
                    📍 {evento.local}
                  </p>

                  <p className="hora_evento">
                    🕗 {evento.hora}
                  </p>

                </details>

              ))}

            </div>

          )}

          {/* FUNCIONAMENTO */}
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

        {/* DÚVIDAS FREQUENTES */}
        <DuvidasFrequentes />

        {/* LOCALIZAÇÃO */}
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
              <p className="telefone_content">
                [Número de contato]
              </p>
            </article>

            <article className="email_card">
              <h3>✉</h3>
              <h4>E-MAIL</h4>
              <p className="email_content">
                [E-mail do parque]
              </p>
            </article>

          </div>

          <div className="mapa_card">
            <h3>Mapa do Parque</h3>
            <p>Adicione aqui o mapa incorporado do Google Maps.</p>
          </div>

        </section>

        {/* RODAPÉ */}
        <footer className="rodape">

          <div className="rodape_localizacao">

            <img
              src={Brasao_ararangua}
              alt="Brasão da Prefeitura de Araranguá"
              width="50"
              height="50"
            />

            <h3>Dino Parque Belinzoni</h3>
            <p>ARARANGUÁ - SC</p>

            <p className="localizacao_content">
              📍 [Rua, número — Bairro, Araranguá/SC]
            </p>

            <p className="telefone_content">
              📞 [Número de contato]
            </p>

            <p className="email_content">
              ✉ [E-mail do parque]
            </p>

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