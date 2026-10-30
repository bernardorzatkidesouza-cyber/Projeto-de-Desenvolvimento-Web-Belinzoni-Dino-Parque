import "../assets/mobile.css";
import "../assets/styles.css";

function AdminInformacoes() {
  return (
    <div>
      <p><Link to="/admin/admin_noticia">Notícias</Link></p>
        <p><Link to="/admin/admin_duvidas">Dúvidas</Link></p>
        <p><Link to="/admin/admin_agenda">Agenda</Link></p>
        <p><Link to="/admin/admin_galeria">Galeria de Fotos</Link></p>
        <p><Link to="/admin/admin_banner">Banner e Cores</Link></p>

      <h1>Informações</h1>
    </div>
  );
}
export default AdminInformacoes;