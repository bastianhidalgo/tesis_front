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
import {HamburgerIcon} from '@chakra-ui/icons'
import Apoderado from '@/pages/alumno/listado'


export const getServerSideProps = async (context)=>{
    const id = context.query.reporte;
    const response = await clienteAxios.get(`/usuarios/getone/${id}`)
    return{
        props: {
            data: response.data
        }
    }
}

const ReporteVisita =({ data }) => {
    const [evento, setEvento] = useState(data.evento);
    const [visita, setVisita] = useState(data.visita);
    const [rol, setRol] = useState('');
    const router = useRouter()
    const btnRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [ingresos, setIngresos]= useState([{
      personaId:'',
      fecha:''
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
      if (visita) {
        const cargarIngresos = async () => {
          try {

            const response = await clienteAxios.get(`/personas/getonebyvisita/${visita.id_visita}`);
            const persona=response.data.persona[0]
            const rolResponse = await clienteAxios.get(`/rol/getone/${persona.rol}`);
            setRol(rolResponse.data.rol.descripcion)

            const ingresosRespuesta = await clienteAxios.get(`/ingresos/getingresosbypersona/${persona.id_persona}`);

                setIngresos(ingresosRespuesta.data.ingresos)
            
            
          } catch (error) {
            console.error('Error al cargar las visitas:', error);
          }
        }
      ;
    
        cargarIngresos();
      }
    }, []);
    


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
    <Heading as={"h1"} className="header" size={"xl"} textAlign="center" mt={10}>Visita</Heading>

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
        <Text as={"h4"}>Rut: {visita.rut}  </Text>
        </HStack>
        <HStack>

        <Text as={"h4"}>Nombre: {visita.nombre} {visita.apellido}</Text>

        </HStack>
        <HStack>
        <Text as={"h4"}>Rol: {rol} </Text>
        </HStack>
        <HStack>

<Text as={"h4"}>Teléfono: {visita.telefono}</Text>

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
              </Tr>
            </Thead>
            <Tbody border={"5"}>
  {ingresos && ingresos.length > 0 ? (
    ingresos.map((Ingreso, idx) => (
      <Tr key={idx}>
        <Td>{idx+1}</Td>
        <Td>{fechaSplit2(Ingreso.fechaIngreso)}</Td>
        <Td>{horaSplit(Ingreso.fechaIngreso)}</Td>

      </Tr>
    ))
  ) : (
    <Tr>
      <Td colSpan={4} textAlign="center">
        No hay ingresos registrados.
      </Td>
    </Tr>
  )}
</Tbody>
          </Table>
        </Stack>

    <HStack style={{marginLeft:1100}}>
        
        <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('../visita_reporte')}>Volver</Button>
    </HStack>
    </Container>
)}


export default ReporteVisita