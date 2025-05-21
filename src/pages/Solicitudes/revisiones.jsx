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
    dataRequest,
    formsData,
    convenioList,
    fetchRequest
  } = useRequestManage()


  const handleCreateRequest=()=>{
    setActiveForm('request')
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
      />

    
    )}

    </div>
  );
}

export default Revisiones;
