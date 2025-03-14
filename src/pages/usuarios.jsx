import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import styled from "styled-components";
import Dropdown from "../components/Dropdown";
import SearchBar from "../components/SearchBar";
import Button from "../components/button";
import UserForm from "../components/expand"; // Importa el formulario para agregar usuario
import { Edit, Filter, Plus } from "lucide-react";

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
  margin-left: 100px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 20px;
  width: 90%;
  margin: 20px auto;
  flex-wrap: wrap;
  gap: 80px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 100px;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
`;

const Usuarios = () => {
  const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar el formulario

  const handleFiltrar = () => {
    alert("Filtrando datos...");
  };

  const handleEditar = () => {
    alert("Editando datos...");
  };

  const handleCrearNuevo = () => {
    setShowForm(true); // Mostrar el formulario cuando se hace clic en "Crear Nuevo"
  };

  const handleFormSubmit = (newUserData) => {
    console.log("Datos capturados:", newUserData);
    setShowForm(false); // Cierra el formulario después de capturar los datos
  };

  const handleCancelForm = () => {
    setShowForm(false); // Cierra el formulario sin guardar nada
  };

  const handleDropdownSelect = (option) => {
    console.log("Opción seleccionada:", option);
  };

  return (
    <div>
      <Sidebar />
      <TitleWrapper>
        <TitleText>Panel de Usuarios</TitleText>
      </TitleWrapper>

      <TopBar>
        <FilterContainer>
          <Dropdown
            options={["Administrador", "Usuario", "Invitado", "Perito"]}
            onSelect={handleDropdownSelect}
            defaultOption="Rol"
          />
          <SearchBar />
        </FilterContainer>

        <ButtonContainer>
          <Button
            $bgColor="#5FB8D6"
            $hoverColor="#5FA6C7"
            width="130px"
            height="38px"
            onClick={handleFiltrar}
          >
            <Filter /> Filtrar
          </Button>

          <Button
            $bgColor="#A9A9A9"
            $hoverColor="#8B8B8B"
            width="130px"
            height="38px"
            onClick={handleEditar}
          >
            <Edit /> Editar
          </Button>

          <Button
            $bgColor="#5FB8D6"
            $hoverColor="#5FA6C7"
            width="180px"
            height="38px"
            onClick={handleCrearNuevo}
          >
            <Plus /> Crear Nuevo
          </Button>
        </ButtonContainer>
      </TopBar>

      {showForm && (
        <FormContainer>
          <UserForm
            title="Crear Nuevo Usuario"
            fields={[
              { name: "name", placeholder: "Nombres", type: "text" },
              { name: "lastname", placeholder: "Apellidos", type: "text" },
              { name: "phone", placeholder: "Teléfono", type: "text" },
              { name: "email", placeholder: "Correo Electrónico", type: "email" },
              { name: "role", placeholder: "Rol", type: "text" },
              { name: "password", placeholder: "Contraseña", type: "password" },
              { name: "confirmPassword", placeholder: "Confirmar Contraseña", type: "password" },
            ]}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        </FormContainer>
      )}
    </div>
  );
};

export default Usuarios;
