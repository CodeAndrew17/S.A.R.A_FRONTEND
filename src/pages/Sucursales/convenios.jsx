import Table from "../../components/table";
import Toolbar from "../../components/Toolbar";
import styled from "styled-components";
import columnsAgreement from "./TableAgreement/columnsAgreement";
import UserForm from "../../components/userForm";
import React, { useState, useEffect, useRef } from "react";
import { getAgreement } from "../../api/api_Convenios";
import CustomButton from "../../components/button";

//!importacion de Funciona CRUD de Convenios 
import useAgreementManagement from "./TableAgreement/convenioManagement";

import Swal from "sweetalert2";


const TitleText = styled.h1`
  color: #000;
  font-size: 20px;
  margin: 2px 0;           
  padding: 5px 10px;       /* Padding vertical reducido (antes: 10px 15px) */
  background-color: rgb(230, 230, 230);
  border-radius: 6px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.15);
  text-align: left;
  display: inline-block;
  width: auto;             /* Evita que ocupe todo el ancho */
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
  padding: 15px 30px;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 80%;
  height: 80vh; /* Altura fija en viewport height */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

          <TitleText>{title}</TitleText>

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
        <div style={{ alignSelf: 'center', marginTop: '20px' }}>
          <CustomButton 
            bgColor="#6F6F6F"
            hoverColor="#898989" 
            width="130px" 
            height="38px"
            onClick={onCerrar}>
            Cerrar
          </CustomButton>
        </div>


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