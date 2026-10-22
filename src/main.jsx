import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './pages/Tela_principal.jsx' from Tela_pricipal


import{ createBrowserRouter, RouterProvider, Route} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // 2 - pag de erro
    errorElement: <ErrorPage/>,
    // 3 - componente base
    children: [
      {
        path:"/",
        element: <Tela_pricipal />
      },
      {
        path:"contacts",
        element: <Contacts />
      },
      // 7 - rota dinamica
      {
        path: "products/:id",
        element: <Product/>
      },
      // 8  - rotas aninhadas
      {
        path: "products/:id/info",
        element: <Info />
      },
      // 10 - search params
      {
        path: "search",
        element: <Search/>,
      },
      // 11 - redirecionamento
      {
        path: "teste",
        element: <Navigate to="/"/>
      }
    ]
  },
  // {
  //   path: "contact",
  //   element: <Contacts />,
  // }
])

/* <Link to={`/products/${product.id}`}>Detalhes</Link>/*