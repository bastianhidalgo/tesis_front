import { useState,useEffect } from "react";
import { clienteAxios } from './clienteAxios';
import { useRouter } from 'next/router'
import { Image,Button,Container,Heading,HStack, Select, Stack,FormLabel, InputLeftAddon,InputGroup  } from '@chakra-ui/react';
import  {InputForm, TelForm} from '../Components/InputForm';
import Swal   from 'sweetalert2'


const Visitas = () =>{

    const [visita,setVisita]= useState({
      rut:'',
      nombre:'',
      apellido: '',
      telefono: '',
      rol:0,
      fechaInicio: '',
      fechaTermino: ''
    }) 
    const [roles, setRoles] = useState([]);

    const handleChange=(e) =>{
        setVisita({
            ... visita,
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

    const submitVisita = async (e) => {
        e.preventDefault(); 
        try{
            visita.fechaInicio=visita.fechaInicio+'T00:00:00.000Z';
            visita.fechaTermino=visita.fechaTermino+'T00:00:00.000Z';
            visita.telefono="+569"+visita.telefono;
            visita.rol= parseInt(visita.rol)

            console.log(visita)
  
            const response = await clienteAxios.post("/usuarios/create",visita);
            console.log(visita)
    
            if(response.status==200){
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
            console.log(e)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error al registrar la visita',
                footer: 'Comunicarse con administración'
              })

            }
      }

    return (
        
<Container maxW="container.xl" mt={10}>
          <Image
        src='https://www.cspnc.cl/wp-content/uploads/2021/07/logo-cspnc-2021.png'
        boxSize='25%'
        alt="Logo"
        onClick={()=>router.push('./Home')}
      />
            <Heading as={"h1"} className="header"  size={"2xl"} textAlign="center" mt="10">Registrar Visita</Heading>
            <Stack  spacing={4} mt={10}>
                <HStack >
                <InputForm label="Rut" handleChange={handleChange} name="rut" placeholder="Rut" type="text" value={visita.rut}  />
                <InputForm label="Nombre" handleChange={handleChange} name="nombre" placeholder="Nombre" type="text" value={visita.nombre}/>
                </HStack>
                <HStack>
                <InputForm label="Apellido" handleChange={handleChange} name="apellido" placeholder="Apellido" type="text" value={visita.apellido}/>
                <TelForm label="Teléfono" handleChange={handleChange} name="telefono" placeholder="Teléfono" type="tel" value={visita.telefono}/>
                </HStack>
                <FormLabel style={{marginBottom:-10}}>Rol de la Visita</FormLabel>
                <HStack>
               
                <Select
    label="Rol Visita"
    onChange={handleChange}
    name="rol"
    placeholder="Seleccione rol de la visita"
    value={visita.rol}
>
    {roles.map((rol) => (
        <option key={rol.codigo_rol} value={rol.codigo_rol}>
            {rol.descripcion}
        </option>
    ))}
</Select>
                </HStack>
                <HStack>
                <InputForm label="Fecha de Inicio" handleChange={handleChange} name="fechaInicio" placeholder="Fecha de Inicio" type="date" value={visita.fechaInicio}/>
                <InputForm label="Fecha de Término" handleChange={handleChange} name="fechaTermino" placeholder="Fecha de Término" type="date"  value={visita.fechaTermino}/>
                </HStack>
            </Stack>
            <HStack style={{marginLeft:1100}}>
        <Button colorScheme="blue" mt={10} mb={10} onClick={submitVisita}>Crear</Button>
        <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('./Home')}>Volver</Button>
    </HStack>
        </Container>


    )
}
export default Visitas
