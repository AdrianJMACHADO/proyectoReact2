import { Typography, TextField, Stack, Button, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
// Importamos las variables de entorno
import { apiUrl } from '../config';

function AltaEntrada() {
  const [datos, setDatos] = useState({
    idcliente: "",
    pelicula: "",
    fecha: "",
    hora: "",
    precio: "",
  });

  const [clientes, setClientes] = useState([]); // Estado para almacenar la lista de clientes
  const navigate = useNavigate();

  // Cargar la lista de clientes al montar el componente
  useEffect(() => {
    async function fetchClientes() {
      try {
        const response = await fetch(apiUrl + "/cliente");
        const data = await response.json();
        if (data.datos) {
          setClientes(data.datos);
        }
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    }
    fetchClientes();
  }, []);

  const handleSubmit = async (e) => {
    // No hacemos submit
    e.preventDefault();

    // Validar que todos los campos estén completos
    if (!datos.idcliente || !datos.pelicula || !datos.fecha || !datos.hora || !datos.precio) {
      alert("Por favor, complete todos los campos");
      return;
    }

    // Formatear el precio: reemplazar comas por puntos y convertir a número
    const precioFormateado = parseFloat(datos.precio.replace(",", "."));
    if (isNaN(precioFormateado)) {
      alert("Por favor, ingrese un precio válido");
      return;
    }

    // Crear el objeto de datos con el precio formateado
    const datosFormateados = {
      ...datos,
      precio: precioFormateado,
    };

    // Enviamos los datos mediante fetch
    try {
      const response = await fetch(apiUrl + "/entrada", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosFormateados),
      });

      if (response.ok) {
        const respuesta = await response.json();
        alert(respuesta.mensaje);
        if (respuesta.ok) {
          navigate("/"); // Volver a la página principal
        }
      } else {
        alert("Error al dar de alta la entrada");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar la solicitud");
    }
  };

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Alta de entradas
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{ mt: 2, justifyContent: "center", alignItems: "center" }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Stack
            component="form"
            spacing={2}
            onSubmit={handleSubmit}
            sx={{ mx: 2 }}
          >
            {/* Selección de cliente */}
            <FormControl fullWidth>
              <InputLabel id="lblClientes">Cliente</InputLabel>
              <Select
                labelId="lblClientes"
                id="lstClientes"
                name="idcliente"
                value={datos.idcliente}
                label="Cliente"
                onChange={handleChange}
                required
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.idcliente} value={cliente.idcliente}>
                    {cliente.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Campo para la película */}
            <TextField
              id="outlined-basic"
              label="Película"
              variant="outlined"
              name="pelicula"
              value={datos.pelicula}
              onChange={handleChange}
              required
            />

            {/* Campo para la fecha */}
            <TextField
              id="outlined-basic"
              label="Fecha"
              variant="outlined"
              type="date"
              name="fecha"
              value={datos.fecha}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />

            {/* Campo para la hora */}
            <TextField
              id="outlined-basic"
              label="Hora"
              variant="outlined"
              type="time"
              name="hora"
              value={datos.hora}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />

            {/* Campo para el precio */}
            <TextField
              id="outlined-basic"
              label="Precio"
              variant="outlined"
              type="text" // Cambiado a tipo "text"
              name="precio"
              value={datos.precio}
              onChange={handleChange}
              required
              inputProps={{
                pattern: "[0-9]+([,\.][0-9]+)?", // Permite números con punto o coma decimal
                title: "Ingrese un precio válido (ejemplo: 9.99 o 9,99)",
              }}
            />

            <Button variant="contained" type="submit">
              Aceptar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default AltaEntrada;