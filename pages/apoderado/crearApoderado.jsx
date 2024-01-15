import { useState,useEffect,useRef } from "react";
import { clienteAxios } from '../clienteAxios';
import { useRouter } from 'next/router'
import { Menu,Drawer,
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


const CrearApoderado = () =>{
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef();
    const [errorNombre, setErrorNombre] = useState('');
    const [errorApellido, setErrorApellido] = useState('');
    const [errorRut, setErrorRut] = useState('');
    const [errorTelefono, setErrorTelefono] = useState('');
    const [errorFechaInicio, setErrorFechaInicio] = useState('');
    const [errorFechaTermino, setErrorFechaTermino] = useState('');

    const [apoderado,setApoderado]= useState({
      rut:'',
      nombre:'',
      apellido: '',
      telefono: ''

      //rol:''
      
    }) 
    const [roles, setRoles] = useState([]);

    const [persona,setPersona]= useState({
      rol:4, 
      apoderadoId:null,
      visitaId:null,
      fecha_inicio: '',
      fecha_termino: '',
      observacion:''
    }) 

    const handleChange=(e) =>{
        setApoderado({
            ... apoderado,
            [e.target.name]: e.target.value
        })
    }
    const handleChange2=(e) =>{
      setPersona({
          ... persona,
          [e.target.name]: e.target.value
      })
  }
    const router = useRouter()

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await clienteAxios.get("/rol/getall"); 
                setRoles(response.data.roles);
            } catch (error) {
                console.error("Error al obtener roles:", error);
            }
        };
    
        fetchRoles();
    }, []);

    const submitVisita = async (e) => {
        try{
            persona.fecha_inicio=persona.fecha_inicio+'T00:00:00.000Z';
           persona.fecha_termino=persona.fecha_termino+'T00:00:00.000Z';
           apoderado.telefono="+569"+apoderado.telefono;
            persona.rol= parseInt(persona.rol)

            console.log(apoderado)


             const response = await clienteAxios.post("/apoderados/create",apoderado);
            const variable = await clienteAxios.get(`/apoderados/comparar/${apoderado.rut}`)
             console.log(variable.data.apoderado[0].id_apoderado)
             persona.apoderadoId=variable.data.apoderado[0].id_apoderado
             console.log(persona)

             const respuesta= await clienteAxios.post("/personas/create",persona);
            
  
            
    
            if(respuesta.status==200 ){
            console.log("Apoderado creado")
            Swal.fire({
                icon:'success',
                title:'Excelente!',
                showConfirmButton: true,
                text: 'apoderado registrado'
            })
            router.push('./listado')
            }
        }catch(error){
            console.log("error al crear el apoderado")
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error al registrar el apoderado',
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
            <Heading as={"h1"} className="header"  size={"2xl"} textAlign="center" mt="10">Crear apoderado</Heading>
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
               
                <InputForm isInvalid={errorNombre !== ''} errors={errorNombre} label="Nombre" handleChange={handleChange} name="nombre" placeholder="Nombre" type="text" value={apoderado.nombre}/> 
                <InputForm isInvalid={errorApellido !== ''} errors={errorApellido} label="Apellido" handleChange={handleChange} name="apellido" placeholder="Apellido" type="text" value={apoderado.apellido}/>

                </HStack>
                <HStack>
                <InputForm isInvalid={errorRut !== ''} errors={errorRut} label="Rut" handleChange={handleChange} name="rut" placeholder="Rut" type="text" value={apoderado.rut}  />

                <TelForm isInvalid={errorTelefono !== ''} errors={errorTelefono} label="Teléfono" handleChange={handleChange} name="telefono" placeholder="Teléfono" type="tel" value={apoderado.telefono}/>
                </HStack>

                <HStack>
                <InputForm isInvalid={errorFechaInicio !== ''} errors={errorFechaInicio} label="Fecha de Inicio" handleChange={handleChange2} name="fecha_inicio" placeholder="Fecha de Inicio" type="date" value={persona.fecha_inicio}/>
                <InputForm isInvalid={errorFechaTermino !== ''} errors={errorFechaTermino} label="Fecha de Término" handleChange={handleChange2} name="fecha_termino" placeholder="Fecha de Término" type="date"  value={persona.fecha_termino}/>
                </HStack>
                <HStack>
                <TextForm label="Observación (opcional)"  handleChange={handleChange2} name="observacion" placeholder="Observación" type="text" value={persona.observacion}/>
</HStack>
            </Stack>
            <HStack style={{marginLeft:1100}}>
            <Button
              colorScheme="blue" mt={10} mb={10}
            onClick={() => {
    if (!apoderado.nombre) {
      setErrorNombre('Por favor, el nombre es requerido.');
    } if (!apoderado.apellido) {
      setErrorApellido('Por favor, el apellido es requerido.');
    } if (!apoderado.rut) {
      setErrorRut('Por favor, el rut es requerido.');
    } if ((!apoderado.telefono) || (apoderado.telefono.length!==8) ) {
      setErrorTelefono('Por favor, el teléfono es inválido.');
    } if (!persona.fecha_inicio) {
      setErrorFechaInicio('Por favor, la fecha de inicio es requerida.');
    } if (!persona.fecha_termino) {
      setErrorFechaTermino('Por favor, la fecha de término es requerida.');
    } else {
      setErrorNombre(''); // Reinicia el mensaje de error
      setErrorApellido('');
      setErrorRut('');
      setErrorTelefono('');
      setErrorFechaInicio('');
      setErrorFechaTermino('');
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
export default CrearApoderado
