import { React,useState, useEffect, useRef } from 'react';
import { clienteAxios } from '../clienteAxios';
import { useRouter } from 'next/router'
import {  Menu,Drawer,
  DrawerBody,FormControl,FormLabel,Select,
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
import {InputForm,TextForm} from '../../Components/InputForm'
function Curso( ) {
    const [modalAlumnos, setModalAlumnos] = useState([]);
    const [modalEventos, setModalEventos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [isCreateCursoModalOpen, setIsCreateCursoModalOpen] = useState(false);

      const [cursitos, setCursitos]= useState([]);
      const [errorDescripcion, setErrorDescripcion] = useState('');

    const [cursos, setCursos]= useState([{
       id_curso:'',
        nombre:'',
        descripcion: '',
        alumnos: [],
        eventos: [],
      }]);
      const [cursoNuevo, setCursoNuevo]= useState([{
         nombre:'',
         descripcion: ''
         
       }]);
      const [alumnos,setAlumnos]=useState([{
        rut:'',
        nombre: '',
        apellido:'',
      }]);
      const [eventos,setEventos]=useState([{
        tema:'',
        descripcion: '',
        fecha:'',
      }]);
      const [busqueda, setBusqueda] = useState("");
      const [ingreso,setIngreso]= useState({
        fechaIngreso: '',
        visitaId:''
      })

        const btnRef = useRef();
        const { isOpen, onOpen, onClose } = useDisclosure()
        const router = useRouter()
        const [modalStates, setModalStates] = useState([]); 
        const [modalStates2, setModalStates2] = useState([]); 


        const handleCreateCursoModalOpen = () => {
          setIsCreateCursoModalOpen(true);
        };
      
        const handleCreateCursoModalClose = () => {
          setIsCreateCursoModalOpen(false);
        };

        const submitCurso= async () => {
       
          try{
             
               const response = await clienteAxios.post("/cursos/create",cursoNuevo);
    
             
            if(response.status==200){
              console.log("Curso creado")
              Swal.fire({
                  icon:'success',
                  title:'Excelente!',
                  showConfirmButton: true,
                  text: 'Curso registrado' 
              })
              handleCreateCursoModalClose()
              router.reload()
    
              }
          }catch(error){
              console.log("error al crear el curso")
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Error al crear el curso',
                  footer: 'Comunicarse con administración'
                })
    
              }
    
        }
        const getCursos = async () => {
          try {
              const responseCursos = await clienteAxios.get("/cursos/getall");
      
              if (responseCursos.status === 200) {
                  const cursosData = responseCursos.data.cursos;
      
                  // Lista acumulativa de todos los alumnos
                  let allAlumnos = [];
      
                  const cursosConDetalles = await Promise.all(cursosData.map(async (curso) => {
                      // Obtener eventos por curso
                      const responseEventos = await clienteAxios.get(`cursoEvento/getEventos/${curso.id_curso}`);
                      const eventos = responseEventos.data.idsEventos;
                      // Obtener detalles de cada evento
                      const eventosDetalles = await Promise.all(eventos.map(async (eventoId) => {
                          const responseEvento = await clienteAxios.get(`/eventos/getone/${eventoId}`);

                          return responseEvento.data.evento;
                      }));
      
                      // Obtener alumnos por curso
                      const responseAlumnos = await clienteAxios.get(`/alumnos/getAlumnos/${curso.id_curso}`);
                      const alumnos = responseAlumnos.data.alumnos;

                      // Agregar los alumnos al acumulativo
                      if (alumnos && alumnos.length > 0) {
                        allAlumnos = [...allAlumnos, ...alumnos];
                        console.log("Datos de alumnos:", responseAlumnos.data.alumnos);

                      } else {
                        console.log(`No hay alumnos en el curso ${curso.nombre}`);
                      }
      
                      return { ...curso, eventos: eventosDetalles, alumnos };
                  }));
      
                  // Actualizar el estado con la lista acumulativa de todos los alumnos
                  setAlumnos(allAlumnos);
                  setCursos(cursosConDetalles);
              }
          } catch (error) {
              console.error("Error fetching data:", error);
          }
      };
      
        
        useEffect(() => {
          
          getCursos();

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
                  'Curso ha sido borrado',
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

          const handleChangeCurso=(e) =>{
            setCursoNuevo({
                ... cursoNuevo,
                [e.target.name]: e.target.value
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
      <Heading  as="h1" size="xl" className="header" textAlign="center"mt="10" >Cursos CSPN Concepción</Heading>
      </Box>

      <Button   colorScheme='blue' mt="10"onClick={handleCreateCursoModalOpen}>Crear curso</Button>
      <Modal  isOpen={isCreateCursoModalOpen} onClose={handleCreateCursoModalClose}>
      <ModalOverlay />
      <ModalContent>
      <ModalHeader>Datos del curso</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
           
      <InputForm label="Ingrese nombre" isInvalid={errorDescripcion !== ''} errors={errorDescripcion} handleChange={handleChangeCurso} name="nombre" placeholder="Nombre" type="text" value={cursos.nombre}/>
      <TextForm label="Ingrese descripción" isInvalid={errorDescripcion !== ''} errors={errorDescripcion} handleChange={handleChangeCurso} name="descripcion" placeholder="Descripción" type="text" value={cursos.descripcion}/>

      </ModalBody>

      <ModalFooter>
      <Button style={{marginRight:20}} colorScheme='blue'            onClick={() => {
   if (!cursoNuevo.descripcion) {
      setErrorDescripcion('Por favor, el nombre del rol es requerido.');
    } else {
     
      setErrorDescripcion('');
      
      submitCurso();
    }
  }}>Agregar</Button>

          <Button colorScheme='blue' onClick={handleCreateCursoModalClose}>Cerrar</Button>
      </ModalFooter>
      </ModalContent>
  </Modal>

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


        <Heading   size="2xl"  style={{textAlign:'left'}}  mt="10">

        </Heading>
        <Heading textAlign="center" as="h4" size="xl"   mt="10">Listado Cursos</Heading>


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
                <Td fontWeight={"bold"}>Nombre</Td>
                <Td fontWeight={"bold"}>Descripción</Td>
                <Td fontWeight={"bold"}>Ver Alumnos</Td>
                <Td fontWeight={"bold"}>Ver Eventos</Td>
                <Td fontWeight={"bold"}>Modificar</Td>
                <Td fontWeight={"bold"}>Eliminar</Td>

              </Tr>
            </Thead>
            <Tbody border={"5"}>
  
            {cursos && cursos.length  > 0 ? (
            cursos.map((Curso,idx)=>
              (
                <Tr key={idx}>
             <Td >{Curso.nombre}</Td>
             <Td >{Curso.descripcion}</Td>
             <Td>
             <Button colorScheme="blue"   onClick={()=>router.push(`./listadoCurso/${Curso.id_curso}`)}>Alumnos</Button>

             </Td>
                <Td><Button colorScheme="teal"   onClick={()=>router.push(`./listadoEventos/${Curso.id_curso}`)}>Eventos</Button>
</Td>
   <Td><Button colorScheme="green"   onClick={()=>router.push(`./modificar/${Curso.id_curso}`)}>Modificar</Button>
</Td>
            
             <Td><Button colorScheme="red" onClick={()=>deleteCurso(Curso.id_curso)} style={{marginLeft:10}}  >Eliminar</Button>
</Td>
             

     </Tr>
)
)
): (
  <Tr>
    <Td colSpan={9} textAlign="center">
      No hay cursos registrados.
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
    export default Curso;