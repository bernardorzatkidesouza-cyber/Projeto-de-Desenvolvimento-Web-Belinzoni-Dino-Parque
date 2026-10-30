
import "../assets/mobile.css";
import "../assets/styles.css";
import { Link } from "react-router-dom";

function Admin_banner() {
  return (
    <div className="admin_banner">
      <div className="admin_barra_lateral">
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
          Personalize a apresentação principal e as cores usadas no site público.
        </p>
        <div className="admin_banner_dados">
          <h1>Dados do banner</h1>

          <h2>Etiqueta</h2>
          <p>Araranguá · Santa Catarina</p>

          <h2>Título principal</h2>
          <p>[Título do banner — insira aqui]</p>

          <h2>Texto de apresentação</h2>
          <p>Insira aqui o texto de apresentação do parque para os visitantes.</p>

          <h2>URL da imagem</h2>
          <p>https://exemplo.com/banner.jpg</p>
          <p>Recomendado: 1440 × 500 px.</p>
        </div>
        <div className="admin_banner_cores">
          <h1>Paleta de cores</h1>
          <p>Use o seletor ou informe uma cor hexadecimal.</p>

          <h2>Verde principal</h2>
          <p> #1e5c1e</p>
          
          <h2>Verde secundário</h2>
          <p> #2d7a2d</p>

          <h2>Fundo verde claro</h2>
          <p> #e8f5e8</p>

          <h2>Cor de destaque</h2>
          <p> #f0b820</p>

          <h2>Fundo escuro</h2>
          <p> #1a1f14</p>

          <h2>Fundo da página</h2>
          <p> #fafcf8</p>

          <button>Restaurar cores padrão</button>
        </div>
        <div className="admin_banner_preview">
          <p>Araranguá · Santa Catarina</p>
          <h1>[Título do banner — insira aqui]</h1>
          <p>Insira aqui o texto de apresentação do parque para os visitantes.</p>
          <p>Pré-visualização do banner</p>
          <img src="https://exemplo.com/banner.jpg" alt="Imagem do banner" />
        </div>
      </div>

    </div>
  );
}

export default Admin_banner;

