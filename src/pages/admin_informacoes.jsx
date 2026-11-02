

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
          throw new Error("Não foi possível carregar as informações.");
        }

        const dados = await resposta.json();

        setEndereco(dados.endereco || "");
        setTelefone(dados.telefone || "");
        setEmail(dados.email || "");

      } catch (error) {
        console.error("Erro ao consultar informações:", error);
        setErro(error.message);

      } finally {
        setCarregando(false);
      }
    }

    buscarInformacoes();

  }, []);

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
        }),
      });

      if (!resposta.ok) {
        throw new Error("Não foi possível salvar as informações.");
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

        <p><Link to="/admin/admin_noticia">Notícias</Link></p>
        <p><Link to="/admin/admin_duvidas">Dúvidas</Link></p>
        <p><Link to="/admin/admin_galeria">Galeria de Fotos</Link></p>
        <p><Link to="/admin/admin_banner">Banner e Cores</Link></p>
        <p><Link to="/admin/admin_agenda">Agenda de Eventos</Link></p>

        <hr />

        <p><Link to="/">Sair para o Site</Link></p>

      </div>

      {/* CONTEÚDO */}
      <div className="admin_conteudo">

        <h1>Informações do Parque</h1>

        <p>
          Estas informações aparecem na seção de contato
          e no rodapé do site.
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

            <button
              className="admin_button"
              type="button"
              onClick={salvarInformacoes}
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar informações"}
            </button>

          </div>

        )}

        {erro && (
          <p role="alert">{erro}</p>
        )}

        {mensagem && (
          <p>{mensagem}</p>
        )}

        {/* PRÉ-VISUALIZAÇÃO */}
        <div className="informacoes_preview">

          <h3>Pré-visualização</h3>

          <p>📍 {endereco || "Endereço não informado"}</p>
          <p>📞 {telefone || "Telefone não informado"}</p>
          <p>✉️ {email || "E-mail não informado"}</p>

        </div>

      </div>

    </div>
  );
}

export default AdminInformacoes;
