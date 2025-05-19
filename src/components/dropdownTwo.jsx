import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  padding: 8px 16px;
  background: #5fc8d6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const DropdownContent = styled.div`
  position: absolute;
  background: white;
  min-width: 200px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1000;
  padding: 10px;
  margin-top: 5px;
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
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedValues || []);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (value) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(newSelected);
  };

  const handleDone = () => {
    onChange(selected);
    setIsOpen(false);
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={toggleDropdown}>
        {selected.length > 0 ? `${selected.length} seleccionados` : "Seleccionar"}
      </DropdownButton>
      {isOpen && (
        <DropdownContent>
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
          <DoneButton onClick={handleDone}>Hecho</DoneButton>
        </DropdownContent>
      )}
    </DropdownContainer>
  );
};