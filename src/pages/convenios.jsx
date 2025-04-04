import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import styled from "styled-components";
//import Dropdown from "../components/Dropdown";
import SearchBar from "../components/SearchBar";
import Button from "../components/button";
import UserForm from "../components/userForm"; 
import { Filter, Plus } from "lucide-react";
import {getConvenios} from "../api/api_Convenios"; 
import { use } from "react";

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

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 80px;
  margin-left: 240px; // Aumenta este valor para mover el SearchBar más a la derecha
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between; // Distribuye el espacio entre los elementos
  align-items: center;
  padding: 10px 20px;
  width: 90%;
  margin: 20px auto;
  flex-wrap: wrap;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 100px;
  margin-left: auto; // Esto empuja el contenedor hacia la derecha
`;

const FormContainer = styled.div`
  display: flex,
  justify-content: center,
  align-items: center,
  flex-direction: column,
  padding: 20px,
`;

const Th = styled.th`
  border: 1px solid #ccc,
  padding: 10px,
  background-color: #f5f5f5,
  text-align: left,
`;

const Td = styled.td`
  border: 1px solid #ccc;
  padding: 10px;
`;


const Convenios = () => {
  const [activeForm, setActiveForm] = useState(null); // Estado para mostrar/ocultar el formulario
  const [convenios, setConvenios] = useState([]); //estado para almacenar convenios 

  useEffect(() => {
    const fetchConvenios = async () => {
      try {
        const response = await getConvenios(); //llama a a la api para obtener convenios
        console.log("convenios",response);
        setConvenios(response); //alamacena los convenios en el estado
      }
    catch (error) {
      console.error("Error fetching convenios: ", error);
    }
  };

  fetchConvenios(); //llamamos a la funcion para obtener los convenios 
}, []);


  const handleFiltrar = () => {
    alert("Filtrando datos...");
  };

  const handleCrearConvenio = () => {
    setActiveForm("convenio"); // Mostrar el formulario cuando se hace clic en "Crear Convenio"
  };

  const handleCrearSucursal = () => {
    setActiveForm("sucursal"); // Mostrar el formulario cuando se hace clic en "Crear Nuevo"
  };

  const handleFormSubmit = (newUserData) => {
    console.log("Datos capturados:", newUserData);

  };

  const handleCancelForm = () => {
    setActiveForm(null); // Cierra el formulario sin guardar nada
  };

  /*const handleDropdownSelect = (option) => {
    console.log("Opción seleccionada:", option); funcion para el dropdown
  };*/



  return (
    <div>
      <Sidebar />
      <TitleWrapper>
        <TitleText>Panel de Convenios</TitleText>
      </TitleWrapper>

      <TopBar>
        <FilterContainer>
          <SearchBar />
        </FilterContainer>

        <ButtonContainer>
          <Button
            bgColor="#5FB8D6"
            hoverColor="#5FA6C7"
            width="130px"
            height="38px"
            onClick={handleFiltrar}
          >
            <Filter /> Filtrar
          </Button>

          <Button
            bgColor="#A9A9A9"
            hoverColor="#8B8B8B"
            width="180px"
            height="38px"
            onClick={handleCrearConvenio}
          >
            <Plus /> Crear Convenio
          </Button>

          <Button
            bgColor="#5FB8D6"
            hoverColor="#5FA6C7"
            width="180px"
            height="38px"
            onClick={handleCrearSucursal}
          >
            <Plus /> Crear Sucursal
          </Button>
        </ButtonContainer>
      </TopBar>

      {activeForm === "sucursal" && (
        <FormContainer>
          <UserForm
            title="Crear Sucursal"
            fields={[
              { name: "name", placeholder: "Nombre", type: "text" },
              { name: "city", placeholder: "Ciudad", type: "text" },
              { name: "address", placeholder: "Dirección", type: "text" },
              { name: "phone", placeholder: "Teléfono", type: "tel" },
              { name: "convenio", placeholder: "Convenio", type: "text" },//esto es una llave foranea el back tiene q pasar las choices
            ]}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        </FormContainer>
      )}

      {activeForm === "convenio" && (
        <FormContainer>
          <UserForm
          title="Crear Convenio"
          fields={[ 
            { name: "name", placeholder: "Nombre", type: "text" },
            { name: "nit", placeholder: "NIT", type: "text" },
            { name: "phone", placeholder: "Teléfono", type: "tel" },
            { name: "city", placeholder: "Ciudad", type: "text" },
          ]}

          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
          />
        </FormContainer>
      )}

        {activeForm === null && convenios.length > 0 && (
          <div style={{ padding: "20px", marginLeft: "240px" }}>
            <h2>Convenios Registrados</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>Nombre</Th>
                <Th>NIT</Th>
                <Th>Teléfono</Th>
                <Th>Ciudad</Th>
                <Th>Estado</Th>
              </tr>
            </thead>
            <tbody>
              {convenios.map((convenio, index) => (
                <tr key={index}>
                  <Td>{convenio.nombre}</Td>
                  <Td>{convenio.nit}</Td>
                  <Td>{convenio.telefono}</Td>
                  <Td>{convenio.ciudad}</Td>
                  <Td>{convenio.estado}</Td>
                </tr>
              ))}
            </tbody>

            </table>
          </div>
        )}

    </div>
    
  );
};

export default Convenios;
