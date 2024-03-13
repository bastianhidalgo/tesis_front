import { useState,useEffect,useRef } from "react";
import { clienteAxios } from '../clienteAxios';
import { useRouter } from 'next/router'
import { Menu,Drawer,FormControl,Text,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    VStack,useDisclosure,IconButton,Image,Button,Container,Heading,HStack, Select, Stack,FormLabel  } from '@chakra-ui/react';
import  {InputForm, TelForm,TextForm} from '../../Components/InputForm';
import Swal   from 'sweetalert2'
import {HamburgerIcon} from '@chakra-ui/icons'
import {Fn,UseRegexRut} from '../../Components/util'

const CrearAlumno = () =>{
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef();
    const [errorNombre, setErrorNombre] = useState('');
    const [errorApellido, setErrorApellido] = useState('');
    const [errorRut, setErrorRut] = useState('');
    const [errorCurso, setErrorCurso] = useState('');


    const [alumno,setAlumno]= useState({
      rut:'',
      nombre:'',
      apellido: '',
      cursoId:''

      //rol:''
      
    }) 
    const [cursos, setCursos] = useState([]);



    const handleChange=(e) =>{
        setAlumno({
            ... alumno,
            [e.target.name]: e.target.value
        })
    }

    const router = useRouter()

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await clienteAxios.get("/cursos/getall"); 
                setCursos(response.data.cursos);
            } catch (error) {
                console.error("Error al obtener cursos:", error);
            }
        };
    
        fetchRoles();
    }, []);

    const submitVisita = async (e) => {
        try{
            

            alumno.cursoId=parseInt(alumno.cursoId)
console.log(alumno)
             const response = await clienteAxios.post("/alumnos/create",alumno);
             console.log(response)

    
            if(response.status==200 ){
            console.log("Alumno creado")
            Swal.fire({
                icon:'success',
                title:'Excelente!',
                showConfirmButton: true,
                text: 'alumno registrado'
            })
            router.push('./listado')
            }
        }catch(error){
            console.log("error al crear el alumno")
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error al registrar el alumno, verifique los campos ingresados',
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
        onClick={()=>router.push('../Home')}
        boxSize='25%'
        alt="Logo"
        style={{marginLeft:50,marginBottom:40}}
      /></HStack>
            <Heading as={"h1"} className="header"  size={"2xl"} textAlign="center" mt="10">Crear alumno</Heading>
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
          <Button style={{marginRight:50}} colorScheme='red' mr={3} onClick={() => router.push('./')}>Cerrar sesión</Button>

            <Button colorScheme='blue' mr={3} onClick={onClose}>Cerrar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
            
            <Stack  spacing={4} mt={10}>
                <HStack >
               
                <InputForm isInvalid={errorNombre !== ''} errors={errorNombre} label="Nombre" handleChange={handleChange} name="nombre" placeholder="Nombre" type="text" value={alumno.nombre}/> 
                <InputForm isInvalid={errorApellido !== ''} errors={errorApellido} label="Apellido" handleChange={handleChange} name="apellido" placeholder="Apellido" type="text" value={alumno.apellido}/>

                </HStack>
                <HStack>
                <InputForm isInvalid={errorRut !== ''} errors={errorRut} label="Rut" handleChange={handleChange} name="rut" placeholder="Rut" type="text" value={alumno.rut}  />
                <FormControl isInvalid={errorCurso !== ''} id="cursoId">
                    <FormLabel>Curso</FormLabel>
                <Select 
    label="Curso alumno"
    onChange={handleChange}
    name="cursoId"
    placeholder="Seleccione curso del alumno"
    value={alumno.cursoId}
>
    {cursos?.map((curso) => (
        <option key={curso.id_curso} value={curso.id_curso}>
            {curso.nombre}
        </option>
    ))}
</Select>
<Text color="red" fontSize="sm">
  {errorCurso}
</Text>
</FormControl>
                </HStack>

               
                
            </Stack>
            <HStack style={{marginLeft:1100}}>
            <Button
              colorScheme="blue" mt={10} mb={10}
            onClick={() => {
    if (!alumno.nombre) {
      setErrorNombre('Por favor, el nombre es requerido.');
    } if (!alumno.apellido) {
      setErrorApellido('Por favor, el apellido es requerido.');
    } if (!alumno.rut || (!UseRegexRut(alumno.rut))) {
      setErrorRut('Por favor, el rut es requerido.');
    } if (!Fn.validaRut(alumno.rut)) {
        setErrorRut('Por favor, el rut es requerido.');
      } else {
      setErrorNombre(''); // Reinicia el mensaje de error
      setErrorApellido('');
      setErrorRut('');
      submitVisita();
    }
  }}>
Crear
  </Button>
        <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('./listado ')}>Volver</Button>
    </HStack>
        </Container>


    )
}
export default CrearAlumno
