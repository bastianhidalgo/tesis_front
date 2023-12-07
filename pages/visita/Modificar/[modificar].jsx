import { useState, useEffect } from 'react'
import {InputForm} from '../../../Components/InputForm'
import { Image,Button, Container, Heading, HStack, Stack, Select } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { clienteAxios } from '../../clienteAxios';
import { fechaSplit } from '../../../Components/util';


export const getServerSideProps = async (context)=>{
    const id = context.query.modificar;
    const response = await clienteAxios.get(`/usuarios/getone/${id}`)
    return{
        props: {
            data: response.data
        }
    }
}

const Editar =({ data }) => {
    const [visita, setVisita] = useState(data.visita);
    const router = useRouter()
    const  visitaa  = router.query
    const id_visita = router.query.visita;
 



    const handleChange=(e) =>{
        setVisita({
            ...visita,
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


    const submitVisita = async(e) =>{
        e.preventDefault()
        try{

            if(!contieneLetra(visita.fechaInicio)){
                visita.fechaInicio=visita.fechaInicio+'T00:00:00.000Z'
            }
            if(!contieneLetra(visita.fechaTermino)){
                visita.fechaTermino=visita.fechaTermino+'T00:00:00.000Z'
            }
            const response = await clienteAxios.put(`/usuarios/update/${visita.id_visita}`,visita);

        if(response.status==200){
            Swal.fire({
                icon:'success',
                title:'Visita actualizado',
                showConfirmButton: true,
                text: 'La visita se actualizo correctamente'
            })
            router.push('/Home')
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
        }


        

    return (
    <Container maxW="container.xl" mt={10}>
                  <Image
        src='https://www.cspnc.cl/wp-content/uploads/2021/07/logo-cspnc-2021.png'
        boxSize='25%'
        alt="Logo"
        onClick={()=>router.push('/Home')}
      />
    <Heading as={"h1"} className="header" size={"xl"} textAlign="center" mt={10}>Modificar Visita</Heading>
    <Stack spacing={4} mt={10}>
        <HStack>
        <InputForm label="Rut" handleChange={handleChange}  value={visita.rut} name="rut" placeholder="Rut" type="text"   />
        <InputForm label="Nombre" handleChange={handleChange} name="nombre" placeholder="Nombre" type="text"  value={visita.nombre}/>
        
        </HStack>
        <HStack>
        <InputForm value={visita.apellido} label="Apellido" handleChange={handleChange} name="apellido" placeholder="Apellido" type="text" />
        <InputForm value={visita.telefono} label="Teléfono" handleChange={handleChange} name="telefono" placeholder="Teléfono" type="text" />
        </HStack>
        <HStack>
                <Select label="Rol Visita" onChange={handleChange} name="rol" placeholder="Seleccione rol de la visita" type="text" value={visita.rol}>
                <option value='Apoderado'>Apoderado</option>
                <option value='Iglesia'>Iglesia</option>
                <option value='Otro'>Otro</option>
                </Select>
                </HStack>
        <HStack>
        <InputForm value={fechaSplit(visita.fechaInicio)} label="Fecha inicio " handleChange={handleChange} name="fechaInicio" placeholder="Fecha inicio rol" type="date" />
        <InputForm value={fechaSplit(visita.fechaTermino)} label="Fecha termino " handleChange={handleChange} name="fechaTermino" placeholder="Fecha termino rol" type="date" />
        </HStack>
    </Stack>
    <HStack style={{marginLeft:1100}}>
        <Button colorScheme="blue" mt={10} mb={10} onClick={submitVisita}>Modificar</Button>
        <Button colorScheme="blue" mt={10} mb={10} onClick={()=> router.push('/Home')}>Volver</Button>
    </HStack>
    </Container>
)}


export default Editar