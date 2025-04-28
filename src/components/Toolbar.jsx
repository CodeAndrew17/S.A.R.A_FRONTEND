import React, { useState, useEffect, useRef } from "react";
 import styled from "styled-components";
 import SearchBar from "./SearchBar";
 import { Search, Plus, Edit, Trash2 } from "lucide-react";
 
 const SearchContainer = styled.div`
   flex: 1 1 auto;
   min-width: 0;
   max-width: 100%;
   height: clamp(30px, 4vh, 40px);
   display: flex;
   align-items: center;
   gap: 4px;
   padding: 0 clamp(4px, 1vw, 8px);
   border: 2px solid #ccc;
   border-radius: 8px;
   background: #e6e3e3;
   box-sizing: border-box;
 `;
 
 const BaseButton = styled.button`
   flex: 0 1 auto;
   min-width: fit-content;
   max-width: 100%;
   height: clamp(30px, 4vh, 40px);
   padding: clamp(4px, 1vw, 8px);
   font-size: clamp(12px, 1.5vw, 16px);
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 4px;
 
   background-color: ${(p) => p.$bgColor || "#5FB8D6"};
   color: white;
   border: none;
   border-radius: 4px;
   cursor: pointer;
   transition: background-color 0.3s;
   white-space: nowrap;
 
   &:hover {
     background-color: ${(p) => p.$hoverColor || "black"};
   }
 
   svg {
     flex-shrink: 0;
     width: clamp(14px, 2vw, 20px);
     height: clamp(14px, 2vw, 20px);
   }
 `;
 
 const SearchIcon = styled(Search)`
   flex-shrink: 0;
   width: 20px;
   height: 20px;
 `;
 
 const SearchInput = styled.input`
   flex: 2 1 0;
   min-width: 0;
   border: none;
   background: transparent;
   outline: none;
   font-size: clamp(12px, 1.5vw, 16px);
   padding: 4px 0;
 `;
 
 const DropdownContainer = styled.div`
   position: relative;
   display: inline-block;
 `;
 
 const DropdownButton = styled.button`
   flex: 0 1 auto;
   min-width: fit-content;
   max-width: 100%;
   height: clamp(30px, 4vh, 40px);
   padding: 0 clamp(6px, 1vw, 10px);
   font-size: clamp(12px, 1.5vw, 16px);
   display: flex;
   align-items: center;
   justify-content: space-between;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
 
   background: white;
   border: 2px solid #a9a9a9;
   border-radius: 4px;
   cursor: pointer;
   position: relative;
 
   &::after {
     content: "";
     position: absolute;
     right: 6px;
     top: 50%;
     border: 5px solid transparent;
     border-top-color: black;
     transform: translateY(-50%);
   }
 `;
 
 const DropdownMenu = styled.div`
   display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
   position: absolute;
   background-color: #f9f9f9;
   min-width: 30px;
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
 }) => {
   return (
     <div
       style={{
         display: "flex",
         flexWrap: "wrap",
         gap: "10px",
         alignItems: "center",
         justifyContent: "flex-start",
         width: "100%",
         maxWidth: "100%",
         boxSizing: "border-box",
         overflow: "hidden",
         ...style,
       }}
     >
       {showDefaultButtons && (
         <>
           <Button
             icon={Plus}
             onClick={onCreate}
             $bgColor="#5FB8D6"
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
             $bgColor="#FF6B6B"
             $hoverColor="#D9534F"
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
 
 Toolbar.Search = Toolbar.Search = (props) => <SearchBar {...props} />;
 
 
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
             <DropdownItem
               key={index}
               onClick={(event) => handleSelectedOption(option, event)}
             >
               {option}
             </DropdownItem>
           ))}
         </DropdownMenu>
       )}
     </DropdownContainer>
   );
 };
 
 export default Toolbar;