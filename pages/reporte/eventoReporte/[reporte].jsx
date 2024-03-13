import { useState, useEffect,useRef } from 'react'
import {InputForm} from '../../../Components/InputForm'
import { Menu,Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,IconButton,VStack,
  useDisclosure,Image,Button, Container, Heading, HStack, Stack, Select, Text,Table,Thead,Tr,Td,Tbody } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { clienteAxios } from '../../clienteAxios';
import { fechaSplit2, horaSplit } from '../../../Components/util';
import {HamburgerIcon,EditIcon,DeleteIcon} from '@chakra-ui/icons'
import Apoderado from '@/pages/alumno/listado'
import { Document, Page, View, StyleSheet,PDFViewer  } from '@react-pdf/renderer';
import EventoPDF from './EventoPDF';

export const getServerSideProps = async (context)=>{
    const id = context.query.reporte;
    const response = await clienteAxios.get(`/eventos/getone/${id}`)
    return{
        props: {
            data: response.data
        }
    }
}

const ReporteEvento =({ data }) => {
  const [showPDF, setShowPDF] = useState(false);

    const [evento, setEvento] = useState(data.evento);
    const router = useRouter()
    const btnRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [visitas, setVisitas]= useState([{
      id_visita:'',
      rut:'',
      nombre: '',
      apellido:'',
      telefono: '',
      rol:'',
      fechaInicio:'',
      fechaTermino:''
    }]);
    const [apoderados, setApoderados]= useState([{
      id_apoderados:'',
      rut:'',
      nombre: '',
      apellido:'',
      telefono: '',
      rol:'',
      fechaInicio:'',
      fechaTermino:''
    }]);
    const [personas,setPersonas]=useState([{
      id_persona:'',
      visitaId:'',
      rol:'',
      fechaInicio:'',
      fechaTermino:''
    }])

    useEffect(() => {
      // Verifica que haya información sobre el evento antes de cargar las visitas
      if (evento) {
        const cargarVisitas = async () => {
          try {
            const response = await clienteAxios.get(`/visita/getVisitas/${evento.codigo_evento}`);
            const idsVisitas = response.data.idsPersonas;
                const respuesta = await clienteAxios.get(`/personas/getmany/${idsVisitas}`);
            
            const personaConRoles = await Promise.all(
              respuesta.data.map(async (persona) => {
                try{

                  if(persona.apoderadoId===null){
                    const rolResponse = await clienteAxios.get(`/rol/getone/${persona.rol}`);
                    const personaResponse = await clienteAxios.get(`/personas/getonebyvisita/${persona.visitaId}`);
                    const personaVisita=personaResponse.data.persona[0].visita
                    personaVisita.rol= rolResponse.data.rol.descripcion
                    return personaVisita
                    
                  }else{
                    const personaResponse = await clienteAxios.get(`/personas/getonebyapoderado/${persona.apoderadoId}`);

                    const personaApoderado=personaResponse.data.persona[0].apoderado
                    personaApoderado.rol="Apoderado"
                    return personaApoderado
                  }

                }
                catch (error) {
                  console.error('Error al cargar las visitas:', error);
                }
              })
              )

            setVisitas(personaConRoles);
          } catch (error) {
            console.error('Error al cargar las visitas:', error);
          }
        }
      ;
    
        cargarVisitas();
      }
    }, []);
    
    const deleteIngreso = async (visita) => {
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
                console.log(visita)
                const idPersona = visita.id_apoderado ? visita.id_apoderado : visita.id_visita;
                const endpoint = visita.id_apoderado ? `/personas/getonebyapoderado/${visita.id_apoderado}` : `/personas/getonebyvisita/${visita.id_visita}`;
                
                const respuesta = await clienteAxios.get(endpoint);
                
                const response = await clienteAxios.delete(`/visita/delete/${evento.codigo_evento}/${respuesta.data.persona[0].id_persona}`);
                
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
    <Heading as={"h1"} className="header" size={"xl"} textAlign="center" mt={10}>Evento</Heading>

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
        <Text as={"h4"}>Tema: {evento.tema} </Text>
        </HStack>
        <HStack>

        <Text as={"h4"}>Descripción: {evento.descripcion} </Text>

        </HStack>
        <HStack>
        <Text as={"h4"}>Fecha: {fechaSplit2(evento.fecha)} </Text>
        </HStack>
        <HStack>
        <Text as={"h4"} >Hora: {horaSplit(evento.fecha)} </Text>
        </HStack>
        </Stack>

        <Heading as={"h1"}  size={"xl"} textAlign="center" mt={10}>Visitas</Heading>

        <Stack spacing={4} mt="10">
          <Table variant='striped'>
            <Thead>
              <Tr>
              <Td fontWeight={"bold"}>Rut</Td>
                <Td fontWeight={"bold"}>Nombre</Td>
                <Td fontWeight={"bold"}>Apellido</Td>
                <Td fontWeight={"bold"}>Rol</Td>
                <Td fontWeight={"bold"}>Motivo</Td>

                <Td fontWeight={"bold"}>Eliminar</Td>
              </Tr>
            </Thead>
            <Tbody border={"5"}>
  {visitas && visitas.length > 0 ? (
    visitas.map((Visita, idx) => (
      <Tr key={idx}>
        <Td>{Visita.rut}</Td>
        <Td>{Visita.nombre}</Td>
        <Td>{Visita.apellido}</Td>
        <Td>{Visita.rol}</Td>
        <Td>{Visita.rol}</Td>

        <Td><IconButton style={{marginLeft:15}}   onClick={() => deleteIngreso(Visita)}  colorScheme='red' icon={<DeleteIcon/>}></IconButton></Td>
      </Tr>
    ))
  ) : (
    <Tr>
      <Td colSpan={5} textAlign="center">
        No hay asistentes registrados.
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
    <EventoPDF evento={evento} visitas={visitas}  />
  </PDFViewer>
  )}
          <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('../evento_reporte')}>Volver</Button>

      </HStack>
    </Container>
)}


export default ReporteEvento