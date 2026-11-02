import "../assets/mobile.css";
import "../assets/styles.css";

import { useState } from "react";
import { Link } from "react-router-dom";

import Brasao_ararangua from "../assets/Brasao_ararangua.jpg";
import useAgenda from "../hooks/useAgenda";
import ModalEvento from "../components/ModalEvento";

function AdminAgenda() {
  const {
    eventos,
    carregando,
    erro,
    mensagem,
    salvarEvento,
    removerEvento
  } = useAgenda();

  const [modalAberto, setModalAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  // ABRIR CADASTRO
  function abrirNovoEvento() {
    setEventoSelecionado(null);
    setModalAberto(true);
  }

  // ABRIR EDIÇÃO
  function abrirEditarEvento(evento) {
    setEventoSelecionado(evento);
    setModalAberto(true);
  }

  // FECHAR MODAL
  function fecharModal() {
    setModalAberto(false);
    setEventoSelecionado(null);
  }

  // SALVAR
  async function handleSalvar(dados, id) {
    return await salvarEvento(dados, id);
  }

  // EXCLUIR
  async function handleRemover(id) {
    const confirmar = window.confirm(
      "Deseja realmente remover este evento?"
    );

    if (confirmar) {
      await removerEvento(id);
    }
  }

  return (
    <div className="admin_agenda">

      {/* MENU LATERAL */}
      <div className="admin_barra_lateral">

        <img
          src={Brasao_ararangua}
          alt="Brasão da Prefeitura de Araranguá"
          width="80"
          height="80"
        />

        <h2>Dino Parque</h2>
        <p>ADMINISTRAÇÃO</p>

        <hr />

        <p>
          <Link to="/admin/admin_noticia">
            Notícias
          </Link>
        </p>

        <p>
          <Link to="/admin/admin_duvidas">
            Dúvidas
          </Link>
        </p>

        <p>
          <Link to="/admin/admin_galeria">
            Galeria de Fotos
          </Link>
        </p>

        <p>
          <Link to="/admin/admin_informacoes">
            Informações
          </Link>
        </p>

        <p>
          <Link to="/admin/admin_banner">
            Banner e Cores
          </Link>
        </p>

        <hr />

        <p>
          <Link to="/">
            Sair para o Site
          </Link>
        </p>

      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="admin_conteudo">

        <h1>Agenda de Eventos</h1>

        <button
          className="admin_button"
          type="button"
          onClick={abrirNovoEvento}
        >
          + Novo Evento
        </button>

        {mensagem && (
          <p className="agenda_mensagem">
            {mensagem}
          </p>
        )}

        {erro && !modalAberto && (
          <p className="agenda_erro">
            {erro}
          </p>
        )}

        {/* CARDS DOS EVENTOS */}
        <div className="admin_agenda_lista">

          {carregando ? (
            <p>Carregando eventos...</p>
          ) : eventos.length === 0 ? (
            <p>Nenhum evento cadastrado no momento.</p>
          ) : (

            eventos.map((evento) => {
              const id = evento.id ?? evento.id_evento;

              return (
                <div
                  className="admin_agenda_card"
                  key={id}
                >

                  <details className="evento_card">

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

                  <button
                    type="button"
                    onClick={() => abrirEditarEvento(evento)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemover(id)}
                  >
                    Remover
                  </button>

                </div>
              );
            })

          )}

        </div>

      </div>

      {/* COMPONENTE DO MODAL */}
      <ModalEvento
        aberto={modalAberto}
        onFechar={fecharModal}
        onSalvar={handleSalvar}
        evento={eventoSelecionado}
        erro={erro}
      />

    </div>
  );
}

export default AdminAgenda;