import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {ListChecks  } from 'lucide-react';
import Swal from "sweetalert2";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  width: 140px; 
  padding: 8px 12px;
  background: #5fc8d6;
  color: white;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  outline: none;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* Espacio entre ícono y texto */
`;


const DropdownContent = styled.div`
  position: fixed; /* Cambiado de absolute a fixed */
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
  ${({ position }) => position && `
    top: ${position.top}px;
    left: ${position.left}px;
  `}

  &.open-up {
    bottom: auto;
    top: ${({ position }) => position ? `${position.top - 220}px` : 'auto'};
  }
`;


const ScrollableCheckboxes = styled.div`
  overflow-y: auto;
  max-height: 180px;  // Ajusta según lo que necesites
  padding: 16px;
`;


const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 0;
`;

const DoneButton = styled.button`
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  background: #5fc8d6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const CheckboxDropdown = ({ options, selectedValues, onChange }) => {
  const [position, setPosition] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedValues || []);
  const [initialSelected, setInitialSelected] = useState(selectedValues || []);
  const dropdownRef = useRef(null);
  const [openUpward, setOpenUpward] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  //actualizar hasChanges cuando el selected cambie 
  useEffect(() => {
    const changes = 
    selected.length !== initialSelected.length ||
    !selected.every((val) => initialSelected.includes(val)); // funcion every para verificar si todos los elementos selected estan en initialSelected (no crea un nuevo array)
    setHasChanges(changes);
  }, [selected, initialSelected]);

  // Cerrar dropdown al hacer clic fuera
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
        const dropdownHeight = 220;
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

  console.log("Intentando cerrar con cambios sin guardar");
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

  console.log("Resultado del SweetAlert:", result);

  if (result.isConfirmed) {
  console.log("El usuario eligió guardar");
  handleSaveOnly();
} else {
  console.log("El usuario descartó los cambios");
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
  // Guardar sin cerrar
  onChange(selected);
  setInitialSelected(selected);
  setHasChanges(false);

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
      <DropdownButton onClick={toggleDropdown}> <ListChecks  size={14} />
        {selected.length > 0 ? `${selected.length} Seleccionados` : "Seleccionar"}
      </DropdownButton>
          {isOpen && (
            <DropdownContent className={openUpward ? "open-up" : ""}
                      position={position}>
              <ScrollableCheckboxes>
                {options.map((option) => (
                  <CheckboxItem key={option.value}>
                    <input
                      type="checkbox"
                      checked={selected.includes(option.value)}
                      onChange={() => handleCheckboxChange(option.value)}
                    />
                    <span style={{ marginLeft: "8px" }}>{option.label}</span>
                  </CheckboxItem>
                ))}
              </ScrollableCheckboxes>
              <DoneButton onClick={handleDoneAndClose}>Hecho</DoneButton>
            </DropdownContent>
          )}

    </DropdownContainer>
  );
};