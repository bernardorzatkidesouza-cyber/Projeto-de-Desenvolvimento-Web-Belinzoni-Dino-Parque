
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import "./index.css";

import App from "./App.jsx";

import Tela_principal from "./pages/tela_principal.jsx";
import Galeria from "./pages/galeria.jsx";
import ErrorPage from "./pages/pagina_de_erro.jsx";
import Noticias from "./pages/noticias.jsx";
import Acesso_admin from "./pages/acesso_admin.jsx";

import Admin_galeria from "./pages/admin_galeria.jsx";
import Admin_noticia from "./pages/admin_noticia.jsx";
import Admin_agenda from "./pages/admin_agenda.jsx";
import Admin_banner from "./pages/admin_banner.jsx";
import Admin_informacoes from "./pages/admin_informacoes.jsx";
import Admin_duvidas from "./pages/admin_duvidas.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Tela_principal />,
      },
      {
        path: "galeria",
        element: <Galeria />,
      },
      {
        path: "noticias",
        element: <Noticias />,
      },
    ],
  },

  {
    path: "/admin",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Acesso_admin />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "admin_noticia",
            element: <Admin_noticia />,
          },
          {
            path: "admin_duvidas",
            element: <Admin_duvidas />,
          },
          {
            path: "admin_agenda",
            element: <Admin_agenda />,
          },
          {
            path: "admin_galeria",
            element: <Admin_galeria />,
          },
          {
            path: "admin_informacoes",
            element: <Admin_informacoes />,
          },
          {
            path: "admin_banner",
            element: <Admin_banner />,
          },
        ],
      },
    ],
  },
]);

const elementoRoot = document.getElementById("root");

if (elementoRoot) {
  createRoot(elementoRoot).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
} else {
  console.error('Elemento com id="root" não encontrado no index.html.');
}
