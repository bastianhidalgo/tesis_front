import { useState, useEffect,useRef } from 'react'
import {InputForm,TextForm} from '../../../Components/InputForm'
import { Menu,Drawer,FormControl,FormLabel,
    DrawerBody,Text,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,IconButton,VStack,Image,Button, Container, Heading, HStack, Stack, Select } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { clienteAxios } from '../../clienteAxios';
import { fechaSplit, UseRegexRut,useRegexTelefono,Fn  } from '../../../Components/util';
import {HamburgerIcon} from '@chakra-ui/icons'


export const getServerSideProps = async (context)=>{
    const id = context.query.modificar;
    const response = await clienteAxios.get(`/alumnos/getone/${id}`)
    const respuesta = await clienteAxios.get(`/cursos/getone/${response.data.alumno.cursoId}`);

    return{
        props: {
            data: response.data,
            datax: respuesta.data
        }
    }
}

const Editar =({ data,datax }) => {
    const [alumno, setAlumno] = useState(data.alumno);
    const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef();
    const [errors, setErrors] = useState('');
    const [curso,setCurso]=useState(datax.curso)
    const [cursos,setCursos]=useState([])

    const [errorNombre, setErrorNombre] = useState('');
    const [errorApellido, setErrorApellido] = useState('');
    const [errorRut, setErrorRut] = useState('');
    const [errorCurso, setErrorCurso] = useState('');
    const [errorRol, setErrorRol] = useState('');
    const [errorFechaInicio, setErrorFechaInicio] = useState('');
    const [errorFechaTermino, setErrorFechaTermino] = useState('');



    
    const handleChange=(e) =>{
        setAlumno({
            ...alumno,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeCursoSeleccionado = (e) => {
        setCurso(e.target.value);
      };

    function contieneLetra(cadena) {
        // Itera sobre cada carácter de la cadena y verifica si es una letra
        for (let i = 0; i < cadena.length; i++) {
          if (/^[a-zA-Z]$/.test(cadena[i])) {
            return true; // Si encuentra una letra, devuelve true
          }
        }
        return false; // Si no encuentra ninguna letra, devuelve false
      }

      useEffect(() => {
        // console.log(cursoSeleccionado)
         const fetchCursos = async () => {
            console.log(datax)
           try{
             const cursos = await clienteAxios.get(`/cursos/getall/`); // Ajusta la ruta según tu API
             setCursos(cursos.data.cursos)
           }catch(error){
             console.log(error)
           }
         };
         
         fetchCursos();
     }, []);
    const submitApoderado = async(e) =>{
      const errors = validateForm();

      if (Object.keys(errors).length === 0) {         
        try{

          alumno.cursoId=parseInt(alumno.cursoId)
 console.log(alumno)
            const response   = await clienteAxios.put(`/alumnos/update/${alumno.id_alumno}`,alumno);

        if(response.status==200 ){
            Swal.fire({
                icon:'success',
                title:'Alumno actualizado',
                showConfirmButton: true,
                text: 'El alumno se actualizo correctamente'
            })
            router.push('../listado')
            }
        }catch(error){
            console.log("error al actualizar el alumno")
            console.log(e)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error al actualizar el alumno',
                footer: 'Comunicarse con administración'
              })
            }
          }else{
            setErrorNombre(errors.errorNombre ||''); // Reinicia el mensaje de error
            setErrorApellido(errors.errorApellido ||'');
            setErrorRut(errors.errorRut ||'');
            
          }
        }

        const validateForm = () => {
          const errors = {};
      
          if (!alumno.nombre) {
              errors.errorNombre = 'Por favor, el nombre es requerido.';
          }
          if (!alumno.apellido) {
              errors.errorApellido = 'Por favor, el apellido es requerido.';
          }  
          if ((!alumno.rut) || (!Fn.validaRut(alumno.rut)) ) {
            errors.errorRut=('Por favor, ingrese rut valido.')
      
          } if ((!alumno.cursoId) ) {
            errors.errorCurso=('Por favor, ingrese curso.')
      
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
       
        <InputForm isInvalid={errorNombre !== ''} errors={errorNombre} label="Nombre" handleChange={handleChange} name="nombre" placeholder="Nombre" type="text"  value={alumno.nombre}/>
        <InputForm isInvalid={errorApellido !== ''} errors={errorApellido} value={alumno.apellido} label="Apellido" handleChange={handleChange} name="apellido" placeholder="Apellido" type="text" />

        </HStack>
        <HStack>
        <InputForm  isInvalid={errorRut !== ''} errors={errorRut} label="Rut" handleChange={handleChange}  value={alumno.rut} name="rut" placeholder="Rut" type="text"   />
        <FormControl  id="curso">
                <FormLabel>{"Ingrese curso del alumno"}</FormLabel>
                <Select 
    label="Curso"
    onChange={handleChange}    
    name="cursoId"
    placeholder="Seleccione curso"

    value={alumno.cursoId}
>
    {cursos?.map((curso) => (
        <option key={curso.id_curso} value={curso.id_curso}>
            {curso.nombre}
        </option>
    ))}
</Select>
<Text>
  {errorCurso}
</Text>
</FormControl>
        </HStack>
        
        
    </Stack>
    <HStack style={{marginLeft:1100}}>
        <Button colorScheme="blue" mt={10} mb={10} onClick={submitApoderado}>Modificar</Button>
        <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('../listado')}>Volver</Button>
    </HStack>
    </Container>
)}


export default Editar