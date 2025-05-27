
import CustomButton from "../../../components/button";
import { FolderCog } from "lucide-react";

const columnsRequest=({})=>[
      
    {key:'fecha', title:<span style={{ fontSize: '14px', fontWeight: 'bold' }}>Fecha</span>},
    {key:'placa', title:<span style={{ fontSize: '14px', fontWeight: 'bold' }}>Placa</span>},
    {key:'id_empleado',title:<span style={{ fontSize: '14px', fontWeight: 'bold' }}>Solicitante</span>},
    {key: 'estado',title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Estado</span>,
        render: (estado) => {
            let color = '';

    switch (estado) {
      case 'AC': // Activo
        color = '#28a745'; // verde
        break;
      case 'CAL': // Inactivo
        color = '#dc3545'; // rojo
        break;
      case 'PRO': // Pendiente (por ejemplo)
        color = '#ffc107'; // amarillo
        break;
      default:
        color = '#6c757d'; // gris para estados desconocidos
    }

    return (
      <span
        style={{
          color,
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
      >
        {estado}
      </span>
    );
  }
},
    {key:'id_plan',title:<span style={{ fontSize: '14px', fontWeight: 'bold' }}>Servicio</span>},
    {key:'id_convenio', title:<span style={{ fontSize: '14px', fontWeight: 'bold' }}>Convenio</span>},
    {key:'id_sucursal', title:<span style={{ fontSize: '14px', fontWeight: 'bold' }}>Sucursal</span>},


    {key:'observaciones',title:<span style={{ fontSize: '14px', fontWeight: 'bold' }}>Observaciones</span>},
    {
        key: 'actions',
        title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Acciones</span>,
    render: (_, record) => {
        let color = '#0000'
        let hover =''
        
        if( record.estado=='PRO'){
            color='#20C997'
            hover='#1BAF89'


        }else{
            color='#bab9b8'
            hover='#bab9b8'
        }
        return(
        <CustomButton

        bgColor={color}
        hoverColor={hover}
        width="100px"
        height="35px"
        icon={FolderCog}
      >
        Ejecutar
      </CustomButton>
        )
    }
  }
];



export default columnsRequest;