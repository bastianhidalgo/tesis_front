import { React,useState, useEffect, useRef } from 'react';
import { clienteAxios } from '../clienteAxios';
import { useRouter } from 'next/router'
import {  Drawer,Menu,FormControl,FormLabel,Select,
  DrawerBody,
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
import { fechaSplit2 } from '../../Components/util';
import { format } from 'date-fns';

function Alumnos({  }) {
    const [modalApoderados, setModalApoderados] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(1);
    const [cursitos, setCursitos]= useState([]);

    const [alumnos, setAlumnos]= useState([{
        id_alumno:'',
        rut:'',
        nombre: '',
        apellido:'',
        curso: '',
        apoderados:[],
      }]);
      const [cursos, setCursos]= useState([{
        id_curso:'',
        nombre:'',
        descripcion: ''        
      }]);

      const [busqueda, setBusqueda] = useState("");
      const [modalAlumnos, setModalAlumnos] = useState([{
        id_alumno:'',
        rut:'',
        nombre: '',
        apellido:'',
        curso: '',
}]);

        const btnRef = useRef();
        const { isOpen, onOpen, onClose } = useDisclosure()
        const router = useRouter()
        const [modalStates, setModalStates] = useState([]); 

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
                    console.log(error);
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


        const getAlumnos = async () => {
          try {
             
      
              let response;
      
              if (cursoSeleccionado === '') {
               
                  response = await clienteAxios.get(`/alumnos/getAlumnos/${cursoSeleccionado}`);
              } else {
                  response = await clienteAxios.get(`/alumnos/getAlumnos/${cursoSeleccionado}`);
              }
      
              if (response.status === 200) {
                  const alumnosData = response.data.alumnos;
                  const alumnosConApoderados = await Promise.all(alumnosData.map(async (alumno) => {
                      const responseApoderados = await clienteAxios.get(`/alumnoApoderado/getApoderados/${alumno.id_alumno}`);
                      const apoderadosIds = responseApoderados.data.idsApoderados;
                      const responseCursos = await clienteAxios.get(`/cursos/getone/${alumno.cursoId}`);
                      const cursos = responseCursos.data.curso;
      
                      setCursos(cursos);
                      alumno.curso = cursos.nombre;
      
                      const apoderadosDetalles = await Promise.all(apoderadosIds.map(async (apoderadoId) => {
                          const responseApoderado = await clienteAxios.get(`/apoderados/getone/${apoderadoId}`);
                          return responseApoderado.data.apoderado;
                      }));
      
                      return { ...alumno, apoderados: apoderadosDetalles };
                  }));
      
                  setAlumnos(alumnosConApoderados);
              }


          } catch (error) {
              console.error("Error fetching data:", error);
              setModalAlumnos("")
          }
      };
         
      useEffect(() => {
        getAlumnos();
      }, [cursoSeleccionado]);
    
      useEffect(() => {
        const fetchCursos = async () => {
          try {
            const response = await clienteAxios.get("/cursos/getall");
            if (Array.isArray(response.data.cursos)) {
              setCursitos(response.data.cursos);
            } else {
              console.error("Error: Los cursos no son un array", response.data.cursos);
            }
          } catch (error) {
            console.error("Error al obtener cursos:", error);
          }
        };
        fetchCursos();
      }, []);

        const filtrar = (terminoBusqueda) => {
          var resultadosBusqueda = alumnos.filter((alumno) => {
            if (
                alumno.nombre
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) ||
                alumno.apellido
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) ||
                alumno.rut
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) 
            ) {
              return alumnos;
            }
          });
          setAlumnos(resultadosBusqueda);
        };

        const handleSearchChange = (e) => {
          const nuevoTermino = e.target.value;
          setBusqueda(nuevoTermino);

          if (nuevoTermino === "") {
            getAlumnos(); 
          } else {
            filtrar(nuevoTermino);
          }
        };


        const deleteVisita = async(e) => {
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

                await clienteAxios.delete(`/alumnos/delete/${e}`)

                Swal.fire(
                  'Borrado!',
                  'Visita ha sido borrada',
                  'success'
                )
                getAlumnos();
              }
            })

          }

          const openModal = (index) => {
            console.log('Datos del alumno:', alumnos[index]); // Agrega esta línea
            setModalApoderados(alumnos[index]?.apoderados || []);
            const newModalStates = [...modalStates];
            newModalStates[index] = true;
            setModalStates(newModalStates);
          };
          const closeModal = () => {
            setModalStates(modalStates.map(() => false));
          };

          const RegistrarVisita = async(e) => {
            Swal.fire({
                title: '¿Seguro?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, registrar'
              }).then(async(result) => {
                if (result.isConfirmed) {
                  ingreso.visitaId=e;
                  ingreso.fechaIngreso=currentDateTime;
                  const respuesta= await clienteAxios.post("/ingresos/create",ingreso);

                  Swal.fire(
                    'Registrada!',
                    'Visita ha sido registrada',
                    'success'
                  )
                  getAlumnos();
                }
              })

            }


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
        onClick={()=>router.push('../Home')}
        boxSize='25%'
        alt="Logo"
        style={{marginLeft:50,marginBottom:40}}
      /></HStack>
      <Box>
      <Heading  as="h1" size="xl" className="header" textAlign="center"mt="10" >Alumnos CSPN Concepción</Heading>
      </Box>

      <Button   colorScheme='blue' mt="10" onClick={() => router.push('./crearAlumno')}>Crear Alumno</Button>


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
          <Button style={{marginRight:50}} colorScheme='red' mr={3} onClick={() => router.push('../../')}>Cerrar sesión</Button>

            <Button colorScheme='blue' mr={3} onClick={onClose}>Cerrar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>


        <Heading textAlign="center" as="h4" size="xl"   mt="10">Listado Alumnos</Heading>


        <Stack spacing={4} mt={10} direction="column">
            <HStack>
              <FormControl id="busqueda">

              <FormLabel>Filtrar:</FormLabel>
              <Input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre, apellido, rut"
                value={busqueda}
                onChange={handleSearchChange}
              />
  </FormControl>
                <FormControl  id="curso">
                <FormLabel>Filtrar:</FormLabel>

                <Select
                   onChange={(e) => {
                    setCursoSeleccionado(e.target.value);
                  }}
    label="Curso"
    name="curso"
    placeholder="Seleccione curso"
    value={cursoSeleccionado || ''} // Asegúrate de usar cursoSeleccionado
    >
    {cursitos.map((curso) => (
        <option key={curso.id_curso} value={curso.id_curso}>
            {curso.nombre}
        </option>
    ))}
