import { useState, useEffect,useRef } from 'react'
import {TextForm, InputForm}  from '../../../Components/InputForm'
import { Menu,Drawer,Select,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,Text,
    useDisclosure,IconButton,VStack,FormControl,FormLabel,Input,Image,Button, Container, Heading, HStack, Stack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { clienteAxios } from '../../clienteAxios';
import { fechaSplit,horaSplit } from '../../../Components/util';
import {HamburgerIcon} from '@chakra-ui/icons'


export const getServerSideProps = async (context) => {
  const id = context.query.modificar;
  const response = await clienteAxios.get(`/eventos/getone/${id}`);
  let respuesta;
  let respuestaa = null;

  try {
    respuesta = await clienteAxios.get(`/cursoEvento/getCursos/${id}`);
    respuestaa = await clienteAxios.get(`/cursos/getone/${respuesta.data.idsCursos[0]}`);
  } catch (error) {
    console.error(error);
  }

  // Verifica si respuestaa existe antes de incluirla en las props
  const props = {
    data: response.data,
  };

  if (respuestaa) {
    props.datax = respuestaa.data;
  }

  return {
    props,
  };
};


const EditarEvento =({ data,datax }) => {
    const [evento, setEvento] = useState(data.evento);
    const router = useRouter()
    const  eventoo  = router.query
    const id_evento = router.query.evento;
    const [hora,setHora]=useState(horaSplit(evento.fecha))
    const [errorTema, setErrorTema] = useState('');
    const [errorDescripcion, setErrorDescripcion] = useState('');
    const [errorFecha, setErrorFecha] = useState('');
    const [errorHora, setErrorHora] = useState('');
    const [relacion,setRelacion]= useState({
      cursoId:'',
      eventoId:'',
    }) 
    const [cursoSeleccionado, setCursoSeleccionado] = useState(datax ? datax.curso.id_curso : "");

    const [cursos, setCursos] = useState([]);
 
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef();

    const handleChange=(e) =>{
        setEvento({
            ...evento,
            [e.target.name]: e.target.value
        })
    }
    const InputHandleChange= (event) => {
        setHora(event.target.value);
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
      const validateForm = () => {
        const errors = {};
    
        if (!evento.tema) {
            errors.errorTema = 'Por favor, el tema es requerido.';
        }
        if (!evento.descripcion) {
            errors.errorDescripcion = 'Por favor, la descripción es requerida.';
        }  

        if (!evento.fecha) {
          errors.errorFecha=('Por favor, la fecha es requerida.')
    
        } 
        if (!hora) {
          errors.errorHora=('Por favor, la hora es requerida.')
    
        }
        // Agrega más validaciones según sea necesario
    
        return errors;
    };
    useEffect(() => {
     // console.log(cursoSeleccionado)
      const fetchCursos = async () => {
        try{
          const cursos = await clienteAxios.get(`/cursos/getall/`); // Ajusta la ruta según tu API
          setCursos(cursos.data.cursos)
        }catch(error){
          console.log(error)
        }if(cursoSeleccionado){
          try {
            
              const response = await clienteAxios.get(`/cursoEvento/getCursos/${evento.codigo_evento}`); // Ajusta la ruta según tu API
              //console.log(response.data.idsCursos[0])
              const idCurso=response.data.idsCursos[0]
              try{
              const respuesta = await clienteAxios.get(`/cursos/getone/${idCurso}`); // Ajusta la ruta según tu API
              setCursoSeleccionado(respuesta.data.curso)  
              }catch(error){
                console.log(error)
              }

          } catch (error) {
              console.error("Error al obtener los cursos:", error);
          }}
      };
      
      fetchCursos();
  }, []);

    const submitEvento = async(e) =>{
      const errors = validateForm();
      //console.log(datax.curso.id_curso)

      if (Object.keys(errors).length === 0) { 
        try{
                evento.fecha=fechaSplit(evento.fecha)+'T'+hora+':00.000Z'
            
            const response = await clienteAxios.put(`/eventos/update/${evento.codigo_evento}`,evento);

            if (!cursoSeleccionado || cursoSeleccionado=='' ) {
              try {
                await clienteAxios.delete(`/cursoEvento/delete/${datax.curso.id_curso}/${evento.codigo_evento}`);
              } catch (error) {
                console.log(error);
              }
            } else {
              try {
                  
                  await clienteAxios.delete(`/cursoEvento/delete/${cursoSeleccionado}/${evento.codigo_evento}`);
                
                }
              
               catch (error) {
                console.log(error);
              }
              try{
                relacion.cursoId = parseInt(cursoSeleccionado);
                relacion.eventoId = evento.codigo_evento;
                console.log(relacion)
                await clienteAxios.post(`/cursoEvento/create/`, relacion);  // Cambiado de `create` a `post`

              }catch(error){
                console.log(error)
              }
            }
const errors = validateForm();

if (Object.keys(errors).length === 0) {
  try {
    evento.fecha = fechaSplit(evento.fecha) + 'T' + hora + ':00.000Z';

    const response = await clienteAxios.put(`/eventos/update/${evento.codigo_evento}`, evento);

    const cursoToDelete = datax ? datax.curso.id_curso : null;

    // Elimina la relación existente si hay un curso para eliminar
    if (cursoToDelete) {
      try {
        await clienteAxios.delete(`/cursoEvento/delete/${cursoToDelete}/${evento.codigo_evento}`);
      } catch (error) {
        console.log(error);
      }
    }

    // Si hay un nuevo curso seleccionado, crea una nueva relación
    if (cursoSeleccionado) {
      try {
        relacion.cursoId = parseInt(cursoSeleccionado);
        relacion.eventoId = evento.codigo_evento;
        console.log(relacion);
        await clienteAxios.post(`/cursoEvento/create/`, relacion);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log("Error al actualizar el evento");
    console.log(error);
    // Handle error
  }
}


          if(response.status==200){
            Swal.fire({
                icon:'success',
                title:'Evento actualizado',
                showConfirmButton: true,
                text: 'El evento se actualizo correctamente'
            })
            router.push('../../evento')
            }
        }catch(error){
            console.log("error al actualizar el evento")
            console.log(e)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error al actualizar el evento',
                footer: 'Comunicarse con administración'
              })
            }
          }
          
          else {
            setErrorTema(errors.errorTema ||''); // Reinicia el mensaje de error
            setErrorDescripcion(errors.errorDescripcion ||'');
            setErrorFecha(errors.errorFecha ||'');
            setErrorHora(errors.errorHora ||'');
            
        }
        }
        const handleBlur = () => {
            console.log('Hora actualizada:', hora);
            setHora(hora);
          };

        
          const handleChangeCursoSeleccionado = (e) => {
            setCursoSeleccionado(e.target.value);
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
    <Heading as={"h1"} className="header" size={"xl"} textAlign="center" mt={10}>Modificar Evento</Heading>
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
        <InputForm isInvalid={errorTema !== ''} errors={errorTema} label="Tema" handleChange={handleChange}  value={evento.tema} name="tema" placeholder="Tema" type="text"   />
        <TextForm isInvalid={errorDescripcion !== ''} errors={errorDescripcion} label="Descripción" handleChange={handleChange} name="descripcion" placeholder="Descripción" type="text"  value={evento.descripcion}/>
        
        </HStack>

        <HStack>
        <InputForm isInvalid={errorFecha !== ''} errors={errorFecha} value={fechaSplit(evento.fecha)} label="Fecha " handleChange={handleChange} name="fecha" placeholder="Fecha" type="date" />
        <FormControl>
        <FormLabel isInvalid={errorHora !== ''}>{"Hora"}</FormLabel>
        <Input value={hora} label="Hora" onChange={InputHandleChange} onBlur={handleBlur} placeholder="hora" type="time" />
        <Text color="red" fontSize="sm">
    {errorHora}
  </Text>
        </FormControl>

        </HStack>
        <HStack>
        <FormControl  id="curso">
                <FormLabel>{"Ingrese curso que realiza el evento (opcional)"}</FormLabel>
                <Select 
    label="Curso evento"
    onChange={handleChangeCursoSeleccionado}    
    name="cursos"
    placeholder="Seleccione curso"

    value={cursoSeleccionado.id_curso}
>
    {cursos?.map((curso) => (
        <option key={curso.id_curso} value={curso.id_curso}>
            {curso.nombre}
        </option>
    ))}
</Select>

</FormControl>
<FormControl></FormControl>
</HStack>

    </Stack>
    <HStack style={{marginLeft:1100}}>
        <Button colorScheme="blue" mt={10} mb={10} onClick={submitEvento}>Modificar</Button>
        <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('../../evento')}>Volver</Button>
    </HStack>
    </Container>
)}


export default EditarEvento