import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import { Image,Button,Container,Heading,HStack, Stack, Table, Thead, Tr, Td,Tbody ,Textarea, Text,Input} from '@chakra-ui/react';
import Swal   from 'sweetalert2'


const ReporteEvento =() => {

  const router = useRouter()
  
    



return (
  <Container maxW="container.xl" mt={10}>
          <Image
        src='https://www.cspnc.cl/wp-content/uploads/2021/07/logo-cspnc-2021.png'
        onClick={()=>router.push('../../Home')}
        boxSize='25%'
        alt="Logo"
      />
    <Stack>
            <center>
            <Heading as="h1" size="xl" className="header" textAlign="center" mt="10">Generar Reporte</Heading>
            </center>
            

            </Stack>


        <Stack>
        
            <HStack style={{marginTop:40, marginLeft:500}}>

        <Button style={{marginLeft:30}}size='lg' colorScheme="blue" onClick={() => router.push('./evento_reporte')} >
        Eventos </Button>
        

        <Button style={{marginLeft:30}}  colorScheme="blue" size='lg' onClick={() => router.push('./visita_reporte')} >
        Visitas </Button>
            </HStack>
            </Stack>
            
           
            <Button colorScheme="blue"  style={{marginTop:30, marginLeft:1170}} onClick={() => router.push('../Home')} >Volver
            </Button>
</Container>

);


        }

export default ReporteEvento;