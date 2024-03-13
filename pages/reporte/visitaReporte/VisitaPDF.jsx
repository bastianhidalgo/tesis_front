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
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

const VisitaPDF = ({ visita,ingresos, rol }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Reporte de Ingresos de Apoderado</Text>
        <Text style={styles.title}>Apoderado</Text>

        <Text style={styles.text}>Rut: {visita.rut}</Text>
        <Text style={styles.text}>Nombre: {visita.nombre} {visita.apellido}</Text>
        <Text style={styles.text}>Teléfono: {visita.telefono}</Text>
        <Text style={styles.text}>Rol: {rol}</Text>

        <Text style={styles.text}></Text>
        <Text style={styles.text}></Text>
        
        <Text style={styles.title}>Ingresos</Text>
        <Text style={styles.title}></Text>
        <Text style={styles.title}></Text>

        {ingresos && ingresos.length >0 ? (
          ingresos.map((Ingreso, index) => (
          <View key={index}>
            <Text style={styles.text}>N°: {index + 1} Fecha: {fechaSplit2(Ingreso.fechaIngreso)} Hora: {horaSplit(Ingreso.fechaIngreso)}</Text>
            <Text style={styles.text}>Motivo: {Ingreso.motivo}</Text>


            
            {/* Agrega cualquier otro dato que desees mostrar */}
          </View>
        ))):(
          <Text style={styles.text}>No hay ingresos registrados.</Text>

        )}
      </View>
    </Page>
  </Document>
);

export default VisitaPDF;
