
import { Link } from "react-router-dom";
import "../assets/mobile.css";
import "../assets/styles.css";
import Brasao_ararangua from '../assets/Brasao_ararangua.jpg';

function AdminInformacoes() {
  return (
    <div className="admin_informacoes">
      <div className="admin_barra_lateral">
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
        <p><Link to="/admin/admin_banner">Banner e Cores</Link></p>
        <p><Link to="/admin/admin_agenda">Agenda de Eventos</Link></p>

        <hr />

        <p><Link to="/">Sair para o Site</Link></p>
      </div>

      <div className="admin_conteudo">

        <h1>Informações do Parque</h1>
        <p>Estas informações aparecem na seção de contato e no rodapé do site.</p>

        <div className="informacoes_formulario">

          <h3>Endereço</h3>
          <p>[Rua, número — Bairro, Araranguá/SC]</p>

          <h3>Telefone</h3>
          <p>[Número de contato]</p>

          <h3>E-mail</h3>
          <p>[E-mail do parque]</p>

          <button
            className="admin_button"
            type="button"
          >
            Salvar informações
          </button>

        </div>

        <div className="informacoes_preview">

          <h3>Pré-visualização</h3>

          <p>📍[Rua, número — Bairro, Araranguá/SC]</p>
          <p>📞[Número de contato]</p>
          <p>✉️[E-mail do parque]</p>

        </div>

      </div>

    </div>
  );
}

export default AdminInformacoes;
