// GlassCard.jsx
import React from 'react';
import styled from 'styled-components';

const GlassWrapper = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  color:rgb(0, 0, 0);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  margin: 2rem auto;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  }

  @media (max-width: 768px) {
    max-width: 90%;
    padding: 1.2rem;
  }
`;

const GlassCard = ({ children }) => {
  return <GlassWrapper>{children}</GlassWrapper>;
};

export default GlassCard;