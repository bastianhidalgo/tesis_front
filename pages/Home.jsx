import { React,useState, useEffect, useRef } from 'react';
import { clienteAxios } from './clienteAxios';
import { useRouter } from 'next/router'
import {  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,Image,Box,Button,Container,Heading, Stack, Table, Thead, Tr, Td,Tbody ,Input, HStack,IconButton, VStack} from '@chakra-ui/react';
import Swal   from 'sweetalert2'
import {HamburgerIcon} from '@chakra-ui/icons'
import { fechaSplit2 } from '../Components/util';
import { format } from 'date-fns';
import {ComponentDrawer} from '../Components/Drawer'

function Home({ serverDateTime }) {

    const [visitas, setVisitas]= useState([{
        id_visita:'',
        rut:'',
        nombre: '',
        apellido:'',
        telefono: '',
        rol:'',
        fechaInicio:'',
        fechaTermino:''
      }]);

      const [busqueda, setBusqueda] = useState("");
      const [currentDateTime, setCurrentDateTime] = useState(serverDateTime);
      const [ingreso,setIngreso]= useState({
        fechaIngreso: '',
        personaId:''
      })
      const [rol,setRol]= useState({
        descripcion:''
      })
      const [horaactual, setHoraactual] = useState('');
        const router = useRouter();
        const { isOpen, onOpen, onClose } = useDisclosure()
        const btnRef = useRef();


      
        const getVisitas = async () => {
          try {
            const response = await clienteAxios.get("/usuarios/getall");
        
            if (response.status === 200) {
              const visitasData = response.data.visitas;
              setVisitas(visitas)
              const visitasConRoles = await Promise.all(
                visitasData.map(async (visita) => {
                  try {
                    // Obtener información de la persona asociada a la visita
                    const personaResponse = await clienteAxios.get(`/personas/getonebyvisita/${visita.id_visita}`);
                    const persona = personaResponse.data.persona[0];
                    visita.rol=persona.rol;
                    visita.fechaInicio = persona.fecha_inicio; // Agrega la fecha de inicio a la visita
                    visita.fechaTermino = persona.fecha_termino; // Agrega la fecha de término a la visita
                    // Obtener información del rol asociado a la persona
                    const rolResponse = await clienteAxios.get(`/rol/getone/${persona.rol}`);
                    const rol = rolResponse.data.rol;
                    // Agregar información adicional a la visita
                    visita.rol = rol.descripcion; // Agrega la descripción del rol a la visita

        
                    return visita;
                  } catch (error) {
                    console.error("Error fetching additional data:", error);
                    return visita;
                  }
                })
              );
        
              setVisitas(visitasConRoles);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        useEffect(() => {
          const intervalId = setInterval(() => {
            const now = new Date();
            const formattedDateTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // Formatear la fecha
            setHoraactual(formattedDateTime);

          },1000);
          getVisitas();

        }, []);

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

                await clienteAxios.delete(`/persona/delete/${e}`)

                Swal.fire(
                  'Borrado!',
                  'Visita ha sido borrada',
                  'success'
                )
                getVisitas();
              }
            })

          }

          const RegistrarVisita = async (idVisita) => {
            Swal.fire({
              title: '¿Seguro?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sí, registrar'
            }).then(async (result) => {
              if (result.isConfirmed) {
                // Obtener información de la visita


                const response = await clienteAxios.get(`/personas/getonebyvisita/${idVisita}`);
                const visita = response.data.persona[0];
               // console.log(response)
                // Crear una nueva entrada en la tabla de fechas
                const hora= new Date()
                const year = hora.getFullYear(); // Año (cuatro dígitos)
                const month = hora.getMonth() + 1; // Mes (ten en cuenta que los meses en JavaScript van de 0 a 11)
                const day = hora.getDate(); // Día del mes
                const hours = hora.getHours(); // Horas (formato de 24 horas)
                const minutes = hora.getMinutes(); // Minutos
                const seconds = hora.getSeconds(); // Segundos

                const formattedDateTime = format(hora, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                setHoraactual(formattedDateTime)
                //console.log(visita.fecha_inicio)
                ingreso.fechaIngreso=formattedDateTime
                ingreso.personaId=visita.id_persona
             // console.log(ingreso)
                if((formattedDateTime>=visita.fecha_inicio) && (formattedDateTime<=visita.fecha_termino)){
                // Crear una nueva entrada en la tabla de ingresos
                const nuevoIngreso = await clienteAxios.post("/ingresos/create", ingreso);
                console.log(nuevoIngreso)
                Swal.fire(
                  'Registrada!',
                  'Visita ha sido registrada',
                  'success'
                );
                           // Actualizar la lista de visitas después del registro
                getVisitas();}
                else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error al ingresar la visita.',
                    footer: ' Revisar fechas de inicio y de término'
                  })
                  }
              }
            });
          };


    return(

      <Container  maxW="container.xl" >
        <HStack>
       <IconButton
      icon={<HamburgerIcon />}
      aria-label="Abrir menú"
      onClick={onOpen}
      colorScheme='red'
    />
         <Image  mt={10} 
        src='https://www.cspnc.cl/wp-content/uploads/2021/07/logo-cspnc-2021.png'
        onClick={()=>router.push('./Home')}
        boxSize='25%'
        alt="Logo"
        style={{marginLeft:50,marginBottom:40}}
      /></HStack>
      <Box>
      <Heading  as="h1" size="xl" className="header" textAlign="center"mt="10" >Control de Ingreso CSPN Concepción</Heading>
      </Box>



      <ComponentDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} />

      <Button colorScheme='blue'  mt="10" onClick={() => router.push('./crearVisita')}>Crear Visita</Button>

       
        <Heading textAlign="center" as="h4" size="xl"   mt="10">Listado Visitas</Heading>


          <div style={{marginTop:30}}>
            <label className="me-2">Buscar:</label>
            <Input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, apellido, rut, teléfono"
              value={busqueda}
              onChange={handleSearchChange}
            />

   </div>
        <Stack spacing={4} mt="10">
          <Table variant="simple">
            <Thead>
              <Tr>
              <Td fontWeight={"bold"}>RUN</Td>
                <Td fontWeight={"bold"}>Nombre</Td>
                <Td fontWeight={"bold"}>Apellido</Td>
                <Td fontWeight={"bold"}>Rol</Td>
                <Td fontWeight={"bold"}>Fecha de Inicio</Td>
                <Td fontWeight={"bold"}>Fecha de Término</Td>
                <Td fontWeight={"bold"}>Registrar Ingreso</Td>
                <Td fontWeight={"bold"}>Modificar</Td>
                <Td fontWeight={"bold"}>Eliminar</Td>
              </Tr>
            </Thead>
            <Tbody border={"5"}>
  
            {visitas && visitas.length  > 0 ? (
            visitas.map((Visita,idx)=>
              (
                <Tr key={idx}>
             <Td >{Visita.rut}</Td>
             <Td >{Visita.nombre}</Td>
             <Td>{Visita.apellido}</Td>
             <Td>{Visita.rol}</Td>
             <Td>{fechaSplit2(Visita.fechaInicio)}</Td>
             <Td>{fechaSplit2(Visita.fechaTermino)}</Td>
             <Td>
             <Button    onClick={()=>RegistrarVisita(Visita.id_visita)}>Registrar</Button>
            </Td>
             <Td>

              <Button colorScheme="green"   onClick={()=>router.push(`./visita/Modificar/${Visita.id_visita}`)}>Modificar</Button>
              </Td>
              <Td>

              <Button colorScheme="red" onClick={()=>deleteVisita(Visita.id_visita)} style={{marginLeft:10}}  >Eliminar</Button>

 </Td>

     </Tr>
)
)
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
        </Stack>
      </Container>
       
    );
    }
    export default Home;
   
   
   
   
   
   
