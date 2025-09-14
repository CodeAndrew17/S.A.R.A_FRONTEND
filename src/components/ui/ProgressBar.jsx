import React from "react";
import styled, { keyframes } from "styled-components";

const ProgressContainer = styled.div`
  width: 100%;
  background: #f0f4f8;
  border-radius: 12px;
  overflow: hidden;
  height: 28px;
  margin-top: 12px;
  cursor: pointer;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
`;

const shine = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`;

const ProgressFiller = styled.div`
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  background: linear-gradient(90deg, #3a7bd5, #00d2ff);
  transition: width 0.5s ease-in-out;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  /* Efecto de brillo al pasar el mouse */
  &:hover::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    animation: ${shine} 1.2s ease;
  }

  /* Borde redondeado en el lado derecho cuando está completo */
  ${({ percentage }) =>
    percentage === 100 &&
    `
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  `}
`;

const ProgressText = styled.p`
  margin: 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #2d3748;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  strong {
    color: #3182ce;
    font-weight: 600;
  }

  @media (max-width: 500px) {
    font-size: 0.9rem;
    flex-direction: column;
    gap: 2px;
  }
`;

const CompletionIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #edf2f7;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 0.85rem;
  margin-left: 6px;
  color: #4a5568;

  @media (max-width: 500px) {
    margin-left: 0;
    margin-top: 2px;
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
        Progreso
        <CompletionIndicator>
          <strong> {completados}_</strong> de <strong>_{total} </strong>
        </CompletionIndicator>
        formularios completados
      </ProgressText>

      <ProgressContainer title={`${porcentaje.toFixed(0)}% completado`}>
        <ProgressFiller percentage={porcentaje.toFixed(2)}>
          {porcentaje >= 25 && `${porcentaje.toFixed(0)}%`}
        </ProgressFiller>
      </ProgressContainer>
    </div>
  );
};

export default ProgressBar;