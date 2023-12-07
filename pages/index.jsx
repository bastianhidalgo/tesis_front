import React, {useState,useEffect} from 'react'
import { useRouter } from 'next/router'
import { Button, Box, Image, Input,InputGroup,InputRightElement, FormLabel } from '@chakra-ui/react';
import {InputForm} from '../Components/InputForm'

function MostrarImagen() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function actualizarTamanoVentana() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener('resize', actualizarTamanoVentana);

    actualizarTamanoVentana();

    return () => window.removeEventListener('resize', actualizarTamanoVentana);
  }, []);

  return (
    <div style={{position: 'fixed', top: 30, left: 320, width: '100%', height: '100%', zIndex: -1 }}>
      <Image
        src="https://i.postimg.cc/Fz0R2Qyx/IMG-0486.jpg"
        layout="fill"
        objectFit="cover"
        objectPosition="center center"
        alt="Mi Imagen" 
        style={{ transform: 'scale(1.5)' }}     />
    </div>
  );
}


function Index() {

  const router = useRouter()
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
            <MostrarImagen/>

    <Box style={{marginLeft:750, marginTop:200 , backgroundColor: 'rgba(255, 255, 255, 0.7)',}} maxW='lg' borderWidth='5px' borderRadius='lg' zIndex={3} >
<Image  mt={10} 
        src='https://www.cspnc.cl/wp-content/uploads/2021/07/logo-cspnc-2021.png'
        boxSize='60%'
        alt="Logo"
        style={{marginLeft:100,marginBottom:40}}
      />

      <InputForm  label="Ingrese Rut"  name="rut" mt={10} placeholder="Rut" type="text"  ></InputForm>
      <FormLabel>Ingrese Contraseña</FormLabel>
      <InputGroup size='md'>
      <Input
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        placeholder='Contraseña'
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={handleClick}>
          {show ? 'Esconder' : 'Mostrar'}
        </Button>
      </InputRightElement>
    </InputGroup>    <Button style={{marginLeft:200}}  mt={10} colorScheme="blue" textAlign="center"  onClick={() => router.push('./Home')}>Entrar</Button>

    </Box>  
    </div>

    );
  
}

export default Index;




