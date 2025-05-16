import CustomButton from "../../../components/button";
import { Edit } from "lucide-react";

const columnsAdmin = ({ setEditingPack, setActiveForm }) => [
    {
        key: 'Nombre',
        title: <span style={{fontSize: '14px',
        fontWeight: 'bold'}}>Nombre</span>,
    },
    {
        key: 'Vehiculo',
        title: <span style={{fontSize: '14px',
        fontWeight: 'bold'}}>Nombre</span>,
    },
    {
        key: 'Cuestionario',
        title: <span style={{fontSize: '14px',
        fontWeight: 'bold'}}>Nombre</span>,
    },
    {
        key: 'Estado',
        title: <span style={{fontSize: '14px',
            fontWeight: 'bold'}}>Estado</span>,
            render: (estado) => (
                <span style={{
                    backgroundColor: estado === 'Activo'? '#f8d7da' : '#d4edda',
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
        title: <span style={{fontSize: '14px',
        fontWeight: 'bold'}}>Modificar</span>,
        render: (_, record) => (
            <CustomButton
                bgColor="#5FB8D6"
                hoverColor="#519CB2"
                width="100px"
                height="35px"
                onClick={() => {
                    setEditingPack(record);
                    setActiveForm("planes");
                }}
                icon={Edit}
            >
              Editar
            </CustomButton>
        )
    }
];

export default columnsAdmin;