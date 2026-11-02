
import { useState } from "react";
import useGaleria from "../hooks/useGaleria";
import { Link } from "react-router-dom";
import "../assets/mobile.css";
import "../assets/styles.css";
import Brasao_ararangua from '../assets/Brasao_ararangua.jpg';

function AdminGaleria() {
  const [urlImagem, setUrlImagem] = useState("");
  const [legenda, setLegenda] = useState("");
  const [mensagem, setMensagem] = useState("");
  const { fotos, carregando, erro, adicionarFoto, excluirFoto } = useGaleria();

  async function handleAdicionarFoto(e) {
    e.preventDefault();
    setMensagem("");
    if (!urlImagem.trim()) {
      setMensagem("Informe a URL da imagem.");
      return;
    }
    try {
      await adicionarFoto({ imagem: urlImagem.trim(), legenda: legenda.trim() });
      setUrlImagem("");
      setLegenda("");
      setMensagem("Foto cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar foto:", error);
      setMensagem(error.message || "Não foi possível cadastrar a foto.");
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

            <input
              id="urlImagem"
              type="url"
              placeholder="Cole aqui o link da imagem"
              value={urlImagem}
              onChange={(e) => setUrlImagem(e.target.value)}
              required
            />

            {urlImagem.trim() && (
              <div className="admin_preview">
                <p>Pré-visualização:</p>
                <img
                  src={urlImagem}
                  alt="Pré-visualização da imagem"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = "block";
                  }}
                />
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

            <button type="submit">
              Cadastrar foto
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
