import React from "react";
import styled from "styled-components";
import Dropdown from "./Dropdown"; // Reutiliza tu componente Dropdown
import SearchBar from "./SearchBar"; // Reutiliza tu componente SearchBar
import CustomButton from "./button";
import { Compass, Trash, Edit, Plus } from "lucide-react";

const ToolbarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  width: 90%;
  margin: 20px auto;
  flex-wrap: wrap;
  gap: 50px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 80px;
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
          options={["Admin.", "Perito", "Recepcionista", "Ad. Convenio", "Cons. Convenio", "Todos"]}
          onSelect={(option) => console.log("Dropdown seleccionado:", option)}
          defaultOption="Rol"
        />
        <SearchBar
          placeholder="Cédula"
          width="280px"
          onSearch={onSearch}
        />
      </FilterContainer>
      <ButtonContainer>
        <CustomButton bgColor="#5AA9E6" hoverColor="#4682B4" width="130px" height="38px" onClick={onSearch}>
          <Compass /> Buscar
        </CustomButton>
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