// ApoderadoPDF.jsx

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { fechaSplit2, horaSplit } from '../../../Components/util';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  section: {
    margin: 20,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },  
  subtitle: {
    fontSize: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

const VisitaPDF = ({ ingresos, fechaInicio,fechaTermino }) => (
    <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Reporte de Ingresos de visitas por fecha</Text>
        <Text style={styles.text}></Text>
        <Text style={styles.text}></Text>
        <Text style={styles.subtitle}>Fecha de inicio: {fechaInicio} </Text>
        <Text style={styles.subtitle}>Fecha de termino: {fechaTermino}</Text>
        <Text style={styles.text}></Text>
        <Text style={styles.text}></Text>
        {ingresos && ingresos.length > 0 ? (
          ingresos.map((Ingreso, index) => (
            <View key={index}>
              <Text style={styles.text}>N°: {index + 1} </Text>
              <Text style={styles.text}>Rut: {Ingreso.rut}</Text>
              <Text style={styles.text}>Nombre: {Ingreso.nombre} {Ingreso.apellido}</Text>
              <Text style={styles.text}>Rol: {Ingreso.rol} </Text>

              <Text style={styles.text}>Fecha: {fechaSplit2(Ingreso.fechaIngreso)} Hora: {horaSplit(Ingreso.fechaIngreso)}</Text>
              <Text style={styles.text}>Motivo: {Ingreso.motivo}</Text>
              <Text style={styles.text}></Text>
              <Text style={styles.title}></Text>
              <Text style={styles.title}></Text>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No hay ingresos registrados.</Text>
        )}
      </View>
    </Page>
  </Document>
);

export default VisitaPDF;
