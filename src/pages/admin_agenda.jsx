import "../assets/mobile.css";
import "../assets/styles.css";
import { Link } from "react-router-dom";
function AdminAgenda() {
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
        <p><a href="#">Sair para o Site</a></p>
      </div>

      <div className="admin_conteudo">
            <h1>Agenda de Eventos</h1>

            <button className="admin_button" type="button">
            + Novo Evento
            </button>

            <div className="admin_agenda_card">
            <details className="evento_card">
                <p className="data_evento">Data do evento</p>
                <summary className="evento_title">Título do evento</summary>
                <p className="lacal_evento">📍Local do evento</p>
                <p className="hora_evento">🕗Hora do evento</p>
            </details>
            <button type="button">Editar</button>
            <button type="button">Remover</button>
            </div>
      </div>
    </div>
  );
}

export default AdminAgenda;