import { useState } from "react";

function useLogin() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function login(email, senha) {
    setCarregando(true);
    setErro("");
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const dados = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(dados.erro || "E-mail ou senha incorretos.");

      localStorage.setItem("token", dados.token);
      localStorage.setItem("adminAutenticado", "true");
      localStorage.setItem("adminNome", dados.nome);
      localStorage.setItem("adminNivel", dados.nivel);
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    } finally {
      setCarregando(false);
    }
  }

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("adminAutenticado");
    localStorage.removeItem("adminNome");
    localStorage.removeItem("adminNivel");
  }

  return { login, sair, carregando, erro };
}

export default useLogin;
