import { useState, useEffect,useRef } from 'react'
import { Menu,Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,IconButton,VStack,
  useDisclosure,Image,Button, Container, Heading, HStack, Stack, Select, Text,Table,Thead,Tr,Td,Tbody } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { clienteAxios } from '../../clienteAxios';
import { fechaSplit2, horaSplit } from '../../../Components/util';
import {HamburgerIcon} from '@chakra-ui/icons'


export const getServerSideProps = async (context)=>{
  const fecha = context.query.reporte;
 // const response = await clienteAxios.get(`/usuarios/getone/${id}`)
  return{
      props: {
          data: fecha
      }
  }
}



const ReporteVisitaFechas =({ data }) => {
  const [ingresos, setIngresos]= useState([{
    
    fechaIngreso:'',
    personaId:'',
    rut:'',
    nombre:'',
  }]);    const router = useRouter()
    const [fechaInicio, setFechainicio] = useState();
    const [fechaTermino, setFechatermino] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef();

  const validarFecha = () => {
    if ((data) ) {
      const fechas = data.split('-');
      if (fechas.length === 6) {
        setFechainicio(fechas[2]+'-'+fechas[1]+'-'+fechas[0]);
        setFechatermino(fechas[5]+'-'+fechas[4]+'-'+fechas[3]);
       }
      if (fechas.length === 4) {
        setFechainicio(fechas[2]+'-'+fechas[1]+'-'+fechas[0]);
        setFechatermino('');
      } 
    }
  };

useEffect(() => {
  validarFecha()

  }, []);

  useEffect(() => {
    // Verifica que haya información sobre el evento antes de cargar las visitas

      const cargarIngresos = async () => {
        try {
          let fecha_inicio;
          let fecha_termino;
          if ((data) ) {
            const fechas = data.split('-');
            if (fechas.length === 6) {
               fecha_inicio=(fechas[0]+'-'+fechas[1]+'-'+fechas[2]);
               fecha_termino=(fechas[3]+'-'+fechas[4]+'-'+fechas[5]);
             }
            if (fechas.length === 4) {
               fecha_inicio=(fechas[0]+'-'+fechas[1]+'-'+fechas[2]);
              fecha_termino=null
            } 
          }

         // /eventos/getallbydate/2023-11-01/
         let response;
         if (fecha_termino===null){
           response = await clienteAxios.get(`/ingresos/getallbydate/${fecha_inicio}`);
         }else{
           response = await clienteAxios.get(`/ingresos/getallbydate/${fecha_inicio}/${fecha_termino}`);
         }
          // Realiza una sola solicitud para obtener información adicional de todas las visitas
          setIngresos(response.data.ingresos)
        //  console.log(response.data.ingresos[0].personaId)

          const ingresosData = response.data.ingresos;
          const personasConIngreso = await Promise.all(
            ingresosData.map(async (ingreso) => {
              try {
                // Obtener información de la persona asociada a la visita

                const respuesta = await clienteAxios.get(`/personas/getone/${ingreso.personaId}`);

              // console.log(respuesta.data)
                const persona=respuesta.data.persona

                
                if (persona.visitaId==null){

                    const respuesta = await clienteAxios.get(`/apoderados/getone/${persona.apoderadoId}`);
                    //console.log(respuesta.data.visita.rut)
                    ingreso.rut=respuesta.data.apoderado.rut
                    ingreso.nombre=respuesta.data.apoderado.nombre
                    ingreso.apellido=respuesta.data.apoderado.apellido

}else{
    return null;
}

                return ingreso;
              } catch (error) {
                console.error("Error fetching additional data:", error);
                return ingreso;
              }
            }))
            setIngresos(personasConIngreso.filter((ingreso) => ingreso !== null));


        
         }
         
        
         catch (error) {
          console.error('Error al cargar los ingresos:', error);
        }
      };
      cargarIngresos();
  
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
    <Heading as={"h1"} className="header" size={"xl"} textAlign="center" mt={10}>Historial de Apoderados</Heading>
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
        <Text as={"h4"}>Fecha Inicio: {(fechaInicio)} </Text>
        <Text as={"h4"} style={{marginLeft:500}} >Fecha Término: {(fechaTermino)} </Text>
        </HStack>
        </Stack>

        <Heading as={"h1"}  size={"xl"} textAlign="center" mt={10}>Apoderados</Heading>

        <Stack spacing={4} mt="10">
          <Table variant='striped'>
            <Thead>
              <Tr>
              <Td fontWeight={"bold"}>Rut</Td>
                <Td fontWeight={"bold"}>Nombre</Td>
                <Td fontWeight={"bold"}>Apellido</Td>
                <Td fontWeight={"bold"}>Fecha</Td>
                <Td fontWeight={"bold"}>Hora</Td>

              </Tr>
            </Thead>
            <Tbody border={"5"}>
  {ingresos && ingresos.length > 0 ? (
    ingresos.map((Ingreso, idx) => (
      <Tr key={idx}>
        <Td>{Ingreso.rut}</Td>
        <Td>{Ingreso.nombre}</Td>
        <Td>{Ingreso.apellido}</Td>

        <Td>{fechaSplit2(Ingreso.fechaIngreso)}</Td>
        <Td>{horaSplit(Ingreso.fechaIngreso)}</Td>
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
        <HStack>
       </HStack>
    <HStack style={{marginLeft:1100}}>
        
        <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('../apoderado_reporte')}>Volver</Button>
    </HStack>
    </Container>
)}


export default ReporteVisitaFechas