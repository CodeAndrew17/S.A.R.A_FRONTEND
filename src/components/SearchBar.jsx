import React from "react";
import styled from "styled-components";
import { Search } from "lucide-react";

// Contenedor de la barra de búsqueda
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Sombreado gris */
  background: rgb(230, 227, 227); /* Fondo claro */
  width: ${({ width }) => width || '300px'}; /* Utiliza un valor por defecto si no se pasa */
  height: 15px;
`;

// Estilo del icono
const SearchIcon = styled(Search)`
  width: 20px;
  height: 20px;
  color: #888;
  background: rgb(230, 227, 227);
`;

// Input de búsqueda
const SearchInput = styled.input`
  flex: 1;
  padding: 8px;
  font-size: 16px;
  border: none;
  outline: none;
  background: transparent;
`;

const SearchBar = ({ placeholder, width, onSearch }) => {
  const handleChange = (event) => {
    if (onSearch) onSearch(event.target.value);  // Llamar a la función onSearch cuando se haga un cambio
  };

  return (
    <SearchContainer width={width}>
      <SearchIcon />
      <SearchInput type="text" placeholder={placeholder || "Buscar..."} onChange={handleChange} />
    </SearchContainer>
  );
};

export default SearchBar;
