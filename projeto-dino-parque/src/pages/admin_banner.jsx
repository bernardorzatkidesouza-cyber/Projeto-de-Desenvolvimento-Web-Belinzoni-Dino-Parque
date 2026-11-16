
import "../assets/mobile.css";
import "../assets/styles.css";

import { Link } from "react-router-dom";
import Brasao_ararangua from "../assets/Brasao_ararangua.jpg";

import useTema from "../hooks/useTema";

function Admin_banner() {
  const { cores, alterarCor, restaurarCores } = useTema();

  const opcoesCores = [
    { nome: "verde", titulo: "Verde principal" },
    { nome: "verdeEscuro", titulo: "Verde escuro" },
    { nome: "verdeClaro", titulo: "Verde claro" },
    { nome: "dourado", titulo: "Dourado / Destaque" },
    { nome: "texto", titulo: "Cor do texto" },
    { nome: "textoSuave", titulo: "Texto secundário" },
    { nome: "fundo", titulo: "Fundo administrativo" },
    { nome: "branco", titulo: "Branco" },
    { nome: "borda", titulo: "Cor das bordas" },
  ];

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

        <p>
          Personalize a apresentação principal e as cores utilizadas no site.
        </p>

        <div className="admin_banner_cores">

          <h1>Paleta de cores</h1>

          <p>Selecione uma cor para personalizar o site.</p>

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

          <button onClick={restaurarCores}>
            Restaurar cores padrão
          </button>

        </div>

        <div className="admin_banner_preview">

          <h2>Pré-visualização do tema</h2>

          <div className="preview_tema">
            <h2>Bem-vindo ao Dino Parque</h2>

            <p>
              Conheça o Dino Parque Belinzoni em Araranguá.
            </p>

            <button>Botão de exemplo</button>

            <span>Texto de destaque</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Admin_banner;
