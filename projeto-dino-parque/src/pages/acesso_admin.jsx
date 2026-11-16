
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../assets/mobile.css";
import "../assets/styles.css";

import Brasao_ararangua from "../assets/Brasao_ararangua.jpg";
import useLogin from "../hooks/useLogin";

function AcessoAdmin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  const { login, carregando, erro } = useLogin();

  async function handleLogin(event) {
    event.preventDefault();

    const sucesso = await login(email, senha);

    if (sucesso) {
      navigate("/admin/admin_noticia");
    }
  }

  return (
    <div className="acesso_admin_pag">

      <div className="centro_pag_acesso_admin">

        <img
          src={Brasao_ararangua}
          width="80"
          height="80"
          alt="Brasão de Araranguá"
        />

        <h1>Dino Parque</h1>
        <h2>Área Administrativa</h2>

        <form onSubmit={handleLogin}>

          <div className="campo_login">
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="campo_login">
            <label htmlFor="senha">Senha</label>

            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {erro && (
            <p className="erro_login">{erro}</p>
          )}

          <button type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default AcessoAdmin;
