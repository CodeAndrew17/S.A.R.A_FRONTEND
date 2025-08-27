import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {ListChecks} from 'lucide-react';
import Swal from "sweetalert2";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  width: 140px; 
  height: 35px;
  padding: 8px 12px;
  background: #4F98D3;
  color: white;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  transform: translateY(0);
  font-size: 14px;

  &:hover {
    background: #3E86C2;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const DropdownContent = styled.div`
  position: fixed;
  background: #f4f4f4;
  min-width: 200px;
  max-height: 250px;
  display: flex;
  flex-direction: column;
  padding: 8px;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  z-index: 9999;
  margin-top: 0px;

  /* Posicionamiento dinámico */
  ${({ $position }) => $position && `
    top: ${$position.top}px;
    left: ${$position.left}px;
  `}

  &.open-up {
    bottom: auto;
    top: ${({ $position }) => $position ? `${$position.top - 250}px` : 'auto'};
  }
`;

const ScrollableCheckboxes = styled.div`
  overflow-y: auto;
  max-height: 180px;
  padding: 16px;
  
  /* Estilo de scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    
    &:hover {
      background: #a8a8a8;
    }
  }
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 0;
  transition: background-color 0.1s ease;
  
  &:hover {
    background-color:rgb(211, 211, 211);
  }
  
  input[type="checkbox"] {
    cursor: pointer;
    accent-color:rgb(105, 105, 105);
  }
  
  span {
    margin-left: 8px;
    cursor: pointer;
  }
`;

const DoneButton = styled.button`
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  background:rgb(100, 204, 207);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #6DA7BB;
    transform: translateY(-1px);
  }
`;

export const CheckboxDropdown = ({ options, selectedValues, onChange, onSave }) => {
  const [position, setPosition] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedValues || []);
  const [initialSelected, setInitialSelected] = useState(selectedValues || []);
  const dropdownRef = useRef(null);
  const [openUpward, setOpenUpward] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changes = 
      selected.length !== initialSelected.length ||
      !selected.every((val) => initialSelected.includes(val));
    setHasChanges(changes);
  }, [selected, initialSelected]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (hasChanges) {
          confirmClose();
        } else {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hasChanges]);

  const handleClose = () => {
    if (hasChanges) {
      confirmClose();
    } else {
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    if (isOpen) {
      handleClose();
    } else {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        });
        
        const windowHeight = window.innerHeight;
        const dropdownHeight = 250; // Aumentado para mejor visualización
        const spaceBelow = windowHeight - rect.bottom;
        setOpenUpward(spaceBelow < dropdownHeight);
      }
      setIsOpen(true);
    }
  };

  const handleSaveOnly = () => {
    setIsOpen(true);
  };

  const confirmClose = async () => {
    const result = await Swal.fire({
      title: '¿Tienes cambios sin guardar?',
      text: "Si cierras ahora, perderás los cambios no guardados. Guarda antes de salir.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5fc8d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Descartar cambios',
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      handleSaveOnly();
    } else {
      setSelected(initialSelected);
      setIsOpen(false);
      setHasChanges(false);
    }
  };

  const handleCheckboxChange = (value) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(newSelected);
  };

  const handleDone = () => {
    onChange(selected);
    setInitialSelected(selected);
    setHasChanges(false);

    if (onSave) {
      onSave(selected);
    }

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Cambios guardados',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const handleDoneAndClose = () => {
    handleDone();
    setIsOpen(false);
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={toggleDropdown}>
        <ListChecks size={14} />
        {selected.length > 0 ? `${selected.length} Formularios` : "Seleccionar"}
      </DropdownButton>
      {isOpen && (
        <DropdownContent 
          className={openUpward ? "open-up" : ""}
          $position={position}
        >
          <ScrollableCheckboxes>
            {options.map((option) => (
              <CheckboxItem key={option.value}>
                <input
                  type="checkbox"
                  checked={selected.includes(option.value)}
                  onChange={() => handleCheckboxChange(option.value)}
                />
                <span>{option.label}</span>
              </CheckboxItem>
            ))}
          </ScrollableCheckboxes>
          <DoneButton onClick={handleDoneAndClose}>Hecho</DoneButton>
        </DropdownContent>
      )}
    </DropdownContainer>
  );
};