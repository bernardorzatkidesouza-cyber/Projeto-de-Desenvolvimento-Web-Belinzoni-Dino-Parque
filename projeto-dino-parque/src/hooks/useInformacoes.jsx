
import { useState, useEffect } from "react";

const API_URL = "/api/informacoes";

function useInformacoes() {

  const [informacoes, setInformacoes] = useState({
    endereco: "",
    telefone: "",
    email: "",
    horarios: {
<<<<<<< HEAD
      Seg: "",
      TerDom: "",
      Feriado: "",
=======
      segSex: "",
      sabado: "",
      domFeriado: "",
>>>>>>> 42adc20afbc115a94593bbe315119c7fc88508a6
    },
  });

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {

    async function buscarInformacoes() {

      try {
        setCarregando(true);
        setErro("");

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar as informações.");
        }

        const dados = await resposta.json();

        setInformacoes({
          endereco: dados.endereco || "",
          telefone: dados.telefone || "",
          email: dados.email || "",
          horarios: {
<<<<<<< HEAD
            Seg: dados.horarios?.Seg || "",
            TerDom: dados.horarios?.TerDom || "",
            Feriado: dados.horarios?.Feriado || "",
=======
            segSex: dados.horarios?.segSex || "",
            sabado: dados.horarios?.sabado || "",
            domFeriado: dados.horarios?.domFeriado || "",
>>>>>>> 42adc20afbc115a94593bbe315119c7fc88508a6
          },
        });

      } catch (error) {
        console.error("Erro ao buscar informações:", error);
        setErro(error.message);

      } finally {
        setCarregando(false);
      }
    }

    buscarInformacoes();

  }, []);

  return {
    informacoes,
    carregando,
    erro,
  };
}

export default useInformacoes;
