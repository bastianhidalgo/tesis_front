import { React,useState, useEffect, useRef } from 'react';
import { clienteAxios } from '../../clienteAxios';
import { useRouter } from 'next/router'
import {  Menu,Drawer,
  DrawerBody,FormControl,FormLabel,Select,Card,CardHeader,CardBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,Image,Box,Button,Container,Heading, Stack, Table, Thead, Tr, Td,Tbody ,Input, HStack,IconButton, VStack,Text,Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton} from '@chakra-ui/react';
import Swal   from 'sweetalert2'
import {HamburgerIcon} from '@chakra-ui/icons'
import { fechaSplit2 ,horaSplit} from '../../../Components/util';
import { format } from 'date-fns';

export const getServerSideProps = async (context)=>{
    const id = context.query.listado;
    const responseEventos = await clienteAxios.get(`cursoEvento/getEventos/${id}`);
    const responseCurso = await clienteAxios.get(`/cursos/getone/${id}`);
    return{
        props: {
            data: responseEventos.data,
            datax:responseCurso.data
        }
    }
}

const ListadoEventos =({ data,datax }) => {
    const [modalAlumnos, setModalAlumnos] = useState([]);
    const [modalEventos, setModalEventos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [busqueda, setBusqueda] = useState('');

      const [cursitos, setCursitos]= useState([]);

    const [curso, setCurso]= useState((datax.curso));


      const [evento,setEvento]=useState([{
        tema:'',
        descripcion: '',
        fecha:'',
      }]);
   
      const [eventos,setEventos]=useState([(data.idsEventos)]);
        const btnRef = useRef();
        const { isOpen, onOpen, onClose } = useDisclosure()
        const router = useRouter()
        const [modalStates, setModalStates] = useState([]); 
        const [modalStates2, setModalStates2] = useState([]); 
        const getEventos = async () => {
            try {
                console.log(curso);
        
                const eventosDetalles = await Promise.all(eventos.flat().map(async (eventoId) => {
                    try {
                        const responseEvento = await clienteAxios.get(`/eventos/getone/${eventoId}`);
                        console.log(responseEvento);
                        return responseEvento.data.evento;
                    } catch (error) {
                        console.log(error);
                        // Puedes manejar el error aquí si es necesario
                        return null; // Otra opción es retornar null en caso de error
                    }
                }));
        
                setEvento(eventosDetalles.filter(evento => evento !== null));
            } catch (error) {
                console.error(error);
            }
        };
        
        
      
        
        useEffect(() => {
          
          getEventos();

        }, []);

        const filtrar = (terminoBusqueda) => {
          var resultadosBusqueda = cursos.filter((curso) => {
            if (
                curso.nombre
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) ||
                curso.descripcion
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase())
            ) {
              return cursos;
            }
          });
          setCursos(resultadosBusqueda);
        };

        const handleSearchChange = (e) => {
          const nuevoTermino = e.target.value;
          setBusqueda(nuevoTermino);

          if (nuevoTermino === "") {
            getCursos()
          } else {
            filtrar(nuevoTermino);
          }
        };


        const deleteEvento = async(e) => {
          Swal.fire({
              title: '¿Seguro?',
              text: "No podrás revertir esta decisión",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sí, borrar!'
            }).then(async(result) => {
              if (result.isConfirmed) {

                try{
                await clienteAxios.delete(`/eventos/delete/${e}`)

                }catch(error){
                  console.error(error)
                }

                Swal.fire(
                  'Borrado!',
                  'Evento ha sido borrado',
                  'success'
                )
                getEventos();
              }
            })

          }
          const openModal = (index) => {
            console.log('Datos del alumno:', cursos[index]); // Agrega esta línea
            setModalAlumnos(cursos[index]?.alumnos || []);
            const newModalStates = [...modalStates];
            newModalStates[index] = true;
            setModalStates(newModalStates);
          };
          const closeModal = () => {
            setModalStates(modalStates.map(() => false));
          };
          const openModal2 = (index) => {
            console.log('Datos del evento:', cursos[index]); // Agrega esta línea
            setModalEventos(cursos[index]?.eventos || []);
            const newModalStates = [...modalStates2];
            newModalStates[index] = true;
            setModalStates2(newModalStates);
          };
          const closeModal2 = () => {
            setModalStates2(modalStates2.map(() => false));
          };


         
    return(

      <Container  maxW="container.xl" >
        <HStack>
       <IconButton
      icon={<HamburgerIcon />}
      aria-label="Abrir menú"
      onClick={onOpen}
      colorScheme='red'
    />
         <Image  mt={10} 
        src='https://www.cspnc.cl/wp-content/uploads/2021/07/logo-cspnc-2021.png'
        onClick={()=>router.push('../../Home')}
        boxSize='25%'
        alt="Logo"
        style={{marginLeft:50,marginBottom:40}}
      /></HStack>
      <Box>
      <Heading  as="h1" size="xl" className="header" textAlign="center"mt="10" >Eventos CSPN Concepción</Heading>
      </Box>



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
        <Button   colorScheme='teal' w="full"  onClick={() => router.push('../../curso/listado')}>Cursos</Button>
     </DrawerFooter>
     <DrawerFooter borderTopWidth='1px'>
        <Button  colorScheme='teal' w="full"  onClick={() => router.push('../../alumno/listado')}>Alumnos</Button>
        </DrawerFooter>
        <DrawerFooter borderTopWidth='1px'>
        
        <Button  colorScheme='teal' w="full"  onClick={() => router.push('../../apoderado/listado')}>Apoderados</Button>
      
        </DrawerFooter >
        <DrawerFooter borderTopWidth='1px'>
        
        <Button   colorScheme='teal'  w="full" onClick={() => router.push('../../evento')}>Eventos</Button>
       
        </DrawerFooter>
        <DrawerFooter borderTopWidth='1px'>
       
        <Button   colorScheme='teal' w="full" onClick={() => router.push('../../reporte/menu_reporte')}>Reportes</Button>
        
        </DrawerFooter >
        
       
        </Menu>

          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
          <Button style={{marginRight:50}} colorScheme='red' mr={3} onClick={() => router.push('../')}>Cerrar sesión</Button>

            <Button colorScheme='blue' mr={3} onClick={onClose}>Cerrar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Stack spacing={4} mt={10}>
<HStack>
      <Card style={{marginBottom:50}}>
  <CardHeader>
    <Heading size='md'>Datos del Curso</Heading>
    <CardBody>
      <FormControl>
        <Text as={"h5"}>Curso: {curso.nombre}  </Text>

        <Text style={{marginTop:30}} as={"h5"}>Descripción: {curso.descripcion} </Text>


</FormControl>
</CardBody>
</CardHeader>
</Card>
</HStack>
</Stack>
        <Heading textAlign="center" as="h4" size="xl"  >Listado Eventos</Heading>


        <Stack spacing={4} mt={10} direction="column">
            <HStack>
              <FormControl id="busqueda">

              <FormLabel>Filtrar:</FormLabel>
              <Input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre, descripción"
                value={busqueda}
                onChange={handleSearchChange}
              />
  </FormControl>

                </HStack>
  </Stack>
        <Stack spacing={4} mt="10">
          <Table variant='striped'>
            <Thead>
              <Tr>
                <Td fontWeight={"bold"}>Tema</Td>
                <Td fontWeight={"bold"}>Fecha</Td>
                <Td fontWeight={"bold"}>Hora</Td>
                <Td fontWeight={"bold"}>Modificar</Td>
                <Td fontWeight={"bold"}>Eliminar</Td>

              </Tr>
            </Thead>
            <Tbody border={"5"}>
  
            {evento && evento.length  > 0 ? (
            evento.map((Evento,idx)=>
              (
                <Tr key={idx}>
             <Td >{Evento.tema}</Td>
             <Td >{fechaSplit2(Evento.fecha)}</Td>
             <Td >{horaSplit(Evento.fecha)}</Td>

               
   <Td><Button colorScheme="green"   onClick={()=>router.push(`../../evento/Modificar/${Evento.codigo_evento}`)}>Modificar</Button>
</Td>
            
             <Td><Button colorScheme="red" onClick={()=>deleteEvento(Evento.codigo_evento)} style={{marginLeft:10}}  >Eliminar</Button>
</Td>
             

     </Tr>
)
)
): (
  <Tr>
    <Td colSpan={9} textAlign="center">
      No hay eventos registrados por este curso.
    </Td>
  </Tr>
)
}

</Tbody>
          </Table>
        </Stack>
        <HStack style={{marginLeft:1100}}>
          <Button  colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('../listado')}>Volver</Button>
          </HStack>
      </Container>
       
    );
    }
    export default ListadoEventos;