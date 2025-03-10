/**
 * @fileoverview Componente para mostrar y gestionar el listado de clientes
 * @module ListadoClientes
 */

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, Box, Pagination, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";
import ClientesChart from "./ClientesChart";

/**
 * @component
 * @description Componente que muestra una tabla paginada con el listado de clientes.
 * Permite eliminar y editar clientes, y muestra estadísticas mediante gráficos.
 * @returns {JSX.Element} Tabla de clientes con controles de paginación y gráficos
 */
function ListadoClientes() {
  /**
   * @state
   * @description Estado que almacena todos los clientes
   * @type {Array<{idcliente: number, nombre: string, email: string, telefono: string}>}
   */
  const [rows, setRows] = useState([]);

  /**
   * @state
   * @description Estado que almacena todas las entradas asociadas a los clientes
   * @type {Array<Object>}
   */
  const [entradas, setEntradas] = useState([]);

  /**
   * @state
   * @description Estado que controla la página actual de la tabla
   * @type {number}
   */
  const [paginaActual, setPaginaActual] = useState(1);

  /**
   * @state
   * @description Número de clientes a mostrar por página
   * @type {number}
   */
  const [clientesPorPagina] = useState(5);

  const navigate = useNavigate();

  /**
   * @function
   * @async
   * @description Carga los datos de clientes y entradas del servidor al montar el componente
   */
  useEffect(() => {
    async function fetchData() {
      try {
        // Obtener clientes
        const clientesResponse = await fetch(apiUrl + "/cliente", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        // Obtener entradas
        const entradasResponse = await fetch(apiUrl + "/entrada", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (clientesResponse.ok && entradasResponse.ok) {
          const clientesData = await clientesResponse.json();
          const entradasData = await entradasResponse.json();

          console.log('Datos de clientes:', clientesData.datos);
          console.log('Datos de entradas:', entradasData.datos);

          setRows(clientesData.datos);
          setEntradas(entradasData.datos);
        } else {
          console.error("Error en la respuesta:", clientesResponse.status);
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    }

    fetchData();
  }, []);
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       // Obtener clientes (con sus entradas embebidas)
  //       const clientesResponse = await fetch(apiUrl + "/cliente", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include",
  //       });
  
  //       if (clientesResponse.ok) {
  //         const clientesData = await clientesResponse.json();
  //         console.log("Datos de clientes:", clientesData);
  //         setRows(clientesData);
  //         // Extraer todas las entradas de cada cliente
  //         const allEntradas = clientesData.flatMap(cliente => cliente.entradas || []);
  //         setEntradas(allEntradas);
  //       } else {
  //         console.error("Error en la respuesta:", clientesResponse.status);
  //       }
  //     } catch (error) {
  //       console.error("Error al cargar los datos:", error);
  //     }
  //   }
  
  //   fetchData();
  // }, []);
  

  /**
   * @function
   * @async
   * @description Maneja la eliminación de un cliente y sus entradas asociadas
   * @param {number} idcliente - ID del cliente a eliminar
   */
  const handleDelete = async (idcliente) => {
    let response = await fetch(apiUrl + "/cliente/" + idcliente, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const clientesTrasBorrado = rows.filter(
        (cliente) => cliente.idcliente !== idcliente
      );
      const entradasActualizadas = entradas.filter(
        (entrada) => entrada.idcliente !== idcliente
      );
      setRows(clientesTrasBorrado);
      setEntradas(entradasActualizadas);
    }
  };

  // Calcular los clientes que se mostrarán en la página actual
  const indiceUltimoCliente = paginaActual * clientesPorPagina;
  const indicePrimerCliente = indiceUltimoCliente - clientesPorPagina;
  const clientesPaginaActual = rows.slice(indicePrimerCliente, indiceUltimoCliente);

  /**
   * @function
   * @description Maneja el cambio de página en la paginación
   * @param {Event} event - Evento del cambio de página
   * @param {number} value - Número de la nueva página
   */
  const handleChangePagina = (event, value) => {
    setPaginaActual(value);
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Listado de clientes
      </Typography>

      <Box sx={{ mx: 4 }}>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table aria-label="tabla de clientes">
            <TableHead>
              <TableRow>
                <TableCell align="right">ID</TableCell>
                <TableCell>NOMBRE</TableCell>
                <TableCell>EMAIL</TableCell>
                <TableCell>TELÉFONO</TableCell>
                <TableCell align="center">ELIMINAR</TableCell>
                <TableCell align="center">EDITAR</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientesPaginaActual.map((row) => (
                <TableRow
                  key={row.idcliente}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="right">{row.idcliente}</TableCell>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.telefono}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      onClick={() => handleDelete(row.idcliente)}
                      color="error"
                    >
                      <DeleteForeverIcon fontSize="small" />
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      onClick={() => navigate("/modificarcliente/" + row.idcliente)}
                    >
                      <EditNoteIcon fontSize="small" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <Stack spacing={2} sx={{ mt: 2, alignItems: "center" }}>
          <Pagination
            count={Math.ceil(rows.length / clientesPorPagina)} // Número total de páginas
            page={paginaActual}
            onChange={handleChangePagina}
            color="primary"
          />
        </Stack>

        {/* Gráficos */}
        {rows.length > 0 && entradas.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <ClientesChart clientes={rows} entradas={entradas} />
          </Box>
        )}
      </Box>
    </>
  );
}

export default ListadoClientes;
