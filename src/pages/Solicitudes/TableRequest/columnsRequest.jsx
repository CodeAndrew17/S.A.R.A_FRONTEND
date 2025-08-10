import CustomButton from "../../../components/ui/button";
import { Download, FolderCog } from "lucide-react"; //<Download />
import {downloadRequest} from "../../../api/api_Solicitudes";  //llamamos la funcion de descarga, lista para usarl al momento de descagrar visualmente el archivo para el usuaorio 

const columnsRequest=({navigate})=> {
  
  //funciona para signarle al boton de cada fila que este en estaod FIN lo cual descarga el odf de esa solicitud seleccionada 
  const handleDownload = async (id) => { //recibimos el id como parametro para la peticion get 
    try {
      const response = await downloadRequest(id); //hacemos la peticion 
      const url = window.URL.createObjectURL(new Blob([response.data])); //creamos un enlace temporal en el DOM 
      //creamos dinamicamente un elemnto <a> ancla  
      const link = document.createElement('a'); //elemento html anchorage para los enlaces de descarga en este caso
      link.href = url; //asigna la url que se creo anteriormente como destino de enlace 
      link.setAttribute('download', `informe_solicitud_${id}.pdf`) // nombre del archivo identificandolo por el id 
      document.body.appendChild(link); //inserta el <a> dinamico al dom (lo hacemos para que sea compatible y funcione el click en diferentes navegadores)
      link.click(); //disparamos el clic simulandolo activando la descarga 

      //limpiamos el objeto url creado 
      link.remove(); //quita el elemnto <a> del dom para no dejar residuos 
      window.URL.revokeObjectURL(url); //libera memoria asociada la url temporal creada con createObjectURL para eficientizar 
    } catch (error) {
      console.error("Error al descargar el informe desde columnsRequest: ", error); 
    }
  };
  
  return [
      
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
        color = '#e0a800'; // amarillo
        break;
      default:
        color = '#495057'; // gris para estados desconocidos
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
    {key:'id_plan',title:<span style={{ fontSize: '14px', fontWeight: 'bold' }}>Plan</span>},
    {key:'id_convenio', title:<span style={{ fontSize: '14px', fontWeight: 'bold' }}>Convenio</span>},
    {key:'id_sucursal', title:<span style={{ fontSize: '14px', fontWeight: 'bold' }}>Sucursal</span>},

    {
        key: 'actions',
        title: <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Acciones</span>,
    render: (_, record) => {

        const isDisabled = record.estado !== "PRO" //desabilitar si no es pro osea en progreso
        let color = '#0000'
        let hover =''
        
        if( record.estado=='PRO'){
            color='#20C997'
            hover='#1BAF89'


        }else{
            color='#bab9b8'
            hover='#bab9b8'
        }
        return record.estado === "FIN" ? (
          <CustomButton
            bgColor="#3399ff"
            hoverColor="#337ab7"
            width="100px"
            height="35px"
            icon={Download}
            onClick={() => handleDownload(record.id)}
          >
            Informe
          </CustomButton>
        ) : (
          <CustomButton
            bgColor="#20B993"  
            hoverColor="#1CA187"
            width="100px"
            height="35px"
            disabled={isDisabled}
            onClick={() =>
              navigate("/forms", {
                state: {
                  solicitud_id: record.id,
                  placa: record.placa,
                  plan: record.id_plan,
                  convenio: record.id_convenio,
                  sucursal: record.id_sucursal,
                  tipo_vehiculo: record.id_tipo_vehiculo,
                  fecha: record.fecha,
                  telefono: record.telefono,
                  observaciones: record.observaciones,
                  id_plan: record.id_real_plan
                }
              })
            }
            icon={FolderCog}
          >
            Ejecutar
          </CustomButton>
    );
    }
  }
]; 
};



export default columnsRequest;