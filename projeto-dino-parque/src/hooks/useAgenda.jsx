import { useState, useEffect, useCallback } from "react";
import { pegar, enviar } from "../services/api";

const API_URL = "/api/agenda";

function useAgenda() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const buscarEventos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");
      const dados = await pegar(API_URL);
      setEventos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { buscarEventos(); }, [buscarEventos]);

  async function salvarEvento(dados, id = null) {
    try {
      setErro("");
      setMensagem("");
      await enviar(id ? `${API_URL}/${id}` : API_URL, id ? "PUT" : "POST", dados);
      setMensagem(id ? "Evento atualizado com sucesso!" : "Evento cadastrado com sucesso!");
      await buscarEventos();
      return true;
    } catch (error) {
      setErro(error.message);
      return false;
    }
  }

  async function removerEvento(id) {
    try {
      setErro("");
      setMensagem("");
      await enviar(`${API_URL}/${id}`, "DELETE");
      setMensagem("Evento removido com sucesso!");
      await buscarEventos();
      return true;
    } catch (error) {
      setErro(error.message);
      return false;
    }
  }

  return { eventos, carregando, erro, mensagem, salvarEvento, removerEvento };
}

export default useAgenda;
