import { useState, useEffect, useCallback } from "react";
import { pegar, enviar } from "../services/api";

const normalizar = (n) => ({
  ...n,
  id: n.id,
  titulo: n.titulo || "",
  descricao: n.descricao ?? n.conteudo ?? "",
  imagem: n.imagem ?? n.imagem_url ?? "",
  data: n.data ?? n.data_publicacao ?? "",
  status: n.status || "publicado",
});

const paraApi = (n) => ({
  titulo: n.titulo,
  conteudo: n.descricao ?? n.conteudo,
  imagem_url: n.imagem ?? n.imagem_url ?? null,
  data_publicacao: n.data
    ? `${String(n.data).slice(0, 10)}T12:00:00`
    : new Date().toISOString(),
  status: n.status || "publicado",
});

function useNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarNoticias = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const caminho = localStorage.getItem("token") ? "/api/admin/noticias" : "/api/noticias";
      const dados = await pegar(caminho);
      setNoticias((Array.isArray(dados) ? dados : []).map(normalizar));
    } catch (e) {
      setErro(e.message);
      console.error("Erro ao buscar notícias:", e);
    } finally {
      setCarregando(false);
    }
  }, []);

  async function cadastrarNoticia(dados) {
    await enviar("/api/noticias", "POST", paraApi(dados));
    await buscarNoticias();
  }

  async function atualizarNoticia(id, dados) {
    await enviar(`/api/noticias/${id}`, "PUT", paraApi(dados));
    await buscarNoticias();
  }

  async function removerNoticia(id) {
    await enviar(`/api/noticias/${id}`, "DELETE");
    await buscarNoticias();
  }

  useEffect(() => { buscarNoticias(); }, [buscarNoticias]);

  return { noticias, carregando, erro, buscarNoticias, cadastrarNoticia, atualizarNoticia, removerNoticia };
}

export default useNoticias;
