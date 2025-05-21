import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar"; 
import styled from "styled-components";
import Table from "../../components/table";
import ColumnsRequest from "./TableRequest/columnsRequest";
import Toolbar from "../../components/Toolbar";
import useRequestManage from "./TableRequest/requestManagement";
import UserForm from "../../components/userForm";


const TitleWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  margin-top: 10px;
  height: 60px;
`;

const TitleText = styled.h1`
  color: #000;
  font-size: 40px;
  line-height: 10px;
  margin: 0;
  top: 20px;
  position: relative;
`;

function Revisiones() {
  const [activeForm, setActiveForm] = useState(true)
  const [loading, setLoading] = useState(true);
  const {
    sucursalList,
    convenioList,
    empleadoList,
    planList,
    tipovehiculoList,
    dataRequest,
    formsData,
    setFormsData,
    fetchRequest
  } = useRequestManage()

const handleFiledChage = (name, value) => {
  let updatedFields = [...formsData];

  if (name === 'id_convenio') {
    const filtersucursal = sucursalList.filter(
      (s) => String(s.id_convenio) === String(value)
    );

    console.log("Sucursales filtradas:", filtersucursal);

    updatedFields = updatedFields.map((field) => {
      if (field.name === "id_sucursal") {
        return {
          ...field,
          options: filtersucursal.map((s) => ({
            value: s.id,
            label: s.nombre,
          })),
        };
      }
      return field;
    });
  }

  if (name === "id_tipovehiculo") {
    const filteredPlans = planList.filter(
      (p) => String(p.id_tipo_vehiculo) === String(value)
    );

    console.log("Planes filtrados:", filteredPlans);

    updatedFields = updatedFields.map((field) => {
      if (field.name === "id_plan") {
        return {
          ...field,
          options: filteredPlans.map((p) => ({
            value: p.id,
            label: p.nombre_plan,
          })),
        };
      }
      return field;
    });
  }

  setFormsData(updatedFields);
};


 const handleCreateRequest=()=>{
    setActiveForm('request')
  }
  const handlecCancelForm = ()=>{
    setActiveForm(null)
  }
    return (
    <div>
      <Sidebar />
      <TitleWrapper>
        <TitleText>Revisiones</TitleText>
      </TitleWrapper>

      <Toolbar
        onCreate={handleCreateRequest}
      
      >


        <Toolbar.Search
          placeholder="Buscar..."
          onSearch={null}
        />
        <Toolbar.Dropdown
          options={{
            "AC": "Activo",
            "IN": "Inactivo",
            "PE": "En Progreso",
            "": "Todos"
          }}
          onSelect={null}
          
        />
    
      </Toolbar>

      <Table
        columns={ColumnsRequest({})}
        data={dataRequest}
        selectable={true}
      />
    {activeForm ==='request' &&(
      <UserForm
        title="Pruba de Creacion"
        fields={formsData}
        onFieldChange={handleFiledChage}
        onCancel={handlecCancelForm}
      />

    
    )}

    </div>
  );
}

export default Revisiones;
