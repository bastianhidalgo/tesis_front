import React, {useState, useEffect} from 'react'
import { clienteAxios } from './clienteAxios';
const { GetRut, UseRegexRut } = require('../Components/util');
import { useRouter } from 'next/router'
import { Image,Button,Container,Heading,HStack, Stack, Table, Thead, Tr, Td,Tbody ,Textarea, Text,Input} from '@chakra-ui/react';
import  InputForm  from '../Components/InputForm';
import Swal   from 'sweetalert2'
import { fechaSplit2 } from '../Components/util';
import { format } from 'date-fns';


function QRscanner({ serverDateTime }) {
    const [estado, setEstado] = useState('');
    const [rut,setRut]=useState('');
    const [visitas, setVisitas] = useState([]);   
    const [buscador, setBuscador] = useState("");
    const [currentDateTime, setCurrentDateTime] = useState(serverDateTime);
    const [ingreso,setIngreso]= useState({
      fechaIngreso: '',
      visitaId:''
    })

    const handleInputChange = (event) => {
      const { rut, id_visita } = event.target;
      setBuscador(id_visita);
    };
    
    const handleError = err => {
    console.error(err)
    }
      
    const handleChange = (event) => {
        setRut(event.target.value);
      };

      
      const getVisita = async () => {
         if(response.status==200){
         setVisitas(response.data.visita)
         }}


         useEffect(() => {
          const intervalId = setInterval(() => {
            const now = new Date();
            const formattedDateTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // Formatear la fecha
            setCurrentDateTime(formattedDateTime);
          }, 1000);
          
          const fetchVisitasPorRut = async () => {
            try {
              const response = await clienteAxios.get(`/usuarios/comparar/${rut}`);
              if (response.status === 200) {
                setVisitas(response.data.visita);
              }
            } catch (error) {
              console.error(error);
              setVisitas([]);
              // Maneja el error si la solicitud no tiene éxito
            }
          };
      
          if (rut !== '') {
            fetchVisitasPorRut(); // Llama a la función para obtener las visitas basadas en el RUT
            setVisitas([]);
          }else{
            setVisitas([]);
          }
        }, [rut]);


      const compararRut2 = async () => {
            if(!UseRegexRut(rut)){
                console.log(" rut mal ingresado ")
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Rut mal ingresado'
                })
                return 0 }
        try{
            const response = await clienteAxios.get(`/usuarios/comparar/${rut}`);
            ingreso.visitaId=response.data.visita[0].id_visita;
            ingreso.fechaIngreso=currentDateTime;
            const respuesta= await clienteAxios.post("/ingresos/create",ingreso);
            if(response.status==200 && respuesta.status==200){
            console.log("persona admitida")
            setEstado("persona admitida")
            Swal.fire({
              icon:'success',
              title:'Excelente!',
              showConfirmButton: true,
              text: 'Persona Registrada'
              

              
          })
          return 0}
        }catch(error){
             console.log("persona denegada")
             setEstado("persona rechazada")
             Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Persona no admitida',
              footer: 'Comunicarse con administración'
            })
             
            }
      }
    

      const router = useRouter()


return (
  <Container maxW="container.xl" mt={10}>
          <Image
        src='https://www.cspnc.cl/wp-content/uploads/2021/07/logo-cspnc-2021.png'
        onClick={()=>router.push('./Home')}
        boxSize='25%'
        alt="Logo"
      />
    <Stack>
            <center>
            <Heading as="h1" size="xl" className="header" textAlign="center" mt="10">Ingrese RUN</Heading>
            </center>

            </Stack>


        <Stack>
        
            <HStack style={{marginTop:40}}>
        <Input  style={{fontSize:18, width:250, height:50}}id="rut" value={rut} onChange={handleChange} name="Rut" placeholder="Sin puntos y con guión" type="text" />

        <Button style={{marginLeft:30}} colorScheme="blue" onClick={compararRut2} >
        Registrar Ingreso </Button>
        

       
            </HStack>
            </Stack>
            <Container maxW="container.xl" mt={10}>
            <Table variant="simple">
            <Thead>
              <Tr>
              <Td fontWeight={"bold"}>Rut</Td>
                <Td fontWeight={"bold"}>Nombre</Td>
                <Td fontWeight={"bold"}>Apellido</Td>
                <Td fontWeight={"bold"}>Teléfono</Td>
                <Td fontWeight={"bold"}>Rol</Td>
                <Td fontWeight={"bold"}>Fecha de Inicio</Td>
                <Td fontWeight={"bold"}>Fecha de Término</Td>
                <Td fontWeight={"bold"}>Modificar/ Eliminar</Td>

              </Tr>
            </Thead>
            <Tbody border={"5"}>{

visitas.map((Visita,idx)=>{
 return (
    <Tr key={idx}>
             <Td >{Visita.rut}</Td>
             <Td >{Visita.nombre}</Td>
             <Td>{Visita.apellido}</Td>
             <Td>{Visita.telefono}</Td>
             <Td>{Visita.rol}</Td>
             <Td>{fechaSplit2(Visita.fechaInicio)}</Td>
             <Td>{fechaSplit2(Visita.fechaTermino)}</Td>
             <Td>

              <Button colorScheme="green"   onClick={()=>router.push(`./visita/Modificar/${Visita.id_visita}`)}>Modificar</Button>
              
              <Button colorScheme="red" onClick={()=>deleteVisita(Visita.id_visita)} style={{marginLeft:3}}  >Eliminar</Button>

 </Td>

     </Tr>
)
})
}

</Tbody>
          </Table>
    

    </Container>
           
            <Button colorScheme="blue" style={{marginTop:30, marginLeft:1170}}onClick={() => router.push('./Home')} >Volver
            </Button>
</Container>

);


        }

export default QRscanner;
