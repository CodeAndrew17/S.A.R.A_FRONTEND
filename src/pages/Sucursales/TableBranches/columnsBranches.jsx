import CustomButton from "../../../components/button";
import { Edit } from "lucide-react";

const columnsBranch = [
    {
      key: 'nombre',
      title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Nombre</span>,
    },
    {
      key: 'ciudad',
      title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Ciudad</span>,
    },
    {
      key: 'direccion',
      title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Dirección</span>,
    },
    {
        key: 'telefono',
        title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Teléfono</span>,
      },
    {
      key: 'estado',
      title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Estado</span>,
      render: (estado) => (
        <span style={{
        backgroundColor: estado === 'Activo' ? '#f8d7da' : '#d4edda',
        color: estado === 'Activo' ? '#721c24' : '#155724',
        padding: '3px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold'
        }}>
        {estado}
        </span>
    )
    },
    {
      key: 'convenio',
      title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Convenio</span>,
      render: (convenio) => convenio ?? "Sin convenio"
    },
    {
        key: 'actions',
        title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Modificar</span>,
        render: (_, record) => (
            <CustomButton
            bgColor="#5FB8D6" 
            hoverColor="#519CB2" 
            width="100px" 
            height="35px"
            //onClick={() => handleEditBranch(record)}
            icon={Edit}> Editar
            </CustomButton>
        )
      }
  ];

const handleEditBranch = (record) => {}; // funcion para mostrar el formulario de editar convenio y la logica 

export default columnsBranch;