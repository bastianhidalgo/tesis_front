import React, {useState, useEffect} from 'react'
import { clienteAxios } from '../clienteAxios';
const { UseRegexRut } = require('../../Components/util');
import { useRouter } from 'next/router'
import { Text,FormControl,FormLabel,Image,Button,Container,Heading,HStack, Stack, Table, Thead, Tr, Td,Tbody ,Textarea,Input} from '@chakra-ui/react';
import Swal   from 'sweetalert2'
import { fechaSplit2,horaSplit } from '../../Components/util';



const ReporteVisita =() => {

  const [fechaInicio,setFechainicio]=useState('');
  const [fechaTermino,setFechatermino]=useState('');
  const [visitas, setVisitas]= useState([{
    id_visita:'',
    rut:'',
    nombre: '',
    apellido:'',
    telefono: '',
    rol: '',
    fechaInicio: '',
    fechaTermino:''
  }]);
  const [busqueda, setBusqueda] = useState("");
  const backgroundImageUrl = 'https://galerias.iglesia.cl/Gale_4fc8f6ca35693/Gale4fc8f6ca35f2c_01062012_107pm.JPG';



    const getVisitas = async () => {
      const response = await clienteAxios.get("/usuarios/getall");
      if(response.status==200){
      setVisitas(response.data.visitas)
      }
    }
    useEffect(() => {
      getVisitas()
    },[])
    const router = useRouter()

    const filtrar = (terminoBusqueda) => {
      var resultadosBusqueda = visitas.filter((visita) => {
        if (
          visita.nombre
            .toString()
            .toLowerCase()
            .includes(terminoBusqueda.toLowerCase()) ||
          visita.apellido
            .toString()
            .toLowerCase()
            .includes(terminoBusqueda.toLowerCase()) ||
          visita.telefono
            .toString()
            .toLowerCase()
            .includes(terminoBusqueda.toLowerCase()) ||
          visita.rut
            .toString()
            .toLowerCase()
            .includes(terminoBusqueda.toLowerCase()) ||
            visita.rol
            .toString()
            .toLowerCase()
            .includes(terminoBusqueda.toLowerCase()) 
        ) {
          return visitas;
        }
      });
      setVisitas(resultadosBusqueda);
    };

    const handleSearchChange = (e) => {
      const nuevoTermino = e.target.value;
      setBusqueda(nuevoTermino);
  
      if (nuevoTermino === "") {
        getVisitas(); 
      } else {
        filtrar(nuevoTermino);
      }
    };


    const deleteVisita = async(e) => {
      Swal.fire({
          title: '¿Seguro?',
          text: "No podrás revertir esta decisión",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, borrar!'
        }).then(async(result) => {
          if (result.isConfirmed) {

            await clienteAxios.delete(`/usuarios/delete/${e}`)

            Swal.fire(
              'Borrado!',
              'Visita ha sido borrada',
              'success'
            )
            getVisitas();
          }
        })

      }

return (
  <Container maxW="container.xl" mt={10}>
          <Image
        src='https://www.cspnc.cl/wp-content/uploads/2021/07/logo-cspnc-2021.png'
        onClick={()=>router.push('../../Home')}
        boxSize='25%'
        alt="Logo"
      />
    <Stack>
            <center>
            <Heading as="h1" size="xl" className="header" textAlign="center" mt="10">Generar Reporte Visita</Heading>
            </center>

            </Stack>


        <Stack>
        <Heading textAlign="center" as="h4" size="xl" mt="10"  >Por Fecha</Heading>

            <HStack style={{marginTop:40}}>
            <FormControl>
        <FormLabel>{"Fecha de Inicio"}</FormLabel>
        <Input value={fechaInicio} label="Hora"   placeholder="hora" type="date" />
        </FormControl>
        <FormControl>
        <FormLabel>{"Fecha de Termino (opcional)"}</FormLabel>
        <Input value={fechaTermino} label="Hora"   placeholder="hora" type="date" />
        </FormControl>
           
        </HStack>
            <HStack style={{marginLeft:1100}}>
            
            <Button colorScheme="blue" mt={10} mb={10} >Generar</Button>

            </HStack>
            <Heading textAlign="center" as="h4" size="xl"   >Por Visita</Heading>

            <HStack>

            <Input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, apellido, rut, teléfono"
              value={busqueda}
              onChange={handleSearchChange}
            />

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
                <Td fontWeight={"bold"}>Generar Reporte</Td>

              </Tr>
            </Thead>
            <Tbody border={"5"}>
  {visitas && visitas.length > 0 ? (

visitas.map((Visita,idx)=>
  (
    <Tr key={idx}>
             <Td >{Visita.rut}</Td>
             <Td >{Visita.nombre}</Td>
             <Td>{Visita.apellido}</Td>
             <Td>{Visita.telefono}</Td>
             <Td>{Visita.rol}</Td>
             <Td>{fechaSplit2(Visita.fechaInicio)}</Td>
             <Td>{fechaSplit2(Visita.fechaTermino)}</Td>
             <Td>
              <Button colorScheme="blue"   onClick={()=>router.push(`./visita/Modificar/${Visita.id_visita}`)}>Generar</Button>
            </Td>

     </Tr>
))
): (
  <Tr>
    <Td colSpan={9} textAlign="center">
      No hay visitas registradas.
    </Td>
  </Tr>
)
}

</Tbody>
          </Table>
    

    </Container>
    
    <HStack style={{marginLeft:1100}}>
        <Button colorScheme="blue" mt={10} mb={10} onClick={() => router.push('./menu_reporte')}>Volver</Button>
        </HStack>
</Container>

);


        }

export default ReporteVisita;