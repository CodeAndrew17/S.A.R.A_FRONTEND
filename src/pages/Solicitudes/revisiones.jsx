import React from "react";
import Sidebar from "../../components/sidebar"; 
import styled from "styled-components";
import Table from "../../components/table";
import ColumnsRequest from "./TableRequest/columnsRequest";
import Toolbar from "../../components/Toolbar";


const TitleWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  margin-top: 10px; /* Espaciado del fondo */
  height: 60px;
`;

const TitleText = styled.h1`
  color: #000;
  font-size: 40px;
  line-height: 10px;
  margin: 0; /* Para que no interfiera con el diseño */
  top: 20px; /* Ajusta el texto sin afectar el fondo */
  position: relative;

`;
const dataPrueba = [
  {
    id: 1,
    placa: 'ABC123',
    fecha: '10/05/2025',
    central_servicio: 'Centro Norte',
    turno: 'Mañana',
    id_empleado: 'Juan Pérez',
    id_sucursal: 'Sucursal Norte',
    estado: 'AC',
    id_plan: 'Plan Basico',
    id_tipo_vehiculo: 'Carro',
    observaciones: 'El vehículo fue recibido en el Centro Norte. Para encontrar el servicio, dirigirse a la zona de recepción, módulo 3. El servicio incluye revisión general, ajuste de frenos y verificación de niveles. Tiempo estimado: 2 horas aprox.',
    id_convenio: 'AutoMec S.A.',
  },
  {
    id: 2,
    placa: 'XYZ789',
    fecha: '12/05/2015',
    central_servicio: 'Centro Sur',
    turno: '1',
    id_empleado: 'María Rodríguez',
    id_sucursal: 'Fast Drive',
    estado: 'IN',
    id_plan: 'PLAN02',
    id_tipo_vehiculo: 'Moto',
    observaciones: 'Falta repuesto para frenos',
    id_convenio: 'Inchcape Colombia S.A.S.',
  },
  {
    id: 3,
    placa: 'LMN456',
    fecha: '09/05/2025',
    central_servicio: 'Centro Este',
    turno: 'Noche',
    id_empleado: 'Andres Gustavo Álvarez Suárez',
    id_sucursal: 'Sucursal Este',
    estado: 'PE',
    id_plan: 'PLAN03',
    id_tipo_vehiculo: 'Camioneta',
    observaciones: 'Esperando aprobación del cliente',
    id_convenio: 'Transporte Express Ltda.',
  },
  {
    id: 4,
    placa: 'DEF321',
    fecha: '08/05/2025',
    central_servicio: 'Centro Oeste',
    turno: 'Mañana',
    id_empleado: 'Laura Gómez',
    id_sucursal: 'Sucursal Oeste',
    estado: 'AC', // RE = Revisado (ejemplo ficticio)
    id_plan: 'PLAN04',
    id_tipo_vehiculo: 'Bus',
    observaciones: 'Estado sin clasificar Estado sin clasificar Estado sin   sin clasificar',
    id_convenio: 'Movilidad Segura S.A.',
  },
];


function Revisiones() {
  return (
    <div > 
      <Sidebar />
      <TitleWrapper>
        <TitleText>Revisiones</TitleText>
      </TitleWrapper>
      <Toolbar>

        <Toolbar.Search 
          placeholder="Buscar..."
          onSearch={null} 
      
        />
        <Toolbar.Dropdown
          options={{
            "AC": "Activo", 
            "IN": "Inactivo",
            'PE': "En Progreso",
            "": "Todos"}}            
          onSelect={null}
        />

      </Toolbar>

      
      <Table
      columns={ColumnsRequest({})}
      data={dataPrueba}
      selectable={true}
      
      />
    </div>
  );
}

export default Revisiones;
