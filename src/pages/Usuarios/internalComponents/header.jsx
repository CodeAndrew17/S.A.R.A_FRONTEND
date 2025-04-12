import React from "react";
import styled from "styled-components";

const TitleWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  margin-top: 5px;
  height: 60px;
`;

const TitleText = styled.h1`
  color: #000;
  font-size: 40px;
  margin: 0;
  position: relative;
  top: 10px;  
`;

const Header = () => {
  return (
    <TitleWrapper>
      <TitleText>Panel de Usuarios</TitleText>
    </TitleWrapper>
  );
};

export default Header;