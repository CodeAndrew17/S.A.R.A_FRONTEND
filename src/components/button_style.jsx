import styled from "styled-components";

const StyledButton = styled.button`
  /* Estilos base (mobile-first) */
  background-color: ${(props) => props.$bgColor || "#5FB8D6"};
  border: none;
  color: white;
  width: 100%; /* Por defecto ocupa todo el ancho */
  min-height: 40px; /* Altura mínima accesible */
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
    flex-shrink: 0; /* Evita que el íconos se deforme */
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
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
  }
`;

export default StyledButton;