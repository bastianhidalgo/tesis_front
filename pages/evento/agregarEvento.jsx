import { useState,useRef ,useEffect } from "react";
import { clienteAxios } from '../clienteAxios';
import { useRouter } from 'next/router'
import { Menu,Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,VStack,IconButton,
  useDisclosure,FormControl,Image,Button,Container,Heading,HStack, Select, Stack,FormLabel, Input,Text } from '@chakra-ui/react';
import  {TextForm,InputForm} from '../../Components/InputForm';
import Swal   from 'sweetalert2'
import { fechaSplit,horaSplit } from "@/Components/util";
import {HamburgerIcon} from '@chakra-ui/icons'


const Evento = () =>{
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef();
  const [errorTema, setErrorTema] = useState('');
  const [errorDescripcion, setErrorDescripcion] = useState('');
  const [errorFecha, setErrorFecha] = useState('');
  const [errorHora, setErrorHora] = useState('');
  const [curso,setCurso]= useState({
    id_curso:'', 
    nombre:'',
    descripcion:""
  }) 
  const [cursos, setCursos] = useState([]);

    const [evento,setEvento]= useState({
      tema:'',
      descripcion:'',
      fecha: ''
    }) 
    const [relacion,setRelacion]= useState({
      cursoId:'',
      eventoId:'',
    }) 
    const [hora,setHora]=useState(horaSplit(evento.fecha))

    const handleChange=(e) =>{
        setEvento({
            ... evento,
            [e.target.name]: e.target.value
        })
    }

    const router = useRouter()
    useEffect(() => {
      const fetchCursos = async () => {
          try {
              const response = await clienteAxios.get("/cursos/getall"); // Ajusta la ruta según tu API
              setCursos(response.data.cursos);
          } catch (error) {
              console.error("Error al obtener los cursos:", error);
          }
      };
  
      fetchCursos();
  }, []);
    

    const submitEvento = async (e) => {
        try{
            console.log(hora)
            evento.fecha=fechaSplit(evento.fecha)+'T'+hora+':00.000Z'
            console.log(evento)

            const response = await clienteAxios.post("/eventos/create",evento);
            console.log(response)
            if(relacion.cursoId!=''){
            relacion.cursoId=parseInt(relacion.cursoId)
            relacion.eventoId=response.data.evento.codigo_evento;
           // console.log(relacion)

            const respuesta = await clienteAxios.post("/cursoEvento/create",relacion);
}
            if(response.status==200 ){
            console.log("evento creado")
            Swal.fire({
                icon:'success',
                title:'Excelente!',
                showConfirmButton: true,
                text: 'Evento registrado'
            })
            router.push('../evento')
            }
        }catch(error){
            console.log("error al crear el evento")
            console.log(e)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error al registrar el evento',
                footer: 'Comunicarse con administración'
              })

            }
      }
      const InputHandleChange= (event) => {
        setHora(event.target.value);
      };
      const handleBlur = () => {
        console.log('Hora actualizada:', hora);
        setHora(hora);
      };
      const handleChange2=(e) =>{
        setCurso({
            ... curso,
            [e.target.name]: e.target.value
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
            <Heading as={"h1"} className="header"  size={"2xl"} textAlign="center" mt="10">Registrar Evento</Heading>
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

            <Stack  spacing={4} mt={10}>
                <HStack >
                <InputForm label="Tema"  isInvalid={errorTema !== ''} errors={errorTema} handleChange={handleChange} name="tema" placeholder="Tema" type="text" value={evento.tema}  />
                <TextForm label="Descripción"  isInvalid={errorDescripcion !== ''} errors={errorDescripcion} handleChange={handleChange} name="descripcion" placeholder="Descripción" type="text" value={evento.descripcion}/>
                </HStack>
                <HStack>
                <InputForm label="Fecha"  isInvalid={errorFecha !== ''} errors={errorFecha} handleChange={handleChange} name="fecha" placeholder="Fecha" type="date" value={evento.fecha}/>
                <FormControl isInvalid={errorFecha !== ''}>
                <FormLabel>{"Hora"}</FormLabel>
                <Input value={hora}   label="Hora" onChange={InputHandleChange} onBlur={handleBlur}    placeholder="ejemplo: 12:00" type="time" />
                <Text color="red" fontSize="sm">
    {errorHora}
  </Text>
                </FormControl>
                </HStack>
                <HStack>
                <FormControl  id="curso">
                <FormLabel>{"Ingrese curso que realiza el evento (opcional)"}</FormLabel>
                <Select 
    label="Curso evento"
    onChange={(e) => setRelacion({ ...relacion, cursoId: e.target.value })}    name="curso"
    placeholder="Seleccione curso"
    value={relacion.cursoId}
>
    {cursos?.map((curso) => (
        <option key={curso.id_curso} value={curso.id_curso}>
            {curso.nombre}
        </option>
    ))}
</Select>

</FormControl>
<FormControl></FormControl>
</HStack>
            </Stack>
            <HStack style={{marginLeft:1100}}>
        
        <Button
              colorScheme="blue" mt={10} mb={10}
            onClick={() => {
    if (!evento.tema) {
      setErrorTema('Por favor, el tema es requerido.');
    } if (!evento.descripcion) {
      setErrorDescripcion('Por favor, la descripción es requerida.');
    } if (!evento.fecha) {
      setErrorFecha('Por favor, la fecha es requerida.');
    } if (!hora) {
      setErrorHora('Por favor, la hora es requerida.');
    }  else {
      setErrorTema(''); // Reinicia el mensaje de error
      setErrorDescripcion('');
      setErrorFecha('');
      setErrorHora('');
      
      submitEvento();
    }
  }}>
Crear
  </Button>
        <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('../evento')}>Volver</Button>
    </HStack>
        </Container>


    )
}
export default Evento
