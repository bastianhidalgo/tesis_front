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
    const responseAlumnos = await clienteAxios.get(`/alumnos/getAlumnos/${id}`);
    const responseCurso = await clienteAxios.get(`/cursos/getone/${id}`);
    return{
        props: {
            data: responseAlumnos.data,
            datax:responseCurso.data
        }
    }
}

const ListadoAlumnos =({ data,datax }) => {

    const [modalAlumnos, setModalAlumnos] = useState([]);
    const [modalEventos, setModalEventos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [busqueda, setBusqueda] = useState('');

      const [cursitos, setCursitos]= useState([]);

    const [curso, setCurso]= useState((datax.curso));


    const [alumno, setAlumno] = useState(data.alumnos.length > 0 ? data.alumnos : null);
                   
        const btnRef = useRef();
        const { isOpen, onOpen, onClose } = useDisclosure()
        const router = useRouter()
        const [modalStates, setModalStates] = useState([]); 
        const [modalStates2, setModalStates2] = useState([]); 
        const getAlumnos = async () => {
            try {
                console.log(data)
            } catch (error) {
                console.error(error);
            }
        };
        
        
      
        
        useEffect(() => {
            console.log(alumno)

          getAlumnos();

        }, []);
        const deleteAlumno = async(e) => {
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
                  await clienteAxios.delete(`/alumnos/delete/${e}`)
  
                  }catch(error){
                    console.error(error)
                  }
  
                  Swal.fire(
                    'Borrado!',
                    'Alumno ha sido borrado',
                    'success'
                  )
                  getAlumnos();
                }
              })
  
            }
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


        const deleteCurso = async(e) => {
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
                await clienteAxios.delete(`/cursos/delete/${e}`)

                }catch(error){
                  console.error(error)
                }

                Swal.fire(
                  'Borrado!',
                  'Visita ha sido borrada',
                  'success'
                )
                getCursos();
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
        <Heading textAlign="center" as="h4" size="xl"  >Listado Alumnos</Heading>


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
                <Td fontWeight={"bold"}>Rut</Td>
                <Td fontWeight={"bold"}>Nombre</Td>
                <Td fontWeight={"bold"}>Apellido</Td>
                <Td fontWeight={"bold"}>Modificar</Td>
                <Td fontWeight={"bold"}>Eliminar</Td>

              </Tr>
            </Thead>
            <Tbody border={"5"}>
  
            {alumno && alumno.length  > 0 ? (
            alumno.map((Alumno,idx)=>
              (
                <Tr key={idx}>
             <Td >{Alumno.rut}</Td>
             <Td >{Alumno.nombre}</Td>
             <Td >{Alumno.apellido}</Td>


               
   <Td><Button colorScheme="green"   onClick={()=>router.push(`../../alumno/modificar/${Alumno.id_alumno}`)}>Modificar</Button>
</Td>
            
             <Td><Button colorScheme="red" onClick={()=>deleteAlumno(Curso.id_curso)} style={{marginLeft:10}}  >Eliminar</Button>
</Td>
             

     </Tr>
)
)
): (
  <Tr>
    <Td colSpan={9} textAlign="center">
      No hay alumnos registrados en este curso.
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
    export default ListadoAlumnos;