</Select>

</FormControl>
                </HStack>
  </Stack>
        <Stack spacing={4} mt="10">
          <Table variant='striped'>
            <Thead>
              <Tr>
              <Td fontWeight={"bold"}>RUN</Td>
                <Td fontWeight={"bold"}>Nombre</Td>
                <Td fontWeight={"bold"}>Apellido</Td>
                <Td fontWeight={"bold"}>Curso</Td>

                <Td fontWeight={"bold"}>Ver Apoderado(s)</Td>
                <Td fontWeight={"bold"}>Modificar</Td>
                <Td fontWeight={"bold"}>Eliminar</Td>

              </Tr>
            </Thead>
            <Tbody border={"5"}>
  
            {alumnos != undefined && alumnos.length >= 1 ?  (
            alumnos.map((Alumno,idx)=>
              (
                <Tr key={idx}>
             <Td >{Alumno.rut}</Td>
             <Td >{Alumno.nombre}</Td>
             <Td>{Alumno.apellido}</Td>
             <Td>{Alumno.curso}</Td>

             <Td>

             <Button colorScheme="blue" onClick={() => openModal(idx)}>Apoderado</Button>

                <Modal closeOnOverlayClick={false} isOpen={modalStates[idx]} onClose={closeModal}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>                    <Heading size="md">Apoderado(s) asociados al alumno:</Heading>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={3}>
                    {modalApoderados.map((apoderado, idxApoderado) => (
                        <VStack key={idxApoderado} align="stretch" mt={4}>
                        <Text>Nombre: {apoderado.nombre}</Text>
                        <Text>Apellido: {apoderado.apellido}</Text>
                        <Text>Rut: {apoderado.rut}</Text>
                        <Text>Teléfono: {apoderado.telefono}</Text>

                        </VStack>
                    ))}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={closeModal}>Cerrar</Button>
                    </ModalFooter>
                    </ModalContent>
                </Modal></Td>
                <Td>

<Button colorScheme="green"   onClick={()=>router.push(`./modificar/${Alumno.id_alumno}`)}>Modificar</Button>
</Td>
<Td>

<Button colorScheme="red" onClick={()=>deleteAlumno(Alumno.id_alumno)} style={{marginLeft:10}}  >Eliminar</Button>

</Td>
              

     </Tr>
)
)
): (
  <Tr>
<Td colSpan={7} textAlign="center">
        No hay alumnos registrados.
    </Td>
  </Tr>
)
}

</Tbody>
          </Table>
        </Stack>
      </Container>
       
    );
    }
    export default Alumnos;