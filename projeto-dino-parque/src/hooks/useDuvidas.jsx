import { useState, useEffect, useCallback } from "react";
import { pegar, enviar } from "../services/api";

function normalizarDuvida(item) {
  return {
    ...item,
    id: item.id ?? item.id_perguntas_frequentes,
    ordemExibicao: item.ordemExibicao ?? item.ordem_exibicao ?? 0,
    categoria: item.categoria || "Geral",
    status: item.status || "publicado",
  };
}

function useDuvidas() {
  const [duvidas, setDuvidas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const buscarDuvidas = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");
      const dados = await pegar("/api/perguntas_frequentes");
      setDuvidas((Array.isArray(dados) ? dados : []).map(normalizarDuvida));
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { buscarDuvidas(); }, [buscarDuvidas]);

  async function adicionarDuvida(duvida) {
    await enviar("/api/perguntas_frequentes", "POST", {
      pergunta: duvida.pergunta,
      resposta: duvida.resposta,
      categoria: String(duvida.categoria || "geral").toLowerCase(),
      ordem_exibicao: Number(duvida.ordemExibicao ?? duvida.ordem_exibicao) || 0,
    });
    await buscarDuvidas();
  }

  async function atualizarDuvida(id, duvida) {
    await enviar(`/api/perguntas_frequentes/${id}`, "PUT", {
      pergunta: duvida.pergunta,
      resposta: duvida.resposta,
      categoria: String(duvida.categoria || "geral").toLowerCase(),
      ordem_exibicao: Number(duvida.ordemExibicao ?? duvida.ordem_exibicao) || 0,
    });
    await buscarDuvidas();
  }

  async function excluirDuvida(id) {
    await enviar(`/api/perguntas_frequentes/${id}`, "DELETE");
    await buscarDuvidas();
  }

  return { duvidas, carregando, erro, buscarDuvidas, adicionarDuvida, atualizarDuvida, excluirDuvida };
}

export default useDuvidas;
