import React, {useState, useEffect} from 'react'
import { clienteAxios } from '../clienteAxios';
const { UseRegexRut } = require('../../Components/util');
import { useRouter } from 'next/router'
import { Text,FormControl,FormLabel,Image,Button,Container,Heading,HStack, Stack, Table, Thead, Tr, Td,Tbody,Input} from '@chakra-ui/react';
import Swal   from 'sweetalert2'
import { fechaSplit2,horaSplit,fechaSplit } from '../../Components/util';



const ReporteEvento =() => {


  const [eventos, setEventos]= useState([{
    id_evento:'',
    tema:'',
    descripcion: '',
    fechaEvento:''
  }]);
  const [busqueda,setBusqueda]=useState('');
  const [evento, setEvento] = useState('');
  const [estado, setEstado] = useState('');
  const [rut,setRut]=useState('');
  const [fechaInicio,setFechainicio]=useState('');
  const [fechaTermino,setFechatermino]=useState('');
  const router = useRouter()
      const [visitaEvento, setVisitaEvento] = useState([
        {
          
          eventoId: evento.id_evento,
          visitaId: '',
        },
      ]);
    
    const handleError = err => {
    console.error(err)
    }

    const handleFechaInicioChange = (event) => {
      setFechainicio(event.target.value);
      console.log(fechaInicio)

    };
    console.log(fechaSplit(fechaInicio))
  
    const handleFechaTerminoChange = (event) => {
      setFechatermino(event.target.value);
    };
  
    const handleClickEnviar = () => {
      // Aquí puedes enviar fechainicio y fechatermino a otro archivo o hacer lo que necesites con ellos
      console.log('Fecha de Inicio:', fechainicio);
      console.log('Fecha de Termino:', fechatermino);
    };
      const getEventos = async () => {
        const response = await clienteAxios.get("/eventos/getall");
        if(response.status==200){
        setEventos(response.data.eventos)
        }
      }
        const handleSearchChange = (e) => {
          const nuevoTermino = e.target.value;
          setBusqueda(nuevoTermino);
      
          if (nuevoTermino === "") {
            getEventos(); 
          } else {
            filtrar(nuevoTermino);
          }
        };

        useEffect(() => {
          getEventos()
        },[])


      const filtrar = (terminoBusqueda) => {
        var resultadosBusqueda = eventos.filter((eventos) => {
          if (
            eventos.tema
              .toString()
              .toLowerCase()
              .includes(terminoBusqueda.toLowerCase()) ||
            eventos.fechaEvento
               ||
            horaSplit(eventos.fechaEvento)
          ) {
            return eventos;
          }
        });
        setEventos(resultadosBusqueda);
      };

return (
  <Container maxW="container.xl" mt={10}>
          <Image
        src='https://www.cspnc.cl/wp-content/uploads/2021/07/logo-cspnc-2021.png'
        onClick={()=>router.push('../../Home')}
        boxSize='25%'
        alt="Logo"
      />
    <Stack>
            <center>
            <Heading as="h1" size="xl" className="header" textAlign="center" mt="10">Generar Reporte Evento</Heading>
            </center>

            </Stack>


        <Stack>
        <Heading textAlign="center" as="h4" size="xl" mt="10"  >Por Fecha</Heading>

            <HStack style={{marginTop:40}}>
            <FormControl>
        <FormLabel>{"Fecha de Inicio"}</FormLabel>
        <Input value={fechaInicio}  onChange={handleFechaInicioChange} placeholder="Fecha de Inicio" type="date" />
        </FormControl>
        <FormControl>
        <FormLabel>{"Fecha de Termino (opcional)"}</FormLabel>
        <Input  value={fechaTermino} onChange={handleFechaTerminoChange} placeholder="Fecha de Termino" type="date" />
        </FormControl>
           
        </HStack>
            <HStack style={{marginLeft:1100}}>
            <Button colorScheme="blue" mt={10} mb={10} 
            onClick={()=>router.push(`./fechaEvento/${fechaSplit(fechaInicio)}${
        fechaTermino ? `/${fechaSplit(fechaTermino)}` : ''
      }`)} >Generar</Button>
      
            </HStack>
            <Heading textAlign="center" as="h4" size="xl"mt="10"   >Por Evento</Heading>

            <HStack>

            <Input
              type="text"
              className="form-control"
              placeholder="Buscar por tema"
              value={busqueda}
              onChange={handleSearchChange}
            />

            </HStack>
            </Stack>
            <Container maxW="container.xl" mt={10}>
            <Table variant="simple">
            <Thead>
              <Tr>
                <Td fontWeight={"bold"}>Tema</Td>
                <Td fontWeight={"bold"}>Fecha</Td>
                <Td fontWeight={"bold"}>Hora de inicio</Td>
                <Td fontWeight={"bold"}>Generar Reporte</Td>

              </Tr>
            </Thead>
            <Tbody border={"5"}>
              
              
              
                {eventos && eventos.length > 0 ? (
              eventos.map((Evento,idx)=>
  (
    <Tr key={idx}>
             <Td >{Evento.tema}</Td>
             <Td>{fechaSplit2(Evento.fecha)}</Td>
             <Td>{horaSplit(Evento.fecha)}</Td>
            <Td>
              <Button mr={3} colorScheme="blue" onClick={()=>router.push(`./eventoReporte/${Evento.codigo_evento}`)}>Generar</Button>
            </Td>

     </Tr>
))
)
: (
  <Tr>
    <Td colSpan={9} textAlign="center">
      No hay eventos registrados.
    </Td>
  </Tr>
)
}

</Tbody>
          </Table>
    

    </Container>
    
    <HStack style={{marginLeft:1100}}>
        <Button colorScheme="blue" mt={10} mb={10} onClick={() => router.push('./menu_reporte')}>Volver</Button>
        </HStack>
</Container>

);


        }

export default ReporteEvento;