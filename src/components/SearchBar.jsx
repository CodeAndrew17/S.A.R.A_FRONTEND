import React from "react";
import styled from "styled-components";
import { Search } from "lucide-react";

const SearchContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px; 
  padding: 12px 15px; /* Más padding para mejor tacto */
  border: 2px solid #ccc;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background: rgb(230, 227, 227);
  height: 10px; /* Altura flexible */
  min-height: auto; /*
  transition: all 0.3s ease;
  width: ${props => props.$width || "10%"};
  max-width: ${props => props.$maxWidth || "100px"};

}  &:hover {
    border-color: #aaa;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  }

}  &:focus-within {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.25);
  }

}  @media (max-width: 768px) {
    width: ${props => props.$responsiveWidth || "10%"};
    max-width: ${props => props.$responsiveMaxWidth || "10%"};
    gap: 6px;
    padding: 10px 12px;
  }

}  @media (max-width: 480px) {
    width: ${props => props.$mobileWidth || "20%"};
    min-width: 0;
    border-radius: 6px;
    padding: 8px 12px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    
    /* Opcional: full-width en móviles muy pequeños */
    @media (max-width: 320px) {
      border-radius: 4px;
      padding: 8px 10px;
    }
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