import "../assets/mobile.css";
import "../assets/styles.css";

function Galeria() {
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
            <Link to={`/`}>Inicio</Link>
            <Link to={`/noticias`}>Notícias</Link>
          </nav>
        </div>
      </header>


      <div className="galeria">
        <div className="banner_galeria">
          <p>Fotos</p>
          <h1>Galeria do Parque</h1>
          <p>Confira as fotos do Dino Parque Belinzoni</p>
        </div>
        <img className="galeria_imagem"/>
        <p className="galeria_legenda">Legenda </p>
      </div>
    </div>
  );
}

export default Galeria;
