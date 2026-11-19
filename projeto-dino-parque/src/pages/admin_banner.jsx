
import { useEffect, useState } from "react";
import "../assets/mobile.css";
import "../assets/styles.css";

import { Link } from "react-router-dom";
import Brasao_ararangua from "../assets/Brasao_ararangua.png";

import useTema from "../hooks/useTema";
import { pegar, enviar, enviarImagem } from "../services/api";

function Admin_banner() {
  const { cores, alterarCor, restaurarCores } = useTema();

  const [banner, setBanner] = useState({
    titulo: "Araranguá · Santa Catarina",
    subtitulo: "Dino Parque Belinzoni",
    texto: "Entrada gratuita!",
    imagem: "",
  });

  const [arquivo, setArquivo] = useState(null);
  const [preview, setPreview] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const opcoesCores = [
    { nome: "verde", titulo: "Verde principal" },
    { nome: "verdeEscuro", titulo: "Verde escuro" },
    { nome: "verdeClaro", titulo: "Verde claro" },
    { nome: "dourado", titulo: "Dourado / Destaque" },
    { nome: "texto", titulo: "Cor do texto" },
    { nome: "textoSuave", titulo: "Texto secundário" },
    { nome: "fundo", titulo: "Fundo do site" },
    { nome: "branco", titulo: "Branco" },
    { nome: "borda", titulo: "Cor das bordas" },
  ];

  useEffect(() => {
    async function carregarBanner() {
      try {
        const dados = await pegar("/configuracoes-site");

        setBanner({
          titulo: dados.titulo || "Araranguá · Santa Catarina",
          subtitulo: dados.subtitulo || "Dino Parque Belinzoni",
          texto: dados.texto || "Entrada gratuita!",
          imagem: dados.imagem || "",
        });

        setPreview(dados.imagem || "");
      } catch (erro) {
        console.error("Erro ao carregar banner:", erro);
      }
    }

    carregarBanner();
  }, []);

  function selecionarImagem(evento) {
    const imagem = evento.target.files[0];

    if (!imagem) return;

    if (!imagem.type.startsWith("image/")) {
      setMensagem("Selecione um arquivo de imagem válido.");
      return;
    }

    if (imagem.size > 5 * 1024 * 1024) {
      setMensagem("A imagem deve ter no máximo 5 MB.");
      return;
    }

    setArquivo(imagem);
    setPreview(URL.createObjectURL(imagem));
    setMensagem("");
  }

  async function salvarBanner() {
    try {
      setSalvando(true);
      setMensagem("");

      let imagemFinal = banner.imagem;

      if (arquivo) {
        imagemFinal = await enviarImagem(arquivo);
      }

      const dados = {
        ...banner,
        imagem: imagemFinal,
      };

      await enviar("/configuracoes-site", "PUT", dados);

      setBanner(dados);
      setArquivo(null);
      setPreview(imagemFinal);

      setMensagem("Banner atualizado com sucesso!");
    } catch (erro) {
      setMensagem("Erro ao salvar: " + erro.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="admin_banner">

      <div className="admin_barra_lateral">
        <img
          src={Brasao_ararangua}
          width="80"
          height="80"
          alt="Brasão de Araranguá"
        />

        <h2>Dino Parque</h2>
        <p>ADMINISTRAÇÃO</p>

        <hr />
        <p><Link to="/admin/admin_noticia">Notícias</Link></p>
        <p><Link to="/admin/admin_agenda">Agenda</Link></p>
        <p><Link to="/admin/admin_duvidas">Dúvidas</Link></p>
        <p><Link to="/admin/admin_galeria">Galeria de Fotos</Link></p>
        <p><Link to="/admin/admin_informacoes">Informações</Link></p>
        <hr />

        <p><Link to="/">Sair para o Site</Link></p>
      </div>

      <div className="admin_conteudo">

        <h1>Banner e Cores</h1>

        <p>Personalize o banner inicial e as cores de todo o Dino Parque.</p>

        <div className="admin_banner_dados">

          <h2>Imagem e informações do banner</h2>

          <label>Título pequeno</label>
          <input
            type="text"
            value={banner.titulo}
            onChange={(e) =>
              setBanner({ ...banner, titulo: e.target.value })
            }
          />

          <label>Título principal</label>
          <input
            type="text"
            value={banner.subtitulo}
            onChange={(e) =>
              setBanner({ ...banner, subtitulo: e.target.value })
            }
          />

          <label>Texto de destaque</label>
          <input
            type="text"
            value={banner.texto}
            onChange={(e) =>
              setBanner({ ...banner, texto: e.target.value })
            }
          />

          <label>Foto do banner</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={selecionarImagem}
          />

          {preview && (
            <div className="preview_imagem_banner">
              <img src={preview} alt="Prévia do banner" />
            </div>
          )}

          <button onClick={salvarBanner} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar banner"}
          </button>

          {mensagem && <p role="status">{mensagem}</p>}

        </div>

        <div className="admin_banner_cores">

          <h2>Paleta de cores global</h2>

          <p>As alterações serão aplicadas em todas as páginas do site.</p>

          {opcoesCores.map((opcao) => (
            <div className="seletor_cor" key={opcao.nome}>

              <label htmlFor={opcao.nome}>
                {opcao.titulo}
              </label>

              <input
                id={opcao.nome}
                type="color"
                value={cores[opcao.nome]}
                onChange={(e) =>
                  alterarCor(opcao.nome, e.target.value)
                }
              />

              <span>{cores[opcao.nome]}</span>

            </div>
          ))}

          <button onClick={restaurarCores}>Restaurar cores padrão</button>
        </div>

        <div className="admin_banner_preview">
          <h2>Pré-visualização do banner</h2>

          <div
            className="preview_tema"
            style={{
              backgroundImage: preview
                ? `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url("${preview}")`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2>{banner.titulo}</h2>
            <h3>{banner.subtitulo}</h3>
            <p>{banner.texto}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin_banner;
