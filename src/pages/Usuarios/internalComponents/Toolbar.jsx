import React from "react";
import styled from "styled-components";
import Dropdown from "../../../components/Dropdown"; // Reutiliza tu componente Dropdown
import SearchBar from "../../../components/SearchBar"; // Reutiliza tu componente SearchBar
import CustomButton from "../../../components/button";
import { Trash, Edit, Plus } from "lucide-react";

const ToolbarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  width: 90%;
  margin: 20px auto;
  flex-wrap: nowrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 80px;
  padding-left: 210px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 50px;
`;

const Toolbar = ({ onSearch, onDelete, onEdit, onCreate }) => {
  return (
    <ToolbarWrapper>
      <FilterContainer>
        <Dropdown
          options={["Activo", "Inactivo", "Todos"]}
          onSelect={(option) => console.log("Dropdown seleccionado:", option)}
          defaultOption="Estado"
        />
        <SearchBar
          placeholder="Cédula, Nombre o Convenio"
          width="280px"
          onSearch={onSearch}
        />
      </FilterContainer>
      <ButtonContainer>
        <CustomButton bgColor="#FF6B6B" hoverColor="#D9534F" width="130px" height="38px" onClick={onDelete}>
          <Trash /> Eliminar
        </CustomButton>
        <CustomButton bgColor="#5A9AC6" hoverColor="#468BAF" width="130px" height="38px" onClick={onEdit}>
          <Edit /> Editar
        </CustomButton>
        <CustomButton bgColor="#5FB8D6" hoverColor="#519CB2" width="160px" height="38px" onClick={onCreate}>
          <Plus /> Crear Nuevo
        </CustomButton>
      </ButtonContainer>
    </ToolbarWrapper>
  );
};

export default Toolbar;