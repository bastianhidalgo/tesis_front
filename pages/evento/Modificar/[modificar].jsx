import { useState, useEffect } from 'react'
import {TextForm, InputForm}  from '../../../Components/InputForm'
import { FormControl,FormLabel,Input,Image,Button, Container, Heading, HStack, Stack, Select } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { clienteAxios } from '../../clienteAxios';
import { fechaSplit,horaSplit } from '../../../Components/util';


export const getServerSideProps = async (context)=>{
    const id = context.query.modificar;
    const response = await clienteAxios.get(`/eventos/getone/${id}`)
    return{
        props: {
            data: response.data
        }
    }
}

const EditarEvento =({ data }) => {
    const [evento, setEvento] = useState(data.evento);
    const router = useRouter()
    const  eventoo  = router.query
    const id_evento = router.query.evento;
    const [hora,setHora]=useState(horaSplit(evento.fecha))



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


    const submitEvento = async(e) =>{
        e.preventDefault()
        try{
                evento.fecha=fechaSplit(evento.fecha)+'T'+hora+':00.000Z'
            
            const response = await clienteAxios.put(`/eventos/update/${evento.id_evento}`,evento);

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
        onClick={()=>router.push('/Home')}
      />
    <Heading as={"h1"} className="header" size={"xl"} textAlign="center" mt={10}>Modificar Evento</Heading>
    <Stack spacing={4} mt={10}>
        <HStack>
        <InputForm label="Tema" handleChange={handleChange}  value={evento.tema} name="tema" placeholder="Rut" type="text"   />
        <TextForm label="Descripción" handleChange={handleChange} name="descripcion" placeholder="Descripción" type="text"  value={evento.descripcion}/>
        
        </HStack>

        <HStack>
        <InputForm value={fechaSplit(evento.fecha)} label="Fecha " handleChange={handleChange} name="fecha" placeholder="Fecha" type="date" />
        <FormControl>
        <FormLabel>{"Hora"}</FormLabel>
        <Input value={hora} label="Hora" onChange={InputHandleChange} onBlur={handleBlur} placeholder="hora" type="text" />
        </FormControl>
        </HStack>
    </Stack>
    <HStack style={{marginLeft:1100}}>
        <Button colorScheme="blue" mt={10} mb={10} onClick={submitEvento}>Modificar</Button>
        <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('../../evento')}>Volver</Button>
    </HStack>
    </Container>
)}


export default EditarEvento