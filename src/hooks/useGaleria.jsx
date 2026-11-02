
import { useState, useEffect, useCallback } from "react";

// A API deve disponibilizar GET, POST e DELETE em /api/galeria.
// O proxy do Vite encaminha essas chamadas para o backend (porta 3000 por padrão).
const API_URL = "/api/galeria";

function normalizarFoto(foto) {
  return {
    id: foto.id ?? foto.id_foto,
    imagem: foto.imagem ?? foto.imagem_url,
    legenda: foto.legenda ?? "",
  };
}

export default function useGaleria() {
  const [fotos, setFotos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const buscarFotos = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await fetch(API_URL);
      if (!resposta.ok) {
        throw new Error(`Não foi possível carregar as fotos (HTTP ${resposta.status}).`);
      }
      const dados = await resposta.json();
      if (!Array.isArray(dados)) {
        throw new Error("A API não retornou uma lista de fotos.");
      }
      setFotos(dados.map(normalizarFoto));
    } catch (error) {
      console.error("Erro ao consultar a API da galeria:", error);
      setFotos([]);
      setErro(error.message || "Não foi possível conectar à API da galeria.");
    } finally {
      setCarregando(false);
    }
  }, []);

  const adicionarFoto = async (foto) => {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagem_url: foto.imagem, legenda: foto.legenda }),
    });
    if (!resposta.ok) {
      throw new Error(`Não foi possível cadastrar a foto (HTTP ${resposta.status}).`);
    }
    await buscarFotos();
  };

  const excluirFoto = async (id) => {
    const resposta = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!resposta.ok) {
      throw new Error(`Não foi possível excluir a foto (HTTP ${resposta.status}).`);
    }
    await buscarFotos();
  };

  useEffect(() => {
    buscarFotos();
  }, [buscarFotos]);

  return { fotos, carregando, erro, buscarFotos, adicionarFoto, excluirFoto };
}
