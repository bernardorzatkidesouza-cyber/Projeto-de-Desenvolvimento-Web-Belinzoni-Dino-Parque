
import { Outlet } from "react-router-dom";

export {
  pegar,
  enviar,
  enviarImagem,
  API,
} from "./services/api";

function App() {
  return (
    <Outlet />
  );
}

export default App;
