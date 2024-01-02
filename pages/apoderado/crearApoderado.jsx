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
import  {InputForm, TelForm} from '../../Components/InputForm';
import Swal   from 'sweetalert2'
import {HamburgerIcon} from '@chakra-ui/icons'


const CrearApoderado = () =>{
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef();

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
      fecha_termino: ''
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
        e.preventDefault(); 
        try{
            persona.fecha_inicio=persona.fecha_inicio+'T00:00:00.000Z';
           persona.fecha_termino=persona.fecha_termino+'T00:00:00.000Z';
            
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
            console.log(e)
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
                <InputForm label="Rut" handleChange={handleChange} name="rut" placeholder="Rut" type="text" value={apoderado.rut}  />
                <InputForm label="Nombre" handleChange={handleChange} name="nombre" placeholder="Nombre" type="text" value={apoderado.nombre}/>
                </HStack>
                <HStack>
                <InputForm label="Apellido" handleChange={handleChange} name="apellido" placeholder="Apellido" type="text" value={apoderado.apellido}/>
                <TelForm label="Teléfono" handleChange={handleChange} name="telefono" placeholder="Teléfono" type="tel" value={apoderado.telefono}/>
                </HStack>

                <HStack>
                <InputForm label="Fecha de Inicio" handleChange={handleChange2} name="fecha_inicio" placeholder="Fecha de Inicio" type="date" value={persona.fecha_inicio}/>
                <InputForm label="Fecha de Término" handleChange={handleChange2} name="fecha_termino" placeholder="Fecha de Término" type="date"  value={persona.fecha_termino}/>
                </HStack>
            </Stack>
            <HStack style={{marginLeft:1100}}>
        <Button colorScheme="blue" mt={10} mb={10} onClick={submitVisita}>Crear</Button>
        <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('../Home')}>Volver</Button>
    </HStack>
        </Container>


    )
}
export default CrearApoderado
