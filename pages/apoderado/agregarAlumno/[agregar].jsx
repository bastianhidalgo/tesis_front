import React, {useState, useEffect,useRef} from 'react'
import { clienteAxios } from '../../clienteAxios';
const { GetRut, UseRegexRut,fechaSplit2 } = require('../../../Components/util');
import { useRouter } from 'next/router'
import { Drawer,Menu,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton ,ModalBody ,ModalFooter,
  DrawerBody,Select,CardBody,CardHeader,Card,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,VStack,IconButton,Image,Button,Container,Heading,HStack, Stack, Table, Thead, Tr, Td,Tbody ,Textarea, Text,Input ,Box, FormControl,FormLabel} from '@chakra-ui/react';
import Swal   from 'sweetalert2'
import { format } from 'date-fns';
import {HamburgerIcon,AddIcon,CloseIcon} from '@chakra-ui/icons'

export const getServerSideProps = async (context)=>{
    const id = context.query.agregar;
    const response = await clienteAxios.get(`/apoderados/getone/${id}`)
    const respuesta = await clienteAxios.get(`/personas/getonebyapoderado/${id}`)
    return{
        props: {
            data: response.data,
            datax: respuesta.data
        }
    }
}

const AgregarAlumno =({ data,datax }) => {
    const [modalApoderados, setModalApoderados] = useState([]);
    const [apoderado, setApoderado] = useState(data.apoderado);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [modalAlumnos, setModalAlumnos] = useState([{
        id_alumno:'',
        rut:'',
        nombre: '',
        apellido:'',
        curso: '',
}]);
const [relacion, setRelacion]= useState({
    apoderadoId:'',
    alumnoId:''
    
  }) ;
    const [alumnos, setAlumnos]= useState([{
        id_alumno:'',
        rut:'',
        nombre: '',
        apellido:'',
        curso: '',
        apoderados:[],
      }]);
      const [cursos, setCursos]= useState([]);
      const [cursitos, setCursitos]= useState([]);

      const [busqueda, setBusqueda] = useState("");


        const btnRef = useRef();
        const { isOpen, onOpen, onClose } = useDisclosure()
        const [modalStates, setModalStates] = useState([]); 

        const getAlumnos = async () => {
            try {
               
        
                let response;
        
                if (cursoSeleccionado === '') {
                    response = await clienteAxios.get("/alumnos/getall");
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

                const respuesta = await clienteAxios.get(`/alumnoApoderado/getAlumnos/${apoderado.id_apoderado}`);
        
                if (respuesta.status === 200) {
                    const idsAlumnos = respuesta.data.idsAlumnos;
        
                    try {
                        if (idsAlumnos.length > 0) {
                            // Solo realiza estas operaciones si hay alumnos relacionados con el apoderado
                            const alumnosPromises = idsAlumnos.map(async (alumnoId) => {
                                try {
                                    const responseAlumno = await clienteAxios.get(`/alumnos/getone/${alumnoId}`);
                                    const alumnado = responseAlumno.data.alumno;
                                    const responseCurso = await clienteAxios.get(`/cursos/getone/${alumnado.cursoId}`);
                                    const curso = responseCurso.data.curso.nombre;
        
                                    // Agregar la información del curso al objeto del alumno
                                    alumnado.curso = curso;
                                    return alumnado; // Supongo que la respuesta contiene los datos del alumno
                                } catch (error) {
                                    console.error(`Error obteniendo datos del alumno ${alumnoId}:`, error);
                                    return null;
                                }
                            });
        
                            const alumnos = await Promise.all(alumnosPromises);
        
                            // Filtra los alumnos que no sean nulos (debido a errores al obtener datos)
                            const filteredAlumnos = alumnos.filter((alumno) => alumno !== null);
        
                            setModalAlumnos(filteredAlumnos);
                        }
                    } catch (error) {
                        console.error("Error al procesar alumnos:", error);
                    }
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
        
        const handleChange2 = (e) => {
            setCursoSeleccionado(e.target.value);
          };
      

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


        const eliminar = async(e) => {
            Swal.fire({
                title: '¿Seguro?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar relación'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {

                        const respuesta = await clienteAxios.delete(`/alumnoApoderado/delete/${apoderado.id_apoderado}/${e}`);

                        Swal.fire(
                            'Eliminado!',
                            'Relación ha sido eliminada',
                            'success'
                        );
        
                        getAlumnos();
                    } catch (error) {
                        console.log("Error al eliminar la relación:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            footer: 'Comunicarse con administración'
                        });
                    }
                }
            });

          }


          const agregar = async (e) => {
            Swal.fire({
                title: '¿Seguro?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, agregar alumno'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        relacion.apoderadoId = apoderado.id_apoderado;
                        relacion.alumnoId = e;
                        console.log(relacion);
        
                        const respuesta = await clienteAxios.post(`/alumnoApoderado/create`, relacion);
        
                        Swal.fire(
                            'Registrada!',
                            'Relación ha sido registrada',
                            'success'
                        );
        
                        getAlumnos();
                    } catch (error) {
                        console.log("Error al crear la relación:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Relación ya realizada',
                            footer: 'Comunicarse con administración'
                        });
                    }
                }
            });
        };
        
    

      const router = useRouter()


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
        <Heading  as="h1" size="xl" className="header" textAlign="center"mt="10" >Asignar alumno a apoderado</Heading>
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
  
      <Button   w="full"  colorScheme='teal' onClick={() => router.push('../../Home')}>Inicio</Button>
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
            <Button  colorScheme='red' mr={3} onClick={() => router.push('../../')}>Cerrar sesión</Button>
  
              <Button colorScheme='blue' mr={3} onClick={onClose}>Cerrar</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Stack spacing={4} mt={10}>
            <HStack>
            <Card style={{marginBottom:50}}>
  <CardHeader>
    <Heading size='md'>Datos del Apoderado</Heading>
    <CardBody>

            <FormControl>
        <Text as={"h5"}>Rut: {apoderado.rut}  </Text>

        <Text style={{marginTop:30}} as={"h5"}>Nombre: {apoderado.nombre} {apoderado.apellido}</Text>


