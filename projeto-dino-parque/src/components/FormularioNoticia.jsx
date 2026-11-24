
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { enviarImagem } from "../services/api";

const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const TAMANHO_MAXIMO = 10 * 1024 * 1024; // 10 MB

function FormularioNoticia({ noticia, onSalvar, onFechar }) {

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState("publicado");
  const [arquivo, setArquivo] = useState(null);
  const [preview, setPreview] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erroImagem, setErroImagem] = useState("");

  useEffect(() => {
    setTitulo(noticia?.titulo || "");
    setDescricao(noticia?.descricao || "");
    setImagem(noticia?.imagem || "");
    setArquivo(null);
    setPreview(noticia?.imagem || "");
    setErroImagem("");
    setData(
      noticia?.data
        ? noticia.data.substring(0, 10)
        : new Date().toLocaleDateString("en-CA")
    );
    setStatus(noticia?.status || "publicado");
  }, [noticia]);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function selecionarImagem(event) {
    const escolhido = event.target.files[0];
    if (!escolhido) return;

    if (!TIPOS_ACEITOS.includes(escolhido.type)) {
      setErroImagem("Selecione uma imagem JPG, PNG, WEBP ou GIF.");
      event.target.value = "";
      return;
    }
    if (escolhido.size > TAMANHO_MAXIMO) {
      setErroImagem("A imagem deve ter no máximo 10 MB.");
      event.target.value = "";
      return;
    }

    setErroImagem("");
    setArquivo(escolhido);
    setPreview(URL.createObjectURL(escolhido));
  }

  function removerImagem() {
    setArquivo(null);
    setImagem("");
    setPreview("");
    setErroImagem("");
  }

  async function enviarFormulario(event) {
    event.preventDefault();
    setErroImagem("");
    setSalvando(true);

    try {
      let imagemFinal = imagem;

      if (arquivo) {
        imagemFinal = await enviarImagem(arquivo);
      }

      await onSalvar({
        titulo,
        descricao,
        imagem: imagemFinal,
        data,
        status
      });
    } catch (e) {
      setErroImagem(e.message || "Não foi possível enviar a imagem.");
    } finally {
      setSalvando(false);
    }
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
        <hr/>
        <label>CONTEÚDO</label>

        <textarea
          placeholder="Texto da notícia..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <hr/>
        <label>IMAGEM DE DESTAQUE</label>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={selecionarImagem}
        />

        {preview && (
          <div className="admin_preview">
            <img src={preview} alt="Pré-visualização da imagem" style={{ maxWidth: "100%", maxHeight: 180 }} />
            <button type="button" onClick={removerImagem}>
              Remover imagem
            </button>
          </div>
        )}

        {erroImagem && <p role="alert">{erroImagem}</p>}



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

          <button type="submit" className="botao_salvar" disabled={salvando}>
            {salvando ? "Salvando..." : "✓ Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default FormularioNoticia;
