import React from "react";
import styled from "styled-components";


const CardWrapper = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* CLAVE: permite que los hijos (el chart) ocupen todo el ancho */
  align-items: stretch;   /* o simplemente quita align-items y justify-content */
  /* no centres aquí; centra adentro si lo necesitas */
`;


const Card = ({ children, gridColumn }) => {
  return (
    <CardWrapper style={{ gridColumn }}>
      {children}
    </CardWrapper>
  );
};

export default Card;
