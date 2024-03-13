import { React,useState, useEffect, useRef } from 'react';
import { clienteAxios } from './clienteAxios';
import { useRouter } from 'next/router'
import {  Modal,Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,Image,Box,Button,Container,Heading, Stack, Table, Thead, Tr, Td,Tbody ,Input, HStack,IconButton, VStack} from '@chakra-ui/react';
import Swal   from 'sweetalert2'
import {HamburgerIcon} from '@chakra-ui/icons'
import { fechaSplit2,fechaSplit,    validarRut} from '../Components/util';
import { format } from 'date-fns';
import {ComponentDrawer} from '../Components/Drawer'
import {InputForm} from '../Components/InputForm'

function Home({ serverDateTime }) {
  const [isCreateIngresoModalOpen, setIsCreateIngresoModalOpen] = useState(false);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [isIngresarModalOpen, setIsIngresarModalOpen] = useState(false);

  const handlePersonaSeleccionada = (visita) => {
    console.log(visita)
    setPersonaSeleccionada(visita);
    onOpenIngresarModal();
  };
  const onOpenIngresarModal = () => {
    setIsIngresarModalOpen(true);
  };
    const [visitas, setVisitas]= useState([{
        id_visita:'',
        rut:'',
        nombre: '',
        apellido:'',
        telefono: '',
        rol:'',
        fechaInicio:'',
        fechaTermino:'',
        observacion:'',
      }]);
      const [modalStates, setModalStates] = useState([]); // Estado para gestionar la visibilidad de cada modal

      const [busqueda, setBusqueda] = useState("");
      const [motivo, setMotivo] = useState("");

      const [currentDateTime, setCurrentDateTime] = useState(serverDateTime);
      const [ingreso,setIngreso]= useState({
        fechaIngreso: '',
        personaId:'',
        motivo:''
      })
      const [rol,setRol]= useState({
        descripcion:''
      })
      const [horaactual, setHoraactual] = useState('');
        const router = useRouter();
        const { isOpen, onOpen, onClose } = useDisclosure()
        const btnRef = useRef();


      
        const getVisitas = async () => {
          
          const responseAlumnos = await clienteAxios.get(`/alumnos/getAlumnos/4`);
          console.log(responseAlumnos)
          try {
            const response = await clienteAxios.get("/usuarios/getall");
        
            if (response.status === 200) {
              const visitasData = response.data.visitas;
              setVisitas(visitas)
              const visitasConRoles = await Promise.all(
                visitasData.map(async (visita) => {
                  try {
                    // Obtener información de la persona asociada a la visita
                    const personaResponse = await clienteAxios.get(`/personas/getonebyvisita/${visita.id_visita}`);
                    const persona = personaResponse.data.persona[0];
                    visita.rol=persona.rol;
                    visita.fechaInicio = persona.fecha_inicio; // Agrega la fecha de inicio a la visita
                    visita.fechaTermino = persona.fecha_termino; // Agrega la fecha de término a la visita
                    visita.observacion=persona.observacion
                    if(visita.observacion==null || visita.observacion==''){
                      visita.observacion='No tiene';
                    }
                    // Obtener información del rol asociado a la persona
                    const rolResponse = await clienteAxios.get(`/rol/getone/${persona.rol}`);
                    const rol = rolResponse.data.rol;
                    // Agregar información adicional a la visita
                    visita.rol = rol.descripcion; // Agrega la descripción del rol a la visita

        
                    return visita;
                  } catch (error) {
                    console.error("Error fetching additional data:", error);
                    return visita;
                  }
                })
              );
        
              setVisitas(visitasConRoles);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        const handleChangeMotivo = (e) => {
          setIngreso({
            ...ingreso,
            motivo: e.target.value
          });
        };
        
        useEffect(() => {
          const intervalId = setInterval(() => {

            const now = new Date();
            const formattedDateTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // Formatear la fecha
            setHoraactual(formattedDateTime);

          },1000);
          getVisitas();

        }, []);

        const filtrar = (terminoBusqueda) => {
          var resultadosBusqueda = visitas.filter((visita) => {
            if (
              visita.nombre
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) ||
              visita.apellido
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) ||
              visita.telefono
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) ||
              visita.rut
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) ||
                visita.rol
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) 
            ) {
              return visitas;
            }
          });
          setVisitas(resultadosBusqueda);
        };

        const handleSearchChange = (e) => {
          const nuevoTermino = e.target.value;
          setBusqueda(nuevoTermino);

          if (nuevoTermino === "") {
            getVisitas(); 
          } else {
            filtrar(nuevoTermino);
          }
        };
        const handleCreateIngresoModalOpen = () => {
          setIsCreateIngresoModalOpen(true);
        };
        const handleCreateIngresoModalClose = () => {
          setIsCreateIngresoModalOpen(false);
        };

        const deleteVisita = async(e) => {
          const response = await  clienteAxios.get(`/personas/getonebyvisita/${e}`)
          const personaId=response.data.persona[0].id_persona
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
                await clienteAxios.delete(`/usuarios/delete/${e}`)
                await clienteAxios.delete(`/personas/delete/${personaId}`)

                Swal.fire(
                  'Borrado!',
                  'Visita ha sido borrada',
                  'success'
                )
                getVisitas();
              }
            })

          }

         const RegistrarVisita = async (personaSeleccionadaId) => {
          onCloseIngresarModal()
  Swal.fire({
    title: '¿Seguro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, registrar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await clienteAxios.get(`/personas/getonebyvisita/${personaSeleccionadaId}`);
      const visita = response.data.persona[0];

      const hora = new Date();
      const formattedDateTime = format(hora, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      setHoraactual(formattedDateTime);

      const nuevoIngreso = {
        fechaIngreso: formattedDateTime,
        personaId: visita.id_persona,
        motivo: ingreso.motivo // Utiliza el valor actualizado de ingreso.motivo
      };

      if ((formattedDateTime >= visita.fecha_inicio) && (formattedDateTime <= `${fechaSplit(visita.fecha_termino)}T23:59:59.999Z`)) {
        const response = await clienteAxios.post("/ingresos/create", nuevoIngreso);
        console.log(response);
        Swal.fire(
          'Registrada!',
          'Visita ha sido registrada',
          'success'
        );
        getVisitas();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al ingresar la visita.',
          footer: ' Revisar fechas de inicio y de término'
        });
      }
    }
  });
};
const onCloseIngresarModal = () => {
  setIsIngresarModalOpen(false);
  setPersonaSeleccionada(null); // Reiniciar el rol seleccionado cuando se cierra el modal
};

          const openModal = (index) => {
            const newModalStates = [...modalStates];
            newModalStates[index] = true;
            setModalStates(newModalStates);
          };
        
          const closeModal = () => {
            setModalStates(modalStates.map(() => false));
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
        onClick={()=>router.push('./Home')}
        boxSize='25%'
        alt="Logo"
        style={{marginLeft:50,marginBottom:40}}
      /></HStack>
      <Box>
      <Heading  as="h1" size="xl" className="header" textAlign="center"mt="10" >Control de Ingreso CSPN Concepción</Heading>
      </Box>



      <ComponentDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} />

      <Button colorScheme='blue'  mt="10" onClick={() => router.push('./crearVisita')}>Crear Visita</Button>
      <Button colorScheme='blue' style={{marginLeft:20}}  mt="10" onClick={() => router.push('./roles')}>Roles</Button>

       
        <Heading textAlign="center" as="h4" size="xl"   mt="10">Listado Visitas</Heading>


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
                <Td fontWeight={"bold"}>Rol</Td>
                <Td fontWeight={"bold"}>Ver info</Td>

                <Td fontWeight={"bold"}>Registrar Ingreso</Td>
                <Td fontWeight={"bold"}>Modificar</Td>
                <Td fontWeight={"bold"}>Eliminar</Td>
              </Tr>
            </Thead>
            <Tbody border={"5"}>
  
            {visitas && visitas.length  > 0 ? (
            visitas.map((Visita,idx)=>
              (
                <Tr key={idx}>
             <Td >{Visita.rut}</Td>
             <Td >{Visita.nombre}</Td>
             <Td>{Visita.apellido}</Td>

             <Td>{Visita.rol}</Td>
             <Td>

<Button colorScheme="blue"   onClick={() => openModal(idx)}>Ver</Button>
  <Modal closeOnOverlayClick={false} isOpen={modalStates[idx]} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
      <ModalHeader>Datos de la visita</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
           <Text>Rut: {Visita.rut}</Text>
           <Text>Nombre: {Visita.nombre} {Visita.apellido}</Text>   
           <Text>Teléfono: {Visita.telefono}</Text>

           <Text>Rol: {Visita.rol}</Text>

          <Text>Fecha de inicio: {fechaSplit2(Visita.fechaInicio)}</Text>
          <Text>Fecha de término: {fechaSplit2(Visita.fechaTermino)}</Text>
          <Text>Observación: {Visita.observacion}</Text>

      </ModalBody>

      <ModalFooter>
          <Button colorScheme='blue' onClick={closeModal}>Cerrar</Button>
      </ModalFooter>
      </ModalContent>
  </Modal>


</Td>

             <Td>
             <Button colorScheme='teal'  onClick={() => handlePersonaSeleccionada(Visita)}>Registrar</Button>
             <Modal  isOpen={isIngresarModalOpen} onClose={onCloseIngresarModal}>
      <ModalOverlay />
      <ModalContent>
      <ModalHeader>Datos del ingreso</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
           
      <InputForm label="Ingrese Motivo" handleChange={handleChangeMotivo} name="descripcion" placeholder="Nombre rol" type="text" value={personaSeleccionada ? personaSeleccionada.motivo : ''}/>
               
      </ModalBody>

      <ModalFooter>
      <Button style={{marginRight:20}} colorScheme='blue'           
       onClick={() => {RegistrarVisita(personaSeleccionada.id_visita);
    
  }}>Registrar</Button>

          <Button colorScheme='blue' onClick={onCloseIngresarModal}>Cerrar</Button>
      </ModalFooter>
      </ModalContent>
  </Modal>
            </Td>
             <Td>

              <Button colorScheme="green"   onClick={()=>router.push(`./visita/Modificar/${Visita.id_visita}`)}>Modificar</Button>
              </Td>
              <Td>

              <Button colorScheme="red" onClick={()=>deleteVisita(Visita.id_visita)} style={{marginLeft:10}}  >Eliminar</Button>

 </Td>

     </Tr>
)
)
): (
  <Tr>
    <Td colSpan={9} textAlign="center">
      No hay visitas registradas.
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
    export default Home;
