
import { Link } from "react-router-dom";
import "../assets/mobile.css";
import "../assets/styles.css";
import Brasao_ararangua from '../assets/Brasao_ararangua.jpg';

import { useState } from "react";
import FormularioNoticia from "../components/FormularioNoticia";
import useNoticias from "../hooks/useNoticias";

function AdminNoticia() {
  const {
    noticias,
    carregando,
    erro,
    cadastrarNoticia,
    atualizarNoticia,
    removerNoticia
  } = useNoticias();

  const [modalAberto, setModalAberto] = useState(false);
  const [noticiaSelecionada, setNoticiaSelecionada] = useState(null);

  function novaNoticia() {
    setNoticiaSelecionada(null);
    setModalAberto(true);
  }

  function editarNoticia(noticia) {
    setNoticiaSelecionada(noticia);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setNoticiaSelecionada(null);
  }

  async function salvarNoticia(dados) {
    try {
      if (noticiaSelecionada) {
        await atualizarNoticia(noticiaSelecionada.id, dados);
      } else {
        await cadastrarNoticia(dados);
      }

      fecharModal();

    } catch (erro) {
      console.error("Erro ao salvar:", erro);
      alert("Não foi possível salvar a notícia.");
    }
  }

  async function excluirNoticia(id) {
    if (!window.confirm("Deseja remover esta notícia?")) {
      return;
    }

    try {
      await removerNoticia(id);
    } catch (erro) {
      console.error("Erro ao remover:", erro);
      alert("Não foi possível remover a notícia.");
    }
  }

  return (
    <div className="admin_noticia">

      <div className="admin_barra_lateral">
        <img 
          src = {Brasao_ararangua}
          width="80"
          height="80"
        />
        <h2>Dino Parque</h2>
        <p>ADMINISTRAÇÃO</p>
        <hr />

        <p><Link to="/admin/admin_duvidas">Dúvidas</Link></p>
        <p><Link to="/admin/admin_agenda">Agenda</Link></p>
        <p><Link to="/admin/admin_galeria">Galeria de Fotos</Link></p>
        <p><Link to="/admin/admin_informacoes">Informações</Link></p>
        <p><Link to="/admin/admin_banner">Banner e Cores</Link></p>

        <hr />
        <p><a href="/">Sair para o Site</a></p>
      </div>

      <div className="admin_conteudo">
        <h1>Notícias</h1>

        <button
          className="admin_button"
          type="button"
          onClick={novaNoticia}
        >
          + Nova Notícia
        </button>

        {carregando && <p>Carregando notícias...</p>}

        {erro && <p>Erro ao carregar notícias: {erro}</p>}

        {!carregando && !erro && noticias.length === 0 && (
          <p>Nenhuma notícia cadastrada.</p>
        )}

        <div className="lista_noticias_admin">
          {noticias.map((noticia) => (
            <div
              className="admin_noticia_card"
              key={noticia.id}
            >
              <span className="noticia_status">
                {noticia.status}
              </span>

              <time className="noticia_data">
                {noticia.data}
              </time>

              <h3 className="noticia_title">
                {noticia.titulo}
              </h3>

              <p className="noticia_description">
                {noticia.descricao}
              </p>

              <button
                type="button"
                onClick={() => editarNoticia(noticia)}
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => excluirNoticia(noticia.id)}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      </div>

      {modalAberto && (
        <FormularioNoticia
          noticia={noticiaSelecionada}
          onSalvar={salvarNoticia}
          onFechar={fecharModal}
        />
      )}

    </div>
  );
}

export default AdminNoticia;
