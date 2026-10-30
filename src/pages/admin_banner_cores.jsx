import "../assets/mobile.css";
import "../assets/styles.css";

function Admin_banner() {
  return (
    <div>
      <p><Link to="/admin/admin_noticia">Notícias</Link></p>
      <p><Link to="/admin/admin_duvidas">Dúvidas</Link></p>
      <p><Link to="/admin/admin_agenda">Agenda</Link></p>
      <p><Link to="/admin/admin_galeria">Galeria de Fotos</Link></p>
      <p><Link to="/admin/admin_informacoes">Informações</Link></p>
      <h1>Banner e Cores</h1>
    </div>
  );
}
export default Admin_banner;