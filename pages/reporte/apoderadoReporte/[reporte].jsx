import { useState, useEffect,useRef } from 'react'
import {InputForm} from '../../../Components/InputForm'
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
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { clienteAxios } from '../../clienteAxios';
import { fechaSplit2, horaSplit,fechaSplit } from '../../../Components/util';
import {HamburgerIcon,EditIcon,DeleteIcon} from '@chakra-ui/icons'
import { Document, Page, View, StyleSheet,PDFViewer  } from '@react-pdf/renderer';
import ApoderadoPDF from './ApoderadoPDF';


export const getServerSideProps = async (context)=>{
    const id = context.query.reporte;
    const response = await clienteAxios.get(`/apoderados/getone/${id}`)
    return{
        props: {
            data: response.data
        }
    }
}

const ReporteApoderado =({ data }) => {
  const [showPDF, setShowPDF] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const onCloseEditarModal = () => {
    setIsEditarModalOpen(false);
    setFechaSeleccionada(null); // Reiniciar el rol seleccionado cuando se cierra el modal
  };
  const [nuevoIngreso, setNuevoIngreso] = useState([{
    
    fechaIngreso:'',
    nuevaFechaIngreso:'',
    personaId: '',
    nuevoMotivo:''
    

  }]);
const [horaEdicion, setHoraEdicion] = useState('');
    const [evento, setEvento] = useState(data.evento);
    const [apoderado, setApoderado] = useState(data.apoderado);
    const [rol, setRol] = useState("Apoderado");
    const router = useRouter()
    const btnRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [ingresos, setIngresos]= useState([{
      personaId:'',
      fecha:'',
      motivo:''
    }]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [fechaFinal, setFechaFinal] = useState(null);

    const [errorFecha, setErrorFecha] = useState('');
    const [errorHora, setErrorHora] = useState('');
    const [hora,setHora]=useState(null)

    const InputHandleChange= (event) => {
      setHora(event.target.value);
    };
    const onOpenEditarModal = () => {
      setIsEditarModalOpen(true);
    };
    const [personas,setPersonas]=useState([{
      id_persona:'',
      visitaId:'',
      rol:'',
      fechaInicio:'',
      fechaTermino:''
    }])
    const styles = StyleSheet.create({
      page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4',
      },
      section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
      },
    });

    const handleIngresoChange = (e) => {
      setNuevoIngreso({
        ...nuevoIngreso,
        [e.target.name]: e.target.value
      })}
      useEffect(() => {
      // Verifica que haya información sobre el evento antes de cargar las visitas
      if (apoderado) {
        const cargarIngresos = async () => {
          try {

            const response = await clienteAxios.get(`/personas/getonebyapoderado/${apoderado.id_apoderado}`);
            const persona=response.data.persona[0]
            
            const ingresosRespuesta = await clienteAxios.get(`/ingresos/getingresosbypersona/${persona.id_persona}`);
            const ingresosActualizados = ingresosRespuesta.data.ingresos.map(ingreso => {
              if (!ingreso.motivo || ingreso.motivo === "") {
                ingreso.motivo = "no hay motivo ingresado";
              }
              return ingreso;
            });
                setIngresos(ingresosActualizados)
          } catch (error) {
            console.error('Error al cargar las visitas:', error);
          }
        }
      ;
    
        cargarIngresos();
      }
    }, []);
    
    const handleEditarIngreso = (fecha) => {
      console.log(fecha)
      setFechaSeleccionada(fecha);
      setFechaFinal(fecha)
      onOpenEditarModal();
    };
    const handleChange=(e) =>{
      console.log(e)
      setFechaSeleccionada({
          ...fechaSeleccionada,
          [e.target.name]: e.target.value
      })}

      function contieneLetraT(variable) {
        return variable.includes('T');
      }
      const guardarCambios = async (ingreso) => {
        // Verifica si hay una fecha seleccionada y un ingreso válido
        console.log(fechaSeleccionada)
        console.log(fechaFinal)

        console.log(horaEdicion)

          try {
            let nuevaFechaIngreso;

            if(horaEdicion!=(horaSplit(fechaFinal.fechaIngreso)) || fechaSeleccionada.fechaIngreso!=fechaFinal.fechaIngreso){
              if (horaEdicion) {
                nuevaFechaIngreso = `${fechaSeleccionada.fechaIngreso}T${horaEdicion}:00.000Z`;
              } else {
                if(!contieneLetraT(fechaSeleccionada.fechaIngreso)){
                nuevaFechaIngreso = `${fechaSeleccionada.fechaIngreso}T${horaSplit(fechaFinal.fechaIngreso)}:00.000Z`;
                }else{
                  nuevaFechaIngreso= fechaSeleccionada.fechaIngreso
                }
              }
            }
            

            console.log(nuevaFechaIngreso)
            console.log(contieneLetraT(nuevaFechaIngreso))
            // Realiza una solicitud al servidor para actualizar el ingreso
            await clienteAxios.put(`/ingresos/update`, {
              // Envía los datos necesarios para la actualización
              fechaIngreso: fechaFinal.fechaIngreso,
              nuevaFechaIngreso: nuevaFechaIngreso, // Nueva fecha de ingreso en formato ISO 8601
              motivo: fechaSeleccionada.motivo, // Motivo del ingreso
              personaId: fechaSeleccionada.personaId // ID de la persona asociada al ingreso
              // Puedes agregar otros campos del ingreso que necesites actualizar
            });
      
            // Cierra el modal después de guardar los cambios
            onCloseEditarModal();
            router.reload()
          } catch (error) {
            console.error('Error al guardar los cambios:', error);
          }
        
      };
      
      
      const deleteIngreso = async (ingreso) => {
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
                    const response = await clienteAxios.delete(`/ingresos/delete`, {
                        data: ingreso // Pasar los datos del ingreso a eliminar en el cuerpo de la solicitud
                    });
    
                    if (response.status === 200) {
                      Swal.fire(
                          'Borrado!',
                          'El ingreso ha sido eliminado',
                          'success'
                      ).then(() => {
                          // Recargar la página después de cerrar el mensaje de confirmación
                          router.reload();
                      });
                  }else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Error al eliminar el ingreso',
                        });
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Error al eliminar el ingreso',
                        footer: 'Ha ocurrido un error inesperado al intentar eliminar el ingreso'
                    });
                }
            }
});
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
        onClick={()=>router.push('../../Home')}
        boxSize='25%'
        alt="Logo"
        style={{marginLeft:50,marginBottom:40}}
      /></HStack>
    <Heading as={"h1"} className="header" size={"xl"} textAlign="center" mt={10}>Apoderado</Heading>

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
          <Button style={{marginRight:50}} colorScheme='red' mr={3} onClick={() => router.push('../../')}>Cerrar sesión</Button>

            <Button colorScheme='blue' mr={3} onClick={onClose}>Cerrar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    <Stack spacing={4} mt={10}>
        <HStack>
        <Text as={"h4"}>Rut: {apoderado.rut}  </Text>
        </HStack>
        <HStack>

        <Text as={"h4"}>Nombre: {apoderado.nombre} {apoderado.apellido}</Text>

        </HStack>
        <HStack>
        <Text as={"h4"}>Rol: {rol} </Text>
        </HStack>
        <HStack>

