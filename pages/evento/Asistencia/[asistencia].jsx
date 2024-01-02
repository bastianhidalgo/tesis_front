import React, {useState, useEffect,useRef} from 'react'
import { clienteAxios } from '../../clienteAxios';
const { UseRegexRut } = require('../../../Components/util');
import { useRouter } from 'next/router'
import {  Menu,Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,IconButton,VStack,
  useDisclosure,Image,Button,Container,Heading,HStack, Stack, Table, Thead, Tr, Td,Tbody ,Textarea, Text,Input} from '@chakra-ui/react';
import Swal   from 'sweetalert2'
import { fechaSplit2 } from '../../../Components/util';
import {HamburgerIcon} from '@chakra-ui/icons'


export const getServerSideProps = async (context)=>{
    const id = context.query.asistencia;
    const response = await clienteAxios.get(`/eventos/getone/${id}`)
    return{
        props: {
            data: response.data
        }
    }
}

const Asistencia =({ data }) => {
  const [evento, setEvento] = useState(data.evento);
  const [estado, setEstado] = useState('');
  const [rut,setRut]=useState('');
  const router = useRouter()
  const  eventoo  = router.query
  const id_evento = router.query.evento;
  const [visitas, setVisitas]= useState([{
        id_visita:'',
        rut:'',
        nombre: '',
        apellido:'',
        telefono: '',
        rol: ''
      }]);
      const [apoderados, setApoderados]= useState([{
        id:'',
        rut:'',
        nombre: '',
        apellido:'',
        telefono: '',
        rol: ''
      }]);
      const [visitaEvento, setVisitaEvento] = useState([
        {
          
          eventoId: evento.id_evento,
          personaId: '',
        },
      ]);

      const { isOpen, onOpen, onClose } = useDisclosure()
      const btnRef = useRef();
    const handleInputChange = (event) => {
      const { rut, id_visita } = event.target;
      setBuscador(id_visita);
    };
    
    const handleError = err => {
    console.error(err)
    }
      
    const handleChange = (event) => {
        setRut(event.target.value);
      };



         const buscarApoderados = async (rut) => {
         try {
          const respuesta = await clienteAxios.get(`/apoderados/comparar/${rut}`);

          setVisitas([respuesta.data.apoderado[0]]);
          return 0;
        } catch (errorApoderados) {
          console.error('Error al cargar visitas desde apoderados:', errorApoderados);
          setVisitas([]);
          // Maneja el error si la segunda solicitud no tiene éxito
        }
      }

         useEffect(() => {
          
          const fetchVisitasPorRut = async () => {
            try {
              if (rut.length > 8) {
                const response = await clienteAxios.get(`/usuarios/comparar/${rut}`);
                console.log(response)

                if (response.status === 200) {
                  setVisitas([response.data.visita[0]]);
                  return 0;
                } else {
                  buscarApoderados(rut);
                }
              }
            } catch (errorUsuarios) {
              console.error('Error al cargar visitas desde usuarios:', errorUsuarios);
              buscarApoderados(rut)

              setVisitas([]);
              // Maneja el error si la primera solicitud no tiene éxito
            }
          };
      
          if (rut !== '') {
            fetchVisitasPorRut(); // Llama a la función para obtener las visitas basadas en el RUT
            setVisitas([]);
          }else{
            setVisitas([]);
          }
        }, [rut]);


      const compararRut2 = async () => {
            if(!UseRegexRut(rut)){
                console.log(" rut mal ingresado ")
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Rut mal ingresado'
                })
                return 0 }

        try{
          let response
          console.log(evento.codigo_evento)
            try{
             response = await clienteAxios.get(`/personas/getonebyvisita/${visitas[0].id_visita}`);
             console.log(response)


            }catch{
               response = await clienteAxios.get(`/personas/getonebyapoderado/${visitas[0].id_apoderado}`);
               console.log(response)

            }

            const VisitaEvento = {
              eventoId: evento.codigo_evento,
              personaId: response.data.persona[0].id_persona,
            };
            setVisitaEvento([VisitaEvento]);
            console.log(VisitaEvento)

            const respuesta= await clienteAxios.post('/visita/create',VisitaEvento);

            

            if(respuesta.status==200){
            console.log("persona admitida")
            setEstado("persona admitida")
            Swal.fire({
              icon:'success',
              title:'Excelente!',
              showConfirmButton: true,
              text: 'Persona Registrada'
              

              
          })
          return 0}
        }catch(error){
             console.log("persona denegada")
             setEstado("persona rechazada")
             console.log(error)
             Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Persona no admitida',
              footer: 'Comunicarse con administración'
            })
             
            }
      }
    



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
    <Stack>
            <center>
            <Heading as="h1" size="xl" className="header" textAlign="center" mt="10">Ingrese RUN </Heading>
            <Heading as="h1" size="xl" className="header" textAlign="center" mt="10">{evento.tema} </Heading>

            </center>
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
            </Stack>


        <Stack>
        
            <HStack style={{marginTop:40}}>
        <Input  style={{fontSize:18, width:250, height:50}}id="rut" value={rut} onChange={handleChange} name="Rut" placeholder="Sin puntos y con guión" type="text" />

        <Button style={{marginLeft:30}} colorScheme="blue" onClick={compararRut2} >
        Registrar Asistencia </Button>
        

       
            </HStack>
            </Stack>
            <Container maxW="container.xl" mt={10}>
            <Table variant="simple">
            <Thead>
              <Tr>
              <Td fontWeight={"bold"}>Rut</Td>
                <Td fontWeight={"bold"}>Nombre</Td>
                <Td fontWeight={"bold"}>Apellido</Td>
                <Td fontWeight={"bold"}>Teléfono</Td>

              </Tr>
            </Thead>
            <Tbody border={"5"}>           {visitas && visitas.length  > 0 ? (
            visitas.map((Visita,idx)=>
              (
                <Tr key={idx}>
             <Td >{Visita.rut}</Td>
             <Td >{Visita.nombre}</Td>
             <Td>{Visita.apellido}</Td>
             <Td>{Visita.telefono}</Td>

            

     </Tr>
)
)
): (
  <Tr>
    <Td colSpan={9} textAlign="center">
      No hay coincidencias.
    </Td>
  </Tr>
)
}

</Tbody>
          </Table>
    

    </Container>
           
            <Button colorScheme="blue" style={{marginTop:30, marginLeft:1170}} onClick={() => router.push('../../evento')} >Volver
            </Button>
</Container>

);


        }

export default Asistencia;