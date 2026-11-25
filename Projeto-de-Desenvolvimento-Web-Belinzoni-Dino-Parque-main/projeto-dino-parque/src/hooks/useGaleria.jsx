import { useState, useEffect, useCallback } from "react";
import { pegar, enviar } from "../services/api";

const API_URL = "/api/galeria";

function normalizarFoto(foto) {
  return {
    ...foto,
    id: foto.id ?? foto.id_foto,
    imagem: foto.imagem ?? foto.imagem_url ?? "",
    legenda: foto.legenda ?? "",
  };
}

export default function useGaleria() {
  const [fotos, setFotos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const buscarFotos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");
      const dados = await pegar(API_URL);
      if (!Array.isArray(dados)) throw new Error("A API não retornou uma lista de fotos.");
      setFotos(dados.map(normalizarFoto));
    } catch (error) {
      setFotos([]);
      setErro(error.message || "Não foi possível conectar à API da galeria.");
    } finally {
      setCarregando(false);
    }
  }, []);

  async function adicionarFoto(foto) {
    await enviar(API_URL, "POST", { imagem_url: foto.imagem, legenda: foto.legenda });
    await buscarFotos();
  }

  async function excluirFoto(id) {
    await enviar(`${API_URL}/${encodeURIComponent(id)}`, "DELETE");
    await buscarFotos();
  }

  useEffect(() => { buscarFotos(); }, [buscarFotos]);

  return { fotos, carregando, erro, buscarFotos, adicionarFoto, excluirFoto };
}
