
import { useState, useEffect, useCallback } from "react";

const API_URL = "/perguntas-frequentes";

function useDuvidas() {
  const [duvidas, setDuvidas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // BUSCAR DÚVIDAS
  const buscarDuvidas = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch(API_URL);

      if (!resposta.ok) {
        throw new Error("Não foi possível buscar as dúvidas.");
      }

      const dados = await resposta.json();

      setDuvidas(
        Array.isArray(dados) ? dados : dados.content || []
      );
    } catch (erro) {
      setErro(erro.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscarDuvidas();
  }, [buscarDuvidas]);

  // CADASTRAR DÚVIDA
    async function adicionarDuvida(duvida) {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...duvida,
                titulo: duvida.pergunta.substring(0, 200),
                status: "publicado",
            }),
        });

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar a dúvida.");
        }

        await buscarDuvidas();
    }

  // EDITAR DÚVIDA
    async function atualizarDuvida(id, duvida) {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...duvida,
                titulo: duvida.pergunta.substring(0, 200),
                status: "publicado",
            }),
        });

        if (!resposta.ok) {
            throw new Error("Erro ao atualizar a dúvida.");
        }

        await buscarDuvidas();
    }

  // EXCLUIR DÚVIDA
  async function excluirDuvida(id) {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) {
      throw new Error("Erro ao excluir a dúvida.");
    }

    await buscarDuvidas();
  }

  return {
    duvidas,
    carregando,
    erro,
    buscarDuvidas,
    adicionarDuvida,
    atualizarDuvida,
    excluirDuvida,
  };
}

export default useDuvidas;
