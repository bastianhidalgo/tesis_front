import { React,useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'
import {  Menu,Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,Button,VStack,HStack} from '@chakra-ui/react';



  const ComponentDrawer=({isOpen,onClose,btnRef})=>{
    const router = useRouter();

    return (
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
        <Button   colorScheme='teal' w="full"  onClick={() => router.push('../alumno/listado')}>Alumnos</Button>
        </DrawerFooter>
        <DrawerFooter borderTopWidth='1px'>
        
        <Button   colorScheme='teal' w="full"  onClick={() => router.push('../apoderado/listado')}>Apoderados</Button>
      
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

  )}


  module.exports={
    ComponentDrawer
  }