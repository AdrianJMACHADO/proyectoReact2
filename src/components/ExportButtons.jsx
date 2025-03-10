import React from 'react';
import { Button, Stack, Box } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF generado con react-pdf
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: 'auto',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  // Estilos específicos para cada columna
  idCell: {
    width: '40',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  clienteCell: {
    width: '40',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  peliculaCell: {
    width: '120',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  fechaCell: {
    width: '80',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  horaCell: {
    width: '70',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  precioCell: {
    width: '60',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'right',
  },
});

// Función para formatear la fecha
const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES');
};

// Función para formatear la hora
const formatHora = (hora) => {
  return hora.substring(0, 5);
};

// Función para formatear el precio
const formatPrecio = (precio) => {
  const precioNumerico = typeof precio === 'string'
    ? parseFloat(precio.replace(',', '.').replace('€', '').trim())
    : precio;

  return !isNaN(precioNumerico)
    ? precioNumerico.toFixed(2) + ' €'
    : 'N/A';
};

// Componente PDF para react-pdf
const MyDocument = ({ data, title }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{title || 'Listado'}</Text>
        <View style={styles.table}>
          {data && data.length > 0 && (
            <>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.idCell}>ID</Text>
                <Text style={styles.clienteCell}>CLI.</Text>
                <Text style={styles.peliculaCell}>PELÍCULA</Text>
                <Text style={styles.fechaCell}>FECHA</Text>
                <Text style={styles.horaCell}>HORA</Text>
                <Text style={styles.precioCell}>PRECIO</Text>
              </View>
              {data.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.idCell}>{item.identrada}</Text>
                  <Text style={styles.clienteCell}>{item.idcliente}</Text>
                  <Text style={styles.peliculaCell}>{item.pelicula}</Text>
                  <Text style={styles.fechaCell}>{formatFecha(item.fecha)}</Text>
                  <Text style={styles.horaCell}>{formatHora(item.hora)}</Text>
                  <Text style={styles.precioCell}>{formatPrecio(item.precio)}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </View>
    </Page>
  </Document>
);

const ExportButtons = ({ chartRef, listRef, data, title }) => {
  // Función para exportar la gráfica a PDF
  const exportChartToPDF = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${title || 'grafica'}.pdf`);
      } catch (error) {
        console.error('Error al exportar la gráfica:', error);
      }
    }
  };

  // Función para imprimir usando el navegador
  const handlePrint = () => {
    window.print();
  };

  // Función para exportar el listado a PDF usando html2canvas
  const exportListToPDF = async () => {
    if (listRef.current) {
      try {
        const canvas = await html2canvas(listRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${title || 'listado'}.pdf`);
      } catch (error) {
        console.error('Error al exportar el listado:', error);
      }
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      width: '100%',
      mt: 3, 
      mb: 3 
    }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        sx={{ 
          maxWidth: 'fit-content',
          '& > *': { minWidth: { xs: '200px', sm: 'auto' } }
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={exportChartToPDF}
        >
          Exportar Gráfica a PDF
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePrint}
        >
          Imprimir Listado
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={exportListToPDF}
        >
          Exportar Listado a PDF (Imagen)
        </Button>
        <PDFDownloadLink
          document={<MyDocument data={data} title={title} />}
          fileName={`${title || 'listado'}-estructurado.pdf`}
          style={{ textDecoration: 'none' }}
        >
          {({ blob, url, loading, error }) => (
            <Button
              variant="contained"
              color="info"
              disabled={loading}
            >
              {loading ? 'Generando PDF...' : 'Descargar PDF Estructurado'}
            </Button>
          )}
        </PDFDownloadLink>
      </Stack>
    </Box>
  );
};

export default ExportButtons; 