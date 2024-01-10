import { React,useState, useEffect, useRef } from 'react';
import { clienteAxios } from '../clienteAxios';
import { useRouter } from 'next/router'
import {  Drawer,Menu,
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

function Apoderado({  }) {
    const [modalApoderados, setModalApoderados] = useState([]);

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


        const btnRef = useRef();
        const { isOpen, onOpen, onClose } = useDisclosure()
        const router = useRouter()
        const [modalStates, setModalStates] = useState([]); 

        const getAlumnos = async () => {
            try {
              const response = await clienteAxios.get("/alumnos/getall");
              if (response.status === 200) {
                const alumnosData = response.data.alumnos;
                //console.log(alumnosData)

                const alumnosConApoderados = await Promise.all(alumnosData.map(async (alumno) => {
                  const responseApoderados = await clienteAxios.get(`/alumnoApoderado/getApoderados/${alumno.id_alumno}`);
                  const apoderadosIds = responseApoderados.data.idsApoderados;
                  const responseCursos = await clienteAxios.get(`/cursos/getone/${alumno.cursoId}`);
                  const cursos = responseCursos.data.curso;

                    setCursos(cursos)
                    alumno.curso=cursos.nombre
                  const apoderadosDetalles = await Promise.all(apoderadosIds.map(async (apoderadoId) => {
                    const responseApoderado = await clienteAxios.get(`/apoderados/getone/${apoderadoId}`);
                    return responseApoderado.data.apoderado;
                  }));
                  // Agregar la información de los alumnos al apoderado
                  return { ...alumno, apoderados: apoderadosDetalles };
                }));
                setAlumnos(alumnosConApoderados);
              }
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };
         
        useEffect(() => {
  
          getAlumnos();

        }, []);

        const filtrar = (terminoBusqueda) => {
          var resultadosBusqueda = alumnos.filter((apoderado) => {
            if (
                alumnos.nombre
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) ||
                alumnos.apellido
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) ||
                alumnos.rut
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
          /*const openModal = (index) => {
            console.log('Datos del apoderado:', apoderados[index]); // Agrega esta línea
            setModalAlumnos(apoderados[index]?.alumnos || []);
            const newModalStates = [...modalStates];
            newModalStates[index] = true;
            setModalStates(newModalStates);
          };
          const closeModal = () => {
            setModalStates(modalStates.map(() => false));
          };*/
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


          <div style={{marginTop:30}}>
            <label className="me-2">Buscar:</label>
            <Input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, apellido, rut, teléfono"
              value={busqueda}
              onChange={handleSearchChange}
            />

   </div>
        <Stack spacing={4} mt="10">
          <Table variant='striped'>
            <Thead>
              <Tr>
              <Td fontWeight={"bold"}>RUN</Td>
                <Td fontWeight={"bold"}>Nombre</Td>
                <Td fontWeight={"bold"}>Apellido</Td>
                <Td fontWeight={"bold"}>Curso</Td>

                <Td fontWeight={"bold"}>Ver Apoderado(s)</Td>
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
      </Container>
       
    );
    }
    export default Apoderado;