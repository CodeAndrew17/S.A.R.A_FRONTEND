import CustomButton from "../../../components/button";
import { Edit } from "lucide-react";

const columnsBranch = [
    {
      key: 'nombre',
      title: 'Nombre',
    },
    {
      key: 'ciudad',
      title: 'Ciudad',
    },
    {
      key: 'direccion',
      title: 'Dirección',
    },
    {
        key: 'telefono',
        title: 'Teléfono',
      },
    {
      key: 'estado',
      title: 'Estado',
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
        title: 'Convenio',
    },
    {
        key: 'actions',
        title: 'Acciones',
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