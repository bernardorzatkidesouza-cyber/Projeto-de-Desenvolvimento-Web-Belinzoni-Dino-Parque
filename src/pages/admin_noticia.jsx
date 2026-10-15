
function AdminNoticia() {
  return (
    <div className="admin_noticia">
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
        <h1>Notícias</h1>

        <button className="admin_button" type="button">
          + Nova Notícia
        </button>

        <div className="admin_noticia_card">
          <span className="noticia_status">publicado</span>

          <date className="noticia_data">
            13/08/2026
          </date>

          <h3 className="noticia_title">
            Título da notícia
          </h3>

          <p className="noticia_description">
            Insira aqui o texto completo da notícia sobre o parque....
          </p>

          <button type="button">Editar</button>
          <button type="button">Remover</button>
        </div>
      </div>
    </div>
  );
}

export default AdminNoticia;
