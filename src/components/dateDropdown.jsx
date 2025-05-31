import React, { useState, useRef, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";

registerLocale("es", es);


const DatepickerStyle = createGlobalStyle`
  .react-datepicker,
  .react-datepicker * {
    box-sizing: border-box;
  }

  .react-datepicker {
    width: 350px;
    font-family: inherit;
    border: 1px solid #a9a9a9;
    border-radius: 8px;
    box-shadow: 0px 8px 16px rgba(0,0,0,0.1);
    font-size: 1.2rem;
  }

  .react-datepicker__header {
    width: 100%;
    background-color: #f7f7f7;
    border-bottom: 1px solid #ccc;
    font-size: 1.2rem;
    padding: 12px;
    text-align: center;
    overflow: hidden;
  }

  .react-datepicker__month-container {
    width: 100%;
  }

  .react-datepicker__month {
    width: 100%;
  }

  .react-datepicker__year {
    display: flex;
    flex-wrap: wrap;
    justify-content: center; /* Centra los años horizontalmente */
    align-items: center; /* Asegura que estén bien alineados verticalmente */
    width: 100%;
}


  .react-datepicker__week {
    display: flex;
    justify-content: center;
    margin-bottom: 4px;
  }

  .react-datepicker__day,
  .react-datepicker__month-text,
  .react-datepicker__year-text {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    margin: 2px;
    font-size: 1.1rem;
    display: inline-block;
  }

  .react-datepicker__day--selected,
  .react-datepicker__month-text--selected,
  .react-datepicker__year-text--selected {
    background-color: #63d8d9 !important;
    color: white !important;
  }

  .react-datepicker__day:hover,
  .react-datepicker__month-text:hover,
  .react-datepicker__year-text:hover {
    background-color: #e6f0ff;
  }

  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    flex-grow: 1;
    font-weight: bold;
    color: #333;
  }

  .react-datepicker__day--keyboard-selected,
  .react-datepicker__month-text--keyboard-selected {
    background-color: #63d8d9 !important;
    color: white !important;
  }

  .react-datepicker_navigation {
    width: 20px;
  }
`;




const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  background-color: white;
  color: black;
  padding: 10px 20px;
  padding-left: 11px;
  border: 2px #a9a9a9 solid;
  border-radius: 4px;
  cursor: pointer;
  width: 120px;
  text-align: left;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    right: 17px;
    top: 50%;
    transform: translateY(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid black;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  z-index: 1000;
  margin-top: 8px;
`;


const ModeButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  justify-content: space-around;
  width: 350px;
  height: 40px;

`;

const ModeButton = styled.button`
  padding: 6px 12px;
  background-color: ${({ $active }) => ($active ? "#4a90e2" : "white")};
  color: ${({ $active }) => ($active ? "white" : "black")};
  border: 1px solid #5FB8D6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  width: 320px;

  &:hover {
    background-color: ${({ $active }) => ($active ? "#4a90e2" : "#63d8d9")};
  }
`;

function DateDropdown({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [mode, setMode] = useState("date"); // "date", "month", "year"
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

  const handleChange = (date) => {
    setSelectedDate(date);
    setIsOpen(false);
    onSelect?.(date, mode);
  };

  const formatLabel = () => {
    if (!selectedDate) return "Fecha";

    switch (mode) {
      case "date":
        return selectedDate.toLocaleDateString();
      case "month":
        return selectedDate.toLocaleDateString("es-ES", { year: "numeric", month: "long" });
      case "year":
        return selectedDate.getFullYear();
      default:
        return "Selecciona fecha";
    }
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <DatepickerStyle  />
      <DropdownButton onClick={toggleDropdown}>{formatLabel()}</DropdownButton>
      {isOpen && (
        <DropdownMenu>
          <ModeButtons>
            <ModeButton onClick={() => setMode("date")} $active={mode === "date"}>Día</ModeButton>
            <ModeButton onClick={() => setMode("month")} $active={mode === "month"}>Mes</ModeButton>
            <ModeButton onClick={() => setMode("year")} $active={mode === "year"}>Año</ModeButton>
          </ModeButtons>
          <DatePicker locale="es"
            selected={selectedDate}
            onChange={handleChange}
            showMonthYearPicker={mode === "month"}
            showYearPicker={mode === "year"}
            dateFormat={
              mode === "date" ? "dd/MM/yyyy" :
                mode === "month" ? "MMMM yyyy" :
                  "yyyy"
            }
            inline
          />
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
}

export default DateDropdown;