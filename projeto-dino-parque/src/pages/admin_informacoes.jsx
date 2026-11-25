
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../assets/mobile.css";
import "../assets/styles.css";

import Brasao_ararangua from "../assets/Brasao_ararangua.png";
import { pegar, enviar } from "../services/api";

const API_URL = "/api/informacoes";

function AdminInformacoes() {

  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [horarios, setHorarios] = useState({
    Seg: "",
    TerDom: "",
    Feriado: "",
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {

    async function buscarInformacoes() {

      try {
        setCarregando(true);
        setErro("");

        const dados = await pegar(API_URL);

        setEndereco(dados.endereco || "");
        setTelefone(dados.telefone || "");
        setEmail(dados.email || "");

        setHorarios({
          Seg: dados.horarios?.Seg || "",
          TerDom: dados.horarios?.TerDom || "",
          Feriado: dados.horarios?.Feriado || "",
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

  function atualizarHorario(campo, valor) {

    setHorarios((horariosAtuais) => ({
      ...horariosAtuais,
      [campo]: valor,
    }));
  }

  async function salvarInformacoes() {

    try {

      setSalvando(true);
      setErro("");
      setMensagem("");

      await enviar(API_URL, "PUT", {
        endereco,
        telefone,
        email,
        horarios,
      });

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
        <p><Link to="/admin/admin_noticia">Notícias</Link></p>
        <p><Link to="/admin/admin_duvidas">Dúvidas</Link></p>
        <p><Link to="/admin/admin_galeria">Galeria de Fotos</Link></p>
        <p><Link to="/admin/admin_banner">Banner e Cores</Link></p>
        <p><Link to="/admin/admin_agenda">Agenda de Eventos</Link></p>
        <hr />

        <p><Link to="/">Sair para o Site</Link></p>
      </div>

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
            <h3>Endereço</h3>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Digite o endereço do parque"
            />
            <h3>Telefone</h3>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Digite o telefone"
            />
            <h3>E-mail</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite o e-mail"
            />
            <h2>Horários de funcionamento</h2>

            <h3>Segunda</h3>

            <input
              type="text"
              value={horarios.Seg}
              onChange={(e) =>
                atualizarHorario("Seg", e.target.value)
              }
              placeholder="Ex: 08:00 às 18:00"
            />

            <h3>Terça a Domingo</h3>

            <input
              type="text"
              value={horarios.TerDom}
              onChange={(e) =>
                atualizarHorario("TerDom", e.target.value)
              }
              placeholder="Ex: 08:00 às 12:00"
            />

            <h3>Feriados</h3>

            <input
              type="text"
              value={horarios.Feriado}
              onChange={(e) =>
                atualizarHorario("Feriado", e.target.value)
              }
              placeholder="Ex: Fechado"
            />

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

        <div className="informacoes_preview">

          <h3>Pré-visualização</h3>

          <p>📍 {endereco || "Endereço não informado"}</p>
          <p>📞 {telefone || "Telefone não informado"}</p>
          <p>✉️ {email || "E-mail não informado"}</p>

          <h3>Horários de funcionamento</h3>

          <p>
<<<<<<< HEAD
            Segunda:{" "}
=======
            Segunda :{" "}
>>>>>>> 42adc20afbc115a94593bbe315119c7fc88508a6
            {horarios.Seg || "Não informado"}
          </p>

          <p>
            Terça a Domingo:{" "}
            {horarios.TerDom || "Não informado"}
          </p>

          <p>
            Feriados:{" "}
            {horarios.Feriado || "Não informado"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminInformacoes;
