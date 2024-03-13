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

const EventoPDF = ({ evento,visitas }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Reporte de ingresos a evento</Text>
        <Text style={styles.text}></Text>
        <Text style={styles.text}></Text>
        <Text style={styles.subtitle}>Tema: {evento.tema} </Text>
        <Text style={styles.subtitle}>Descripción: {evento.descripcion}</Text>

        <Text style={styles.subtitle}>Fecha: {fechaSplit2(evento.fecha)}</Text>
        <Text style={styles.subtitle}>Hora: {horaSplit(evento.fecha)}</Text>
        {visitas && visitas.length > 0 ? (
          visitas.map((Visita, index) => (
            <View key={index}>
              <Text style={styles.text}>N°: {index + 1} </Text>
              <Text style={styles.text}>Rut: {Visita.rut}</Text>
              <Text style={styles.text}>Nombre: {Visita.nombre} {Visita.apellido}</Text>
              <Text style={styles.text}>Rol: {Visita.rol}</Text>
              <Text style={styles.text}></Text>
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

export default EventoPDF;
