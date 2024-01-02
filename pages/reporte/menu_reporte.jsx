import React, {useState, useEffect,useRef} from 'react'
import { useRouter } from 'next/router'

import {  Menu,Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,Image,Box,Button,Container,Heading, Stack, Table, Thead, Tr, Td,Tbody ,Input, HStack,IconButton, VStack} from '@chakra-ui/react';
import {HamburgerIcon} from '@chakra-ui/icons'
import { format } from 'date-fns';
const ReporteEvento =() => {

  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef();
    



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
            <Heading as="h1" size="xl" className="header" textAlign="center" mt="10">Generar Reporte</Heading>
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
        
            <HStack style={{marginTop:40, marginLeft:400}}>

        <Button style={{marginLeft:20}} size='lg' colorScheme="blue" onClick={() => router.push('./evento_reporte')} >
        Eventos </Button>
        

        <Button  style={{marginLeft:20}} colorScheme="blue" size='lg' onClick={() => router.push('./visita_reporte')} >
        Visitas </Button>

        <Button style={{marginLeft:20}}  colorScheme="blue" size='lg' onClick={() => router.push('./apoderado_reporte')} >
        Apoderados </Button>
            </HStack>
            </Stack>
            
           
            <Button colorScheme="blue"  style={{marginTop:30, marginLeft:1170}} onClick={() => router.push('../Home')} >Volver
            </Button>
</Container>

);


        }

export default ReporteEvento;