<Text style={{marginTop:30}} as={"h5"}>Teléfono: {apoderado.telefono}</Text>


</FormControl>
</CardBody>
</CardHeader>
</Card>
<Card style={{marginLeft:150}}>
  <CardHeader>
    <Heading size='md'>Alumnos Relacionados al Apoderado</Heading>
    <CardBody>
<FormControl>
   
<Table  variant='striped'>
              <Thead>
                <Tr>
                <Td fontWeight={"bold"}>RUN</Td>
                  <Td fontWeight={"bold"}>Nombre</Td>
                  <Td fontWeight={"bold"}>Apellido</Td>
                  <Td fontWeight={"bold"}>Curso</Td>
  
                  <Td fontWeight={"bold"}>Eliminar</Td>
                </Tr>
              </Thead>
              <Tbody border={"5"}>
    
              {modalAlumnos && modalAlumnos.length  > 0 ? (
              modalAlumnos.map((Alumno,idx)=>
                (
                  <Tr key={idx}>
               <Td >{Alumno.rut}</Td>
               <Td >{Alumno.nombre}</Td>
               <Td>{Alumno.apellido}</Td>
               <Td>{Alumno.curso}</Td>
  
               <Td>
  
               <IconButton style={{marginLeft:10}} icon={<CloseIcon />} colorScheme="red"  onClick={()=>eliminar(Alumno.id_alumno)}></IconButton>
  
          </Td>
              
              
                
  
       </Tr>
  )
  )
  ): (
    <Tr>
       <Td colSpan={5} textAlign="center">
                    {modalAlumnos ?   "Cargando alumnos...":"No hay alumnos registrados."}
                </Td>
    </Tr>
  )
  }
  
  </Tbody>
            </Table>

</FormControl>
</CardBody>
  </CardHeader>
  </Card>
</HStack>
        </Stack>



        
  
          <Heading textAlign="center" as="h4" size="xl"   mt="10">Listado Alumnos</Heading>
  
  
            <div style={{marginTop:30}}>
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
                <FormLabel>Cursos:</FormLabel>

                <Select
                   onChange={(e) => {
                    setCursoSeleccionado(e.target.value);
                  }}
    label="Curso"
    name="curso"
    placeholder="Seleccione curso del alumno"
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
     </div>
          <Stack spacing={4} mt="10">
            <Table variant='striped'>
              <Thead>
                <Tr>
                <Td fontWeight={"bold"}>RUN</Td>
                  <Td fontWeight={"bold"}>Nombre</Td>
                  <Td fontWeight={"bold"}>Apellido</Td>
                  <Td fontWeight={"bold"}>Curso</Td>
  
                  <Td  fontWeight={"bold"}>Agregar</Td>
                </Tr>
              </Thead>
              <Tbody border={"5"}>
    
              {alumnos && alumnos.length  > 0 ? (
              alumnos.map((Alumno,idx)=>
                (
                  <Tr key={idx}>
               <Td >{Alumno.rut}</Td>
               <Td >{Alumno.nombre}</Td>
               <Td>{Alumno.apellido}</Td>
               <Td>{Alumno.curso}</Td>
  
               <Td>
  
               <IconButton style={{marginLeft:10}} icon={<AddIcon />} colorScheme="blue" onClick={()=>agregar(Alumno.id_alumno)}></IconButton>
  
          </Td>
              
              
                
  
       </Tr>
  )
  )
  ): (
    <Tr>
      <Td colSpan={9} textAlign="center">
        No hay alumnos registrados.
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

export default AgregarAlumno;
