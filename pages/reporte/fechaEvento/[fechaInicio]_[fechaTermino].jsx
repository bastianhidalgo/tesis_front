import { useState, useEffect } from 'react'
import { Image,Button, Container, Heading, HStack, Stack, Select, Text,Table,Thead,Tr,Td,Tbody } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { clienteAxios } from '../../clienteAxios';
import { fechaSplit2, horaSplit } from '../../../Components/util';


export const getServerSideProps = async (context) => {
  const fechaInicio = context.query.fechaInicio;
  const fechaTermino = context.query.fechaTermino;
  console.log('Fecha de inicio:', context.query);
  console.log('Fecha de término:', fechaTermino);

  let endpoint = `/eventos/getallbydate/${fechaInicio}`;
  // Si la fecha de término está presente, agrégala al endpoint
 if (fechaTermino) {
    endpoint = endpoint + (`/${fechaTermino}`);
  }
  try {
    const response = await clienteAxios.get(endpoint);
    console.log(response)

    return {
      props: {
        data: response.data
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
console.log(error)
    return {
      props: {
        data: null,
      },
    };
  }
  };

const ReporteEventoFechas =({ data }) => {
    const [evento, setEvento] = useState('');
    const router = useRouter()
    const [fechaInicio, setFechainicio] = useState('');
    const [eventos, setEventos] = useState(data);
    const [fechaTermino, setFechatermino] = useState('');

  console.log(data)
  /*useEffect(() => {
    // Verifica que haya información sobre el evento antes de cargar las visitas
    if (evento) {
      const cargarEventos = async () => {
        try {
          const response = await clienteAxios.get(`/visita/getVisitas/${evento.id_evento}`);
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
  }, []);*/


    return (
    <Container maxW="container.xl" mt={10}>
                  <Image
        src='https://www.cspnc.cl/wp-content/uploads/2021/07/logo-cspnc-2021.png'
        boxSize='25%'
        alt="Logo"
        onClick={()=>router.push('/Home')}
      />
    <Heading as={"h1"} className="header" size={"xl"} textAlign="center" mt={10}>Historial de Eventos</Heading>
    <Stack spacing={4} mt={10}>
        <HStack>
        <Text as={"h4"}>Fecha Inicio: {fechaSplit2(fechaInicio)} </Text>
        <Text as={"h4"} style={{marginLeft:500}} >Fecha Término: {fechaSplit2(fechaTermino)} </Text>
        </HStack>
        </Stack>

        <Heading as={"h1"}  size={"xl"} textAlign="center" mt={10}>Eventos</Heading>

        <Stack spacing={4} mt="10">
          <Table variant="simple">
            <Thead>
              <Tr>
              <Td fontWeight={"bold"}>Tema</Td>
                <Td fontWeight={"bold"}>Fecha</Td>
                <Td fontWeight={"bold"}>Hora</Td>
              </Tr>
            </Thead>
            <Tbody border={"5"}>
  {eventos && eventos.length > 0 ? (
    eventos.map((Evento, idx) => (
      <Tr key={idx}>
        <Td>{Evento.tema}</Td>
        <Td>{fechaSplit2(Evento.fecha)}</Td>
        <Td>{horaSplit(Evento.fecha)}</Td>
      </Tr>
    ))
  ) : (
    <Tr>
      <Td colSpan={4} textAlign="center">
        No hay eventos registrados.
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


export default ReporteEventoFechas