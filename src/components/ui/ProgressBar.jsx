import React from "react";
import styled, { keyframes } from "styled-components";



const ProgressContainer = styled.div`
  width: 100%;
  background: #e0e0e0;
  border-radius: 20px;
  overflow: hidden;
  height: 28px;                /* un pelín más alto */
  margin-top: 10px;
  cursor: pointer;             /* indica que tiene interacción */
`;


const shine = keyframes`
  0%   { left: -100%; }
  50%  { left: 100%; }
  100% { left: 100%; }
`;

const ProgressFiller = styled.div`
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  background: linear-gradient(90deg, #4c98af, #81c784);
  transition: width 0.5s ease-in-out, filter 0.3s;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;
  font-weight: 600;
  font-size: 0.85rem;          /* tamaño compacto pero legible */
  letter-spacing: 0.4px;

  /* Sombra y brillo cuando el usuario pasa el mouse */
  ${ProgressContainer}:hover & {
    filter: brightness(1.1);
  }

  /* Destello animado */
  ${ProgressContainer}:hover &::after {
    animation: ${shine} 1.2s forwards;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: rgba(255, 255, 255, 0.25);
    transform: skewX(-30deg);
  }
`;


const ProgressText = styled.p`
  margin: 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  text-align: center;

  @media (max-width: 500px) {
    font-size: 0.9rem; /* tamaño más compacto en móviles */
    text-align: center;
  }
`;


const ProgressBar = ({ principales = 0, adicionales = 0, respondidos = 0 }) => {
  const total = principales + adicionales;
  const completados = respondidos;
  const porcentaje =
    total === 0 ? 0 : Math.min((completados / total) * 100, 100);

  return (
    <div>
      <ProgressText>
        Progreso&nbsp;
        <strong>
          {completados}/{total}
        </strong>{" "}
        formularios completados
      </ProgressText>

      <ProgressContainer title={`${porcentaje.toFixed(0)}% completado`}>
        <ProgressFiller percentage={porcentaje.toFixed(2)}>
          {porcentaje.toFixed(0)}%
        </ProgressFiller>
      </ProgressContainer>
    </div>
  );
};

export default ProgressBar;
