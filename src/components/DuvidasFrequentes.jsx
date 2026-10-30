
import "../assets/styles.css";
import useDuvidas from "../hooks/useDuvidas";

function DuvidasFrequentes() {
  const {
    duvidas,
    carregando,
    erro
  } = useDuvidas();

  const duvidasPublicadas = duvidas
    .filter((duvida) => duvida.status === "publicado")
    .sort(
      (a, b) =>
        (a.ordemExibicao ?? 0) - (b.ordemExibicao ?? 0)
    );

  return (
    <section className="duvidas_tela_principal" id="duvidas">

      <p>DÚVIDAS</p>

      <h1>Perguntas Frequentes</h1>

      <h3>
        Encontre respostas para as principais dúvidas
        sobre o Dino Parque Belinzoni.
      </h3>

      {carregando && (
        <p>Carregando perguntas frequentes...</p>
      )}

      {erro && (
        <p>Não foi possível carregar as perguntas frequentes.</p>
      )}

      {!carregando && !erro && (

        <div className="duvidas_lista_publica">

          {duvidasPublicadas.length === 0 ? (

            <p className="duvidas_vazia">
              Nenhuma pergunta cadastrada no momento.
            </p>

          ) : (

            duvidasPublicadas.map((duvida) => (

              <details
                className="duvidas_card"
                key={
                  duvida.idPerguntasFrequentes ?? duvida.id
                }
              >

                <summary className="duvidas_title">
                  {duvida.pergunta}
                </summary>

                <p className="duvidas_conteudo">
                  {duvida.resposta}
                </p>

              </details>

            ))

          )}

        </div>

      )}

    </section>
  );
}

export default DuvidasFrequentes;
