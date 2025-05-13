import React from "react";
import Sidebar from "../../components/sidebar"; 
import styled from "styled-components";
import Table from "../../components/table";
import columnsManage from "./columnsManage";

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
  position: relative;
  top: 20px; /* Ajusta el texto sin afectar el fondo */
`;

function Administrar() {

  const handleSelectionChange = (selectedRows) => {
  console.log("Filas seleccionadas:", selectedRows);
};

  return (
    <div> 
      <Sidebar />
      <TitleWrapper>
        <TitleText>Administrar</TitleText>
      </TitleWrapper>
      <Table
data={[
  { id: 1, estado: 'Activo', nombre: 'Ever', cuestionario: 'Libiano' },
  { id: 2, estado: 'asdad', nombre: 'dadasdsds', cuestionario: 'ojdad' }
]}

      onSelectionChange = {handleSelectionChange}  
      selectable={true}
      columns={columnsManage}
      />

    </div>
  );
}

export default Administrar;
