import styled from "styled-components";

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
  gap: 8px; /* Espacio entre el icono y el texto */

    &:hover {
    background-color: ${(props) => props.$hoverColor || "black"};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export default StyledButton;
