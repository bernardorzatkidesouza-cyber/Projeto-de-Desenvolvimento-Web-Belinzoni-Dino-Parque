
import { useState, useEffect } from "react";
import { pegar, enviar } from "../services/api";

export const coresPadrao = {
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

function aplicarCores(cores) {
  Object.entries(variaveisCSS).forEach(([nome, variavel]) => {
    document.documentElement.style.setProperty(
      variavel,
      cores[nome] || coresPadrao[nome]
    );
  });
}

function useTema() {
  const [cores, setCores] = useState(coresPadrao);
  const [carregandoTema, setCarregandoTema] = useState(true);

  useEffect(() => {
    async function carregarTema() {
      try {
        const dados = await pegar("/configuracoes-site");
        const novasCores = {
          ...coresPadrao,
          ...(dados.cores || {}),
        };

        setCores(novasCores);
        aplicarCores(novasCores);
      } catch {
        const salvas = localStorage.getItem("temaSite");
        if (salvas) {
          const novasCores = {
            ...coresPadrao,
            ...JSON.parse(salvas),
          };
          setCores(novasCores);
          aplicarCores(novasCores);
        } else {
          aplicarCores(coresPadrao);
        }
      } finally {
        setCarregandoTema(false);
      }
    }

    carregarTema();

    function receberTema(evento) {
      setCores(evento.detail);
      aplicarCores(evento.detail);
    }

    window.addEventListener("tema-atualizado", receberTema);

    return () => {
      window.removeEventListener("tema-atualizado", receberTema);
    };
  }, []);

  async function alterarCor(nome, valor) {
    const novasCores = {
      ...cores,
      [nome]: valor,
    };

    setCores(novasCores);
    aplicarCores(novasCores);
    localStorage.setItem("temaSite", JSON.stringify(novasCores));

    window.dispatchEvent(
      new CustomEvent("tema-atualizado", {
        detail: novasCores,
      })
    );

    try {
      await enviar("/configuracoes-site", "PUT", {
        cores: novasCores,
      });
    } catch (erro) {
      console.error("Erro ao salvar cores:", erro);
    }
  }

  async function restaurarCores() {
    setCores(coresPadrao);
    aplicarCores(coresPadrao);
    localStorage.setItem("temaSite", JSON.stringify(coresPadrao));

    window.dispatchEvent(
      new CustomEvent("tema-atualizado", {
        detail: coresPadrao,
      })
    );

    try {
      await enviar("/configuracoes-site", "PUT", {
        cores: coresPadrao,
      });
    } catch (erro) {
      console.error("Erro ao restaurar cores:", erro);
    }
  }

  return {
    cores,
    alterarCor,
    restaurarCores,
    carregandoTema,
  };
}

export default useTema;
