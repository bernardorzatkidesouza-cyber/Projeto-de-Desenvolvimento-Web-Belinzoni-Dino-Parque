
import { Outlet } from "react-router-dom";
import useTema from "./hooks/useTema";
export {
  pegar,
  enviar,
  enviarImagem,
  API,
} from "./services/api";

function App() {
  useTema();

  return <Outlet />;
}

export default App;
