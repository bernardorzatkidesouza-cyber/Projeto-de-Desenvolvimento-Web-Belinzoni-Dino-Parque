
import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/mobile.css";
import "../assets/styles.css";

function AdminGaleria() {
  const [urlImagem, setUrlImagem] = useState("");
  const [legenda, setLegenda] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [fotos, setFotos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("galeriaFotos")) || [];
    } catch {
      return [];
    }
  });

  function cadastrarFoto(event) {
    event.preventDefault();

    if (!urlImagem.trim()) {
      setMensagem("Insira a URL da imagem.");
      return;
    }

    const novaFoto = {
      id: crypto.randomUUID(),
      imagem: urlImagem.trim(),
      legenda: legenda.trim(),
    };

    const fotosAtualizadas = [...fotos, novaFoto];

    localStorage.setItem(
      "galeriaFotos",
      JSON.stringify(fotosAtualizadas)
    );

    setFotos(fotosAtualizadas);
    setUrlImagem("");
    setLegenda("");
    setMensagem("Foto cadastrada com sucesso!");
  }

  function excluirFoto(id) {
    const fotosAtualizadas = fotos.filter((foto) => foto.id !== id);

    localStorage.setItem(
      "galeriaFotos",
      JSON.stringify(fotosAtualizadas)
    );

    setFotos(fotosAtualizadas);
    setMensagem("Foto excluída.");
  }

  return (
    <div className="admin_agenda">
      <div className="admin_barra_lateral">
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
      </div>

      <div className="admin_conteudo">
        <h1>Galeria de Fotos</h1>

        <form onSubmit={cadastrarFoto}>
          <div className="admin_galeria_card">
            <label htmlFor="urlImagem">URL da imagem</label>
            <div className="admin_galeria_url">
              <input
                id="urlImagem"
                type="url"
                placeholder="Insira a URL da imagem"
                value={urlImagem}
                onChange={(event) => {
                  setUrlImagem(event.target.value);
                  setMensagem("");
                }}
                required
              />
            </div>

            <label htmlFor="legenda">Legenda (opcional)</label>
            <div className="admin_galeria_legenda">
              <input
                id="legenda"
                type="text"
                placeholder="Insira a legenda da imagem"
                value={legenda}
                onChange={(event) => setLegenda(event.target.value)}
              />
            </div>

            <div className="admin_galeria_previsualizacao">
              {urlImagem.trim() ? (
                <img
                  src={urlImagem}
                  alt={legenda || "Pré-visualização da imagem"}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display = "block";
                  }}
                />
              ) : (
                <p>A pré-visualização aparecerá aqui.</p>
              )}
            </div>

            <button type="submit">Cadastrar foto</button>

            {mensagem && <p role="status">{mensagem}</p>}
          </div>
        </form>

        <h2>Fotos cadastradas ({fotos.length})</h2>

        <div className="galeria_lista">
          {fotos.map((foto) => (
            <div className="galeria_imagens" key={foto.id}>
              <img
                className="galeria_imagem"
                src={foto.imagem}
                alt={foto.legenda || "Foto do parque"}
              />

              <p className="galeria_legenda">
                {foto.legenda || "Sem legenda"}
              </p>

              <button
                type="button"
                onClick={() => excluirFoto(foto.id)}
              >
                Excluir foto
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminGaleria;
