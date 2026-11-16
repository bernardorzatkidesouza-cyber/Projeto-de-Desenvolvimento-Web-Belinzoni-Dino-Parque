import { useState, useEffect } from "react";

function ModalEvento({
  aberto,
  onFechar,
  onSalvar,
  evento,
  erro
}) {
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [titulo, setTitulo] = useState("");
  const [local, setLocal] = useState("");
  const [hora, setHora] = useState("");

  // PREENCHER OS CAMPOS AO EDITAR
  useEffect(() => {
    if (evento) {
      setDia(evento.dia || "");
      setMes(evento.mes || "");
      setTitulo(evento.titulo || "");
      setLocal(evento.local || "");
      setHora(evento.hora || "");
    } else {
      limparFormulario();
    }
  }, [evento, aberto]);

  function limparFormulario() {
    setDia("");
    setMes("");
    setTitulo("");
    setLocal("");
    setHora("");
  }

  // SALVAR FORMULÁRIO
  async function handleSubmit(e) {
    e.preventDefault();

    const dados = {
      dia,
      mes,
      titulo,
      local,
      hora
    };

    const id = evento
      ? evento.id ?? evento.id_evento
      : null;

    const sucesso = await onSalvar(dados, id);

    if (sucesso) {
      limparFormulario();
      onFechar();
    }
  }

  if (!aberto) return null;

  return (
    <div
      className="evento_modal_fundo"
      onClick={onFechar}
    >
      <div
        className="evento_modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>
          {evento ? "Editar Evento" : "Novo Evento"}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* DIA E MÊS */}
          <div className="evento_campos_data">

            <div className="evento_campo">
              <label>DIA</label>

              <input
                type="number"
                min="1"
                max="31"
                placeholder="Ex: 18"
                value={dia}
                onChange={(e) => setDia(e.target.value)}
                required
              />
            </div>

            <div className="evento_campo">
              <label>MÊS</label>

              <input
                type="text"
                placeholder="Ex: AGO"
                value={mes}
                onChange={(e) =>
                  setMes(e.target.value.toUpperCase())
                }
                required
              />
            </div>

          </div>

          {/* TÍTULO */}
          <div className="evento_campo">
            <label>TÍTULO DO EVENTO</label>

            <input
              type="text"
              placeholder="Nome do evento"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          {/* LOCAL */}
          <div className="evento_campo">
            <label>LOCAL</label>

            <input
              type="text"
              placeholder="Local dentro do parque"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              required
            />
          </div>

          {/* HORÁRIO */}
          <div className="evento_campo">
            <label>HORÁRIO</label>

            <input
              type="text"
              placeholder="Ex: 14h às 16h"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
            />
          </div>

          {erro && (
            <p className="evento_modal_erro">
              {erro}
            </p>
          )}

          {/* BOTÕES */}
          <div className="evento_modal_botoes">

            <button
              className="evento_botao_cancelar"
              type="button"
              onClick={onFechar}
            >
              Cancelar
            </button>

            <button
              className="evento_botao_salvar"
              type="submit"
            >
              ✓ Salvar
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default ModalEvento;