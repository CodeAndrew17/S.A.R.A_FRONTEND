import React from "react";
import styled from "styled-components";

const TitleWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 30px 20px 20px; /* Más espacio arriba */
  text-align: center;
  margin-top: 10px;
  height: auto; /* ¡No fijes altura si no es necesario! */
`;


const TitleText = styled.h1`
  color: #000;
  font-size: 32px;
  line-height: 1.2; /* Mucho mejor que usar pixeles fijos */
  margin: 0;

  @media (max-width: 500px) {
    font-size: 25px;
  }
`;
const Header = () => {
  return (
    <TitleWrapper>
      <TitleText>Panel de Usuarios</TitleText>
    </TitleWrapper>
  );
};

export default Header;