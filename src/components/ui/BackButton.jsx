import styled from 'styled-components';

export const BackSquareButton = styled.button`
  background-color: #20B993;
  border: none;
  border-radius: 12px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: ;

  &:hover {
    background-color: rgb(2, 221, 155);
    transform: translateY(-3px); /* alzadita */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* sombra suave */
  }

  svg {
    color: white;
    stroke-width: 2.5;
  }
`;
