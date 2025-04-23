import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

const StyledButton = styled.button`
  background-color: ${(props) => props.$bgColor || "#5FB8D6"};
  border: none;
  color: white;
  width: ${(props) => props.width || "120px"};
  height: ${(props) => props.height || "40px"};
  padding: 10px;
  font-size: 16px;
  font-family: Helvetica, Arial, sans-serif;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex; 
  align-items: center; 
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: ${(props) => props.$hoverColor || "black"};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background: rgb(230, 227, 227);
  width: ${({ width }) => width || '300px'};
  height: 15px;
`;

const SearchIcon = styled(Search)`
  width: 20px;
  height: 20px;
  color: #888;
  background: rgb(230, 227, 227);
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px;
  font-size: 16px;
  border: none;
  outline: none;
  background: transparent;
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  max-width: 100%;
  background-color: rgb(255, 255, 255);
  color: black;
  padding: 10px 20px;
  padding-left: 11px;
  border: 2px #a9a9a9 solid;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  width: 120px;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  &::after {
    content: "";
    position: absolute;
    right: 17px;
    top: 55%;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid black;
    transform: translateY(-50%);
  }
`;

const DropdownMenu = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const DropdownItem = styled.button`
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const BaseButton = styled.button`
  background-color: ${(props) => props.$bgColor || "#5FB8D6"};
  border: none;
  color: white;
  width: ${(props) => props.$width || "120px"};
  height: ${(props) => props.$height || "40px"};
  padding: 10px;
  font-size: 16px;
  font-family: Helvetica, Arial, sans-serif;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex; 
  align-items: center; 
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: ${(props) => props.$hoverColor || "black"};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;


const Button = ({ children, icon: Icon, ...props }) => {
    return (
      <BaseButton {...props}>
        {Icon && <Icon />}
        {children}
      </BaseButton>
    );
  };

const Toolbar = ({ 
    children,
    onCreate,
    onEdit,
    onDelete,
    showDefaultButtons = true,
    createLabel = "Crear Nuevo",
    editLabel = "Editar",
    deleteLabel = "Eliminar",
    buttonsGap = "10px",       // Espacio entre botones 
    style 
  }) => {
    return (
        <div style={{ display: "flex", gap: buttonsGap, alignItems: "center", ...style }}>
          {showDefaultButtons && (
            <>
              <Button 
                icon={Plus} 
                onClick={onCreate}
                $bgColor="#5FB8D6"
                $width="150px"
                $hoverColor="#519CB2"
              >
                {createLabel}
              </Button>
              <Button 
                icon={Edit} 
                onClick={onEdit}
                $bgColor="#5A9AC6"
                $hoverColor="#468BAF"
              >
                {editLabel}
              </Button>
              <Button 
                icon={Trash2} 
                onClick={onDelete}
                $hoverColor="#D9534F"
                $bgColor="#FF6B6B"
              >
                {deleteLabel}
              </Button>
            </>
          )}
          {children}
        </div>
      );
    };


Toolbar.Button = Button;
Toolbar.Search = ({ placeholder, width, onSearch }) => {
  const handleChange = (event) => {
    if (onSearch) onSearch(event.target.value);
  };

  return (
    <SearchContainer width={width}>
      <SearchIcon />
      <SearchInput type="text" placeholder={placeholder || "Buscar..."} onChange={handleChange} />
    </SearchContainer>
  );
};

Toolbar.Dropdown = ({ options, onSelect, defaultOption = "Selecciona" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectedOption = (option, event) => {
    event.preventDefault();
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={toggleDropdown}>
        {selectedOption}
      </DropdownButton>
      {isOpen && (
        <DropdownMenu $isOpen={isOpen}>
          {options.map((option, index) => (
            <DropdownItem key={index} onClick={(event) => handleSelectedOption(option, event)}>
              {option}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

export default Toolbar;