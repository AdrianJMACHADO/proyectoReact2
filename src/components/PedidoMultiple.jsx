import { useEffect, useState } from "react";
import { apiUrl } from "../config";
import { Typography, TextField, Grid, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";

// Función utilitaria para formatear precio de forma segura
const formatPrecio = (precio) => {
  // Convierte a número si es una cadena
  const precioNumerico =
    typeof precio === "string"
      ? parseFloat(precio.replace(",", ".").replace("€", "").trim())
      : precio;

  // Comprueba si es un número válido
  return !isNaN(precioNumerico) ? precioNumerico.toFixed(2) : "0.00";
};

// Función utilitaria para formatear precio de forma segura
function PedidoMultiple() {
  // Estados para búsqueda y filtrado
  const [peliculasFiltro, setPeliculasFiltro] = useState({
    nombre: "",
    precio: "",
    precioMin: "",
    precioMax: "",
  });

  // Estados para datos
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasFiltradas, setPeliculasFiltradas] = useState([]);
  const [peliculasSeleccionadas, setPeliculasSeleccionadas] = useState([]);
  const [cliente, setCliente] = useState("");
  const [clientes, setClientes] = useState([]);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  // Contador para generar IDs únicos
  const [contadorId, setContadorId] = useState(0);

  useEffect(() => {
    async function getDatos() {
      try {
        const [entradasResponse, clienteResponse] = await Promise.all([
          fetch(apiUrl + "/entrada"),
          fetch(apiUrl + "/cliente"),
        ]);

        const entradasData = await entradasResponse.json();
        const clienteData = await clienteResponse.json();

        // Asegurar que cada entrada tenga un precio formateado
        const nombresUnicos = new Set();
        const peliculasFormateadas = entradasData.datos.map((entrada) => ({
          idpelicula: entrada.identrada,
          nombre: entrada.pelicula,
          precio: formatPrecio(entrada.precio),
          fecha: entrada.fecha,
        }));

        const peliculasUnicas = peliculasFormateadas.filter((entrada) => {
          if (!nombresUnicos.has(entrada.nombre)) {
            nombresUnicos.add(entrada.nombre);
            return true;
          }
          return false;
        });

        setPeliculas(peliculasUnicas);
        setPeliculasFiltradas(peliculasUnicas);
        setClientes(clienteData.datos);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    }

    getDatos();
  }, []);

  // Función de búsqueda y filtrado
  const buscarPeliculas = () => {
    let resultado = peliculas;

    if (peliculasFiltro.nombre) {
      resultado = resultado.filter((p) =>
        p.nombre.toLowerCase().includes(peliculasFiltro.nombre.toLowerCase())
      );
    }

    if (peliculasFiltro.precioMin) {
      resultado = resultado.filter(
        (p) => parseFloat(p.precio) >= parseFloat(peliculasFiltro.precioMin)
      );
    }

    if (peliculasFiltro.precioMax) {
      resultado = resultado.filter(
        (p) => parseFloat(p.precio) <= parseFloat(peliculasFiltro.precioMax)
      );
    }

    setPeliculasFiltradas(resultado);
  };

  // Manejadores de cambio para filtros
  const handleFiltroChange = (campo) => (e) => {
    setPeliculasFiltro({
      ...peliculasFiltro,
      [campo]: e.target.value,
    });
  };

  // Función para agregar una película seleccionada
  const agregarPelicula = (pelicula) => {
    if (pelicula) {
      const nuevaPelicula = {
        ...pelicula,
        idUnico: contadorId, // Usamos el contador como ID único
        fecha: fecha,
        hora: hora,
      };

      setPeliculasSeleccionadas([...peliculasSeleccionadas, nuevaPelicula]);
      setContadorId(contadorId + 1); // Incrementamos el contador
    }
  };

  // Función para eliminar una película seleccionada
  const handleDelete = (idUnico) => {
    setPeliculasSeleccionadas(
      peliculasSeleccionadas.filter((pelicula) => pelicula.idUnico !== idUnico)
    );
  };

  // Función para confirmar la compra
  // Función para confirmar la compra
  const aceptar = async () => {
    if (!cliente) {
      alert("Por favor, seleccione un cliente");
      return;
    }

    try {
      // Crear un array para almacenar las respuestas de la API
      const respuestas = [];

      // Recorrer todas las entradas seleccionadas
      for (const pelicula of peliculasSeleccionadas) {
        const entrada = {
          idcliente: cliente,
          pelicula: pelicula.nombre,
          fecha: pelicula.fecha,
          hora: pelicula.hora,
          precio: pelicula.precio,
        };

        // Enviar la entrada a la API
        const response = await fetch(apiUrl + "/entrada", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entrada),
        });

        // Guardar la respuesta
        const respuesta = await response.json();
        respuestas.push(respuesta);
      }

      // Verificar si todas las solicitudes fueron exitosas
      const todasExitosas = respuestas.every((respuesta) => respuesta.ok);

      if (todasExitosas) {
        alert("Todas las entradas se compraron con éxito");
        setPeliculasSeleccionadas([]); // Limpiar la lista de entradas seleccionadas
      } else {
        alert("Hubo un error al comprar algunas entradas");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar la compra");
    }
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Compra múltiple de entradas
      </Typography>

      <Box sx={{ maxWidth: 800, margin: "auto", p: 2 }}>
        {/* Sección de filtros */}
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Buscar Películas
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Nombre de Película"
                value={peliculasFiltro.nombre}
                onChange={handleFiltroChange("nombre")}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Precio Mín"
                type="number"
                value={peliculasFiltro.precioMin}
                onChange={handleFiltroChange("precioMin")}
                variant="outlined"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Precio Máx"
                type="number"
                value={peliculasFiltro.precioMax}
                onChange={handleFiltroChange("precioMax")}
                variant="outlined"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={buscarPeliculas}
                sx={{ height: "100%" }}
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Resto del componente de compra de entradas */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="lblClientes">Cliente</InputLabel>
            <Select
              labelId="lblClientes"
              id="lstClientes"
              value={cliente}
              label="Cliente"
              onChange={(e) => setCliente(e.target.value)}
            >
              {clientes.map((client) => (
                <MenuItem key={client.idcliente} value={client.idcliente}>
                  {client.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              type="date"
              label="Fecha"
              InputLabelProps={{ shrink: true }}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              fullWidth
            />
            <TextField
              type="time"
              label="Hora"
              InputLabelProps={{ shrink: true }}
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              fullWidth
            />
          </Box>

          {/* Tabla de películas filtradas */}
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table aria-label="tabla de películas">
              <TableHead>
                <TableRow>
                  <TableCell>PELÍCULA</TableCell>
                  <TableCell align="right">PRECIO</TableCell>
                  <TableCell align="center">ACCIÓN</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {peliculasFiltradas.map((pelicula) => (
                  <TableRow key={pelicula.idpelicula}>
                    <TableCell>{pelicula.nombre}</TableCell>
                    <TableCell align="right">{pelicula.precio} €</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => agregarPelicula(pelicula)} // Pasa la película directamente
                        disabled={!fecha || !hora} // Deshabilita si no hay fecha u hora
                      >
                        Añadir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Tabla de películas seleccionadas */}
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table aria-label="tabla de películas seleccionadas">
              <TableHead>
                <TableRow>
                  <TableCell>PELÍCULA</TableCell>
                  <TableCell align="center">FECHA</TableCell>
                  <TableCell align="center">HORA</TableCell>
                  <TableCell align="right">PRECIO</TableCell>
                  <TableCell align="center">ELIMINAR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {peliculasSeleccionadas.map((row) => (
                  <TableRow
                    key={row.idUnico} // Usamos el ID único como clave
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{row.nombre}</TableCell>
                    <TableCell align="center">{row.fecha}</TableCell>
                    <TableCell align="center">{row.hora}</TableCell>
                    <TableCell align="right">{row.precio} €</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => handleDelete(row.idUnico)} // Eliminar por ID único
                        color="error"
                      >
                        <DeleteForeverIcon fontSize="small" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={aceptar}
            disabled={peliculasSeleccionadas.length === 0 || !cliente}
          >
            Confirmar compra
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default PedidoMultiple;
