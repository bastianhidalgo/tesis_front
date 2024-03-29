import { useState,useEffect,useRef } from "react";
import { clienteAxios } from './clienteAxios';
import { useRouter } from 'next/router'
import {  Menu,Text,Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,useDisclosure,IconButton,Image,Button,Container,Heading,HStack, Select, Stack,FormLabel ,FormControl  } from '@chakra-ui/react';
import  {InputForm, TelForm, TextForm} from '../Components/InputForm';
import Swal   from 'sweetalert2'
import {HamburgerIcon,ChevronDownIcon,AddIcon, MinusIcon,EditIcon } from '@chakra-ui/icons'

import  {UseRegexRut,Fn,fechaSplit2} from '../Components/util';


const Visitas = () =>{

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateRolModalOpen, setIsCreateRolModalOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleCreateRolModalOpen = () => {
    setIsCreateRolModalOpen(true);
  };

  const handleCreateRolModalClose = () => {
    setIsCreateRolModalOpen(false);
  };
  const [errorDescripcion, setErrorDescripcion] = useState('');

    const [errorNombre, setErrorNombre] = useState('');
    const [errorApellido, setErrorApellido] = useState('');
    const [errorRut, setErrorRut] = useState('');
    const [errorTelefono, setErrorTelefono] = useState('');
    const [errorRol, setErrorRol] = useState('');
    const [errorFechaInicio, setErrorFechaInicio] = useState('');
    const [errorFechaTermino, setErrorFechaTermino] = useState('');

    const [modalStates, setModalStates] = useState([]); // Estado para gestionar la visibilidad de cada modal
    const { isOpen, onOpen, onClose } = useDisclosure()

    const btnRef = useRef();
    const [rol,setRol]= useState({
      descripcion:''
    }) 

    const [visita,setVisita]= useState({
      rut:'',
      nombre:'',
      apellido: '',
      telefono: ''
      
    }) 
    const [roles, setRoles] = useState([]);

    const [persona,setPersona]= useState({
      rol:'', 
      apoderadoId:null,
      visitaId:null,
      fecha_inicio: '',
      fecha_termino: '',
      observacion:''
    }) 
    const [errors, setErrors] = useState('');

    const handleChange=(e) =>{
        setVisita({
            ... visita,
            [e.target.name]: e.target.value
        })
    }
    const handleChange2=(e) =>{
      setPersona({
          ... persona,
          [e.target.name]: e.target.value
      })
  }
  const handleChangeRol=(e) =>{
    setRol({
        ... rol,
        [e.target.name]: e.target.value
    })
}

  
    const router = useRouter()

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await clienteAxios.get("/rol/getall"); // Ajusta la ruta según tu API
                setRoles(response.data.roles);
            } catch (error) {
                console.error("Error al obtener roles:", error);
            }
        };
    
        fetchRoles();
    }, []);

    const submitRol= async () => {
       
      try{
         
           const response = await clienteAxios.post("/rol/create",rol);

         
        if(response.status==200){
          console.log("Rol creado")
          Swal.fire({
              icon:'success',
              title:'Excelente!',
              showConfirmButton: true,
              text: 'Rol registrado' 
          })
          handleCreateRolModalClose()
          router.reload()

          }
      }catch(error){
          console.log("error al crear el rol")
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error al crear el rol',
              footer: 'Comunicarse con administración'
            })

          }

    }


    const submitVisita = async () => {
       
        try{
            persona.fecha_inicio=persona.fecha_inicio+'T00:00:00.000Z';
           persona.fecha_termino=persona.fecha_termino+'T00:00:00.000Z';
           visita.telefono="+569"+visita.telefono;
            persona.rol= parseInt(persona.rol)
         //   console.log(visita)
       //     console.log(persona)
      
             const response = await clienteAxios.post("/usuarios/create",visita);

            const variable = await clienteAxios.get(`/usuarios/comparar/${visita.rut}`)
           // console.log(variable)
           //  console.log(variable.data.visita[0].id_visita)
             persona.visitaId=variable.data.visita[0].id_visita
         //    console.log(persona)
          if(response.status==200){
                         
            try{
            const respuesta= await clienteAxios.post("/personas/create",persona);

            }catch(error){
              console.log(error)
            }

          }


            if(respuesta.status==200 && response.status==200){
            console.log("visita creada")
            Swal.fire({
                icon:'success',
                title:'Excelente!',
                showConfirmButton: true,
                text: 'Visita registrada'
            })
            router.push('/Home')
            }
        }catch(error){
            console.log("error al crear la visita")
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error al registrar la visita',
                footer: 'Verifica que los datos ingresados esten correctos'
              })

            }

      }
    return (
        
<Container maxW="container.xl" mt={10}>
<HStack>
       <IconButton
      icon={<HamburgerIcon />}
      aria-label="Abrir menú"
      onClick={handleMenuOpen}
      colorScheme='red'
    />
         <Image  mt={10} 
        src='https://www.cspnc.cl/wp-content/uploads/2021/07/logo-cspnc-2021.png'
        onClick={()=>router.push('./Home')}
        boxSize='25%'
        alt="Logo"
        style={{marginLeft:50,marginBottom:40}}
      /></HStack>
            <Heading as={"h1"} className="header"  size={"2xl"} textAlign="center" mt="10">Crear Visita</Heading>
            <Drawer
        colorScheme='teal' 
        isOpen={isMenuOpen}
        placement='left'
        onClose={handleMenuClose}
        finalFocusRef={btnRef}
               >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>Menú</DrawerHeader>

          <DrawerBody colorScheme='blue'> 
            <Menu >
            <DrawerFooter borderTopWidth='1px'>

    <Button   w="full"  colorScheme='teal' onClick={() => router.push('./curso/listado')}>Inicio</Button>
        </DrawerFooter>
        <DrawerFooter borderTopWidth='1px'>
        <Button   colorScheme='teal' w="full"  onClick={() => router.push('./curso/listado')}>Cursos</Button>
     </DrawerFooter>
     <DrawerFooter borderTopWidth='1px'>
        <Button  colorScheme='teal' w="full"  onClick={() => router.push('./alumno/listado')}>Alumnos</Button>
        </DrawerFooter>
        <DrawerFooter borderTopWidth='1px'>
        
        <Button  colorScheme='teal' w="full"  onClick={() => router.push('./apoderado/listado')}>Apoderados</Button>
      
        </DrawerFooter >
        <DrawerFooter borderTopWidth='1px'>
        
        <Button   colorScheme='teal'  w="full" onClick={() => router.push('./evento')}>Eventos</Button>
       
        </DrawerFooter>
        <DrawerFooter borderTopWidth='1px'>
       
        <Button   colorScheme='teal' w="full" onClick={() => router.push('./reporte/menu_reporte')}>Reportes</Button>
        
        </DrawerFooter >
        
       
        </Menu>

          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
          <Button style={{marginRight:50}} colorScheme='red' mr={3} onClick={() => router.push('./')}>Cerrar sesión</Button>

            <Button colorScheme='blue' mr={3} onClick={handleMenuClose}>Cerrar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
            
            <Stack  spacing={4} mt={10}>
                <HStack >
            



                <InputForm label="Nombre" isInvalid={errorNombre !== ''} errors={errorNombre} handleChange={handleChange} name="nombre" placeholder="Nombre" type="text" value={visita.nombre}/>
                <InputForm label="Apellido" isInvalid={errorApellido !== ''} errors={errorApellido} handleChange={handleChange} name="apellido" placeholder="Apellido" type="text" value={visita.apellido}/>
                
                
                </HStack>
                <HStack>
                <InputForm label="Rut" handleChange={handleChange} isInvalid={errorRut !== ''} errors={errorRut}  name="rut" placeholder="Rut" type="text" value={visita.rut}  />
                
                <TelForm label="Teléfono" isInvalid={errorTelefono !== ''} errors={errorTelefono} handleChange={handleChange} name="telefono" placeholder="Teléfono" type="tel" value={visita.telefono}/>
                </HStack>
                <FormLabel style={{marginBottom:-10}}>Rol de la Visita</FormLabel>
                <HStack>
                <FormControl isInvalid={errorRol !== ''} id="rol">
                <Select 
    label="Rol Visita"
    onChange={handleChange2}
    name="rol"
    placeholder="Seleccione rol de la visita"
    value={persona.rol}
>
    {roles?.map((rol) => (
        <option key={rol.codigo_rol} value={rol.codigo_rol}>
            {rol.descripcion}
        </option>
    ))}
</Select>
<Text color="red" fontSize="sm">
  {errorRol}
</Text>
</FormControl>
<HStack>
<IconButton onClick={handleCreateRolModalOpen } icon={<AddIcon />} style={{marginBottom:14}} 
      colorScheme='blue'> </IconButton>
        <Modal  isOpen={isCreateRolModalOpen} onClose={handleCreateRolModalClose}>
      <ModalOverlay />
      <ModalContent>
      <ModalHeader>Datos del rol</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
           
      <InputForm label="Ingrese Rol" isInvalid={errorDescripcion !== ''} errors={errorDescripcion} handleChange={handleChangeRol} name="descripcion" placeholder="Nombre rol" type="text" value={rol.descripcion}/>
               
      </ModalBody>

      <ModalFooter>
      <Button style={{marginRight:20}} colorScheme='blue'
    
   onClick={() => {
   if (!rol.descripcion) {
      setErrorDescripcion('Por favor, el nombre del rol es requerido.');
    } else {
     
      setErrorDescripcion('');
      
      submitRol();
      onClose()
    }
  }}>Agregar</Button>

          <Button colorScheme='blue' onClick={handleCreateRolModalClose}>Cerrar</Button>
      </ModalFooter>
      </ModalContent>
  </Modal>
      </HStack>
<HStack>
<IconButton onClick={()=> router.push('./roles')} icon={<EditIcon />} style={{marginBottom:14}} 
      colorScheme='green'>Editar</IconButton>
      </HStack>
                </HStack>
                <HStack>
                <InputForm label="Fecha de Inicio" isInvalid={errorFechaInicio !== ''} errors={errorFechaInicio} handleChange={handleChange2} name="fecha_inicio" placeholder="Fecha de Inicio" type="date" value={persona.fecha_inicio}/>
                <InputForm label="Fecha de Término" isInvalid={errorFechaTermino !== ''} errors={errorFechaTermino} handleChange={handleChange2} name="fecha_termino" placeholder="Fecha de Término" type="date"  value={persona.fecha_termino}/>
                </HStack>
                <HStack>
                <TextForm label="Observación (opcional)"  handleChange={handleChange} name="observacion" placeholder="Observación" type="text" value={persona.observacion}/>
</HStack>
            </Stack>
            <HStack style={{marginLeft:1100}}>

              <Button
              colorScheme="blue" mt={10} mb={10}
            onClick={() => {
    if (!visita.nombre || visita.nombre.trim() === '') {
      setErrorNombre('Por favor, el nombre es requerido.');
    } if (!visita.apellido) {
      setErrorApellido('Por favor, el apellido es requerido.');
    } if ((!visita.rut) || (!UseRegexRut(visita.rut)) ) {
      setErrorRut('Por favor, ingrese rut valido.');
    } if ((!visita.telefono) || (visita.telefono.length!==8) ) {
      setErrorTelefono('Por favor, ingrese teléfono valido.');
    } if (!persona.rol) {
      setErrorRol('Por favor, el rol es requerido.');
    } if (!persona.fecha_inicio) {
      setErrorFechaInicio('Por favor, la fecha de inicio es requerida.');
    } if (!persona.fecha_termino) {
      setErrorFechaTermino('Por favor, la fecha de término es requerida.');
    }  if (!Fn.validaRut(visita.rut)) {
      console.log('El RUT no es válido.')
      setErrorRut("Rut invalido")
    } else {
      setErrorNombre(''); // Reinicia el mensaje de error
      setErrorApellido('');
      setErrorRut('');
      setErrorTelefono('');
      setErrorRol('');
      setErrorFechaInicio('');
      setErrorFechaTermino('');
      submitVisita();
    }
  }}>
Crear
  </Button>
        
        <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('./Home')}>Volver</Button>
    </HStack>
        </Container>


    )
}
export default Visitas
