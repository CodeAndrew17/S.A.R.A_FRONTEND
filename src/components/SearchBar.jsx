import React from "react";
import styled from "styled-components";
import { Search } from "lucide-react";

const SearchContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background: rgb(230, 227, 227);
  height: 15px;
  transition: all 0.3s ease;
  width: ${props => props.$width || "100%"};
  max-width: ${props => props.$maxWidth || "400px"};

  /* Estilos responsivos */
  @media (max-width: 768px) {
    width: ${props => props.$responsiveWidth || "300px"};
    max-width: ${props => props.$responsiveMaxWidth || "100%"};
  }

  @media (max-width: 480px) {
    width: ${props => props.$mobileWidth || "100%"};
    min-width: 0;
  }
`;

const SearchIcon = styled(Search)`
  width: 20px;
  height: 20px;
  color: #888;
  background: rgb(230, 227, 227);
  flex-shrink: 0;
  margin-right: 2px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0 10px;
  font-size: 16px;
  border: none;
  outline: none;
  background: transparent;
  min-width: 0;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const SearchBar = ({ 
  placeholder, 
  onSearch, 
  width, 
  maxWidth,
  responsiveWidth,
  responsiveMaxWidth,
  mobileWidth 
}) => {
  const handleChange = (event) => {
    if (onSearch) onSearch(event.target.value);
  };

  return (
    <SearchContainer
      $width={width}
      $maxWidth={maxWidth}
      $responsiveWidth={responsiveWidth}
      $responsiveMaxWidth={responsiveMaxWidth}
      $mobileWidth={mobileWidth}
    >
      <SearchIcon />
      <SearchInput 
        type="text" 
        placeholder={placeholder || "Buscar..."} 
        onChange={handleChange} 
      />
    </SearchContainer>
  );
};

export default SearchBar;