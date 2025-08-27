import CustomButton from "../../../components/ui/button";
import { Edit } from "lucide-react";

/**
 * Generador de columnas para la tabla de sucursales.
 * Recibe funciones para editar la sucursal desde el componente padre.
 */
const columnsBranch = ({ setEditingBranch, setActiveForm }) => [
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
  title: 'Estado',
  render: (estado) => (
    <span
      style={{
        color: estado === 'IN' ? '#dc3545' : '#28a745', // rojo para IN, verde para AC
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }}
    >
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
        bgColor="#4F98D3"
        hoverColor="#3E86C2"
        width="110px"
        height="35px"
        onClick={() => {
          setEditingBranch(record); 
          setActiveForm("sucursal"); 
        }}
        icon={Edit}
      >
        Editar
      </CustomButton>
    )
  }
];

export default columnsBranch;
  