
import { useState, useEffect, useCallback } from "react";

function useGaleria() {
  const [fotos, setFotos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Buscar fotos
  const buscarFotos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch("/galeria");

      if (!resposta.ok) {
        throw new Error("Não foi possível carregar as fotos.");
      }

      const dados = await resposta.json();

      setFotos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Cadastrar foto
  async function adicionarFoto(foto) {
    const resposta = await fetch("/galeria", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(foto),
    });

    if (!resposta.ok) {
      throw new Error("Não foi possível cadastrar a foto.");
    }

    await buscarFotos();
  }

  // Excluir foto
  async function excluirFoto(id) {
    const resposta = await fetch(`/galeria/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) {
      throw new Error("Não foi possível excluir a foto.");
    }

    await buscarFotos();
  }

  useEffect(() => {
    buscarFotos();
  }, [buscarFotos]);

  return {
    fotos,
    carregando,
    erro,
    buscarFotos,
    adicionarFoto,
    excluirFoto,
  };
}

export default useGaleria;
