import React, { useState } from "react";
import styled from "styled-components";
import { Search } from "lucide-react";

const SearchContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 15px;
  border: 2px solid #ccc;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background: rgb(230, 227, 227);
  transition: all 0.3s ease;
  width: ${(props) => props.$width || "100%"};
  max-width: ${(props) => props.$maxWidth || "210px"};
  height: ${(props) => props.$height || "1vh"};

  &:hover {
    border-color: #aaa;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:focus-within {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.25);
  }

  @media (max-width: 768px) {
    width: ${(props) => props.$responsiveWidth || "10%"};
    max-width: ${(props) => props.$responsiveMaxWidth || "10%"};
    gap: 6px;
    padding: 10px 12px;
  }

  @media (max-width: 480px) {
    width: ${(props) => props.$mobileWidth || "20%"};
    min-width: 0;
    border-radius: 6px;
    padding: 8px 12px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 320px) {
    border-radius: 4px;
    padding: 8px 10px;
  }
`;


const SearchIcon = styled(Search)`
  width: 20px;
  height: 20px;
  color: #888;
  background: rgb(230, 227, 227);
  flex-shrink: 0;
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

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: #999;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;

  &:hover {
    color: #333;
  }
`;

const SearchBar = ({
  placeholder,
  onSearch,
  width,
  maxWidth,
  responsiveWidth,
  responsiveMaxWidth,
  mobileWidth,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (onSearch) onSearch(value);
  };

  const handleClear = () => {
    setInputValue("");
    if (onSearch) onSearch("");
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
        value={inputValue}
        placeholder={placeholder || "Buscar..."}
        onChange={handleChange}
      />
      {inputValue && <ClearButton onClick={handleClear}>✕</ClearButton>}
    </SearchContainer>
  );
};

export default SearchBar;
