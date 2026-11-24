
import { useEffect, useRef, useState } from "react";
import useGaleria from "../hooks/useGaleria";
import { Link } from "react-router-dom";
import "../assets/mobile.css";
import "../assets/styles.css";
import Brasao_ararangua from "../assets/Brasao_ararangua.png";
import { enviarImagem } from "../services/api";

const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const TAMANHO_MAXIMO = 10 * 1024 * 1024; // 10 MB

function AdminGaleria() {
  const [arquivo, setArquivo] = useState(null);
  const [preview, setPreview] = useState("");
  const [enviando, setEnviando] = useState(false);
  const inputArquivo = useRef(null);
  const [legenda, setLegenda] = useState("");
  const [mensagem, setMensagem] = useState("");
  const { fotos, carregando, erro, adicionarFoto, excluirFoto } = useGaleria();

  useEffect(() => {
  return () => {
    if (preview) URL.revokeObjectURL(preview);
  };
}, [preview]);

  function selecionarArquivo(e) {
    const escolhido = e.target.files[0];
    if (!escolhido) return;

    if (!TIPOS_ACEITOS.includes(escolhido.type)) {
      setMensagem("Selecione uma imagem JPG, PNG, WEBP ou GIF.");
      e.target.value = "";
      return;
    }
    if (escolhido.size > TAMANHO_MAXIMO) {
      setMensagem("A imagem deve ter no máximo 10 MB.");
      e.target.value = "";
      return;
    }

    setMensagem("");
    setArquivo(escolhido);
    setPreview(URL.createObjectURL(escolhido));
  }

  async function handleAdicionarFoto(e) {
    e.preventDefault();
    setMensagem("");
    if (!arquivo) {
      setMensagem("Selecione uma imagem.");
      return;
    }
    try {
      setEnviando(true);
      const url = await enviarImagem(arquivo);
      await adicionarFoto({ imagem: url, legenda: legenda.trim() });

      setArquivo(null);
      setPreview("");
      setLegenda("");
      if (inputArquivo.current) inputArquivo.current.value = "";
      setMensagem("Foto cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar foto:", error);
      setMensagem(error.message || "Não foi possível cadastrar a foto.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleExcluirFoto(id) {
    setMensagem("");
    try {
      await excluirFoto(id);
      setMensagem("Foto excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir foto:", error);
      setMensagem(error.message || "Não foi possível excluir a foto.");
    }
  }

  return (
    <div className="admin_galeria">

      <aside className="admin_barra_lateral">
        <img 
          src = {Brasao_ararangua}
          width="80"
          height="80"
        />
        <h2>Dino Parque</h2>
        <p>ADMINISTRAÇÃO</p>
        <hr />

        <p><Link to="/admin/admin_noticia">Notícias</Link></p>
        <p><Link to="/admin/admin_duvidas">Dúvidas</Link></p>
        <p><Link to="/admin/admin_galeria">Galeria de Fotos</Link></p>
        <p><Link to="/admin/admin_informacoes">Informações</Link></p>
        <p><Link to="/admin/admin_banner">Banner e Cores</Link></p>

        <hr />
        <p><Link to="/">Sair para o Site</Link></p>
      </aside>

      <main className="admin_conteudo">
        <h1>Galeria de Fotos</h1>
        <p>Cadastre e gerencie as fotos do Dino Parque Belinzoni.</p>

        <section className="admin_formulario">
          <h2>Adicionar nova foto</h2>

          <form onSubmit={handleAdicionarFoto}>
            <label htmlFor="urlImagem">URL da imagem</label>

            <label htmlFor="arquivoImagem">Imagem</label>

            <input
              id="arquivoImagem"
              ref={inputArquivo}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={selecionarArquivo}
              required
            />

            {preview && (
              <div className="admin_preview">
                <p>Pré-visualização:</p>
                <img src={preview} alt="Pré-visualização da imagem" />
              </div>
            )}

            <label htmlFor="legenda">Legenda da foto</label>

            <input
              id="legenda"
              type="text"
              placeholder="Digite uma legenda (opcional)"
              value={legenda}
              onChange={(e) => setLegenda(e.target.value)}
            />

            <button type="submit" disabled={enviando}>
              {enviando ? "Enviando..." : "Cadastrar foto"}
            </button>
          </form>

          {mensagem && <p role="status">{mensagem}</p>}
          {erro && <p role="alert">{erro}</p>}
        </section>

        <section className="admin_lista_fotos">
          <h2>Fotos cadastradas ({fotos.length})</h2>

          {carregando ? (
            <p>Consultando a API e carregando fotos...</p>
          ) : fotos.length === 0 ? (
            <p>Nenhuma foto cadastrada.</p>
          ) : (
            <div className="galeria_lista">
              {fotos.map((foto) => (
                <div className="galeria_imagens" key={foto.id}>
                  <img
                    className="galeria_imagem"
                    src={foto.imagem}
                    alt={foto.legenda || "Foto do parque"}
                  />
                  {foto.legenda && <p className="galeria_legenda">{foto.legenda}</p>}
                  <button type="button" onClick={() => handleExcluirFoto(foto.id)}>
                    Excluir foto
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

    </div>
  );
}

export default AdminGaleria;