<Text as={"h4"}>Teléfono: {apoderado.telefono}</Text>

</HStack>
        </Stack>

        <Heading as={"h1"}  size={"xl"} textAlign="center" mt={10}>Ingresos</Heading>

        <Stack spacing={4} mt="10">
          <Table variant='striped'>
            <Thead>
              <Tr>
              <Td fontWeight={"bold"}>N°</Td>
                <Td fontWeight={"bold"}>Fecha</Td>
                <Td fontWeight={"bold"}>Hora</Td>
                <Td fontWeight={"bold"}>Motivo</Td>
                <Td fontWeight={"bold"}>Modificar</Td>
                <Td fontWeight={"bold"}>Eliminar</Td>
              </Tr>
            </Thead>
            <Tbody border={"6"}>
  {ingresos && ingresos.length > 0 ? (
    ingresos.map((Ingreso, idx) => (
      <Tr key={idx}>
        <Td>{idx+1}</Td>
        <Td>{fechaSplit2(Ingreso.fechaIngreso)}</Td>
        <Td>{horaSplit(Ingreso.fechaIngreso)}</Td>
        <Td>{Ingreso.motivo}</Td>

        <Td ><IconButton style={{marginLeft:20}} colorScheme='green' onClick={() => handleEditarIngreso(Ingreso)}  icon={<EditIcon/>}></IconButton></Td>
        <Modal  isOpen={isEditarModalOpen} onClose={onCloseEditarModal}>
      <ModalOverlay />
      <ModalContent>
      <ModalHeader>Datos del ingreso</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
      <InputForm

    value={fechaSeleccionada ? fechaSplit(fechaSeleccionada.fechaIngreso) : ''}
    label="Fecha"
    handleChange={handleChange}
    name="fechaIngreso"
    placeholder="Fecha"
    type="date"
  />
  <FormControl mt={4}>
    <FormLabel>Hora</FormLabel>
    <Input
      value={fechaSeleccionada ? horaSplit(fechaSeleccionada.fechaIngreso) : ''} // Usar la variable hora como valor inicial
      onChange={(e) => setHoraEdicion(e.target.value)}
  placeholder="Hora"
  type="time"
/>


    <Text color="red" fontSize="sm">
      {errorHora}
    </Text>
  </FormControl>
  <FormControl mt={4}>
    <FormLabel>Motivo</FormLabel>
    <Input
  value={fechaSeleccionada ? fechaSeleccionada.motivo : ''}
  onChange={(e) => setFechaSeleccionada({ ...fechaSeleccionada, motivo: e.target.value })}
  placeholder="Motivo"
  type="text"
/>

  </FormControl>

      </ModalBody>

      <ModalFooter>
      <Button 
  style={{ marginRight: 20 }} 
  colorScheme="blue"
  onClick={() => guardarCambios(fechaFinal)} // Pasar el ID de la persona asociada al ingreso
>
  Guardar cambios
</Button>

          <Button colorScheme='blue' onClick={onCloseEditarModal}>Cerrar</Button>
      </ModalFooter>
      </ModalContent>
  </Modal>
      <Td><IconButton style={{marginLeft:15}}   onClick={() => deleteIngreso(Ingreso)}  colorScheme='red' icon={<DeleteIcon/>}></IconButton></Td>

      </Tr>
    ))
  ) : (
    <Tr>
      <Td colSpan={6} textAlign="center">
        No hay ingresos registrados.
      </Td>
    </Tr>
  )}
</Tbody>
          </Table>
        </Stack>

    <HStack style={{marginTop:40}}>
      
        
  

    <Button colorScheme="blue" onClick={() => setShowPDF(true)}>Generar PDF</Button>
      {showPDF && (
        <PDFViewer width="1000" height="600">
        <ApoderadoPDF apoderado={apoderado} ingresos={ingresos} />
      </PDFViewer>
      )}

<Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('../apoderado_reporte')}>Volver</Button>

          </HStack>

    </Container>

    
)}
      

export default ReporteApoderado;

