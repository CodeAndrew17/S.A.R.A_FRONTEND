import React from 'react';
import styled from 'styled-components';

const GlassWrapper = styled.div`
  background: rgba(255, 255, 255, 0.55);
  border-radius: 20px;
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  border: 1px solid ${({ borderClr }) => borderClr || 'rgba(255, 255, 255, 0.25)'};
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  color: #1f1f1f;
  max-width: ${({ cardWidth }) => cardWidth || '455px'};
  width: auto;
  height: ${({ cardHeight }) => cardHeight || 'auto'};
  min-height: ${({ cardMinHeight }) => cardMinHeight || 'auto'};
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-4px) scale(1.01);
    background: rgba(255, 255, 255, 0.65);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 500px) {
    max-width: 300px;
    padding: 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  margin: -2rem -2rem 1.5rem;
  padding: 1rem 2rem;

  background: ${({ bg }) => bg || 'linear-gradient(135deg, rgba(220,220,220,0.5), rgba(240,240,240,0.5))'};
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);

  border-bottom: 1px solid ${({ borderClr }) => borderClr || 'rgba(161, 161, 161, 0.25)'};
  border-top-left-radius: 19px;
  border-top-right-radius: 19px;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111;
  margin: 0;
  letter-spacing: 0.3px;
`;

const Badge = styled.span`
  background: linear-gradient(135deg, #00e0ff, #00b5d8);
  color: #fff;
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 0.85rem;
  margin-left: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const GlassCardPro = ({
  title,
  badgeText,
  icon: Icon,
  children,
  headerBg,
  borderColor,
  height,
  minHeight,
  width,
}) => (
  <GlassWrapper
    cardWidth={width}
    cardHeight={height}
    cardMinHeight={minHeight}
    borderClr={borderColor}
  >
    {(title || Icon) && (
      <Header bg={headerBg} borderClr={borderColor}>
        {Icon && <Icon size={26} color="#111" />}
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
