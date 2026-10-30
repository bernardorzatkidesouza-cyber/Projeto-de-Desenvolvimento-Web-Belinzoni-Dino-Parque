
import { useState, useEffect, useCallback } from "react";

function useNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // GET - Buscar notícias
  const buscarNoticias = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);

      const resposta = await fetch("/noticias");

      if (!resposta.ok) {
        throw new Error("Erro ao buscar notícias");
      }

      const dados = await resposta.json();
      setNoticias(dados);

    } catch (erro) {
      setErro(erro.message);
      console.error("Erro ao buscar notícias:", erro);
    } finally {
      setCarregando(false);
    }
  }, []);

  // POST - Cadastrar notícia
  async function cadastrarNoticia(dados) {
    const resposta = await fetch("/noticias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
      throw new Error("Erro ao cadastrar notícia");
    }

    await buscarNoticias();
  }

  // PUT - Atualizar notícia
  async function atualizarNoticia(id, dados) {
    const resposta = await fetch(`/noticias/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
      throw new Error("Erro ao atualizar notícia");
    }

    await buscarNoticias();
  }

  // DELETE - Excluir notícia
  async function removerNoticia(id) {
    const resposta = await fetch(`/noticias/${id}`, {
      method: "DELETE"
    });

    if (!resposta.ok) {
      throw new Error("Erro ao excluir notícia");
    }

    await buscarNoticias();
  }

  useEffect(() => {
    buscarNoticias();
  }, [buscarNoticias]);

  return {
    noticias,
    carregando,
    erro,
    buscarNoticias,
    cadastrarNoticia,
    atualizarNoticia,
    removerNoticia
  };
}

export default useNoticias;
