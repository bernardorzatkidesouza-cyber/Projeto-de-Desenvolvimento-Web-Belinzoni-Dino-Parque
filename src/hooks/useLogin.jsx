
import { useState } from "react";

function useLogin() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function login(email, senha) {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, senha }),
      });

      if (!resposta.ok) {
        throw new Error("E-mail ou senha incorretos.");
      }

      sessionStorage.setItem("adminAutenticado", "true");

      return true;

    } catch (error) {
      setErro(error.message);
      return false;

    } finally {
      setCarregando(false);
    }
  }

  return { login, carregando, erro };
}

export default useLogin;
