import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

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

function Dropdown({ options, onSelect, defaultOption = "Selecciona" }) {
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
    event.preventDefault(); // Esto evita que se envíe el formulario
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option); // Llamamos la función externa si existe
      onSelect(option);
    }
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={toggleDropdown}>
        {selectedOption}</DropdownButton>
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
}

export default Dropdown;

