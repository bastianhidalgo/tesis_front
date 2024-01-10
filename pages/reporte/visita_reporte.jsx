import React, {useState, useEffect,useRef} from 'react'
import { clienteAxios } from '../clienteAxios';
const { UseRegexRut } = require('../../Components/util');
import { useRouter } from 'next/router'
import { Menu,Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,IconButton,VStack,Text,FormControl,FormLabel,Image,Button,Container,Heading,HStack, Stack, Table, Thead, Tr, Td,Tbody ,Input} from '@chakra-ui/react';
import Swal   from 'sweetalert2'
import { fechaSplit2,fechaSplit } from '../../Components/util';
import {HamburgerIcon} from '@chakra-ui/icons'



const ReporteVisita =() => {

  const [errorFechaInicio, setErrorFechaInicio] = useState('');

  const [fechaInicio,setFechainicio]=useState('');
  const [fechaTermino,setFechatermino]=useState('');
  const [visitas, setVisitas]= useState([{
    id_visita:'',
    rut:'',
    nombre: '',
    apellido:'',
    telefono: '',
    rol: '',
    fechaInicio: '',
    fechaTermino:''
  }]);
 
  const [busqueda, setBusqueda] = useState("");
  const backgroundImageUrl = 'https://galerias.iglesia.cl/Gale_4fc8f6ca35693/Gale4fc8f6ca35f2c_01062012_107pm.JPG';
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef();


  const handleFechaInicioChange = (event) => {
    setFechainicio(event.target.value);

  };

  const handleFechaTerminoChange = (event) => {
    setFechatermino(event.target.value);
  };
  const getVisitas = async () => {
    try {
      const response = await clienteAxios.get("/usuarios/getall");
  
      if (response.status === 200) {
        const visitasData = response.data.visitas;
        //setVisitas(visitas)
        const visitasConRoles = await Promise.all(
          visitasData.map(async (visita) => {
            try {
              // Obtener información de la persona asociada a la visita
              const personaResponse = await clienteAxios.get(`/personas/getonebyvisita/${visita.id_visita}`);
              const persona = personaResponse.data.persona[0];
              visita.rol=persona.rol;
              visita.fechaInicio = persona.fecha_inicio; // Agrega la fecha de inicio a la visita
              visita.fechaTermino = persona.fecha_termino; // Agrega la fecha de término a la visita
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
       
          
       setVisitas( visitasConRoles);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

    useEffect(() => {
      getVisitas()
    },[])
    const router = useRouter()

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

            await clienteAxios.delete(`/usuarios/delete/${e}`)

            Swal.fire(
              'Borrado!',
              'Visita ha sido borrada',
              'success'
            )
            getVisitas();
          }
        })

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
        onClick={()=>router.push('../Home')}
        boxSize='25%'
        alt="Logo"
        style={{marginLeft:50,marginBottom:40}}
      /></HStack>
    <Stack>
            <center>
            <Heading as="h1" size="xl" className="header" textAlign="center" mt="10">Generar Reporte Visita</Heading>
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

            <Button colorScheme='blue' mr={3} onClick={onClose}>Cerrar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
            </Stack>


        <Stack>
        <Heading textAlign="center" as="h4" size="xl" mt="10"  >Por Fecha</Heading>

            <HStack style={{marginTop:40}}>
            <FormControl isInvalid={errorFechaInicio !== ''}>
  <FormLabel>{"Fecha de Inicio"}</FormLabel>
  <Input
    value={fechaInicio}
    onChange={handleFechaInicioChange}
    placeholder="Fecha de Inicio"
    type="date"
  />
  <Text color="red" fontSize="sm">
    {errorFechaInicio}
  </Text>
</FormControl>
<FormControl style={{marginBottom:17}}>
        <FormLabel>{"Fecha de Termino (opcional)"}</FormLabel>
        <Input  value={fechaTermino} onChange={handleFechaTerminoChange} placeholder="Fecha de Termino" type="date" />
        </FormControl>
           
        </HStack>
            <HStack style={{marginLeft:1100}}>
            
            <Button
  colorScheme="blue"
  mt={10}
  mb={10}
  onClick={() => {
    if (!fechaInicio) {
      setErrorFechaInicio('Por favor, seleccione la fecha de inicio.');
    } else {
      setErrorFechaInicio(''); // Reinicia el mensaje de error
      router.push(`./fechaVisita/${fechaSplit(fechaInicio) + '-' + fechaSplit(fechaTermino)}`);
    }
  }}
>
  Generar
</Button>

            </HStack>
            <Heading textAlign="center" as="h4" size="xl"   >Por Visita</Heading>

            <HStack>

            <Input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, apellido, rut, teléfono"
              value={busqueda}
              onChange={handleSearchChange}
            />

            </HStack>
            </Stack>
            <Container maxW="container.xl" mt={10}>
            <Table variant='striped'>
            <Thead>
              <Tr>
              <Td fontWeight={"bold"}>Rut</Td>
                <Td fontWeight={"bold"}>Nombre</Td>
                <Td fontWeight={"bold"}>Apellido</Td>
                <Td fontWeight={"bold"}>Teléfono</Td>
                <Td fontWeight={"bold"}>Rol</Td>
                <Td fontWeight={"bold"}>Fecha de Inicio</Td>
                <Td fontWeight={"bold"}>Fecha de Término</Td>
                <Td fontWeight={"bold"}>Generar Reporte</Td>

              </Tr>
            </Thead>
            <Tbody border={"5"}>
  {visitas && visitas.length > 0 ? (
visitas.map((Visita,idx)=>
  (
    <Tr key={idx}>
             <Td >{Visita.rut}</Td>
             <Td >{Visita.nombre}</Td>
             <Td>{Visita.apellido}</Td>
             <Td>{Visita.telefono}</Td>
             <Td>{Visita.rol}</Td>
             <Td>{fechaSplit2(Visita.fechaInicio)}</Td>
             <Td>{fechaSplit2(Visita.fechaTermino)}</Td>
             <Td>
              <Button colorScheme="blue"   onClick={()=>router.push(`./visitaReporte/${Visita.id_visita}`)}>Generar</Button>
            </Td>

     </Tr>
))
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
    

    </Container>
    
    <HStack style={{marginLeft:1100}}>
        <Button colorScheme="blue" mt={10} mb={10} onClick={() => router.push('./menu_reporte')}>Volver</Button>
        </HStack>
</Container>

);


        }

export default ReporteVisita;