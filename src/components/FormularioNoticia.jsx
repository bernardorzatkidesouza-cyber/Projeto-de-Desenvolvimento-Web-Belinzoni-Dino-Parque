
import { useEffect, useState } from "react";
import Modal from "./Modal";

function FormularioNoticia({ noticia, onSalvar, onFechar }) {

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState("publicado");

  useEffect(() => {
    setTitulo(noticia?.titulo || "");
    setDescricao(noticia?.descricao || "");
    setImagem(noticia?.imagem || "");
    setData(
      noticia?.data
        ? noticia.data.substring(0, 10)
        : new Date().toLocaleDateString("en-CA")
    );
    setStatus(noticia?.status || "publicado");
  }, [noticia]);

  function enviarFormulario(event) {
    event.preventDefault();

    onSalvar({
      titulo,
      descricao,
      imagem,
      data,
      status
    });
  }

  return (
    <Modal
      titulo={noticia ? "Editar Notícia" : "Nova Notícia"}
      onFechar={onFechar}
    >

      <form onSubmit={enviarFormulario}>

        <label>TÍTULO</label>

        <input
          type="text"
          placeholder="Título da notícia"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <label>CONTEÚDO</label>

        <textarea
          placeholder="Texto da notícia..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <label>URL DA IMAGEM</label>

        <input
          type="url"
          placeholder="https://..."
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
        />

        <div className="modal_campos">

          <div>
            <label>DATA</label>

            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
          </div>

          <div>
            <label>STATUS</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="publicado">Publicado</option>
              <option value="rascunho">Rascunho</option>
            </select>
          </div>

        </div>

        <div className="modal_botoes">

          <button
            type="button"
            className="botao_cancelar"
            onClick={onFechar}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="botao_salvar"
          >
            ✓ Salvar
          </button>

        </div>

      </form>

    </Modal>
  );
}

export default FormularioNoticia;
