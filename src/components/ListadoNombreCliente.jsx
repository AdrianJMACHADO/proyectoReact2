import { useEffect, useState } from "react";
import { apiUrl } from "../config";
import { Typography, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Box, Button } from "@mui/material";
import { useNavigate } from "react-router";

function ListadoNombreCliente() {
  const [clientes, setClientes] = useState([]); // Todos los clientes
  const [filtroNombre, setFiltroNombre] = useState(""); // Filtro de búsqueda por nombre
  const [clientesFiltrados, setClientesFiltrados] = useState([]); // Clientes filtrados
  const navigate = useNavigate();

  // Cargar todos los clientes al montar el componente
  useEffect(() => {
    async function fetchClientes() {
      try {
        const response = await fetch(apiUrl + "/cliente", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setClientes(data.datos); // Guardar todos los clientes
          setClientesFiltrados(data.datos); // Inicialmente, mostrar todos los clientes
        } else {
          console.error("Error cargando clientes:", response.status);
        }
      } catch (error) {
        console.error("Error al cargar los clientes:", error);
      }
    }

    fetchClientes();
  }, []);

  // Función para filtrar clientes por nombre
  const buscarClientesPorNombre = () => {
    if (filtroNombre) {
      const clientesFiltrados = clientes.filter((cliente) =>
        cliente.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
      );
      setClientesFiltrados(clientesFiltrados);
    } else {
      setClientesFiltrados(clientes); // Si no hay filtro, mostrar todos los clientes
    }
  };

  // Manejar cambios en el campo de búsqueda
  const handleFiltroChange = (e) => {
    setFiltroNombre(e.target.value);
  };

  // Manejar la acción de buscar
  const handleBuscar = () => {
    buscarClientesPorNombre();
  };

  // Manejar la acción de editar un cliente
  const handleEditar = (idcliente) => {
    navigate(`/modificarcliente/${idcliente}`);
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Listado de Clientes por Nombre
      </Typography>

      <Box sx={{ maxWidth: 800, margin: "auto", p: 2 }}>
        {/* Campo de búsqueda */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Buscar por nombre"
            variant="outlined"
            value={filtroNombre}
            onChange={handleFiltroChange}
          />
          <Button variant="contained" onClick={handleBuscar}>
            Buscar
          </Button>
        </Box>

        {/* Tabla de clientes */}
        <TableContainer component={Paper}>
          <Table aria-label="tabla de clientes">
            <TableHead>
              <TableRow>
                <TableCell>NOMBRE</TableCell>
                <TableCell>EMAIL</TableCell>
                <TableCell>TELÉFONO</TableCell>
                <TableCell>DIRECCIÓN</TableCell>
                <TableCell align="center">ACCIÓN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente) => (
                  <TableRow key={cliente.idcliente}>
                    <TableCell>{cliente.nombre}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>{cliente.direccion}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => handleEditar(cliente.idcliente)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No se encontraron clientes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default ListadoNombreCliente;