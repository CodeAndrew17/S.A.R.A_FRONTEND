import React, { useState, useEffect, useRef } from "react";
 import styled from "styled-components";
 import SearchBar from "./SearchBar";
 import {  Plus, Edit, Trash2 } from "lucide-react";
 
 const ContainerToolbar = styled.div`
 max-width: 80%;
 margin: auto;
 display: flex;
 justify-content: center;  /* Centra los elementos horizontalmente */
 align-items: center;
 gap: 20px;                
 margin-top: 20px;
 padding: 16px;
 flex-wrap: wrap;
 @media (max-width: 768px) {
   max-width: 100%;
   height: clamp(30px, 4vh, 40px);
   display: flex;
   align-items: center;
   gap: 4px;
   padding: 0 clamp(4px, 1vw, 8px);
   box-sizing: border-box;
 `;
 
 const BaseButton = styled.button`
 background-color: ${(props) => props.$bgColor || "#5FB8D6"};
 border: none;
 color: white;
 width: ${(props) => props.$width || "120px"};
 height: ${(props) => props.$height || "38px"};
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
  height:50px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`;
 
 // ============ Toolbar Components ============
 
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
   onSearch,
   showDefaultButtons = true,
   createLabel = "Crear Nuevo",
   editLabel = "Editar",
   deleteLabel = "Eliminar",
   style,
   onActiveButton=true
 }) => {
  const boton= onActiveButton
   return (
     <ContainerToolbar>
       {showDefaultButtons && (
         <>
           <Button
             icon={Plus}
             onClick={onCreate}
             $bgColor="#5FB8D6"
             $hoverColor="#519CB2"
             $width= "auto"
           >
             {createLabel}
           </Button>

           <Button
             icon={Trash2}
             onClick={onDelete}
             $bgColor="#FF6B6B"
             $hoverColor="#D9534F"
           >
             {deleteLabel}
           </Button>

           {boton &&(
            <Button
              icon={Edit}
              onClick={onEdit}
              $bgColor="#5A9AC6"
              $hoverColor="#468BAF"
              $width="auto"
          
              >
                {editLabel}
              </Button> // ← Esta línea debe estar dentro del bloque condicional
           )}

           
         </>
       )}
       {children}
     </ContainerToolbar>
   );
 };
 
 Toolbar.Button = Button;
 
 Toolbar.Search = Toolbar.Search = (props) => <SearchBar {...props} />;
 
 
 Toolbar.Dropdown = ({ 
  options = {},   // Recibimos un objeto {valor: label}
  onSelect, 
  defaultOption = "Selecciona" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(defaultOption);
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
        {selectedLabel}
      </DropdownButton>

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
 
 export default Toolbar;