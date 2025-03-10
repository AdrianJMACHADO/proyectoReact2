/**
 * @fileoverview Archivo principal de la aplicación React que configura el enrutamiento y renderiza la aplicación.
 * @module main
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import PaginaError from "./pages/PaginaError";
import ListadoClientes from "./components/ListadoClientes";
import ListadoEntradas from "./components/ListadoEntradas";
import PedidoMultiple from "./components/PedidoMultiple";
import AltaCliente from "./components/AltaCliente";
import AltaEntrada from "./components/AltaEntrada";
import ListadoFechaEntrada from "./components/ListadoFechaEntradas";
import ModificarCliente from "./components/ModificarCliente";
import ListadoNombreCliente from "./components/ListadoNombreCliente";
import ModificarEntrada from "./components/ModificarEntrada";

/**
 * @constant {Object} router - Configuración del enrutador de la aplicación
 * @description Define todas las rutas disponibles en la aplicación y sus componentes asociados
 */
let router = createBrowserRouter([
  {
    path: "/",
    element : <Home />,
    errorElement : <PaginaError />,
    children: [   // Los hijos se renderizan en el elemento <Outlet /> del padre
      {
        path: 'listadoclientes',
        element: <ListadoClientes />, 
      },
      {
        path: 'listadonombrecliente',
        element: <ListadoNombreCliente />,  // Este es un ejemplo de cómo se puede renderizar un componente con props
      },
      {
        path:'modificarcliente/:idcliente',
        element: <ModificarCliente />,  // Este es un ejemplo de cómo se puede renderizar un componente con props
      },
      {
        path: 'altacliente',
        element: <AltaCliente />,
      },
      {
        path: 'listadoentradas',
        element: <ListadoEntradas />, 
      },
      {
        path:'modificarentrada/:identrada',
        element: <ModificarEntrada />,  // Este es un ejemplo de cómo se puede renderizar un componente con props
      },
      {
        path: 'listadofechaentrada',
        element: <ListadoFechaEntrada />,  // Este es un ejemplo de cómo se puede renderizar un componente con props
      },
      {
        path: 'altaentradas',
        element: <AltaEntrada />, 
      },
      {
        path: 'pedidomultiple',
        element: <PedidoMultiple />, 
      },
    ],
  },
]);

/**
 * @description Renderiza la aplicación React en el elemento root del DOM
 * @renders {React.Component} Renderiza el componente RouterProvider envuelto en StrictMode
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
