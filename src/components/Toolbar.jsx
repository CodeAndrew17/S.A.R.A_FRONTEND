import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import SearchBar from "./SearchBar";
import { Plus, Edit, Trash2 } from "lucide-react";

/* ============ STYLED COMPONENTS ============ */

const ContainerToolbar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  width: 100%;
  margin: 20px 0;
  gap: 15px;
  flex-wrap: wrap;
`;

const BaseButton = styled.button`
  /* Estilos base (mobile-first) */
  background-color: ${(props) => props.$bgColor || "#5FB8D6"};
  border: none;
  color: white;
  width: 100%;
  min-height: 40px;
  min-width: 130px;
  padding: 8px 12px;
  font-size: 14px;
  font-family: Helvetica, Arial, sans-serif;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-sizing: border-box;

  &:hover {
    background-color: ${(props) => props.$hoverColor || "black"};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.05);
  }

  /* Media queries progresivos */
  @media (min-width: 480px) {
    width: ${(props) => props.width || "auto"};
    padding: 8px 16px;
    font-size: 15px;
    
    svg {
      width: 17px;
      height: 17px;
    }
  }

  @media (min-width: 768px) {
    height: ${(props) => props.height || "auto"};
    padding: 10px 20px;
    font-size: 16px;
    gap: 8px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (min-width: 1024px) {
    &:hover {
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
  }
`;

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
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: ${({ bgColor }) => bgColor || '#f9f9f9'};
  min-width: ${({ minWidth }) => minWidth || '160px'};
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  border-radius: 4px;
  padding: 4px 0;
  user-select: none;

  /* Opcional: transición para abrir/cerrar */
  transition: opacity 0.2s ease;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
`;

const DropdownItem = styled.button`
  color: ${({ color }) => color || 'black'};
  padding: ${({ padding }) => padding || '12px 16px'};
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: ${({ fontSize }) => fontSize || '1rem'};

  &:hover,
  &:focus {
    background-color: ${({ hoverBg }) => hoverBg || '#f1f1f1'};
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

/* ============ COMPONENTES ============ */

const Button = ({ children, icon: Icon, ...props }) => {
  return (
    <BaseButton {...props}>
      {Icon && <Icon />}
      {children}
    </BaseButton>
  );
};

/* ============ COMPONENTE PRINCIPAL ============ */

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
  onActiveButton = true
}) => {
  return (
    <ContainerToolbar style={style}>
      {showDefaultButtons && (
        <>
          <Button
            icon={Plus}
            onClick={onCreate}
            $bgColor="#5FB8D6"
            $hoverColor="#519CB2"
            $width="auto"
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

          {onActiveButton && (
            <Button
              icon={Edit}
              onClick={onEdit}
              $bgColor="#5A9AC6"
              $hoverColor="#468BAF"
              $width="auto"
            >
              {editLabel}
            </Button>
          )}
        </>
      )}
      {children}
    </ContainerToolbar>
  );
};

/* ============ COMPONENTES ADICIONALES ============ */

Toolbar.Button = Button;

Toolbar.Search = (props) => <SearchBar {...props} />;

Toolbar.Dropdown = ({ 
  options = {},
  onSelect, 
  defaultOption = "Estado" 
}) => {
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