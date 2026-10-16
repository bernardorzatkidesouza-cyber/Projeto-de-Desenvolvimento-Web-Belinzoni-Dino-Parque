import ".../assets/mobile.css";
import "../assets/styles.css";

function AdminGaleria() {
  return (
    <div className="admin_agenda">
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
            <h1>Galeria de Fotos</h1>
            <div className="admin_galeria_card">
                <p>URL da imagem</p>
                <div className="admin_galeria_url">
                    <input type="text" placeholder="Insira a URL da imagem" />
                </div>

                <p>Legenda (opcional)</p>
                <div className="admin_galeria_legenda">
                    <input type="text" placeholder="Insira a legenda da imagem" />
                </div>
            </div>
            <div className="admin_galeria_previsualizacao">
                <img/>{/*previsualização da imagem*/}
            </div>
      </div>
    </div>
  );
}

export default AdminGaleria;