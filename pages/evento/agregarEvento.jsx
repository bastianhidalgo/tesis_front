import { useState,useRef } from "react";
import { clienteAxios } from '../clienteAxios';
import { useRouter } from 'next/router'
import { Menu,Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,VStack,IconButton,
  useDisclosure,FormControl,Image,Button,Container,Heading,HStack, Select, Stack,FormLabel, Input } from '@chakra-ui/react';
import  {TextForm,InputForm} from '../../Components/InputForm';
import Swal   from 'sweetalert2'
import { fechaSplit,horaSplit } from "@/Components/util";
import {HamburgerIcon} from '@chakra-ui/icons'


const Evento = () =>{
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef();
    
    const [evento,setEvento]= useState({
      tema:'',
      descripcion:'',
      fecha: ''
    }) 
    const [hora,setHora]=useState(horaSplit(evento.fecha))

    const handleChange=(e) =>{
        setEvento({
            ... evento,
            [e.target.name]: e.target.value
        })
    }

    const router = useRouter()

    

    const submitEvento = async (e) => {
        e.preventDefault(); 
        try{
            
            evento.fecha=fechaSplit(evento.fecha)+'T'+hora+':00.000Z'
            const response = await clienteAxios.post("/eventos/create",evento);
    
    
            if(response.status==200){
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
                <InputForm label="Tema" handleChange={handleChange} name="tema" placeholder="Tema" type="text" value={evento.tema}  />
                <TextForm label="Descripción" handleChange={handleChange} name="descripcion" placeholder="Descripción" type="text" value={evento.descripcion}/>
                </HStack>
                <HStack>
                <InputForm label="Fecha" handleChange={handleChange} name="fecha" placeholder="Fecha" type="date" value={evento.fecha}/>
                <FormControl>
                <FormLabel>{"Hora"}</FormLabel>
                <Input value={hora} label="Hora" onChange={InputHandleChange} onBlur={handleBlur}   placeholder="ejemplo: 12:00" type="text" />
                </FormControl>
                </HStack>
            </Stack>
            <HStack style={{marginLeft:1100}}>
        <Button colorScheme="blue" mt={10} mb={10} onClick={submitEvento}>Crear</Button>
        <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('../evento')}>Volver</Button>
    </HStack>
        </Container>


    )
}
export default Evento
