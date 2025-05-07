import CustomButton from "../../../components/button";
import { Edit } from "lucide-react";

const columnsAgreement = [
    {
      key: 'nombre',
      title: 'Nombre',
    },
    {
      key: 'nit',
      title: 'NIT',
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
        key: 'actions',
        title: 'Acciones',
        render: (_, record) => (
            <CustomButton
            bgColor="#5FB8D6" 
            hoverColor="#519CB2" 
            width="100px" 
            height="30px"
            //onClick={() => handleEditAgreement(record)}
            icon={Edit}> Editar
            </CustomButton>
        )
      }
  ];

const handleEditAgreement = async(id,formData) => {}; // funcion para mostrar el formulario de editar convenio y la logica 

export default columnsAgreement;