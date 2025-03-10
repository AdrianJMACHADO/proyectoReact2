/**
 * @fileoverview Componente para el registro de nuevos clientes
 * @module AltaCliente
 */

import { Typography, TextField, Stack, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { useNavigate } from "react-router";
// Importamos las variables de entorno
import { apiUrl } from "../config";

/**
 * @component
 * @description Componente que maneja el formulario de registro de nuevos clientes.
 * Incluye validación de campos y comunicación con el backend.
 * @returns {JSX.Element} Formulario de registro de clientes
 */
function AltaCliente() {
  /**
   * @state
   * @description Estado que almacena los datos del formulario
   * @type {{nombre: string, email: string, telefono: string}}
   */
  const [datos, setDatos] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });
  const navigate = useNavigate();
  
  /**
   * @state
   * @description Estado que controla los errores de validación de cada campo
   * @type {{nombre: boolean, email: boolean, telefono: boolean}}
   */
  const [validacion, setValidacion] = useState({
    nombre: false, // true si hay error
    email: false,
    telefono: false,
  });
  
  /**
   * @function
   * @async
   * @description Maneja el envío del formulario, validando los datos y comunicándose con el backend
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    // No hacemos submit
    e.preventDefault();
    if (validarDatos()) {
      // Enviamos los datos mediante fetch
      try {
        const response = await fetch(apiUrl + "/cliente", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
        });

        if (response.ok) {
          const respuesta = await response.json();
          alert(respuesta.mensaje);
          if (respuesta.ok) {
            navigate("/"); // Volver a la página principal
          }
        } else {
          alert("Error al dar de alta el cliente");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al procesar la solicitud");
      }
    }
  };

  /**
   * @function
   * @description Valida los datos del formulario según las reglas de negocio
   * @returns {boolean} true si los datos son válidos, false en caso contrario
   */
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

  /**
   * @function
   * @description Maneja los cambios en los campos del formulario
   * @param {Event} e - Evento de cambio del campo
   */
  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Alta de clientes
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
            <Button variant="contained" type="submit">
              Aceptar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default AltaCliente;
