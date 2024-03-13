import { React,useState, useEffect, useRef } from 'react';
import { clienteAxios } from './clienteAxios';
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
import { fechaSplit2 } from '../Components/util';
import { format } from 'date-fns';
import {InputForm} from '../Components/InputForm'
function Roles( ) {

    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [errorRol, setErrorRol] = useState('');

      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const [isCreateRolModalOpen, setIsCreateRolModalOpen] = useState(false);
      const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
      const handleChange=(e) =>{
        setRolSeleccionado({
            ...rolSeleccionado,
            [e.target.name]: e.target.value
        })
    }

  
      const handleMenuOpen = () => {
        setIsMenuOpen(true);
      };
    
      const handleMenuClose = () => {
        setIsMenuOpen(false);
      };
    
      const handleCreateRolModalOpen = () => {
        setIsCreateRolModalOpen(true);
      };
    
      const handleCreateRolModalClose = () => {
        setIsCreateRolModalOpen(false);
      };
      const handleEditarRol = (rol) => {
        setRolSeleccionado(rol);
        onOpenEditarModal();
      };
      
      const onOpenEditarModal = () => {
        setIsEditarModalOpen(true);
      };
      
      const onCloseEditarModal = () => {
        setIsEditarModalOpen(false);
        setRolSeleccionado(null); // Reiniciar el rol seleccionado cuando se cierra el modal
      };
    const [roles, setRoles]= useState([{
       codigo_rol   :'',
       descripcion: ''
      }]);
      const [rol, setRol]= useState([{
        descripcion: ''
       }]);
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
      const [busqueda, setBusqueda] = useState("");


  const [errorDescripcion, setErrorDescripcion] = useState('');


        const btnRef = useRef();
        const { isOpen, onOpen, onClose } = useDisclosure()
        const router = useRouter()
        const [modalStates, setModalStates] = useState([]); 
        const [modalStates2, setModalStates2] = useState([]); 
        const submitRol= async () => {
       
          try{
             
               const response = await clienteAxios.post("/rol/create",rol);
    
             
            if(response.status==200){
              console.log("Rol creado")
              Swal.fire({
                  icon:'success',
                  title:'Excelente!',
                  showConfirmButton: true,
                  text: 'Rol registrado' 
              })
              handleCreateRolModalClose()
              router.reload()
    
              }
          }catch(error){
              console.log("error al crear el rol")
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Error al crear el rol',
                  footer: 'Comunicarse con administración'
                })
    
              }
    
        }
        const getRoles = async () => {
          try {
              const responseRoles = await clienteAxios.get("/rol/getall");
      
              if (responseRoles.status === 200) {
                  const rolesData = responseRoles.data.roles;
      
                  // Lista acumulativa de todos los alumnos
      

                  setRoles(rolesData);
              }
          } catch (error) {
              console.error("Error fetching data:", error);
          }
      };
      
      const handleChangeRol=(e) =>{
        setRol({
            ... rol,
            [e.target.name]: e.target.value
        })
    }
        useEffect(() => {
          
          getRoles();

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
        const guardarCambios = async (idRol) => {
          try {
            console.log(idRol)
            console.log(rolSeleccionado)
            // Lógica para enviar los cambios del rol al servidor
            // Por ejemplo, puedes utilizar clienteAxios.put() para actualizar el rol en la base de datos
            // Después de actualizar, cierra el modal de editar
            await clienteAxios.put(`/rol/update/${idRol}`, rolSeleccionado);
            onCloseEditarModal(); // Cierra el modal de editar
            // Puedes recargar los roles o actualizar el estado después de guardar los cambios si es necesario
            getRoles(); // Por ejemplo, volver a cargar los roles actualizados
          } catch (error) {
            console.error('Error al guardar los cambios:', error);
          }
        };

        const deleteRol = async (e) => {
          Swal.fire({
              title: '¿Seguro?',
              text: "No podrás revertir esta decisión",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sí, borrar!'
          }).then(async (result) => {
              if (result.isConfirmed) {
                  try {
                      const response = await clienteAxios.get(`/personas/getmanybyrol/${e}`);
      
                      if (response.status === 202) {
                          try {
                              await clienteAxios.delete(`/rol/delete/${e}`);
                              Swal.fire(
                                  'Borrado!',
                                  'Rol ha sido borrado',
                                  'success'
                              );
                          } catch (error) {
                              console.error(error);
                          }
                      } else {
                          console.log("Hay personas que contienen el rol");
                          Swal.fire({
                              icon: 'error',
                              title: 'Oops...',
                              text: 'Error al eliminar el rol',
                              footer: 'Hay personas que cuentan con tal rol, por favor modificar el rol de las personas'
                          });
                      }
                  } catch (error) {
                      console.error(error);
                      Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Error al eliminar el rol',
                          footer: 'Ha ocurrido un error inesperado al intentar eliminar el rol'
                      });
                  }
      
                  getRoles(); // Actualizar la lista de roles después de eliminar o intentar eliminar
              }
          });
      };
      
          const openModalEdite = (index) => {
            console.log('Datos del alumno:', cursos[index]); // Agrega esta línea
            setModalAlumnos(cursos[index]?.alumnos || []);
            const newModalStates = [...modalStates];
            newModalStates[index] = true;
            setModalStates(newModalStates);
          };
          const closeModalEdite = () => {
            setModalStates(modalStates.map(() => false));
          };
 

         
    return(

      <Container  maxW="container.xl" >
        <HStack>
       <IconButton
      icon={<HamburgerIcon />}
      aria-label="Abrir menú"
      onClick={handleMenuOpen}
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
      <Heading  as="h1" size="xl" className="header" textAlign="center"mt="10" >Roles CSPN Concepción</Heading>
      </Box>

      <Button   colorScheme='blue' mt="10" onClick={handleCreateRolModalOpen}>Crear Rol</Button>
      <Modal  isOpen={isCreateRolModalOpen} onClose={handleCreateRolModalClose}>
      <ModalOverlay />
      <ModalContent>
      <ModalHeader>Datos del rol</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
           
      <InputForm label="Ingrese Rol" isInvalid={errorDescripcion !== ''} errors={errorDescripcion} handleChange={handleChangeRol} name="descripcion" placeholder="Nombre rol" type="text" value={roles.descripcion}/>
               
      </ModalBody>

      <ModalFooter>
      <Button style={{marginRight:20}} colorScheme='blue'            onClick={() => {
   if (!rol.descripcion) {
      setErrorDescripcion('Por favor, el nombre del rol es requerido.');
    } else {
     
      setErrorDescripcion('');
      
      submitRol();
    }
  }}>Agregar</Button>

          <Button colorScheme='blue' onClick={handleCreateRolModalClose}>Cerrar</Button>
      </ModalFooter>
      </ModalContent>
  </Modal>

      <Drawer
        colorScheme='teal' 
        isOpen={isMenuOpen}
        placement='left'
        onClose={handleMenuClose}
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

            <Button colorScheme='blue' mr={3} onClick={handleMenuClose}>Cerrar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>


        <Heading   size="2xl"  style={{textAlign:'left'}}  mt="10">

        </Heading>
        <Heading textAlign="center" as="h4" size="xl"   mt="10">Listado Roles</Heading>


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
              <Td fontWeight={"bold"}>N°</Td>

                <Td fontWeight={"bold"}>Nombre</Td>
                <Td fontWeight={"bold"}>Modificar</Td>
                <Td fontWeight={"bold"}>Eliminar</Td>

              </Tr>
            </Thead>
            <Tbody border={"5"}>
  
            {roles && roles.length  > 0 ? (
            roles.map((Rol,idx)=>
              (
                <Tr key={idx}>
             <Td >{idx+1}</Td>
             <Td >{Rol.descripcion}</Td>

   <Td>
   
  <Button colorScheme="green" onClick={() => handleEditarRol(Rol)}>Modificar</Button>
  <Modal  isOpen={isEditarModalOpen} onClose={onCloseEditarModal}>
      <ModalOverlay />
      <ModalContent>
      <ModalHeader>Datos del rol</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
      <FormControl>

      <InputForm isInvalid={errorRol !== ''} errors={errorRol} 
      value={rolSeleccionado ? rolSeleccionado.descripcion : ''} label="Nombre rol" handleChange={handleChange} 
      name="descripcion" placeholder="Nombre rol" type="text" />

      </FormControl>
      </ModalBody>

      <ModalFooter>
      <Button style={{ marginRight: 20 }} colorScheme="blue"
       onClick={() =>
        {
          if (!rolSeleccionado.descripcion) {
             setErrorRol('Por favor, el nombre del rol es requerido.');
           } else {
            
            setErrorRol('');
            guardarCambios(rolSeleccionado.codigo_rol)
          }
            }}>
  Guardar cambios
</Button>

          <Button colorScheme='blue' onClick={onCloseEditarModal}>Cerrar</Button>
      </ModalFooter>
      </ModalContent>
  </Modal>
</Td>
            
             <Td><Button colorScheme="red" onClick={()=>  deleteRol(Rol.codigo_rol)} style={{marginLeft:10}}  >Eliminar</Button>
</Td>
             

     </Tr>
)
)
): (
  <Tr>
    <Td colSpan={9} textAlign="center">
      No hay roles registrados.
    </Td>
  </Tr>
)
}

</Tbody>
          </Table>
        </Stack>
        <HStack style={{marginLeft:1100}}>
        <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('./crearVisita')}>Volver</Button>
</HStack>
      </Container>
       
    );
    }
    export default Roles;