import { useState, useEffect } from "react";

const API_URL = "/api/agenda";

function useAgenda() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // BUSCAR EVENTOS
  async function buscarEventos() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch(API_URL);

      if (!resposta.ok) {
        throw new Error("Não foi possível carregar os eventos.");
      }

      const dados = await resposta.json();

      setEventos(Array.isArray(dados) ? dados : []);

    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarEventos();
  }, []);

  // CADASTRAR OU EDITAR EVENTO
  async function salvarEvento(dados, id = null) {
    try {
      setErro("");
      setMensagem("");

      const resposta = await fetch(
        id ? `${API_URL}/${id}` : API_URL,
        {
          method: id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dados)
        }
      );

      if (!resposta.ok) {
        throw new Error("Não foi possível salvar o evento.");
      }

      setMensagem(
        id
          ? "Evento atualizado com sucesso!"
          : "Evento cadastrado com sucesso!"
      );

      await buscarEventos();

      return true;

    } catch (error) {
      setErro(error.message);
      return false;
    }
  }

  // EXCLUIR EVENTO
  async function removerEvento(id) {
    try {
      setErro("");
      setMensagem("");

      const resposta = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!resposta.ok) {
        throw new Error("Não foi possível remover o evento.");
      }

      setMensagem("Evento removido com sucesso!");

      await buscarEventos();

      return true;

    } catch (error) {
      setErro(error.message);
      return false;
    }
  }

  return {
    eventos,
    carregando,
    erro,
    mensagem,
    salvarEvento,
    removerEvento
  };
}

export default useAgenda;