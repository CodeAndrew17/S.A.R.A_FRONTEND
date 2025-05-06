import Table from "../../components/table";
import Toolbar from "../../components/Toolbar";
import styled from "styled-components";
import columnsAgreement from "./TableAgreement/columnsAgreement";
import UserForm from "../../components/userForm";
import React, { useState, useEffect, useRef } from "react";
import { getAgreement } from "../../api/api_Convenios";

//!importacion de Funciona CRUD de Convenios 
import useAgreementManagement from "./TableAgreement/convenioEmployeeManagement";

import Swal from "sweetalert2";

const TitleWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  width: 100%;
  margin: 0 -30px;
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
`;

const TitleText = styled.h1`
  color: #000;
  font-size: 40px;
  margin: 0;
  position: relative;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FormContainer = styled.div`
  padding: 30px;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 80%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
`;


const GestionConvenios = ({ title = "Gestión de Convenios", onCerrar }) => {
  const [activeForm, setActiveForm] = useState(false); // Para mostrar el formulario
  const [selected, setSelected] = useState([]); // Para los convenios seleccionados
  const modalRef = useRef(null); // Referencia al modal

  const {
    agreements, // Los convenios
    loading, // Estado de carga
    filteredAgreement,// Datos con Filtro
    fetchAgreementData, // Funcion para cargar los convenios
    createAgreement, // Funcion para crear un convenio
    removeAgreement, // Funcion para eliminar convenios
    ConsultSearch, //Funcion Para buscar
  } = useAgreementManagement();

  useEffect(() => {
    fetchAgreementData(); 
  }, []); 

  const handleForm = () => setActiveForm(true); 
  const closeForm = () => setActiveForm(false); 

  // * Crear un convenio
  const handlecreate = (form) => {
    if (createAgreement(form)) {
      closeForm(); 
    }
  };

  // Gestionar selección de convenios
  const handleSelected = (ids) => {
    setSelected(ids);
  };

  // Eliminar convenios seleccionados
  const handleDelete = async () => {
    const success = await removeAgreement(selected);
    if (success) {
      setSelected([]); // Limpia la selección
      fetchAgreementData(); // Refresca la lista de convenios después de eliminar
    }
  };

  return (
    <ModalContainer>
      <FormContainer ref={modalRef}>
        <TitleWrapper>
          <TitleText>{title}</TitleText>
        </TitleWrapper>

        <Toolbar
          onCreate={handleForm}
          onActiveButton={false}
          onDelete={handleDelete}
          style={{ margin: "3px solid #07f53d" }}
        >
          <Toolbar.Search 
          placeholder="Buscar..."
          onSearch={ConsultSearch} 

           />
          <Toolbar.Dropdown
            options={["Todos", "Activo"]}
            onSelect={ConsultSearch}
          />
        </Toolbar>

        {/* Mostrar tabla con los convenios */}

        <Table
          containerStyle={{ margin: "5px 10px 5px 5px", width: "98%", overflow: "auto" }}
          selectable={true}
          data={filteredAgreement} // Usamos los convenios que vienen del hook
          columns={columnsAgreement}
          onSelectionChange={handleSelected}
        />
        <button onClick={onCerrar}>Cancelar</button>

        {/* Mostrar el formulario si es necesario */}
        {activeForm && (
          <UserForm
            title="Crear Convenio"
            fields={[
              { name: "nombre", placeholder: "Nombre", type: "text", required: true },
              { name: "nit", placeholder: "NIT", type: "number", required: true },
              { name: "telefono", placeholder: "Teléfono", type: "tel", required: true },
            ]}
            onCancel={closeForm}
            onSubmit={handlecreate}
          />
        )}
      </FormContainer>
    </ModalContainer>
  );
};

export default GestionConvenios;