
import React from 'react';
import styled from 'styled-components';


const GlassWrapper = styled.div`
  background: rgba(250, 250, 250, 0.10);
  border-radius: 18px;
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid ${({ borderClr }) => borderClr || 'rgba(0, 0, 0, 0.35)'};
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.10);
  padding: 2rem;
  color: #1f1f1f;
  max-width: ${({ cardWidth }) => cardWidth || '350px'};
  width: 100%;
  height: ${({ cardHeight }) => cardHeight || 'auto'};
  margin: 2rem auto;
  transition: transform .3s ease, box-shadow .3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.20);
  }
`;


const Header = styled.div`
  display: flex;
  align-items: center;
  gap: .5rem;

  /* rellenamos todo el ancho para la franja de color */
  margin: -2rem -2rem 1rem;
  padding: 1rem 2rem;

  /* fondo configurable */
  background: ${({ bg }) => bg || 'rgba(211, 210, 210, 0.65)'};
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);

  /* línea separadora con mismo color del borde exterior */
  border-bottom: 1px solid ${({ borderClr }) => borderClr || 'rgba(161, 161, 161, 0.35)'};

  border-top-left-radius: 17px;
  border-top-right-radius: 17px;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
  margin: 0;
`;

const Badge = styled.span`
  background-color: rgb(0, 220, 255);
  color: #000;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 1rem;
  margin-left: 8px;
  letter-spacing: 1px;
  font-family: 'Segoe UI', Roboto, 'Open Sans', sans-serif;
`;


const GlassCardPro = ({
  title,
  badgeText,
  icon: Icon,
  children,
  headerBg,
  borderColor,
  height,
  width,
}) => (
  <GlassWrapper cardWidth={width} cardHeight={height} borderClr={borderColor}>
    {(title || Icon) && (
      <Header bg={headerBg} borderClr={borderColor}>
        {Icon && <Icon size={25} color="black" />}
        <Title>
          {title}
          {badgeText && <Badge>{badgeText}</Badge>}
        </Title>
      </Header>
    )}
    {children}
  </GlassWrapper>
);

export default GlassCardPro;
