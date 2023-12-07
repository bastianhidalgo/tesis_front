import { useState, useEffect } from 'react'
import {InputForm} from '../../../Components/InputForm'
import { Image,Button, Container, Heading, HStack, Stack, Select, Text,Table,Thead,Tr,Td,Tbody } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { clienteAxios } from '../../clienteAxios';
import { fechaSplit2, horaSplit } from '../../../Components/util';


export const getServerSideProps = async (context)=>{
    const id = context.query.reporte;
    const response = await clienteAxios.get(`/eventos/getone/${id}`)
    return{
        props: {
            data: response.data
        }
    }
}

const ReporteEvento =({ data }) => {
    const [evento, setEvento] = useState(data.evento);
    const router = useRouter()

    const [visitas, setVisitas] = useState([]);
    console.log(data.evento)

  useEffect(() => {
    // Verifica que haya información sobre el evento antes de cargar las visitas
    if (evento) {
      const cargarVisitas = async () => {
        try {
          const response = await clienteAxios.get(`/visita/getVisitas/${evento.codigo_evento}`);
          const idsVisitas = response.data.idsVisitas;
          // Realiza una sola solicitud para obtener información adicional de todas las visitas
          const respuesta = await clienteAxios.get(`/usuarios/getmany/${idsVisitas}`);
          // Actualiza el estado con todas las visitas y su información adicional
          setVisitas(respuesta.data);
        } catch (error) {
          console.error('Error al cargar las visitas:', error);
        }
      };
      cargarVisitas();
    }
  }, []);


    return (
    <Container maxW="container.xl" mt={10}>
                  <Image
        src='https://www.cspnc.cl/wp-content/uploads/2021/07/logo-cspnc-2021.png'
        boxSize='25%'
        alt="Logo"
        onClick={()=>router.push('/Home')}
      />
    <Heading as={"h1"} className="header" size={"xl"} textAlign="center" mt={10}>Evento</Heading>
    <Stack spacing={4} mt={10}>
        <HStack>
        <Text as={"h4"}>Tema: {evento.tema} </Text>
        </HStack>
        <HStack>

        <Text as={"h4"}>Descripción: {evento.descripcion} </Text>

        </HStack>
        <HStack>
        <Text as={"h4"}>Fecha: {fechaSplit2(evento.fecha)} </Text>
        </HStack>
        <HStack>
        <Text as={"h4"} >Hora: {horaSplit(evento.fecha)} </Text>
        </HStack>
        </Stack>

        <Heading as={"h1"}  size={"xl"} textAlign="center" mt={10}>Asistentes</Heading>

        <Stack spacing={4} mt="10">
          <Table variant="simple">
            <Thead>
              <Tr>
              <Td fontWeight={"bold"}>Rut</Td>
                <Td fontWeight={"bold"}>Nombre</Td>
                <Td fontWeight={"bold"}>Apellido</Td>
                <Td fontWeight={"bold"}>Rol</Td>
              </Tr>
            </Thead>
            <Tbody border={"5"}>
  {visitas && visitas.length > 0 ? (
    visitas.map((Visita, idx) => (
      <Tr key={idx}>
        <Td>{Visita.rut}</Td>
        <Td>{Visita.nombre}</Td>
        <Td>{Visita.apellido}</Td>
        <Td>{Visita.rol}</Td>
      </Tr>
    ))
  ) : (
    <Tr>
      <Td colSpan={4} textAlign="center">
        No hay asistentes registrados.
      </Td>
    </Tr>
  )}
</Tbody>
          </Table>
        </Stack>
        <HStack>
       </HStack>
    <HStack style={{marginLeft:1100}}>
        
        <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('../evento_reporte')}>Volver</Button>
    </HStack>
    </Container>
)}


export default ReporteEvento