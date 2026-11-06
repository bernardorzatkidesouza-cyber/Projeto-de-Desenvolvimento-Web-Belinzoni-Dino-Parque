
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../assets/mobile.css";
import "../assets/styles.css";

import Brasao_ararangua from "../assets/Brasao_ararangua.jpg";

const API_URL = "/api/informacoes";

function AdminInformacoes() {

  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  // HORÁRIOS DE FUNCIONAMENTO
  const [horarios, setHorarios] = useState({
    segSex: "",
    sabado: "",
    domFeriado: "",
  });

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // CONSULTAR INFORMAÇÕES NA API
  useEffect(() => {

    async function buscarInformacoes() {

      try {
        setCarregando(true);
        setErro("");

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
          throw new Error(
            "Não foi possível carregar as informações."
          );
        }

        const dados = await resposta.json();

        setEndereco(dados.endereco || "");
        setTelefone(dados.telefone || "");
        setEmail(dados.email || "");

        setHorarios({
          segSex: dados.horarios?.segSex || "",
          sabado: dados.horarios?.sabado || "",
          domFeriado: dados.horarios?.domFeriado || "",
        });

      } catch (error) {

        console.error("Erro ao consultar informações:", error);
        setErro(error.message);

      } finally {

        setCarregando(false);

      }
    }

    buscarInformacoes();

  }, []);

  // ATUALIZAR HORÁRIOS
  function atualizarHorario(campo, valor) {

    setHorarios((horariosAtuais) => ({
      ...horariosAtuais,
      [campo]: valor,
    }));

  }

  // SALVAR INFORMAÇÕES NA API
  async function salvarInformacoes() {

    try {

      setSalvando(true);
      setErro("");
      setMensagem("");

      const resposta = await fetch(API_URL, {

        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          endereco,
          telefone,
          email,
          horarios,
        }),

      });

      if (!resposta.ok) {
        throw new Error(
          "Não foi possível salvar as informações."
        );
      }

      setMensagem("Informações salvas com sucesso!");

    } catch (error) {

      console.error("Erro ao salvar informações:", error);
      setErro(error.message);

    } finally {

      setSalvando(false);

    }
  }

  return (

    <div className="admin_informacoes">

      {/* MENU LATERAL */}
      <div className="admin_barra_lateral">

        <img
          src={Brasao_ararangua}
          alt="Brasão da Prefeitura de Araranguá"
          width="80"
          height="80"
        />

        <h2>Dino Parque</h2>
        <p>ADMINISTRAÇÃO</p>

        <hr />

        <p>
          <Link to="/admin/admin_noticia">
            Notícias
          </Link>
        </p>

        <p>
          <Link to="/admin/admin_duvidas">
            Dúvidas
          </Link>
        </p>

        <p>
          <Link to="/admin/admin_galeria">
            Galeria de Fotos
          </Link>
        </p>

        <p>
          <Link to="/admin/admin_banner">
            Banner e Cores
          </Link>
        </p>

        <p>
          <Link to="/admin/admin_agenda">
            Agenda de Eventos
          </Link>
        </p>

        <hr />

        <p>
          <Link to="/">
            Sair para o Site
          </Link>
        </p>

      </div>

      {/* CONTEÚDO */}
      <div className="admin_conteudo">

        <h1>Informações do Parque</h1>

        <p>
          Estas informações aparecem na seção de contato,
          funcionamento e no rodapé do site.
        </p>

        {carregando ? (

          <p>Carregando informações...</p>

        ) : (

          <div className="informacoes_formulario">

            {/* ENDEREÇO */}
            <h3>Endereço</h3>

            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Digite o endereço do parque"
            />

            {/* TELEFONE */}
            <h3>Telefone</h3>

            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Digite o telefone"
            />

            {/* E-MAIL */}
            <h3>E-mail</h3>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite o e-mail"
            />

            {/* HORÁRIOS */}
            <h2>Horários de funcionamento</h2>

            <h3>Segunda a sexta-feira</h3>

            <input
              type="text"
              value={horarios.segSex}
              onChange={(e) =>
                atualizarHorario("segSex", e.target.value)
              }
              placeholder="Ex: 08:00 às 18:00"
            />

            <h3>Sábado</h3>

            <input
              type="text"
              value={horarios.sabado}
              onChange={(e) =>
                atualizarHorario("sabado", e.target.value)
              }
              placeholder="Ex: 08:00 às 12:00"
            />

            <h3>Domingos e feriados</h3>

            <input
              type="text"
              value={horarios.domFeriado}
              onChange={(e) =>
                atualizarHorario("domFeriado", e.target.value)
              }
              placeholder="Ex: Fechado"
            />

            {/* BOTÃO SALVAR */}
            <button
              className="admin_button"
              type="button"
              onClick={salvarInformacoes}
              disabled={salvando}
            >
              {salvando
                ? "Salvando..."
                : "Salvar informações"}
            </button>

          </div>

        )}

        {/* MENSAGENS */}
        {erro && (
          <p role="alert">
            {erro}
          </p>
        )}

        {mensagem && (
          <p>
            {mensagem}
          </p>
        )}

        {/* PRÉ-VISUALIZAÇÃO */}
        <div className="informacoes_preview">

          <h3>Pré-visualização</h3>

          <p>
            📍 {endereco || "Endereço não informado"}
          </p>

          <p>
            📞 {telefone || "Telefone não informado"}
          </p>

          <p>
            ✉️ {email || "E-mail não informado"}
          </p>

          <h3>Horários de funcionamento</h3>

          <p>
            Segunda a sexta-feira:{" "}
            {horarios.segSex || "Não informado"}
          </p>

          <p>
            Sábado:{" "}
            {horarios.sabado || "Não informado"}
          </p>

          <p>
            Domingos e feriados:{" "}
            {horarios.domFeriado || "Não informado"}
          </p>

        </div>

      </div>

    </div>

  );

}

export default AdminInformacoes;
