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
  useDisclosure,Image,Button,Container,Heading,HStack,Select, Stack, Table, Thead, Tr, Td,Tbody ,Textarea, Text,Input} from '@chakra-ui/react';
import Swal   from 'sweetalert2'
import { fechaSplit2 } from '../../../Components/util';
import {HamburgerIcon,CheckIcon} from '@chakra-ui/icons'


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
  const [busqueda, setBusqueda] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState(''); // Estado para almacenar la selección del usuario
  const [visitass, setVisitass] = useState([]); // Estado para almacenar las visitas obtenidas del servidor
    const [apoderadoss, setApoderadoss] = useState([]);

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

      const filtrarDatos = (datos) => {
        // Verificar si datos es un array antes de llamar a filter
        if (!Array.isArray(datos)) {
          // Si no es un array, no se puede filtrar, así que regresamos los datos sin cambios
          return datos;
        }
      
        // Luego, procedemos a filtrar si datos es un array válido
        return datos.filter((item) => {
          // Filtrar por rut, nombre o apellido
          return (
            item.rut.toLowerCase().includes(busqueda.toLowerCase()) ||
            item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            item.apellido.toLowerCase().includes(busqueda.toLowerCase())
          );
        });
      };
      



      const cargarDatos = async () => {
        try {
            if (tipoSeleccionado === 'visita') {
                const response = await clienteAxios.get('usuarios/getall');
                setVisitass(response.data.visitas);
            } else if (tipoSeleccionado === 'apoderado') {
                const response = await clienteAxios.get('apoderados/getall');
                setApoderadoss(response.data.apoderados);
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [tipoSeleccionado]);
    const handleChangeTipo = (event) => {
      setTipoSeleccionado(event.target.value); // Actualiza el estado con la selección del usuario
  };

  const handleSearchChange = (e) => {
    const nuevoTermino = e.target.value;
    setBusqueda(nuevoTermino);

    if (nuevoTermino === "") {
        // Restablecer los datos originales cuando el término de búsqueda está vacío
        if (tipoSeleccionado === 'visita') {
            if (data && data.visitas) {
                setVisitass(data.visitas);
            }
        } else if (tipoSeleccionado === 'apoderado') {
            if (data && data.apoderados) {
                setApoderadoss(data.apoderados);
            }
        }
    } else {
        // Realizar la búsqueda y filtrar los datos según el término de búsqueda
        if (tipoSeleccionado === 'visita') {
            const visitasFiltradas = filtrarDatos(visitass);
            setVisitass(visitasFiltradas);
        } else if (tipoSeleccionado === 'apoderado') {
            const apoderadosFiltrados = filtrarDatos(apoderadoss);
            setApoderadoss(apoderadosFiltrados);
        }
    }
};

      const compararRut2 = async (e) => {


        try{
          let response
          console.log(evento.codigo_evento)
            try{
              if(tipoSeleccionado=='visita'){
             response = await clienteAxios.get(`/personas/getonebyvisita/${e}`);
             console.log(response)
            }else{
                response = await clienteAxios.get(`/personas/getonebyapoderado/${e}`);

              }

            }catch(errror){
               console.log(error)

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
              text: 'Persona ya registrada',
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
            <Input
                type="text"
                className="form-control"
                placeholder="Buscar por rut, nombre o apellido"
                value={busqueda}
                onChange={handleSearchChange}
            />
       
        
   <Select value={tipoSeleccionado} onChange={handleChangeTipo}>
                <option value="">Seleccione tipo</option>
                <option value="visita">Visita</option>
                <option value="apoderado">Apoderado</option>
            </Select>
       
            </HStack>
            </Stack>
            <Container maxW="container.xl" mt={10}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Td>Rut</Td>
                        <Td>Nombre</Td>
                        <Td>Apellido</Td>
                        <Td>Teléfono</Td>
                        <Td>Registrar</Td>
                    </Tr>
                </Thead>
                <Tbody>
                    {/* Renderizar las visitas o apoderados según la selección del usuario */}
                    {tipoSeleccionado === 'visita' ? (
                        visitass.map((visita, idx) => (
                            <Tr key={idx}>
                                <Td>{visita.rut}</Td>
                                <Td>{visita.nombre}</Td>
                                <Td>{visita.apellido}</Td>
                                <Td>{visita.telefono}</Td>
                                <Td>
                                    <IconButton icon={<CheckIcon />} colorScheme="green"  onClick={()=>compararRut2(visita.id_visita)} />
                                </Td>
                            </Tr>
                        ))
                    ) : tipoSeleccionado === 'apoderado' ? (
                        apoderadoss.map((apoderado, idx) => (
                            <Tr key={idx}>
                                <Td>{apoderado.rut}</Td>
                                <Td>{apoderado.nombre}</Td>
                                <Td>{apoderado.apellido}</Td>
                                <Td>{apoderado.telefono}</Td>
                                <Td>
                                    <IconButton icon={<CheckIcon />} colorScheme="green"  onClick={()=>compararRut2(apoderado.id_apoderado)} />
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={5} textAlign="center">Seleccione un tipo para mostrar los datos</Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
    

    </Container>
           
            <Button colorScheme="blue" style={{marginTop:30, marginLeft:1170}} onClick={() => router.push('../../evento')} >Volver
            </Button>
</Container>

);


        }

export default Asistencia;