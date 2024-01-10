import { useState, useEffect,useRef } from 'react'
import {InputForm} from '../../../Components/InputForm'
import { Menu,Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,IconButton,VStack,Image,Button, Container, Heading, HStack, Stack, Select } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { clienteAxios } from '../../clienteAxios';
import { fechaSplit, UseRegexRut,useRegexTelefono  } from '../../../Components/util';
import {HamburgerIcon} from '@chakra-ui/icons'


export const getServerSideProps = async (context)=>{
    const id = context.query.modificar;
    const response = await clienteAxios.get(`/apoderados/getone/${id}`)
    const respuesta = await clienteAxios.get(`/personas/getonebyapoderado/${id}`)
    return{
        props: {
            data: response.data,
            datax: respuesta.data
        }
    }
}

const Editar =({ data,datax }) => {
    const [apoderado, setApoderado] = useState(data.apoderado);
   const [persona,setPersona]=useState(datax.persona[0])
    const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef();
    const [errors, setErrors] = useState('');

    const [errorNombre, setErrorNombre] = useState('');
    const [errorApellido, setErrorApellido] = useState('');
    const [errorRut, setErrorRut] = useState('');
    const [errorTelefono, setErrorTelefono] = useState('');
    const [errorRol, setErrorRol] = useState('');
    const [errorFechaInicio, setErrorFechaInicio] = useState('');
    const [errorFechaTermino, setErrorFechaTermino] = useState('');
    //console.log(datax.persona)

    const handleChange=(e) =>{
        setApoderado({
            ...apoderado,
            [e.target.name]: e.target.value
        })
    }

    const handleChangePersona=(e) =>{
      setPersona({
          ...persona,
          [e.target.name]: e.target.value
      })
  }
    function contieneLetra(cadena) {
        // Itera sobre cada carácter de la cadena y verifica si es una letra
        for (let i = 0; i < cadena.length; i++) {
          if (/^[a-zA-Z]$/.test(cadena[i])) {
            return true; // Si encuentra una letra, devuelve true
          }
        }
        return false; // Si no encuentra ninguna letra, devuelve false
      }


    const submitApoderado = async(e) =>{
      const errors = validateForm();

      if (Object.keys(errors).length === 0) {         
        try{

            if(!contieneLetra(persona.fecha_inicio)){
                persona.fecha_inicio=persona.fecha_inicio+'T00:00:00.000Z'
            }
            if(!contieneLetra(persona.fecha_termino)){
                persona.fecha_termino=persona.fecha_termino+'T00:00:00.000Z'
            }
            const response = await clienteAxios.put(`/apoderados/update/${apoderado.id_apoderado}`,apoderado);
            

            const respuesta = await clienteAxios.put(`/personas/update/${persona.id_persona}`,persona);
           

        if(response.status==200 && respuesta.status==200){
            Swal.fire({
                icon:'success',
                title:'Apoderado actualizado',
                showConfirmButton: true,
                text: 'El apoderado se actualizo correctamente'
            })
            router.push('../listado')
            }
        }catch(error){
            console.log("error al actualizar la visita")
            console.log(e)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error al actualizar la visita',
                footer: 'Comunicarse con administración'
              })
            }
          }else{
            setErrorNombre(errors.errorNombre ||''); // Reinicia el mensaje de error
            setErrorApellido(errors.errorApellido ||'');
            setErrorRut(errors.errorRut ||'');
            setErrorTelefono(errors.errorTelefono ||'');
            setErrorFechaInicio(errors.errorFechaInicio ||'');
            setErrorFechaTermino(errors.errorFechaTermino ||'');
          }
        }

        const validateForm = () => {
          const errors = {};
      
          if (!apoderado.nombre) {
              errors.errorNombre = 'Por favor, el nombre es requerido.';
          }
          if (!apoderado.apellido) {
              errors.errorApellido = 'Por favor, el apellido es requerido.';
          }  
          if ((!apoderado.rut) || (!UseRegexRut(apoderado.rut)) ) {
            errors.errorRut=('Por favor, ingrese rut valido.')
      
          }
           if ((!apoderado.telefono) || (!useRegexTelefono(apoderado.telefono)) ) {
            errors.errorTelefono=('Por favor, ingrese teléfono valido.')
      
          } 
          
          if (!persona.fecha_inicio) {
            errors.errorFechaInicio=('Por favor, la fecha de inicio es requerida.')
      
          } 
          if (!persona.fecha_termino) {
            errors.errorFechaTermino=('Por favor, la fecha de término es requerida.')
      
          }
          // Agrega más validaciones según sea necesario
      
          return errors;
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
    <Heading as={"h1"} className="header" size={"xl"} textAlign="center" mt={10}>Modificar Apoderado</Heading>
   
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
    <Stack spacing={4} mt={10}>
        <HStack>
       
        <InputForm isInvalid={errorNombre !== ''} errors={errorNombre} label="Nombre" handleChange={handleChange} name="nombre" placeholder="Nombre" type="text"  value={apoderado.nombre}/>
        <InputForm isInvalid={errorApellido !== ''} errors={errorApellido} value={apoderado.apellido} label="Apellido" handleChange={handleChange} name="apellido" placeholder="Apellido" type="text" />

        </HStack>
        <HStack>
        <InputForm  isInvalid={errorRut !== ''} errors={errorRut} label="Rut" handleChange={handleChange}  value={apoderado.rut} name="rut" placeholder="Rut" type="text"   />
        <InputForm isInvalid={errorTelefono !== ''} errors={errorTelefono} value={apoderado.telefono} label="Teléfono" handleChange={handleChange} name="telefono" placeholder="Teléfono" type="text" />
        </HStack>
        
        <HStack>
        <InputForm isInvalid={errorFechaInicio !== ''} errors={errorFechaInicio} value={fechaSplit(persona.fecha_inicio)} label="Fecha inicio " handleChange={handleChangePersona} name="fecha_inicio" placeholder="Fecha inicio rol" type="date" />
        <InputForm isInvalid={errorFechaTermino !== ''} errors={errorFechaTermino} value={fechaSplit(persona.fecha_termino)} label="Fecha termino " handleChange={handleChangePersona} name="fecha_termino" placeholder="Fecha termino rol" type="date" />
        </HStack>
    </Stack>
    <HStack style={{marginLeft:1100}}>
        <Button colorScheme="blue" mt={10} mb={10} onClick={submitApoderado}>Modificar</Button>
        <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('../listado')}>Volver</Button>
    </HStack>
    </Container>
)}


export default Editar