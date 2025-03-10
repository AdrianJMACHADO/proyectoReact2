import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Typography, Box, Paper, Grid } from '@mui/material';
import { apiUrl } from "../config";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const ChartComponent = () => {
  const [clientes, setClientes] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesResponse, entradasResponse] = await Promise.all([
          fetch(apiUrl + "/cliente", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
          fetch(apiUrl + "/entrada", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })
        ]);

        if (clientesResponse.ok && entradasResponse.ok) {
          const clientesData = await clientesResponse.json();
          const entradasData = await entradasResponse.json();
          
          setClientes(clientesData.datos);
          setEntradas(entradasData.datos);
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Procesar datos para los gráficos
  const procesarDatos = () => {
    // Datos para el resumen mensual
    const resumenMensual = entradas.reduce((acc, entrada) => {
      const fecha = new Date(entrada.fecha);
      const mes = fecha.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
      const precio = parseFloat(entrada.precio.replace('€', '').trim());
      
      if (!acc[mes]) {
        acc[mes] = { mes, entradas: 0, ingresos: 0, clientes: new Set() };
      }
      acc[mes].entradas += 1;
      acc[mes].ingresos += precio;
      acc[mes].clientes.add(entrada.idcliente);
      return acc;
    }, {});

    // Convertir a array y calcular promedio por cliente
    const datosResumenMensual = Object.values(resumenMensual).map(mes => ({
      mes: mes.mes,
      entradas: mes.entradas,
      ingresos: mes.ingresos,
      clientesUnicos: mes.clientes.size,
      promedioEntradas: mes.entradas / mes.clientes.size
    })).sort((a, b) => new Date(a.mes) - new Date(b.mes));

    // Datos para el resumen por película
    const peliculasResumen = entradas.reduce((acc, entrada) => {
      if (!acc[entrada.pelicula]) {
        acc[entrada.pelicula] = {
          nombre: entrada.pelicula,
          entradas: 0,
          ingresos: 0,
          clientesUnicos: new Set()
        };
      }
      acc[entrada.pelicula].entradas += 1;
      acc[entrada.pelicula].ingresos += parseFloat(entrada.precio.replace('€', '').trim());
      acc[entrada.pelicula].clientesUnicos.add(entrada.idcliente);
      return acc;
    }, {});

    const datosPeliculas = Object.values(peliculasResumen)
      .map(pelicula => ({
        ...pelicula,
        clientesUnicos: pelicula.clientesUnicos.size
      }))
      .sort((a, b) => b.entradas - a.entradas);

    return {
      resumenMensual: datosResumenMensual,
      peliculas: datosPeliculas
    };
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" align="center">Cargando estadísticas...</Typography>
      </Box>
    );
  }

  const datos = procesarDatos();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        Dashboard General
      </Typography>

      <Grid container spacing={4}>
        {/* KPIs */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
            <Paper sx={{ p: 3, flex: 1, maxWidth: 200, textAlign: 'center' }}>
              <Typography variant="h6">Total Clientes</Typography>
              <Typography variant="h4">{clientes.length}</Typography>
            </Paper>
            <Paper sx={{ p: 3, flex: 1, maxWidth: 200, textAlign: 'center' }}>
              <Typography variant="h6">Total Entradas</Typography>
              <Typography variant="h4">{entradas.length}</Typography>
            </Paper>
            <Paper sx={{ p: 3, flex: 1, maxWidth: 200, textAlign: 'center' }}>
              <Typography variant="h6">Ingresos Totales</Typography>
              <Typography variant="h4">
                {entradas.reduce((total, entrada) => 
                  total + parseFloat(entrada.precio.replace('€', '').trim()), 0
                ).toFixed(2)} €
              </Typography>
            </Paper>
          </Box>
        </Grid>

        {/* Gráfico de evolución mensual */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              Evolución Mensual
            </Typography>
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={datos.resumenMensual}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => {
                    if (name === "ingresos") return `${value.toFixed(2)} €`;
                    return value.toFixed(2);
                  }} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="entradas"
                    stroke="#8884d8"
                    name="Entradas Vendidas"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#82ca9d"
                    name="Ingresos (€)"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="clientesUnicos"
                    stroke="#ffc658"
                    name="Clientes Únicos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>

        {/* Gráfico de películas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              Top Películas por Entradas
            </Typography>
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datos.peliculas.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value, name) => {
                    if (name === "ingresos") return `${value.toFixed(2)} €`;
                    return value;
                  }} />
                  <Legend />
                  <Bar dataKey="entradas" fill="#8884d8" name="Entradas Vendidas" />
                  <Bar dataKey="clientesUnicos" fill="#82ca9d" name="Clientes Únicos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>

        {/* Gráfico de distribución de ingresos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              Distribución de Ingresos por Película
            </Typography>
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datos.peliculas}
                    dataKey="ingresos"
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    fill="#8884d8"
                    label={({name, percent}) => 
                      `${name} (${(percent * 100).toFixed(1)}%)`
                    }
                  >
                    {datos.peliculas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(2)} €`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChartComponent; 