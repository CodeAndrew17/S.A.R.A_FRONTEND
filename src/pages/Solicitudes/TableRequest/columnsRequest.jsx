
import CustomButton from "../../../components/button";
import { FolderCog } from "lucide-react";

const columnsRequest=({})=>[
      
    {key:'fecha', title:'Fecha'},
    {key:'placa', title:'Placa'},
    {key:'id_empleado',title:'Solicitante'},
    {key: 'estado',title: 'Estado',
        render: (estado) => {
            let color = '';

    switch (estado) {
      case 'AC': // Activo
        color = '#28a745'; // verde
        break;
      case 'IN': // Inactivo
        color = '#dc3545'; // rojo
        break;
      case 'PE': // Pendiente (por ejemplo)
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
    {key:'id_plan',title:'Servicio'},
    {key:'id_convenio', title:'Convenio'},
    {key:'id_sucursal', title:'Sucursal'},


    {key:'observaciones',title:'Observaciones'},
    {
        key: 'actions',
        title: 'Acciones',
    render: (_, record) => {
        let color = '#0000'
        let hover =''
        
        if( record.estado=='PE'){
            color='#07f53d'
            hover='#519CB2'


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