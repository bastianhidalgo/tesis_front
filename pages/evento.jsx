import { useState, useEffect } from 'react';
import { clienteAxios } from './clienteAxios';
import { useRouter } from 'next/router'
import {  Text,useDisclosure,Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,Image,Button,Container,Heading, Stack, Table, Thead, Tr, Td,Tbody ,Input} from '@chakra-ui/react';
import Swal   from 'sweetalert2'
import { fechaSplit2,horaSplit } from '../Components/util';

function Eventos() {

    const [eventos, setEventos]= useState([{
        codigo_evento:'',
        tema:'',
        descripcion: '',
        fechaEvento:''
      }]);
      const [busqueda, setBusqueda] = useState("");
      const [visitas,setVisitas]=([]);
      const { isOpen, onOpen, onClose } = useDisclosure()
      const router = useRouter()
      const [modalStates, setModalStates] = useState([]); // Estado para gestionar la visibilidad de cada modal



        const getEventos = async () => {
          const response = await clienteAxios.get("/eventos/getall");
          if(response.status==200){
          setEventos(response.data.eventos)
          }
        }
        useEffect(() => {
          getEventos()
        },[])

        const handleSearchChange = (e) => {
          const nuevoTermino = e.target.value;
          setBusqueda(nuevoTermino);
      
          if (nuevoTermino === "") {
            getEventos(); 
          } else {
            filtrar(nuevoTermino);
          }
        };
        const filtrar = (terminoBusqueda) => {
          var resultadosBusqueda = eventos.filter((evento) => {
            if (
              evento.tema
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase())

            ) {
              return eventos;
            }
          });
          setEventos(resultadosBusqueda);
        };

        const deleteEvento = async(e) => {
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

                await clienteAxios.delete(`/eventos/delete/${e}`)

                Swal.fire(
                  'Borrado!',
                  'Evento ha sido borrado',
                  'success'
                )
                getEventos();
              }
            })

          }

          const openModal = (index) => {
            const newModalStates = [...modalStates];
            newModalStates[index] = true;
            setModalStates(newModalStates);
          };
        
          const closeModal = () => {
            setModalStates(modalStates.map(() => false));
          };

    return(
      <div >

      <Container  maxW="container.xl" mt={10}>

      <Image
        src='https://www.cspnc.cl/wp-content/uploads/2021/07/logo-cspnc-2021.png'
        onClick={()=>router.push('./Home')}
        boxSize='25%'
        alt="Logo"
      />
        <Heading  as="h1" size="xl" className="header" textAlign="center" mt="10">Eventos Colegio San Pedro Nolasco Concepción</Heading>
        <Button colorScheme="blue" mt="10" onClick={() => router.push('./evento/agregarEvento')}>Agregar Evento</Button>

        <Heading as="h4" size="xl"  textAlign="center" mt="10">Próximos Eventos</Heading>

       
          <div style={{marginTop:30}}>
            <label className="me-2">Buscar:</label>
            <Input
              type="text"
              className="form-control"
              placeholder="Buscar por tema"
              value={busqueda}
              onChange={handleSearchChange}
            />
   
   </div>
        <Stack spacing={4} mt="10">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Td fontWeight={"bold"}>Tema</Td>
                <Td fontWeight={"bold"}>Fecha</Td>
                <Td fontWeight={"bold"}>Hora de inicio</Td>
                <Td fontWeight={"bold"}>Registrar Asistencia</Td>
                <Td fontWeight={"bold"}>Ver</Td>
                <Td fontWeight={"bold"}>Eliminar</Td>

              </Tr>
            </Thead>
            <Tbody border={"5"}>
              
            

{eventos && eventos.length > 0 ? (
eventos.map((Evento,idx)=>
  (
    <Tr key={idx}>
             <Td >{Evento.tema}</Td>
             <Td>{fechaSplit2(Evento.fecha)}</Td>
             <Td>{horaSplit(Evento.fecha)}</Td>
            <Td>
              <Button mr={3} onClick={()=>router.push(`./evento/Asistencia/${Evento.codigo_evento}`)}>Asistencia</Button>
            </Td>
             <Td>

              <Button colorScheme="blue"   onClick={() => openModal(idx)}>Ver</Button>
                <Modal closeOnOverlayClick={false} isOpen={modalStates[idx]} onClose={closeModal}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>{Evento.tema}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                         <Text>Descripción: {Evento.descripcion}</Text>
                        <Text>Fecha: {fechaSplit2(Evento.fecha)}</Text>
                        <Text>Hora de inicio: {horaSplit(Evento.fecha)}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' mr={3} onClick={()=>router.push(`./evento/Modificar/${Evento.codigo_evento}`)}>Editar</Button>
                        <Button onClick={closeModal}>Cerrar</Button>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
              
            
 </Td>
 <Td><Button colorScheme="red" onClick={()=>deleteEvento(Evento.codigo_evento)} style={{marginLeft:10}}  >Eliminar</Button>
 </Td>
     </Tr>
))) 
: (
  <Tr>
    <Td colSpan={6} textAlign="center">
      No hay eventos registrados.
    </Td>
  </Tr>
)}
</Tbody>
          </Table>
        </Stack>
                   
        <Button colorScheme="blue" style={{marginTop:30, marginLeft:1170}}onClick={() => router.push('../Home')} >Volver
            </Button>
      </Container>
    </div>
       
    );
    }
    export default Eventos;