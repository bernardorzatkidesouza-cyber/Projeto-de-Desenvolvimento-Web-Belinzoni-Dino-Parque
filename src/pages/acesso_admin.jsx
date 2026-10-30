
import "../assets/mobile.css";
import "../assets/styles.css";
import { Link } from "react-router-dom";
function AcessoAdmin() {
  return (
    <div className="acesso_admin_pag">
      

      <div className="centro_pag_acesso_admin">
            
            <img />{/*logo prefeitura*/}
            <h1>Dino Parque</h1>
            <p>Área Administrativa</p>
            <label htmlFor="email">Endereço de e-mail</label>
            <input name="email" id="email" type="text" placeholder="user@email.com"/>

            <label htmlFor="senha"> Senha </label>
            <input name="senha" id="senha" type="password"/>

            <Link to={`/admin/admin_noticia`}>entrar</Link>
      </div>
    </div>
  );
}

export default AcessoAdmin;
