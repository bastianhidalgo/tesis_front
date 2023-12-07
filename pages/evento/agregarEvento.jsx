import { useState } from "react";
import { clienteAxios } from '../clienteAxios';
import { useRouter } from 'next/router'
import { FormControl,Image,Button,Container,Heading,HStack, Select, Stack,FormLabel, Input } from '@chakra-ui/react';
import  {TextForm,InputForm} from '../../Components/InputForm';
import Swal   from 'sweetalert2'
import { fechaSplit,horaSplit } from "@/Components/util";

const Evento = () =>{

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
          <Image
        src='https://www.cspnc.cl/wp-content/uploads/2021/07/logo-cspnc-2021.png'
        boxSize='25%'
        alt="Logo"
        onClick={()=>router.push('./Home')}
      />
            <Heading as={"h1"} className="header"  size={"2xl"} textAlign="center" mt="10">Registrar Evento</Heading>
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
