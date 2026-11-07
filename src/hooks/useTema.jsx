
import { useState, useEffect } from "react";

const coresPadrao = {
  verde: "#245c35",
  verdeEscuro: "#173f27",
  verdeClaro: "#eaf3e9",
  dourado: "#d6a62c",
  texto: "#263329",
  textoSuave: "#68756b",
  fundo: "#f6f8f5",
  branco: "#ffffff",
  borda: "#dce5dc",
};

const variaveisCSS = {
  verde: "--verde",
  verdeEscuro: "--verde-escuro",
  verdeClaro: "--verde-claro",
  dourado: "--dourado",
  texto: "--texto",
  textoSuave: "--texto-suave",
  fundo: "--fundo",
  branco: "--branco",
  borda: "--borda",
};

function useTema() {
  const [cores, setCores] = useState(() => {
    try {
      const salvas = localStorage.getItem("temaSite");

      return salvas
        ? { ...coresPadrao, ...JSON.parse(salvas) }
        : coresPadrao;
    } catch {
      return coresPadrao;
    }
  });

  useEffect(() => {
    const raiz = document.documentElement;

    Object.entries(variaveisCSS).forEach(([nome, variavel]) => {
      raiz.style.setProperty(variavel, cores[nome]);
    });

    localStorage.setItem("temaSite", JSON.stringify(cores));
  }, [cores]);

  function alterarCor(nome, valor) {
    setCores((anterior) => ({
      ...anterior,
      [nome]: valor,
    }));
  }

  function restaurarCores() {
    setCores({ ...coresPadrao });
  }

  return {
    cores,
    alterarCor,
    restaurarCores,
  };
}

export default useTema;
