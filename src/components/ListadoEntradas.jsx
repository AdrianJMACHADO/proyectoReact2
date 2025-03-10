/**
 * @fileoverview Componente para mostrar y gestionar el listado de entradas de cine
 * @module ListadoEntradas
 */

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, Box, Pagination, Stack } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";
import EntradasChart from "./EntradasChart";
import ExportButtons from "./ExportButtons";

/**
 * @component
 * @description Componente que muestra una tabla paginada con el listado de entradas de cine.
 * Permite eliminar y editar entradas, y muestra estadísticas mediante gráficos.
 * @returns {JSX.Element} Tabla de entradas con controles de paginación y gráficos
 */
function ListadoEntradas() {
  /**
   * @state
   * @description Estado que almacena todas las entradas
   * @type {Array<{identrada: number, idcliente: number, pelicula: string, fecha: string, hora: string, precio: number}>}
   */
  const [rows, setRows] = useState([]);

  /**
   * @state
   * @description Mapa que almacena los clientes indexados por su ID para búsqueda rápida
   * @type {Object.<number, {idcliente: number, nombre: string, email: string, telefono: string}>}
   */
  const [clientesMap, setClientesMap] = useState({});

  /**
   * @state
   * @description Estado que controla la página actual de la tabla
   * @type {number}
   */
  const [paginaActual, setPaginaActual] = useState(1);

  /**
   * @state
   * @description Número de entradas a mostrar por página
   * @type {number}
   */
  const [entradasPorPagina] = useState(5);

  const navigate = useNavigate();

  /**
   * @type {React.RefObject}
   * @description Referencia para el componente de gráficos
   */
  const chartRef = useRef(null);

  /**
   * @type {React.RefObject}
   * @description Referencia para el componente de lista
   */
  const listRef = useRef(null);

  /**
   * @function
   * @async
   * @description Carga los datos de entradas y clientes del servidor al montar el componente
   */
  useEffect(() => {
    async function fetchData() {
      try {
        // Obtener entradas
        const entradasResponse = await fetch(apiUrl + "/entrada", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        // Obtener clientes
        const clientesResponse = await fetch(apiUrl + "/cliente", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (entradasResponse.ok && clientesResponse.ok) {
          const entradasData = await entradasResponse.json();
          const clientesData = await clientesResponse.json();

          console.log('Datos de entradas:', entradasData.datos);
          console.log('Datos de clientes:', clientesData.datos);

          // Crear un mapa de clientes para búsqueda rápida
          const clientesMapping = {};
          if (Array.isArray(clientesData.datos)) {
            clientesData.datos.forEach((cliente) => {
              clientesMapping[cliente.idcliente] = cliente;
            });
          }

          setClientesMap(clientesMapping);
          setRows(entradasData.datos); // Guardar todas las entradas
        } else {
          console.error("Error en las respuestas:", {
            entradas: entradasResponse.status,
            clientes: clientesResponse.status,
          });
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    }

    fetchData();
  }, []);

  /**
   * @function
   * @async
   * @description Maneja la eliminación de una entrada
   * @param {number} identrada - ID de la entrada a eliminar
   */
  const handleDelete = async (identrada) => {
    let response = await fetch(apiUrl + "/entrada/" + identrada, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const entradasTrasBorrado = rows.filter(
        (entrada) => entrada.identrada !== identrada
      );
      setRows(entradasTrasBorrado);
    }
  };

  /**
   * @function
   * @description Formatea una fecha al formato local español
   * @param {string} fecha - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES");
  };

  /**
   * @function
   * @description Formatea una hora al formato HH:mm
   * @param {string} hora - Hora en formato HH:mm:ss
   * @returns {string} Hora formateada
   */
  const formatHora = (hora) => {
    return hora.substring(0, 5);
  };

  /**
   * @function
   * @description Formatea un precio al formato monetario
   * @param {(number|string)} precio - Precio a formatear
   * @returns {string} Precio formateado con símbolo de euro
   */
  const formatPrecio = (precio) => {
    const precioNumerico =
      typeof precio === "string"
        ? parseFloat(precio.replace(",", ".").replace("€", "").trim())
        : precio;

    return !isNaN(precioNumerico)
      ? precioNumerico.toFixed(2) + " €"
      : "N/A";
  };

  /**
   * @function
   * @description Obtiene el nombre de un cliente por su ID
   * @param {number} idcliente - ID del cliente
   * @returns {string} Nombre del cliente o mensaje de error si no se encuentra
   */
  const getNombreCliente = (idcliente) => {
    return clientesMap[idcliente]?.nombre || "Cliente no encontrado";
  };

  // Calcular las entradas que se mostrarán en la página actual
  const indiceUltimaEntrada = paginaActual * entradasPorPagina;
  const indicePrimeraEntrada = indiceUltimaEntrada - entradasPorPagina;
  const entradasPaginaActual = rows.slice(indicePrimeraEntrada, indiceUltimaEntrada);

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
        Listado de Entradas
      </Typography>

      <Box sx={{ mx: 4 }}>
        <div ref={listRef}>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table aria-label="tabla de entradas">
              <TableHead>
                <TableRow>
                  <TableCell align="right">ID</TableCell>
                  <TableCell>CLIENTE</TableCell>
                  <TableCell>PELÍCULA</TableCell>
                  <TableCell align="center">FECHA</TableCell>
                  <TableCell align="center">HORA</TableCell>
                  <TableCell align="right">PRECIO</TableCell>
                  <TableCell align="center">ELIMINAR</TableCell>
                  <TableCell align="center">EDITAR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entradasPaginaActual.map((row) => (
                  <TableRow
                    key={row.identrada}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="right">{row.identrada}</TableCell>
                    <TableCell>{getNombreCliente(row.idcliente)}</TableCell>
                    <TableCell>{row.pelicula}</TableCell>
                    <TableCell align="center">{formatFecha(row.fecha)}</TableCell>
                    <TableCell align="center">{formatHora(row.hora)}</TableCell>
                    <TableCell align="right">{formatPrecio(row.precio)}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => handleDelete(row.identrada)}
                        color="error"
                      >
                        <DeleteForeverIcon fontSize="small" />
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => navigate("/modificarentrada/" + row.identrada)}
                      >
                        <EditNoteIcon fontSize="small" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Paginación */}
        <Stack spacing={2} sx={{ mt: 2, alignItems: "center" }}>
          <Pagination
            count={Math.ceil(rows.length / entradasPorPagina)}
            page={paginaActual}
            onChange={handleChangePagina}
            color="primary"
          />
        </Stack>

        {/* Botones de exportación */}
        <ExportButtons
          chartRef={chartRef}
          listRef={listRef}
          data={rows}
          title="Listado de Entradas"
        />

        {/* Gráficos */}
        {rows.length > 0 && (
          <Box sx={{ mt: 4 }} ref={chartRef}>
            <EntradasChart data={rows} />
          </Box>
        )}
      </Box>
    </>
  );
}

export default ListadoEntradas;