import { useEffect, useState } from "react";
import { apiUrl } from "../config";
import { Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TextField, Box } from "@mui/material";

function ListaFechaEntrada() {
  const [entradas, setEntradas] = useState([]); // Estado para almacenar las entradas
  const [fechaSeleccionada, setFechaSeleccionada] = useState(""); // Estado para la fecha seleccionada
  const [totalEntradas, setTotalEntradas] = useState(0); // Estado para el número total de entradas
  const [totalPrecio, setTotalPrecio] = useState(0); // Estado para la suma de los precios

  // Función para obtener las entradas filtradas por fecha
  const obtenerEntradasPorFecha = async (fecha) => {
    try {
      const response = await fetch(apiUrl + "/entrada");
      const data = await response.json();

      // Filtrar las entradas por la fecha seleccionada
      const entradasFiltradas = data.datos.filter((entrada) => entrada.fecha === fecha);
      setEntradas(entradasFiltradas);

      // Calcular el número total de entradas y la suma de los precios
      const totalEntradas = entradasFiltradas.length;
      const totalPrecio = entradasFiltradas.reduce((sum, entrada) => sum + parseFloat(entrada.precio), 0);

      setTotalEntradas(totalEntradas);
      setTotalPrecio(totalPrecio.toFixed(2)); // Formatear a 2 decimales
    } catch (error) {
      console.error("Error cargando entradas:", error);
    }
  };

  // Manejar el cambio de fecha
  const handleFechaChange = (e) => {
    const fecha = e.target.value;
    setFechaSeleccionada(fecha);
    obtenerEntradasPorFecha(fecha); // Obtener entradas para la fecha seleccionada
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Entradas por Fecha
      </Typography>

      {/* Campo para seleccionar la fecha */}
      <TextField
        type="date"
        label="Seleccionar Fecha"
        InputLabelProps={{ shrink: true }}
        value={fechaSeleccionada}
        onChange={handleFechaChange}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Resumen de entradas */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          <strong>Total de entradas:</strong> {totalEntradas}
        </Typography>
        <Typography variant="body1">
          <strong>Suma de precios:</strong> {totalPrecio} €
        </Typography>
      </Box>

      {/* Tabla de entradas */}
      <TableContainer>
        <Table aria-label="tabla de entradas">
          <TableHead>
            <TableRow>
              <TableCell>PELÍCULA</TableCell>
              <TableCell>FECHA</TableCell>
              <TableCell>HORA</TableCell>
              <TableCell align="right">PRECIO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entradas.length > 0 ? (
              entradas.map((entrada) => (
                <TableRow key={entrada.identrada}>
                  <TableCell>{entrada.pelicula}</TableCell>
                  <TableCell>{entrada.fecha}</TableCell>
                  <TableCell>{entrada.hora}</TableCell>
                  <TableCell align="right">{entrada.precio} €</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay entradas para esta fecha.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ListaFechaEntrada;