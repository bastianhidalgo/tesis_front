import React, {useState, useEffect,useRef} from 'react'
import { clienteAxios } from '../clienteAxios';
const { UseRegexRut } = require('../../Components/util');
import { useRouter } from 'next/router'
import { Menu,Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,IconButton,VStack,
  useDisclosure,Text,FormControl,FormLabel,Image,Button,Container,Heading,HStack, Stack, Table, Thead, Tr, Td,Tbody,Input} from '@chakra-ui/react';
import Swal   from 'sweetalert2'
import { fechaSplit2,horaSplit,fechaSplit } from '../../Components/util';
import {HamburgerIcon} from '@chakra-ui/icons'



const ReporteEvento =() => {

  const [errorFechaInicio, setErrorFechaInicio] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef();
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

    };
  
    const handleFechaTerminoChange = (event) => {
      setFechatermino(event.target.value);
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
<HStack>
       <IconButton
      icon={<HamburgerIcon />}
      aria-label="Abrir menú"
      onClick={onOpen}
      colorScheme='red'
    />
         <Image  mt={10} 
        src='https://www.cspnc.cl/wp-content/uploads/2021/07/logo-cspnc-2021.png'
        onClick={()=>router.push('../Home')}
        boxSize='25%'
        alt="Logo"
        style={{marginLeft:50,marginBottom:40}}
      /></HStack>
    <Stack>
            <center>
            <Heading as="h1" size="xl" className="header" textAlign="center" mt="10">Generar Reporte Evento</Heading>
            </center>
            <Drawer
        colorScheme='teal' 
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
               >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>Menú</DrawerHeader>

          <DrawerBody colorScheme='blue'> 
            <Menu >
            <DrawerFooter borderTopWidth='1px'>

    <Button   w="full"  colorScheme='teal' onClick={() => router.push('../Home')}>Inicio</Button>
        </DrawerFooter>
        <DrawerFooter borderTopWidth='1px'>
        <Button   colorScheme='teal' w="full"  onClick={() => router.push('../curso/listado')}>Cursos</Button>
     </DrawerFooter>
     <DrawerFooter borderTopWidth='1px'>
        <Button  colorScheme='teal' w="full"  onClick={() => router.push('../alumno/listado')}>Alumnos</Button>
        </DrawerFooter>
        <DrawerFooter borderTopWidth='1px'>
        
        <Button  colorScheme='teal' w="full"  onClick={() => router.push('../apoderado/listado')}>Apoderados</Button>
      
        </DrawerFooter >
        <DrawerFooter borderTopWidth='1px'>
        
        <Button   colorScheme='teal'  w="full" onClick={() => router.push('../evento')}>Eventos</Button>
       
        </DrawerFooter>
        <DrawerFooter borderTopWidth='1px'>
       
        <Button   colorScheme='teal' w="full" onClick={() => router.push('../reporte/menu_reporte')}>Reportes</Button>
        
        </DrawerFooter >
        
       
        </Menu>

          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
          <Button style={{marginRight:50}} colorScheme='red' mr={3} onClick={() => router.push('../')}>Cerrar sesión</Button>

            <Button colorScheme='blue' mr={3} onClick={onClose}>Cerrar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

            </Stack>


        <Stack>
        <Heading textAlign="center" as="h4" size="xl" mt="10"  >Por Fecha</Heading>

            <HStack style={{marginTop:40}}>

            <FormControl isInvalid={errorFechaInicio !== ''}>
  <FormLabel>{"Fecha de Inicio"}</FormLabel>
  <Input
    value={fechaInicio}
    onChange={handleFechaInicioChange}
    placeholder="Fecha de Inicio"
    type="date"
  />
  <Text color="red" fontSize="sm">
    {errorFechaInicio}
  </Text>
</FormControl>

           
        <FormControl style={{marginBottom:17}}>
        <FormLabel>{"Fecha de Termino (opcional)"}</FormLabel>
        <Input  value={fechaTermino} onChange={handleFechaTerminoChange} placeholder="Fecha de Termino" type="date" />
        </FormControl>
           
        </HStack>
            <HStack style={{marginLeft:1100}}>
            
            
            <Button
  colorScheme="blue"
  mt={10}
  mb={10}
  onClick={() => {
    if (!fechaInicio) {
      setErrorFechaInicio('Por favor, seleccione la fecha de inicio.');
    } else {
      setErrorFechaInicio(''); // Reinicia el mensaje de error
      router.push(`./fechaEvento/${fechaSplit(fechaInicio) + '-' + fechaSplit(fechaTermino)}`);
    }
  }}
>
  Generar
</Button>



            
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