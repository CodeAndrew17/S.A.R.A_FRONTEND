import Table from "../../components/table";
import Toolbar from "../../components/Toolbar";
import styled from "styled-components";
import columnsAgreement from "./TableAgreement/columnsAgreement";
import UserForm from "../../components/userForm";
import React, { useState, useEffect, useRef } from "react";
import CustomButton from "../../components/button";
import { Edit } from "lucide-react";
import useAgreementManagement from "./TableAgreement/convenioManagement";


const TitleWrapper = styled.div`
  align-self: flex-start;
  margin-bottom: 0px;
`;

const TitleText = styled.h1`
  color: #000;
  font-size: 20px;
  margin: 0;
  padding: 0;
  text-align: left;
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

const ContainerAgreement = styled.div`
  padding: 30px;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
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

const GestionConvenios = ({ title = "Gestión de Convenios", onCerrar, onedit = false, data = null }) => {
  const [activeForm, setActiveForm] = useState(false); // Para mostrar el formulario
  const [selected, setSelected] = useState([]); // Para los convenios seleccionados
  const [editinAgreement, setEditinAgreement] =  useState(null) //Datos para editar 
  const modalRef = useRef(null); // Referencia al modal


  const {
    filteredAgreement,// Datos con Filtro
    fetchAgreementData, // Funcion para cargar los convenios
    createAgreement, // Funcion para crear un convenio
    removeAgreement, // Funcion para eliminar convenios
    ConsultSearch, //Funcion Para buscar
    updateAgreement,
  } = useAgreementManagement();

 
  useEffect(() => {
    fetchAgreementData(); 
  }, []); 

   // ! Funciones para la Activacion de Formularios 
  const handleCancelForm = () => {
    setActiveForm(null);
    setEditinAgreement(null);
  };

  const handleCreateAgreement=()=>{
    setActiveForm('convenio')
    setEditinAgreement(null)
  }
  const handleFormSubmit= async(newData)=>{
    try{
      if(editinAgreement){
        await updateAgreement( newData)
      }else{
        await createAgreement(newData);

      }
      setEditinAgreement(null)
      setActiveForm(null)
    }
    catch (erro){
      console.log(erro)
      
    }
  }

  const handleDelete = async () => {
    const success = await removeAgreement(selected);
    if (success) {
      setSelected([]);
      fetchAgreementData();
    }
  };
  

  // Gestionar selección de convenios
  const handleSelected = (ids) => {
    setSelected(ids);
  };
  
  return (
    <ModalContainer>
      <ContainerAgreement ref={modalRef}>
      <TitleWrapper>
        <TitleText>{title}</TitleText>
      </TitleWrapper>

        <Toolbar
        
          onCreate={handleCreateAgreement}
          onActiveButton={false}
          onDelete={handleDelete}
          style={{ margin: "3px solid #07f53d" }}
        >

          <Toolbar.Search 
          placeholder="Buscar..."
          onSearch={ConsultSearch} 

          />
          <Toolbar.Dropdown
            options={{
              "AC": "Activo", 
              "IN": "Inactivo",
              "": "Todos"
            }}            
            onSelect={ConsultSearch}
          />
        </Toolbar>

        {/* Mostrar tabla con los convenios */}

        <Table
          containerStyle={{ margin: "5px 10px 5px 5px", width: "98%", overflow: "auto" ,  borderRadius: "0px"}}
          selectable={true}
          data={filteredAgreement} // Usamos los convenios que vienen del hook
          columns={columnsAgreement({setEditinAgreement,setActiveForm})}
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
        {activeForm === 'convenio'&& (
          <UserForm
            title={editinAgreement? 'Editar Convenio':'Crear Convenio'}
            fields={[
              { name: "nombre", placeholder: "Nombre", type: "text", required: true},
              { name: "nit", placeholder: "NIT", type: "text", required: true },
              { name: "telefono", placeholder: "Teléfono", type: "tel", required: true },
              { 
                name: "estado",
                type: "select",
                options: [
                  {value: "AC", label:"Activo"},
                  {value: "IN", label:"Inactivo"}
                ],
                defaultValue: "AC",
                placeholder: "Estado",
              },
            ]}
            initialValues={editinAgreement}
            onCancel={handleCancelForm}
            onSubmit={handleFormSubmit}
          />
        )} {/*el punto y coma en esta linea no va */}
      </ContainerAgreement>
    </ModalContainer>
  );
};

export default GestionConvenios;