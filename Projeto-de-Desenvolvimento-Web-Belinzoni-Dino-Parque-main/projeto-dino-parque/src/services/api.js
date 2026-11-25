
export const API = "/api";

const API_BASE = API;

// Remove /api do início para evitar duplicação
function removerPrefixoApi(caminho) {
  if (caminho.startsWith("/api/")) {
    return caminho.slice(4);
  }

  if (caminho === "/api") {
    return "";
  }

  return caminho.startsWith("/") ? caminho : `/${caminho}`;
}

// Função principal de requisição
async function requisicao(caminho, opcoes = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(opcoes.body && !(opcoes.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opcoes.headers,
  };

  const resposta = await fetch(
    `${API_BASE}${caminho}`,
    {
      ...opcoes,
      headers,
    }
  );

  if (resposta.status === 204) {
    return null;
  }

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(
      dados.erro || `Falha na requisição (HTTP ${resposta.status}).`
    );
  }

  return dados;
}

// Buscar informações
export const pegar = (caminho) =>
  requisicao(removerPrefixoApi(caminho));

// Enviar, editar ou excluir informações
export const enviar = (caminho, metodo, corpo) =>
  requisicao(removerPrefixoApi(caminho), {
    method: metodo,
    body:
      corpo === undefined
        ? undefined
        : JSON.stringify(corpo),
  });

// Enviar imagens
export async function enviarImagem(arquivo) {
  const formulario = new FormData();

  formulario.append("imagem", arquivo);

  const dados = await requisicao("/upload", {
    method: "POST",
    body: formulario,
  });

  return dados.url;
}
