import { React,useState, useEffect, useRef } from 'react';
import { clienteAxios } from '../clienteAxios';
import { useRouter } from 'next/router'
import {  Drawer,
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
  ModalCloseButton,Menu} from '@chakra-ui/react';
import Swal   from 'sweetalert2'
import {HamburgerIcon} from '@chakra-ui/icons'
import { fechaSplit2 } from '../../Components/util';
import { format } from 'date-fns';

function Apoderado({ serverDateTime }) {
  const [horaactual, setHoraactual] = useState('');
    const [modalAlumnos, setModalAlumnos] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState(serverDateTime);
    const [ingreso,setIngreso]= useState({
      fechaIngreso: '',
      personaId:''
    })
    const [apoderados, setApoderados]= useState([{
        id_apoderado:'',
        rut:'',
        nombre: '',
        apellido:'',
        telefono: '',
        alumnos: [],
      }]);
      const [alumnos,setAlumnos]=useState([{
        rut:'',
        nombre: '',
        apellido:'',
      }]);
      const [busqueda, setBusqueda] = useState("");
     
      const [rol,setRol]= useState({
        descripcion:''
      })
        const btnRef = useRef();
        const { isOpen, onOpen, onClose } = useDisclosure()
        const router = useRouter()
        const [modalStates, setModalStates] = useState([]); 

        const getApoderados = async () => {
            try {
              const response = await clienteAxios.get("/apoderados/getall");
              if (response.status === 200) {
                const apoderadosData = response.data.apoderados;

                // Actualiza el estado de apoderados con la información de los alumnos
                const apoderadosConAlumnos = await Promise.all(apoderadosData.map(async (apoderado) => {
                  const responseAlumnos = await clienteAxios.get(`/alumnoApoderado/getAlumnos/${apoderado.id_apoderado}`);
                  const alumnosIds = responseAlumnos.data.idsAlumnos;
                  // Obtener detalles de cada alumno
                  const alumnosDetalles = await Promise.all(alumnosIds.map(async (alumnoId) => {
                    const responseAlumno = await clienteAxios.get(`/alumnos/getone/${alumnoId}`);
                    return responseAlumno.data.alumno;
                  }));
          
                  // Agregar la información de los alumnos al apoderado
                  return { ...apoderado, alumnos: alumnosDetalles };
                }));
          
                setApoderados(apoderadosConAlumnos);
              }
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };

        useEffect(() => {
          const intervalId = setInterval(() => {
            const now = new Date();
            const formattedDateTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // Formatear la fecha
            setCurrentDateTime(formattedDateTime);
          }, 1000);
          getApoderados();

        }, []);

        const filtrar = (terminoBusqueda) => {
          var resultadosBusqueda = apoderados.filter((apoderado) => {
            if (
                apoderado.nombre
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) ||
                apoderado.apellido
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) ||
                apoderado.telefono
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) ||
                apoderado.rut
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) 
            ) {
              return apoderados;
            }
          });
          setApoderados(resultadosBusqueda);
        };

        const handleSearchChange = (e) => {
          const nuevoTermino = e.target.value;
          setBusqueda(nuevoTermino);

          if (nuevoTermino === "") {
            getApoderados(); 
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

                await clienteAxios.delete(`/apoderados/delete/${e}`)

                Swal.fire(
                  'Borrado!',
                  'Apoderado ha sido borrado',
                  'success'
                )
                getApoderados();
              }
            })

          }
          const openModal = (index) => {
            console.log('Datos del apoderado:', apoderados[index]); // Agrega esta línea
            setModalAlumnos(apoderados[index]?.alumnos || []);
            const newModalStates = [...modalStates];
            newModalStates[index] = true;
            setModalStates(newModalStates);
          };
          const closeModal = () => {
            setModalStates(modalStates.map(() => false));
          };

          const RegistrarVisita = async (idVisita) => {
            Swal.fire({
              title: '¿Seguro?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sí, registrar'
            }).then(async (result) => {
              if (result.isConfirmed) {
                // Obtener información de la visita


                const response = await clienteAxios.get(`/personas/getonebyapoderado/${idVisita}`);
                console.log(response)

                const visita = response.data.persona[0];
                // Crear una nueva entrada en la tabla de fechas
                const hora= new Date()
                const year = hora.getFullYear(); // Año (cuatro dígitos)
                const month = hora.getMonth() + 1; // Mes (ten en cuenta que los meses en JavaScript van de 0 a 11)
                const day = hora.getDate(); // Día del mes
                const hours = hora.getHours(); // Horas (formato de 24 horas)
                const minutes = hora.getMinutes(); // Minutos
                const seconds = hora.getSeconds(); // Segundos

                const formattedDateTime = format(hora, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                setHoraactual(formattedDateTime)
                
                ingreso.fechaIngreso=formattedDateTime
                ingreso.personaId=visita.id_persona
              console.log(ingreso)

                // Crear una nueva entrada en la tabla de ingresos
                const nuevoIngreso = await clienteAxios.post("/ingresos/create", ingreso);
                Swal.fire(
                  'Registrada!',
                  'Apoderado ha sido registrada',
                  'success'
                );
          
                getApoderados(); // Actualizar la lista de visitas después del registro
              }
            });
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
        onClick={()=>router.push('../Home')}
        boxSize='25%'
        alt="Logo"
        style={{marginLeft:50,marginBottom:40}}
      /></HStack>
      <Box>
      <Heading  as="h1" size="xl" className="header" textAlign="center"mt="10" >Apoderados CSPN Concepción</Heading>
      </Box>

      <Button   colorScheme='blue' mt="10" onClick={() => router.push('./crearApoderado')}>Crear Apoderado</Button>


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


        <Heading   size="2xl"  style={{textAlign:'left'}}  mt="10">

        </Heading>
        <Heading textAlign="center" as="h4" size="xl"   mt="10">Listado Apoderados</Heading>


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
          <Table variant="simple">
            <Thead>
              <Tr>
              <Td fontWeight={"bold"}>RUN</Td>
                <Td fontWeight={"bold"}>Nombre</Td>
                <Td fontWeight={"bold"}>Apellido</Td>
                <Td fontWeight={"bold"}>Teléfono</Td>
                <Td fontWeight={"bold"}>Ver Alumno(s)</Td>
                <Td fontWeight={"bold"}>Registrar Ingreso</Td>
                <Td fontWeight={"bold"}>Modificar</Td>
                <Td fontWeight={"bold"}>Eliminar</Td>
              </Tr>
            </Thead>
            <Tbody border={"5"}>
  
            {apoderados && apoderados.length  > 0 ? (
            apoderados.map((Apoderado,idx)=>
              (
                <Tr key={idx}>
             <Td >{Apoderado.rut}</Td>
             <Td >{Apoderado.nombre}</Td>
             <Td>{Apoderado.apellido}</Td>
             <Td>{Apoderado.telefono}</Td>
             <Td>

             <Button colorScheme="blue" onClick={() => openModal(idx)}>Alumnos</Button>

                <Modal closeOnOverlayClick={false} isOpen={modalStates[idx]} onClose={closeModal}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>                    <Heading size="md">Alumno(s) asociados al apoderado:</Heading>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                    {modalAlumnos.map((alumno, idxAlumno) => (
                        <VStack key={idxAlumno} align="stretch" mt={4}>
                        <Text>Nombre: {alumno.nombre} {alumno.apellido}</Text>
                        <Text>Rut: {alumno.rut}</Text>
                        </VStack>
                    ))}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={closeModal}>Cerrar</Button>
                    </ModalFooter>
                    </ModalContent>
                </Modal></Td>
             <Td>
             <Button    onClick={()=>RegistrarVisita(Apoderado.id_apoderado)}>Registrar</Button>
            </Td>
             <Td>

              <Button colorScheme="green"   onClick={()=>router.push(`./modificar/${Apoderado.id_apoderado}`)}>Modificar</Button>
              </Td>
              <Td>

              <Button colorScheme="red" onClick={()=>deleteVisita(Apoderado.id_apoderado)} style={{marginLeft:10}}  >Eliminar</Button>

 </Td>

     </Tr>
)
)
): (
  <Tr>
    <Td colSpan={9} textAlign="center">
      No hay apoderados registrados.
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