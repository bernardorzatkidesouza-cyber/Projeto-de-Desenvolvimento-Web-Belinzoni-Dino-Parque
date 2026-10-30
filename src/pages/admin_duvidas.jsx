
import { useState } from "react";
import { Link } from "react-router-dom";

import "../assets/mobile.css";
import "../assets/styles.css";

import useDuvidas from "../hooks/useDuvidas";

function AdminDuvidas() {
  const {
    duvidas,
    carregando,
    erro,
    adicionarDuvida,
    atualizarDuvida,
    excluirDuvida,
  } = useDuvidas();

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [formulario, setFormulario] = useState({
    pergunta: "",
    resposta: "",
    categoria: "Geral",
    ordemExibicao: 1,
  });

  // ABRIR MODAL PARA NOVA PERGUNTA
  function novaDuvida() {
    setEditando(null);

    setFormulario({
      pergunta: "",
      resposta: "",
      categoria: "Geral",
      ordemExibicao: duvidas.length + 1,
    });

    setMensagem("");
    setModalAberto(true);
  }

  // ABRIR MODAL PARA EDITAR
  function editarDuvida(duvida) {
    setEditando(duvida);

    setFormulario({
      pergunta: duvida.pergunta || "",
      resposta: duvida.resposta || "",
      categoria: duvida.categoria || "Geral",
      ordemExibicao: duvida.ordemExibicao ?? 1,
    });

    setMensagem("");
    setModalAberto(true);
  }

  // ALTERAR CAMPOS
  function alterarCampo(e) {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: name === "ordemExibicao"
        ? Number(value)
        : value,
    }));
  }

  // SALVAR PERGUNTA
  async function salvarDuvida(e) {
    e.preventDefault();

    try {
      setSalvando(true);
      setMensagem("");

      if (editando) {
        await atualizarDuvida(
          editando.idPerguntasFrequentes ?? editando.id,
          formulario
        );
      } else {
        await adicionarDuvida(formulario);
      }

      setModalAberto(false);
      setEditando(null);

      setFormulario({
        pergunta: "",
        resposta: "",
        categoria: "Geral",
        ordemExibicao: 1,
      });
    } catch (erro) {
      setMensagem(erro.message);
    } finally {
      setSalvando(false);
    }
  }

  // REMOVER PERGUNTA
  async function removerDuvida(duvida) {
    const confirmar = window.confirm(
      "Tem certeza que deseja remover esta dúvida?"
    );

    if (!confirmar) return;

    try {
      await excluirDuvida(
        duvida.idPerguntasFrequentes ?? duvida.id
      );
    } catch (erro) {
      setMensagem(erro.message);
    }
  }

  // ORDENAR PERGUNTAS
  const duvidasOrdenadas = [...duvidas].sort(
    (a, b) => a.ordemExibicao - b.ordemExibicao
  );

  return (
    <div className="admin_duvidas">

      {/* MENU LATERAL */}
      <div className="admin_barra_lateral">
        <h2>Dino Parque</h2>
        <p>ADMINISTRAÇÃO</p>

        <hr />

        <p><Link to="/admin/admin_noticia">Notícias</Link></p>
        <p><Link to="/admin/admin_agenda">Agenda</Link></p>
        <p><Link to="/admin/admin_duvidas">Dúvidas</Link></p>
        <p><Link to="/admin/admin_galeria">Galeria de Fotos</Link></p>
        <p><Link to="/admin/admin_informacoes">Informações</Link></p>
        <p><Link to="/admin/admin_banner">Banner e Cores</Link></p>

        <hr />

        <p><Link to="/">Sair para o Site</Link></p>
      </div>

      {/* CONTEÚDO */}
      <div className="admin_conteudo">

        <div className="admin_duvidas_cabecalho">
          <div>
            <h1>Dúvidas Frequentes</h1>
            <p>Gerencie as perguntas e respostas do parque.</p>
          </div>

          <button
            className="admin_button"
            type="button"
            onClick={novaDuvida}
          >
            + Nova Dúvida
          </button>
        </div>

        {mensagem && (
          <p className="duvidas_mensagem">{mensagem}</p>
        )}

        {carregando && (
          <p>Carregando dúvidas...</p>
        )}

        {erro && (
          <p className="duvidas_erro">{erro}</p>
        )}

        {!carregando && !erro && (
          <div className="admin_duvidas_lista">

            {duvidasOrdenadas.length === 0 ? (
              <p className="duvidas_vazia">
                Nenhuma dúvida cadastrada.
              </p>
            ) : (

              duvidasOrdenadas.map((duvida) => (

                <div
                  className="admin_agenda_card"
                  key={
                    duvida.idPerguntasFrequentes ?? duvida.id
                  }
                >
                  <span className="duvida_status">
                    {duvida.categoria || "Geral"}
                  </span>

                  <span className="duvida_ordem">
                    Ordem: {duvida.ordemExibicao}
                  </span>

                  <h3 className="duvidas_title">
                    {duvida.pergunta}
                  </h3>

                  <p className="duvidas_conteudo">
                    {duvida.resposta}
                  </p>

                  <div className="duvidas_acoes">
                    <button
                      type="button"
                      onClick={() => editarDuvida(duvida)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => removerDuvida(duvida)}
                    >
                      Remover
                    </button>
                  </div>
                </div>

              ))
            )}

          </div>
        )}

      </div>

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      {modalAberto && (

        <div
          className="duvidas_modal_fundo"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !salvando) {
              setModalAberto(false);
            }
          }}
        >

          <div
            className="duvidas_modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo_modal_duvidas"
          >

            <h2 id="titulo_modal_duvidas">
              {editando ? "Editar Pergunta" : "Nova Pergunta"}
            </h2>

            <form onSubmit={salvarDuvida}>

              <div className="duvidas_campo">
                <label htmlFor="pergunta">
                  PERGUNTA
                </label>

                <input
                  id="pergunta"
                  name="pergunta"
                  type="text"
                  placeholder="Qual a dúvida?"
                  value={formulario.pergunta}
                  onChange={alterarCampo}
                  maxLength={200}
                  required
                />
              </div>

              <div className="duvidas_campo">
                <label htmlFor="resposta">
                  RESPOSTA
                </label>

                <textarea
                  id="resposta"
                  name="resposta"
                  placeholder="Resposta para o visitante..."
                  value={formulario.resposta}
                  onChange={alterarCampo}
                  required
                />
              </div>

              <div className="duvidas_campos_linha">

                <div className="duvidas_campo">
                  <label htmlFor="categoria">
                    CATEGORIA
                  </label>

                  <select
                    id="categoria"
                    name="categoria"
                    value={formulario.categoria}
                    onChange={alterarCampo}
                  >
                    <option value="Geral">Geral</option>
                    <option value="Funcionamento">Funcionamento</option>
                    <option value="Ingressos">Ingressos</option>
                    <option value="Atrações">Atrações</option>
                    <option value="Localização">Localização</option>
                    <option value="Acessibilidade">Acessibilidade</option>
                  </select>
                </div>

                <div className="duvidas_campo">
                  <label htmlFor="ordemExibicao">
                    ORDEM DE EXIBIÇÃO
                  </label>

                  <input
                    id="ordemExibicao"
                    name="ordemExibicao"
                    type="number"
                    min="1"
                    value={formulario.ordemExibicao}
                    onChange={alterarCampo}
                    required
                  />
                </div>

              </div>

              {mensagem && (
                <p className="duvidas_erro">{mensagem}</p>
              )}

              <div className="duvidas_modal_acoes">

                <button
                  type="button"
                  className="duvidas_cancelar"
                  onClick={() => setModalAberto(false)}
                  disabled={salvando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="duvidas_salvar"
                  disabled={salvando}
                >
                  ✓ {salvando ? "Salvando..." : "Salvar"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDuvidas;
