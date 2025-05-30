import Table from "../../components/table";
import Toolbar from "../../components/toolbar";
import styled from "styled-components";
import columnsAgreement from "./TableAgreement/columnsAgreement";
import UserForm from "../../components/userForm";
import { useState, useEffect, useRef } from "react";
import CustomButton from "../../components/button";
import useAgreementManagement from "./TableAgreement/convenioManagement";


const TitleWrapper = styled.div`
  align-self: flex-start;
  margin-bottom: 0px;
`;

const TitleText = styled.h1`
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  padding: 0;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -16px;
    width: 50px;
    height: 3px;
    background: linear-gradient(to right, #00c5d6, #2575fc);
    border-radius: 3px;
  }

  @media (min-width: 768px) {
    font-size: 28px;
    
    &::after {
      width: 70px;
    }
  }
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  overflow-y: auto; /* Permite scroll si el contenido del modal es muy largo */
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Cambiado de 'center' a 'flex-start' para alinear arriba */
  padding: 20px 0; /* Espacio vertical */
`;

const ContainerAgreement = styled.div`
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  width: 100%;
  max-width: 1200px; /* Ancho máximo para pantallas grandes */
  min-height: 90vh; /* Altura mínima */
  max-height: 90vh; /* Altura máxima con scroll interno */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 20px; /* Margen en dispositivos pequeños */
  
  /* Media queries para diferentes tamaños */
  @media (min-width: 768px) {
    padding: 30px;
    margin: 0;
  }

  /* Estilos de scroll */
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
    filteredData,
    setStatusFilter,
    setSearchText
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
        await updateAgreement( newData, editinAgreement.nit) //arreglo de funcion editar pasamos el nit original 
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
          onSearch={(search) => setSearchText(search)} 

          />
          <Toolbar.Dropdown
            options={{
              "AC": "Activo", 
              "IN": "Inactivo",
              "": "Todos"
            }}            
            onSelect={(option) => setStatusFilter(option)}
          />
        </Toolbar>

        {/* Mostrar tabla con los convenios */}

        <Table
          containerStyle={{ margin: "5px 10px 5px 5px", width: "98%", overflow: "auto" ,  borderRadius: "0px"}}
          selectable={true}
          data={filteredData} // Usamos los convenios que vienen del hook
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
            title={editinAgreement ? `Editar Convenio ${editinAgreement.nombre}` : 'Crear Convenio'}
            fields={[
              { name: "nombre",label: "Nombre", placeholder: "Nombre", type: "text", required: true},
              { name: "nit", placeholder: "NIT", type: "text", required: true },
              { name: "telefono", placeholder: "Teléfono", type: "tel", required: true },
              { 
                name: "estado",
                label: "Estado",
                type: "select",
                options: [
                  {value: "AC", label:"Activo"},
                  {value: "IN", label:"Inactivo"}
                ],
                defaultValue: "AC",
                placeholder: "Estado",
                required: true
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