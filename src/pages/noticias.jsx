import ".../assets/mobile.css";
import "../assets/styles.css";
function Noticias() {
  return (
    <div className="tela-principal">
      <header className="menu">
        <div className="menu__body">
          <img /> {/*logo prefeitura*/}
          <h1 className="menu__title">
            Prefeitura de Araranguá
            <span>Dino Parque Belinzoni</span>
          </h1>

          <nav className="menu__links">
            <a href="#tela_principal">Inicio</a>
            <a href="#galeria">Galeria</a>
            <a href="#agenda">Agenda</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>
        </div>
      </header>

      
        <div className="noticia">
            <p>comunicação</p>
            <h2>Notícias do Parque</h2>
            <p>Fique por dentro de tudo que acontece no Dino Parque Belinzoni</p>

            <div className="corpo_noticia">
                <img className="noticia_imagem"/>
                <div className="texto_total_noticia">
                    <date className="noticia_data" >
                        12/08/2026
                    </date>

                    <h1 className="noticia_title">
                        [Título da notícia — insira aqui]
                    </h1>

                    <p className="noticia_description">
                        Insira aqui o texto completo da notícia sobre o parque.
                    </p>
                </div>
            </div>
        </div>
        
    </div>
  );
}

export default Noticias;
