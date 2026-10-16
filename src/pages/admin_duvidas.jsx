import ".../assets/mobile.css";
import "../assets/styles.css";

function AdminDuvidas() {
  return (
    <div className="admin_duvidas">
      <div className="admin_barra_lateral">
        <h2>Dino Parque</h2>
        <p>ADMINISTRAÇÃO</p>
        <hr />
        <p><a href="#">Notícias</a></p>
        <p><a href="#">Dúvidas </a></p>
        <p><a href="#">Agenda</a></p>
        <p><a href="#">Galeria de Fotos</a></p>
        <p><a href="#">Informações</a></p>
        <p><a href="#">Banner e Cores</a></p>
        <hr />
        <p><a href="#">Sair para o Site</a></p>
      </div>

      <div className="admin_conteudo">
        <h1>Dúvidas Frequentes</h1>

        <button className="admin_button" type="button">
          + Nova Dúvida
        </button>

        <div className="admin_agenda_card">
          <span className="duvida_status">geral</span>
          <h3 className="duvidas_title">
            Título da dúvida
          </h3>
          <p className="duvidas_conteudo">
            Insira aqui o texto completo da dúvida sobre o parque....
          </p>
          <button type="button">Editar</button>
          <button type="button">Remover</button>
        </div>
      </div>
    </div>
  );
}

export default AdminDuvidas;
