import { Typography, TextField, Stack, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../config";

function ModificarCliente() {
  const params = useParams();
  const [datos, setDatos] = useState({
    idcliente: params.idcliente, // ID del cliente a modificar
    nombre: "",
    email: "",
    telefono: "",
  });

  const [validacion, setValidacion] = useState({
    nombre: false, // true si hay error
    email: false,
    telefono: false,
  });

  const navigate = useNavigate();

  // Cargar los datos del cliente al montar el componente
  useEffect(() => {
    async function getClienteById() {
      try {
        const response = await fetch(apiUrl + "/cliente/" + datos.idcliente);
        if (response.ok) {
          const data = await response.json();
          setDatos(data.datos); // Actualizar el estado con los datos del cliente
        } else if (response.status === 404) {
          const data = await response.json();
          alert(data.mensaje);
          navigate("/"); // Volver a la página principal si el cliente no existe
        }
      } catch (error) {
        console.error("Error cargando cliente:", error);
      }
    }

    getClienteById();
  }, [datos.idcliente, navigate]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    if (validarDatos()) {
      try {
        const response = await fetch(apiUrl + "/cliente/" + datos.idcliente, {
          method: "PUT", // Método HTTP para actualizar
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos), // Enviar los datos del cliente
        });

        if (response.ok) {
          alert("Cliente actualizado correctamente");
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
      nombre: false,
      email: false,
      telefono: false,
    };

    // Validar nombre
    if (datos.nombre.length < 3) {
      validacionAux.nombre = true;
      validado = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.email)) {
      validacionAux.email = true;
      validado = false;
    }

    // Validar teléfono
    const telefonoRegex = /^\d{9}$/; // Suponemos que el teléfono debe tener 9 dígitos
    if (!telefonoRegex.test(datos.telefono)) {
      validacionAux.telefono = true;
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
        Modificar Cliente
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
            {/* Campo para el nombre */}
            <TextField
              id="outlined-basic"
              label="Nombre"
              variant="outlined"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              required
              error={validacion.nombre}
              helperText={
                validacion.nombre && "Nombre incorrecto. Mínimo 3 caracteres"
              }
            />

            {/* Campo para el email */}
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              name="email"
              value={datos.email}
              onChange={handleChange}
              required
              error={validacion.email}
              helperText={
                validacion.email && "Email incorrecto. Formato: ejemplo@dominio.com"
              }
            />

            {/* Campo para el teléfono */}
            <TextField
              id="outlined-basic"
              label="Teléfono"
              variant="outlined"
              name="telefono"
              value={datos.telefono}
              onChange={handleChange}
              required
              error={validacion.telefono}
              helperText={
                validacion.telefono && "Teléfono incorrecto. Debe tener 9 dígitos"
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

export default ModificarCliente;