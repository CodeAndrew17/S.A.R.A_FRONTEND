import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar"; 
import styled from "styled-components";
import Table from "../../components/table";
import ColumnsRequest from "./TableRequest/columnsRequest";
import Toolbar from "../../components/Toolbar";
import useRequestManage from "./TableRequest/requestManagement";
import UserForm from "../../components/userForm";
import { Database } from "lucide-react";
import Swal from "sweetalert2";


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
  const [editinRequest, setEditinRequest] =  useState(null) //Datos para editar 
  const [selectedRequests, setSelectedRequests] = useState([]);


  const [loading, setLoading] = useState(true);
  const {
    originalRequest,
    dataRequest,
    formsData,
    fetchRequest,
    fetchBaseData,
    createRequest,
    editingRequest,
    removeRequest,
    handleFiledChage,
  } = useRequestManage()

  useEffect(() => {
  const init = async () => {
    await fetchBaseData();  // <-- se llama aquí
    await fetchRequest();
    console.log(originalRequest)
  };
  init();
}, []);

console.log("Data de ids", selectedRequests)

  const handleeditRequest = () => {
    if (selectedRequests.length === 1) {
      setEditinRequest(selectedRequests[0]); // cargamos los datos al formulario
      setActiveForm('request');
    } else {
      Swal.fire({
        title: "Error",
        text: "No se pudo modificar la solicitud. Verifica los datos ingresados.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleDelete=async()=>{
    const success = await removeRequest(selectedRequests);
     if (success) {
      fetchRequest();
      fetchBaseData();
    }
  }


  const handleCreateRequest=()=>{
    setActiveForm('request')

  }
  const handlecCancelForm = ()=>{
    setActiveForm(null)
  }

  const handleFormSubmit = (data) => {
    console.log("Datos recibidos:", data); // <-- Añade esto

    if(editinRequest){
      const dataWithId = {
      ...data,
      id: editinRequest.id
      };
      console.log("ingresar al edit ",dataWithId)
      
      editingRequest(dataWithId)

    }else{
      createRequest(data);
    }
    setActiveForm(null)
    setEditinRequest(null)
    
  };
    return (
    <div>
      <Sidebar />
      <TitleWrapper>
        <TitleText>Revisiones</TitleText>
      </TitleWrapper>

      <Toolbar
        onCreate={handleCreateRequest}
        onEdit={handleeditRequest}
        onDelete={handleDelete}
      
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
        onSelectionChange={(selectedIds) => {
          const selectedItems = originalRequest.filter(item => selectedIds.includes(item.id));
          console.log("Filas seleccionadas:", selectedItems);
            setEditinRequest(selectedRequests[0]);

          setSelectedRequests(selectedItems);
        }}
        />
    {activeForm ==='request' &&(
        <UserForm
          title="Pruba de Creacion"
          fields={formsData}
          onFieldChange={handleFiledChage}
          onCancel={handlecCancelForm}
          onSubmit={handleFormSubmit}
          initialValues={editinRequest}
        />

    
    )}

    </div>
  );
}

export default Revisiones;
