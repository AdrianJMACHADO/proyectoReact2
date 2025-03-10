import { Typography, TextField, Stack, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../config";

function ModificarEntrada() {
  const params = useParams();
  const [datos, setDatos] = useState({
    identrada: params.identrada, // ID de la entrada a modificar
    pelicula: "",
    fecha: "",
    hora: "",
    precio: "",
  });

  const [validacion, setValidacion] = useState({
    pelicula: false, // true si hay error
    fecha: false,
    hora: false,
    precio: false,
  });

  const navigate = useNavigate();

  // Cargar los datos de la entrada al montar el componente
  useEffect(() => {
    async function getEntradaById() {
      try {
        const response = await fetch(apiUrl + "/entrada/" + datos.identrada);
        if (response.ok) {
          const data = await response.json();
          
          // Ajustar el formato de la hora si es necesario
          let horaFormateada = data.datos.hora;
          if (horaFormateada.includes(":") && horaFormateada.length > 5) {
            horaFormateada = horaFormateada.slice(0, 5); // Asegurar formato HH:MM
          }
  
          setDatos({ ...data.datos, hora: horaFormateada });
        } else if (response.status === 404) {
          const data = await response.json();
          alert(data.mensaje);
          navigate("/");
        }
      } catch (error) {
        console.error("Error cargando entrada:", error);
      }
    }
  
    getEntradaById();
  }, [datos.identrada, navigate]);
  

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    if (validarDatos()) {
      try {
        const response = await fetch(apiUrl + "/entrada/" + datos.identrada, {
          method: "PUT", // Método HTTP para actualizar
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos), // Enviar los datos de la entrada
        });

        if (response.ok) {
          alert("Entrada actualizada correctamente");
          navigate(-1); // Volver a la página anterior
        } else {
          const data = await response.json();
          alert(data.mensaje); // Mostrar mensaje de error
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al procesar la solicitud");
      }
    }
  };

  // Función para validar los datos del formulario
  const validarDatos = () => {
    let validado = true; // Suponemos que el formulario es válido
    const validacionAux = {
      pelicula: false,
      fecha: false,
      hora: false,
      precio: false,
    };

    // Validar película
    if (datos.pelicula.length < 3) {
      validacionAux.pelicula = true;
      validado = false;
    }

    // Validar fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/; // Formato YYYY-MM-DD
    if (!fechaRegex.test(datos.fecha)) {
      validacionAux.fecha = true;
      validado = false;
    }

    // Validar hora
    const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Formato HH:MM en 24 horas
    if (!horaRegex.test(datos.hora)) {
      validacionAux.hora = true;
      validado = false;
    }

    // Validar precio
    const precioRegex = /^\d+(\.\d{1,2})?$/; // Número con hasta 2 decimales
    if (!precioRegex.test(datos.precio) || parseFloat(datos.precio) <= 0) {
      validacionAux.precio = true;
      validado = false;
    }

    // Actualizar el estado de validación
    setValidacion(validacionAux);
    return validado;
  };

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Modificar Entrada
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
            {/* Campo para la película */}
            <TextField
              id="outlined-basic"
              label="Película"
              variant="outlined"
              name="pelicula"
              value={datos.pelicula}
              onChange={handleChange}
              required
              error={validacion.pelicula}
              helperText={
                validacion.pelicula &&
                "Nombre de película incorrecto. Mínimo 3 caracteres"
              }
            />

            {/* Campo para la fecha */}
            <TextField
              id="outlined-basic"
              label="Fecha"
              variant="outlined"
              name="fecha"
              type="date"
              value={datos.fecha}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              error={validacion.fecha}
              helperText={
                validacion.fecha && "Fecha incorrecta. Formato: YYYY-MM-DD"
              }
            />

            {/* Campo para la hora */}
            <TextField
              id="outlined-basic"
              label="Hora"
              variant="outlined"
              name="hora"
              type="time"
              value={datos.hora}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              error={validacion.hora}
              helperText={validacion.hora && "Hora incorrecta. Formato: HH:MM"}
            />

            {/* Campo para el precio */}
            <TextField
              id="outlined-basic"
              label="Precio"
              variant="outlined"
              name="precio"
              type="number"
              value={datos.precio}
              onChange={handleChange}
              required
              error={validacion.precio}
              helperText={
                validacion.precio &&
                "Precio incorrecto. Debe ser un número positivo"
              }
            />

            {/* Botón para enviar el formulario */}
            <Button variant="contained" type="submit">
              Aceptar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default ModificarEntrada;
