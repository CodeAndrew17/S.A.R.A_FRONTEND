import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  max-width: 100%;
  background-color: ${({ bgColor }) => bgColor || 'white'};
  color: ${({ color }) => color || 'black'};
  padding: ${({ padding }) => padding || '10px 16px'};
  border: 2px solid ${({ borderColor }) => borderColor || '#a9a9a9'};
  border-radius: ${({ borderRadius }) => borderRadius || '4px'};
  cursor: pointer;
  position: relative;
  width: ${({ width }) => width || 'auto'};
  min-width: ${({ minWidth }) => minWidth || '120px'};
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ focusBorderColor }) => focusBorderColor || '#555'};
    box-shadow: 0 0 3px ${({ focusBorderColor }) => focusBorderColor || '#555'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::after {
    content: "";
    position: absolute;
    right: 16px;
    top: 50%;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid ${({ arrowColor }) => arrowColor || 'black'};
    transform: translateY(-50%);
    pointer-events: none;
  }

  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px); /* Sube un poquito */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(1px); /* Baja como si lo presionaras */
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
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
  height:50px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`;

function Dropdown({ 
  options = {},   // Recibimos un objeto {valor: label}
  onSelect, 
  defaultOption = "Estado"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(defaultOption);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectedOption = (value, label, event) => {
    event.preventDefault();
    setSelectedLabel(label);
    setIsOpen(false);
    onSelect?.(value);
  };

  const optionsArray = Object.entries(options);


  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={toggleDropdown}>
        {selectedLabel}</DropdownButton>

      {isOpen && (

        <DropdownMenu $isOpen={isOpen}>
           {optionsArray.map(([value, label]) => (
            <DropdownItem 
              key={value} 
              onClick={(event) => handleSelectedOption(value, label, event)}
            >
              {label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

export default Dropdown;