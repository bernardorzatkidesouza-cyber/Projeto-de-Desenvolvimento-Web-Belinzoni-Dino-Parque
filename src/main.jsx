
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

import App from './App.jsx';

import Galeria from './pages/galeria.jsx';
import ErrorPage from './pages/pagina_de_erro.jsx';
import Noticias from './pages/noticias.jsx';
import Acesso_admin from './pages/acesso_admin.jsx';

import Admin_galeria from './pages/admin_galeria.jsx';
import Admin_noticia from './pages/admin_noticia.jsx';
import Admin_agenda from './pages/admin_agenda.jsx';
import Admin_banner from './pages/admin_banner_cores.jsx';
import Admin_informacoes from './pages/admin_informacoes.jsx';
import Admin_duvidas from './pages/admin_duvidas.jsx';

import Nova_noticia from './pages/nova_noticia.jsx';
import Nova_duvida from './pages/nova_duvida.jsx';
import Novo_evento from './pages/novo_evento.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'galeria',
        element: <Galeria />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'noticias',
        element: <Noticias />,
        errorElement: <ErrorPage />,
      },
    ],
  },

  {
    path: '/acesso_admin',
    element: <Acesso_admin />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'admin_noticia',
        element: <Admin_noticia />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'nova_noticia',
        element: <Nova_noticia />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'admin_duvidas',
        element: <Admin_duvidas />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'nova_duvida',
        element: <Nova_duvida />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'admin_agenda',
        element: <Admin_agenda />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'novo_evento',
        element: <Novo_evento />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'admin_galeria',
        element: <Admin_galeria />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'admin_informacoes',
        element: <Admin_informacoes />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'admin_banner',
        element: <Admin_banner />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

const elementoRoot = document.getElementById('root');

if (elementoRoot) {
  createRoot(elementoRoot).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
} else {
  console.error('Elemento com id="root" não encontrado no index.html.');
}

