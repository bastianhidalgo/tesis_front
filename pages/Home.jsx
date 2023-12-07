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

function Home({ serverDateTime }) {

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
      const [currentDateTime, setCurrentDateTime] = useState(serverDateTime);
      const [ingreso,setIngreso]= useState({
        fechaIngreso: '',
        visitaId:''
      })
      const [rol,setRol]= useState({
        descripcion:''
      })

        const router = useRouter();
        const { isOpen, onOpen, onClose } = useDisclosure()
        const btnRef = useRef();


        const getVisitas = async () => {
          try {
            const response = await clienteAxios.get("/usuarios/getall");
            if (response.status === 200) {
              const visitasData = response.data.visitas;
        
              const visitasConRoles = await Promise.all(
                visitasData.map(async (visita) => {
                  const rolResponse = await clienteAxios.get(`/rol/getone/${visita.rol}`);
                  visita.rol = rolResponse.data.rol.descripcion;
                  return visita;
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
            setCurrentDateTime(formattedDateTime);
          }, 1000);
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

          const RegistrarVisita = async(e) => {
            Swal.fire({
                title: '¿Seguro?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, registrar'
              }).then(async(result) => {
                if (result.isConfirmed) {
                  ingreso.visitaId=e;
                  ingreso.fechaIngreso=currentDateTime;
                  const respuesta= await clienteAxios.post("/ingresos/create",ingreso);

                  Swal.fire(
                    'Registrada!',
                    'Visita ha sido registrada',
                    'success'
                  )
                  getVisitas();
                }
              })

            }


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

          <DrawerBody>
          <VStack spacing={4} align="stretch">
          <HStack style={{marginTop:50}}>
        <Button   colorScheme='teal'  onClick={() => router.push('./apoderado/listado')}>Apoderados</Button>
        </HStack>
            <HStack style={{marginTop:50}}>
        <Button colorScheme='teal'  onClick={() => router.push('./crearVisita')}>Agregar Visita</Button>
        </HStack>
        <HStack style={{marginTop:50}}>
        <Button   colorScheme='teal'  onClick={() => router.push('./QRscanner')}>Registrar Ingreso</Button>
        </HStack>
        <HStack style={{marginTop:50}}>
        <Button   colorScheme='teal'  onClick={() => router.push('./evento')}>Eventos</Button>
        </HStack>
        <HStack style={{marginTop:50}}>
        <Button   colorScheme='teal'  onClick={() => router.push('./reporte/menu_reporte')}>Reportes</Button>
        </HStack>
        </VStack>
          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
            <Button colorScheme='blue' mr={3} onClick={onClose}>Cerrar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>


        <Heading   size="2xl"  style={{textAlign:'left'}}  mt="10">

        </Heading>
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
   
   
   
   
   
   
