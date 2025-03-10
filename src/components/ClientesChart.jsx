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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Box, Paper, Typography } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const ClientesChart = ({ clientes, entradas }) => {
  console.log('Recibiendo clientes:', clientes);
  console.log('Recibiendo entradas:', entradas);

  // Procesar datos para el gráfico de entradas por cliente
  const entradasPorCliente = clientes.map(cliente => {
    const entradasCliente = entradas.filter(entrada => entrada.idcliente === cliente.idcliente);
    const totalGastado = entradasCliente.reduce((total, entrada) => {
      const precio = parseFloat(entrada.precio.replace('€', '').trim());
      return total + (isNaN(precio) ? 0 : precio);
    }, 0);

    return {
      name: cliente.nombre,
      entradas: entradasCliente.length,
      gastado: totalGastado
    };
  });

  // Ordenar por número de entradas
  entradasPorCliente.sort((a, b) => b.entradas - a.entradas);

  console.log('Datos procesados:', entradasPorCliente);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" align="center" sx={{ mb: 4 }}>
        Análisis de Clientes
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        {/* Gráfico de barras de entradas por cliente */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Entradas y Gastos por Cliente
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={entradasPorCliente}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => {
                  if (name === "gastado") return `${value.toFixed(2)} €`;
                  return value;
                }} />
                <Legend />
                <Bar yAxisId="left" dataKey="entradas" fill="#8884d8" name="Número de Entradas" />
                <Bar yAxisId="right" dataKey="gastado" fill="#82ca9d" name="Total Gastado (€)" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Gráfico circular de distribución de clientes */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Distribución de Entradas por Cliente
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={entradasPorCliente}
                  dataKey="entradas"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  fill="#8884d8"
                  label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {entradasPorCliente.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} entradas`, props.payload.name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ClientesChart; 