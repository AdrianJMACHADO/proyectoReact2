import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Box, Paper, Typography } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const EntradasChart = ({ data }) => {
  console.log('Recibiendo datos de entradas:', data);

  // Procesar datos para el gráfico de entradas por fecha
  const entradasPorFecha = data.reduce((acc, entrada) => {
    const fecha = new Date(entrada.fecha).toLocaleDateString('es-ES');
    const existingDate = acc.find(item => item.fecha === fecha);
    const precio = parseFloat(entrada.precio.replace('€', '').trim());
    
    if (existingDate) {
      existingDate.cantidad += 1;
      existingDate.ingresos += isNaN(precio) ? 0 : precio;
    } else {
      acc.push({
        fecha,
        cantidad: 1,
        ingresos: isNaN(precio) ? 0 : precio
      });
    }
    return acc;
  }, []);

  // Ordenar por fecha
  entradasPorFecha.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  // Procesar datos para el gráfico de películas más vendidas
  const peliculasVendidas = data.reduce((acc, entrada) => {
    const existingMovie = acc.find(item => item.pelicula === entrada.pelicula);
    const precio = parseFloat(entrada.precio.replace('€', '').trim());
    
    if (existingMovie) {
      existingMovie.cantidad += 1;
      existingMovie.ingresos += isNaN(precio) ? 0 : precio;
    } else {
      acc.push({
        pelicula: entrada.pelicula,
        cantidad: 1,
        ingresos: isNaN(precio) ? 0 : precio
      });
    }
    return acc;
  }, []);

  // Ordenar por cantidad de entradas vendidas
  peliculasVendidas.sort((a, b) => b.cantidad - a.cantidad);

  // Calcular totales para el gráfico circular
  const totalIngresos = peliculasVendidas.reduce((total, pelicula) => total + pelicula.ingresos, 0);
  const peliculasConPorcentaje = peliculasVendidas.map(pelicula => ({
    ...pelicula,
    porcentajeIngresos: (pelicula.ingresos / totalIngresos) * 100
  }));

  console.log('Datos procesados por fecha:', entradasPorFecha);
  console.log('Datos procesados por película:', peliculasVendidas);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" align="center" sx={{ mb: 4 }}>
        Análisis de Entradas
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        {/* Gráfico de línea temporal de ventas */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Evolución de Ventas por Fecha
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <ResponsiveContainer>
              <LineChart data={entradasPorFecha}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => {
                  if (name === "ingresos") return `${value.toFixed(2)} €`;
                  return value;
                }} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="cantidad"
                  stroke="#8884d8"
                  name="Cantidad de Entradas"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#82ca9d"
                  name="Ingresos (€)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Gráfico circular de distribución de ingresos */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Distribución de Ingresos por Película
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={peliculasConPorcentaje}
                  dataKey="ingresos"
                  nameKey="pelicula"
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  fill="#8884d8"
                  label={({name, percent}) => 
                    `${name} (${percent.toFixed(1)}%)`
                  }
                >
                  {peliculasConPorcentaje.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(2)} €`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Gráfico de barras de películas más vendidas */}
        <Paper sx={{ p: 3, gridColumn: '1 / -1' }}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Películas Más Vendidas
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={peliculasVendidas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pelicula" angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => {
                  if (name === "ingresos") return `${value.toFixed(2)} €`;
                  return value;
                }} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="cantidad"
                  fill="#8884d8"
                  name="Cantidad de Entradas"
                />
                <Bar
                  yAxisId="right"
                  dataKey="ingresos"
                  fill="#82ca9d"
                  name="Ingresos (€)"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default EntradasChart; 